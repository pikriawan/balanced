"use server";

import { eq } from "drizzle-orm";
import { refresh } from "next/cache";
import { companiesTable, usersTable } from "../db/schema";
import { auth } from "../lib/auth";
import db from "../lib/db";

export async function createCompany(formData) {
    const session = await auth();

    if (!session?.user) {
        return;
    }

    const users = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.email, session.user.email));

    if (users.length === 0) {
        return;
    }

    await db
        .insert(companiesTable)
        .values({
            userId: users[0].id,
            name: formData.get("name")
        });

    refresh();
}
