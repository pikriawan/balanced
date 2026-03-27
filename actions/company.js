"use server";

import { and, eq } from "drizzle-orm";
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

export async function deleteCompany(formData) {
    const session = await auth();

    if (!session?.user) {
        return;
    }

    const rawFormData = {
        id: formData.get("id")
    };

    const error = {
        id: []
    };

    const company = await db
        .select({ id: companiesTable.id })
        .from(companiesTable)
        .where(
            and(
                eq(companiesTable.id, rawFormData.id),
                eq(companiesTable.userId, session.user.id)
            )
        );
    
    const exists = company.length !== 0;

    if (!exists) {
        error.id.push("Perusahaan tidak ditemukan");
    }

    if (Object.values(error).some((errors) => errors.length)) {
        return {
            success: false,
            error
        };
    }

    await db
        .delete(companiesTable)
        .where(
            and(
                eq(companiesTable.id, rawFormData.id),
                eq(companiesTable.userId, session.user.id)
            )
        );

    refresh();

    return {
        success: true
    };
}
