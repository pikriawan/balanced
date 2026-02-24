import { eq } from "drizzle-orm";
import { companiesTable, usersTable } from "../db/schema";
import { auth } from "../lib/auth";
import db from "../lib/db";

export async function getCompanies() {
    const session = await auth();

    if (!session?.user) {
        return null;
    }

    const users = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.email, session.user.email));

    if (users.length === 0) {
        return null;
    }

    const companies = await db
        .select()
        .from(companiesTable)
        .where(eq(companiesTable.userId, users[0].id));

    return companies;
}
