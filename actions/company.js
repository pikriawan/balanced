"use server";

import { refresh } from "next/cache";
import { companiesTable, usersTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import db from "@/lib/db";

export async function createCompany(formData) {
    const session = await auth();

    if (!session?.user) {
        return;
    }

    const rawFormData = {
        name: formData.get("name")
    };

    const error = {
        name: []
    };

    if (rawFormData.name.length < 5) {
        error.name.push("Nama perusahaan harus memiliki setidaknya 5 karakter")
    }

    if (Object.values(error).some((errors) => errors.length)) {
        return {
            success: false,
            error
        };
    }

    await db
        .insert(companiesTable)
        .values({
            userId: session.user.id,
            name: rawFormData.name
        });

    refresh();

    return {
        success: true
    };
}
