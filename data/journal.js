import { and, desc, eq, like } from "drizzle-orm";
import { accountsTable, companiesTable, journalLinesTable, journalsTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import db from "@/lib/db";

export async function getJournals(companyId) {
    const session = await auth();

    if (!session?.user) {
        return null;
    }

    let result = await db
        .select()
        .from(journalsTable)
        .where(eq(journalsTable.companyId, companyId))
        .orderBy(journalsTable.date, journalsTable.id, journalLinesTable.position)
        .leftJoin(journalLinesTable, eq(journalsTable.id, journalLinesTable.journalId))
        .leftJoin(accountsTable, eq(accountsTable.id, journalLinesTable.accountId));

    return result;
}

export async function getJournal(companyId, journalId) {
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
                eq(journalsTable.companyId, companyId)
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

export async function getLastJournalNumber(companyId) {
    const session = await auth();

    if (!session?.user) {
        return null;
    }

    const prefix = "JU";
    let number;

    let result = await db
        .select({ number: journalsTable.number })
        .from(journalsTable)
        .where(
            and(
                eq(journalsTable.companyId, companyId)),
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
