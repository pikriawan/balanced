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

    const name = formData.get("name").trim();

    if (name.length < 5) {
        return {
            success: false,
            error: {
                name: "\"name\" setidaknya harus memiliki panjang 5 karakter"
            }
        };
    }

    await db
        .insert(companiesTable)
        .values({
            userId: session.user.id,
            name
        });

    refresh();

    return {
        success: true
    };
}
