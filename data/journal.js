import { eq } from "drizzle-orm";
import { journalsTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import db from "@/lib/db";

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
        .orderBy(journalsTable.createdAt);

    if (result.length === 0) {
        number = 1;
    } else {
        number = parseInt(result[0].number.match(/[\d]/g).join(""));
    }

    number += 1;

    return "JU" + String(number).padStart(5, "0");
}
