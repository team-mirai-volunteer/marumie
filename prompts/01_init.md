# poli-money-something

we're trying to make a simple web app.
the point is to visualize monetary transactions for politicians.
we can copy the design of [polimoney](https://polimoney.dd2030.org/takahiro-anno/2024)
so basically a sankey chart.

we're not sure how the data will come in, but we can image something like
```
# out
{
    "date": 2025-08-01 10:30:00,
    "value": 2200,
    "which": card,
    "category": transport,
    "category1": taxi,
    "category2": null
}

# in
{
    "date": 2025-08-01 10:00:00,
    "value": 3000,
    "who": foo,
    "type": personal,
    "source": stripe
}
```


## stack
- react
- nextjs
- vercel
- postgres
- supabase
- prisma

## commands
- init the db
- migrate the db
- build the web app
- start the webapp

## folders
- app
- api
- migrations
- etc.

## supabase local
- we can see local usage in https://github.com/team-mirai-volunteer/action-board
