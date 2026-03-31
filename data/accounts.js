import { eq } from "drizzle-orm";
import { accountsTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import db from "@/lib/db";

export async function getAccounts(companyId) {
    const session = await auth();

    if (!session?.user) {
        return null;
    }

    let result = await db
        .select()
        .from(accountsTable)
        .where(eq(accountsTable.companyId, companyId));

    return result;
}
