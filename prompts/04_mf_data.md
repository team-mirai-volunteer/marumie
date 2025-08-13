# mf_data
- we want to make edits to prisma def, to injest mf data
    - name it mf_transactions
- the columns are in data/masker - ledger_masked.csv
- we will need something in scripts/ maybe? to load the csv to the database

## later
- we will adjust the sankey chart to use the new data
- basically
    - IN/OUT for in out
    - 貸方勘定科目 for in, 借方勘定科目 + 摘要_詳細 for out
