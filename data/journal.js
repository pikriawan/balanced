import { desc, eq } from "drizzle-orm";
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
        .orderBy(desc(journalsTable.date))
        .leftJoin(journalLinesTable, eq(journalsTable.id, journalLinesTable.journalId))
        .leftJoin(accountsTable, eq(accountsTable.id, journalLinesTable.accountId));

    return result;
}

export async function getLastJournalNumber(companyId) {
    const session = await auth();

    if (!session?.user) {
        return null;
    }

    let number;

    let result = await db
        .select({ number: journalsTable.number })
        .from(journalsTable)
        .where(eq(journalsTable.companyId, companyId))
        .orderBy(desc(journalsTable.createdAt))
        .limit(1);

    if (result.length === 0) {
        number = 0;
    } else {
        number = parseInt(result[0].number.match(/[\d]/g).join(""));
    }

    number += 1;

    return "JU" + String(number).padStart(5, "0");
}
