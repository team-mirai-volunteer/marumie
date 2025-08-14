# management app workspace plan

- Monorepo layout using npm/pnpm/yarn workspaces:
```
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
├─ package.json (workspaces + db scripts)
└─ supabase/config.toml
```

- `packages/db` owns schema, migrations, and exports a Prisma singleton.
- Both apps depend on `@poli-money/db`.
- Generate/migrate from the root using scripts:
```
- db:generate
- db:migrate:dev
- db:migrate:deploy
```
