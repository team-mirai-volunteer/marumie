# supabase
- supabase comes with a nice UI both for local and cloud envs
- we can see local usage in https://github.com/team-mirai-volunteer/action-board
- so supabase start with start a local db 

## local setup
- install CLI: `npm i -D supabase`
- init: `npx supabase init`
- start: `npx supabase start`
  - DB URL: `postgresql://postgres:postgres@localhost:54322/postgres`
  - Studio: `http://localhost:54323`

## prisma switch
- sqlite (default): `prisma/schema.prisma`, `DATABASE_URL="file:./dev.db"`
- postgres (supabase): use `prisma/schema.postgres.prisma` and set `DATABASE_URL` from Supabase local output

## commands
- generate types (optional): `npx supabase gen types typescript --local > supabase/types.gen.ts`
- reset db + seed: `npx supabase db reset` (uses `supabase/seed.sql`)
