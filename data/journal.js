import { desc, eq } from "drizzle-orm";
import { journalLinesTable, journalsTable } from "@/db/schema";
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
        .leftJoin(journalLinesTable, eq(journalsTable.id, journalLinesTable.journalId));

    return result;

    // const journals = [];

    // for (const row of result) {
    //     if (!journals.some((j) => j.id === row.journals.id)) {
    //         journals.push({
    //             ...row.journals,
    //             journalLines: []
    //         });
    //     }

    //     const index = journals.findIndex((j) => j.id === row.journals.id);

    //     if (index !== -1) {
    //         journals[index].journalLines.push(row.journal_lines);
    //     }
    // }

    // return journals;
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
        number = 1;
    } else {
        number = parseInt(result[0].number.match(/[\d]/g).join(""));
    }

    number += 1;

    return "JU" + String(number).padStart(5, "0");
}
