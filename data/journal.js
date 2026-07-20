import Decimal from "decimal.js";
import { and, desc, eq, gte, like, lt } from "drizzle-orm";
import { accountsTable, companiesTable, journalLinesTable, journalsTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import db from "@/lib/db";

export async function getOpeningJournals(companyId) {
    const session = await auth();

    if (!session?.user) {
        return null;
    }

    const result = await db
        .select()
        .from(accountsTable)
        .where(eq(accountsTable.companyId, companyId))
        .orderBy(accountsTable.code);

    for (let i = 0; i < result.length; i++) {
        const rows = await db
            .select()
            .from(journalLinesTable)
            .innerJoin(journalsTable, eq(journalLinesTable.journalId, journalsTable.id))
            .where(
                and(
                    eq(journalLinesTable.accountId, result[i].id),
                    eq(journalsTable.type, "opening")
                )
            );

        let balance = new Decimal("0");

        for (const row of rows) {
            balance = balance.plus(new Decimal(row.journal_lines.debit));
            balance = balance.minus(new Decimal(row.journal_lines.credit));
        }

        result[i].balance = balance.toString();
    }

    return result;
}

export async function getJournals(companyId, start_date, end_date, type) {
    const session = await auth();

    if (!session?.user) {
        return null;
    }

    if (new Date(start_date).toString() === "Invalid Date" || new Date(end_date).toString() === "Invalid Date") {
        return [];
    }

    let result = await db
        .select()
        .from(journalsTable)
        .where(
            and(
                eq(journalsTable.companyId, companyId),
                eq(journalsTable.type, type),
                gte(journalsTable.date, new Date(start_date)),
                lt(journalsTable.date, new Date(end_date))
            )
        )
        .orderBy(journalsTable.date, journalsTable.id, journalLinesTable.position)
        .leftJoin(journalLinesTable, eq(journalsTable.id, journalLinesTable.journalId))
        .leftJoin(accountsTable, eq(accountsTable.id, journalLinesTable.accountId));

    return result;
}

export async function getJournal(companyId, journalId, type) {
    const session = await auth();

    if (!session?.user) {
        return null;
    }

    let result = await db
        .select({ id: companiesTable.id })
        .from(companiesTable)
        .where(
            and(
                eq(companiesTable.id, companyId),
                eq(companiesTable.userId, session.user.id)
            )
        );

    if (result.length === 0) {
        return null;
    }

    result = await db
        .select()
        .from(journalsTable)
        .where(
            and(
                eq(journalsTable.id, journalId),
                eq(journalsTable.companyId, companyId),
                eq(journalsTable.type, type)
            )
        );

    if (result.length === 0) {
        return null;
    }

    const journal = result[0];

    result = await db
        .select()
        .from(journalLinesTable)
        .where(eq(journalLinesTable.journalId, journal.id))
        .orderBy(journalLinesTable.position)
        .leftJoin(accountsTable, eq(accountsTable.id, journalLinesTable.accountId));

    journal.journalLines = result;

    return journal;
}

export async function getLastJournalNumber(companyId, prefix, type) {
    const session = await auth();

    if (!session?.user) {
        return null;
    }

    let number;

    let result = await db
        .select({ number: journalsTable.number })
        .from(journalsTable)
        .where(
            and(
                eq(journalsTable.companyId, companyId),
                eq(journalsTable.type, type)
            ),
            like(journalsTable.number, `${prefix}%`)
        )
        .orderBy(desc(journalsTable.number))
        .limit(1);

    if (result.length === 0) {
        number = 0;
    } else {
        number = parseInt(result[0].number.match(/[\d]/g).join(""));
    }

    number += 1;

    return prefix + number.toString().padStart(5, "0");
}
