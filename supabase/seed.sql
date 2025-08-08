-- Seed SQL to mirror prisma/seed.cjs data for Supabase local
insert into public."Politician" (id, slug, name)
values
  (1, 'hoge', 'Hoge')
on conflict (id) do nothing;

-- IN transactions
insert into public."Transaction"
  ("politicianId", date, value, direction, counterparty, "inflowType", source)
values
  (1, now(), 3000, 'IN', 'Foo Supporter', 'personal', 'stripe'),
  (1, now(), 12000, 'IN', 'ACME Corp', 'corporate', 'bank-transfer')
on conflict do nothing;

-- OUT transactions
insert into public."Transaction"
  ("politicianId", date, value, direction, method, category, "category1", "category2")
values
  (1, now(), 2200, 'OUT', 'card', 'transport', 'taxi', null),
  (1, now(), 5400, 'OUT', 'cash', 'meals', 'lunch', null),
  (1, now(), 11000, 'OUT', 'card', 'travel', 'train', 'shinkansen')
on conflict do nothing;


