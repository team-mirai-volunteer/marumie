# management app
- we want to add a management app that shares the db. will look like below

## chatgpt answer

Recommended layout (pnpm/npm/yarn workspaces)
/
├─ apps/
│  ├─ user-facing-app/
│  └─ managing-app/
├─ packages/
│  └─ db/
│     ├─ prisma/
│     │  └─ schema.prisma
│     ├─ src/
│     │  └─ client.ts
│     └─ package.json
├─ package.json
├─ supabase/config.toml
└─ turbo.json (optional)

packages/db/package.json
{
  "name": "@acme/db",
  "version": "0.0.0",
  "private": true,
  "main": "src/client.ts",
  "types": "src/client.ts",
  "license": "UNLICENSED",
  "dependencies": {
    "@prisma/client": "5.x"
  },
  "devDependencies": {
    "prisma": "5.x"
  },
  "prisma": {
    "schema": "prisma/schema.prisma"
  },
  "scripts": {
    "generate": "prisma generate",
    "migrate:dev": "prisma migrate dev",
    "migrate:deploy": "prisma migrate deploy",
    "studio": "prisma studio"
  }
}

packages/db/prisma/schema.prisma

Put your models and generators here. Keep all schema changes in this one place.

Use one datasource; migrations should be run from this package (Locally or in CI).

generator client {
  provider = "prisma-client-js"
  // If you also need a separate edge client, see "Two clients" below.
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL") // provided by each app or CI process
}

packages/db/src/client.ts

Export a singleton to avoid multiple instances during hot reload in Next.js.

import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error']
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;

Workspace root package.json
{
  "private": true,
  "workspaces": ["apps/*", "packages/*"],
  "scripts": {
    "db:generate": "pnpm --filter @acme/db generate",
    "db:migrate:dev": "pnpm --filter @acme/db migrate:dev",
    "db:migrate:deploy": "pnpm --filter @acme/db migrate:deploy"
  }
}

Each app depends on @acme/db

apps/user-facing-app/package.json and apps/managing-app/package.json:

{
  "dependencies": {
    "@acme/db": "workspace:*"
  }
}


Then in app code:

import prisma from '@acme/db';

const data = await prisma.user.findMany();

Env & migrations

DATABASE_URL: set per app environment (they can point to the same DB in prod, or separate DBs per environment). The client reads it at runtime.

Migrations: run once from packages/db (e.g., in CI/CD) so both apps stay in sync. Avoid running migrations on app boot.

Do you ever generate twice?

Not necessary. The client is generated inside packages/db and consumed by both apps. Only generate separately if you need two different clients (e.g., Node vs Edge/Workers).

Two clients (optional)

If one app is Node (API routes) and the other is Edge/Cloudflare, you can add a second generator:

generator client_node {
  provider = "prisma-client-js"
  output   = "../db/node-client" // relative to schema.prisma
}

generator client_edge {
  provider = "prisma-client-js"
  previewFeatures = ["driverAdapters"] // if using Data Proxy/edge patterns
  output   = "../db/edge-client"
}


Then export two entry points in packages/db/src/ (e.g., client-node.ts, client-edge.ts), and have each app import the right one.

Why not keep prisma/ at repo root?

It’s not a package, so @prisma/client generation is ambiguous and can conflict between apps.

Harder to version and publish changes atomically.

You’ll end up running prisma generate in multiple places anyway.

TL;DR

Create a packages/db workspace that owns:

the schema

the migrations

the generated client

a singleton export

Both user-facing-app and managing-app just depend on @acme/db and import prisma. This cleanly supports your MVP now and scales when you split responsibilities later.

You said:
what's acme?
ChatGPT said:

acme is just a placeholder org/package name — like the fake “Acme Corp” in docs and cartoons.

In your monorepo, you’d replace it with your actual org or project namespace.
For example, if your project is called finviz, your shared db package could be:

packages/db/
package.json:
{
  "name": "@finviz/db",
  ...
}


Then in your apps:

import prisma from '@finviz/db';


It’s purely a naming convention so the shared package has a scoped name (@something/name) that makes it easy to reference inside a workspace.
