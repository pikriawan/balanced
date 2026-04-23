import { and, desc, eq, like } from "drizzle-orm";
import { accountsTable, journalLinesTable, journalsTable } from "@/db/schema";
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
