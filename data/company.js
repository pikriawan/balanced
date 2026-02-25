import { eq } from "drizzle-orm";
import { companiesTable, usersTable } from "../db/schema";
import { auth } from "../lib/auth";
import db from "../lib/db";

export async function getCompanies() {
    const session = await auth();

    if (!session?.user) {
        return null;
    }

    const companies = await db
        .select()
        .from(companiesTable)
        .where(eq(companiesTable.userId, session.user.id));

    return companies;
}
