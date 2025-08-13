'use strict'

require('dotenv/config')
const fs = require('fs')
const path = require('path')
const { parse } = require('csv-parse')
const { PrismaClient, TransactionDirection } = require('@prisma/client')

const prisma = new PrismaClient()

function coerceInt(value) {
    if (value == null) return null
    const s = String(value).trim().replace(/,/g, '')
    if (s === '' || s === '""') return null
    const n = Number.parseInt(s, 10)
    return Number.isFinite(n) ? n : null
}

function coerceString(value) {
    if (value == null) return null
    const s = String(value).trim()
    return s === '' ? null : s
}

function parseLocalDate(yyyyMmDd) {
    if (!yyyyMmDd) return null
    // Accept forms like 2025/06/20 or 2025-06-20
    const parts = String(yyyyMmDd).trim().replace(/-/g, '/').split('/')
    if (parts.length !== 3) return null
    const [y, m, d] = parts.map((p) => Number.parseInt(p, 10))
    if (!y || !m || !d) return null
    const dt = new Date(Date.UTC(y, m - 1, d))
    return dt
}

function mapRecordToMfTransaction(rec) {
    const directionRaw = coerceString(rec['IN/OUT'])
    const direction = directionRaw === 'IN' ? TransactionDirection.IN : TransactionDirection.OUT

    return {
        transactionNo: coerceInt(rec['取引No']),
        date: parseLocalDate(rec['取引日']),

        debitAccount: coerceString(rec['借方勘定科目']),
        debitSubaccount: coerceString(rec['借方補助科目']),
        debitDepartment: coerceString(rec['借方部門']),
        debitCounterparty: coerceString(rec['借方取引先']),
        debitTaxCategory: coerceString(rec['借方税区分']),
        debitInvoice: coerceString(rec['借方インボイス']),
        debitAmountYen: coerceInt(rec['借方金額(円)']),

        creditAccount: coerceString(rec['貸方勘定科目']),
        creditSubaccount: coerceString(rec['貸方補助科目']),
        creditDepartment: coerceString(rec['貸方部門']),
        creditCounterparty: coerceString(rec['貸方取引先']),
        creditTaxCategory: coerceString(rec['貸方税区分']),
        creditInvoice: coerceString(rec['貸方インボイス']),
        creditAmountYen: coerceInt(rec['貸方金額(円)']),

        summary: coerceString(rec['摘要']),
        tags: coerceString(rec['タグ']),
        memo: coerceString(rec['メモ']),
        note1: coerceString(rec['摘要1']),
        note2: coerceString(rec['摘要2']),
        note3: coerceString(rec['摘要3']),
        summaryDetail: coerceString(rec['摘要_詳細']),

        direction,
    }
}

async function upsertInBatches(rows, batchSize = 100) {
    for (let i = 0; i < rows.length; i += batchSize) {
        const slice = rows.slice(i, i + batchSize)
        await prisma.$transaction(
            slice.map((data) =>
                prisma.mfTransaction.upsert({
                    where: { transactionNo: data.transactionNo },
                    create: data,
                    update: data,
                })
            )
        )
        process.stdout.write(`Imported ${Math.min(i + batchSize, rows.length)} / ${rows.length}\r`)
    }
    process.stdout.write('\n')
}

async function main() {
    const csvPathArg = process.argv[2]
    const csvPath = csvPathArg
        ? path.resolve(process.cwd(), csvPathArg)
        : path.resolve(process.cwd(), 'data', 'masker - ledger_masked.csv')

    if (!fs.existsSync(csvPath)) {
        console.error(`CSV not found at ${csvPath}`)
        process.exit(1)
    }

    const rows = await new Promise((resolve, reject) => {
        const out = []
        fs.createReadStream(csvPath)
            .pipe(
                parse({
                    bom: true,
                    columns: true,
                    skip_empty_lines: true,
                    relax_column_count: true,
                    trim: true,
                })
            )
            .on('data', (rec) => out.push(mapRecordToMfTransaction(rec)))
            .on('error', reject)
            .on('end', () => resolve(out))
    })

    // Filter out rows missing transactionNo or date
    const filtered = rows.filter((r) => Number.isInteger(r.transactionNo) && r.date instanceof Date)
    console.log(`Parsed ${rows.length} rows, importing ${filtered.length} rows...`)

    await upsertInBatches(filtered, 200)
    console.log('Done')
}

main()
    .catch((err) => {
        console.error(err)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })


