import { and, eq } from "drizzle-orm";
import { companiesTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import db from "@/lib/db";

export async function getCompanies() {
    const session = await auth();

    if (!session?.user) {
        return null;
    }

    let result = await db
        .select()
        .from(companiesTable)
        .where(eq(companiesTable.userId, session.user.id));

    return result;
}

export async function getCompany(id) {
    const session = await auth();

    if (!session?.user) {
        return null;
    }

    let result = await db
        .select()
        .from(companiesTable)
        .where(
            and(
                eq(companiesTable.id, id),
                eq(companiesTable.userId, session.user.id)
            )
        );

    if (result.length === 0) {
        return null;
    }

    return result[0];
}
