import Decimal from "decimal.js";
import { and, eq, gte, lt } from "drizzle-orm";
import { accountsTable, journalLinesTable, journalsTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import db from "@/lib/db";

export async function getLedger(companyId, start_date, end_date) {
    const session = await auth();

    if (!session?.user) {
        return null;
    }

    if (new Date(start_date).toString() === "Invalid Date" || new Date(end_date).toString() === "Invalid Date") {
        return [];
    }

    let result = await db
        .select()
        .from(accountsTable)
        .where(and(eq(accountsTable.companyId, companyId), gte(journalsTable.date, new Date(start_date)), lt(journalsTable.date, new Date(end_date))))
        .leftJoin(journalLinesTable, eq(accountsTable.id, journalLinesTable.accountId))
        .leftJoin(journalsTable, eq(journalLinesTable.journalId, journalsTable.id))
        .orderBy(accountsTable.code, journalsTable.date, journalsTable.id, journalLinesTable.position);

    const accounts = [];

    for (const row of result) {
        const account = {
            code: row.accounts.code,
            name: row.accounts.name,
            rows: []
        };

        if (!accounts.some((a) => a.code === account.code)) {
            accounts.push(account);
        }
    }

    for (const row of result) {
        if (!row.journal_lines) {
            continue;
        }

        const accountIndex = accounts.findIndex((a) => a.code === row.accounts.code);

        if (accountIndex !== -1) {
            let balance = accounts[accountIndex].rows.length === 0
                ? new Decimal("0")
                : new Decimal(accounts[accountIndex].rows.at(-1).balance);

            balance = balance.plus(new Decimal(row.journal_lines.debit));
            balance = balance.minus(new Decimal(row.journal_lines.credit));

            const journalLine = {
                id: row.journal_lines.id,
                date: row.journals.date,
                description: row.journals.description,
                ref: row.journals.number,
                debit: row.journal_lines.debit,
                credit: row.journal_lines.credit,
                balance: balance.toString()
            };

            accounts[accountIndex].rows.push(journalLine);
        }
    }

    return accounts;
}
