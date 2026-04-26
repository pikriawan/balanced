"use server";

import { and, eq, ne } from "drizzle-orm";
import { refresh } from "next/cache";
import { z } from "zod";
import { companiesTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import db from "@/lib/db";

export async function createCompany(formData) {
    const session = await auth();

    if (!session?.user) {
        return {
            success: false,
            error: "Tidak terautentikasi"
        };
    }

    const schema = z.object({
        name: z.string().nonempty("Nama perusahaan tidak boleh kosong")
    });

    const rawFormData = Object.fromEntries(formData);
    const validatedFields = schema.safeParse(rawFormData);

    if (!validatedFields.success) {
        return {
            success: false,
            error: z.flattenError(validatedFields.error).fieldErrors
        };
    }

    let result = await db
        .select({ id: companiesTable.id })
        .from(companiesTable)
        .where(
            and(
                eq(companiesTable.name, rawFormData.name),
                eq(companiesTable.userId, session.user.id)
            )
        );

    if (result.length > 0) {
        return {
            success: false,
            error: "Nama perusahaan sudah digunakan di perusahaan lain"
        };
    }

    try {
        await db
            .insert(companiesTable)
            .values({
                userId: session.user.id,
                ...validatedFields.data
            });
    } catch (error) {
        return {
            success: false,
            error: "Gagal membuat perusahaan baru"
        };
    }

    refresh();

    return {
        success: true
    };
}

export async function editCompany(companyId, formData) {
    const session = await auth();

    if (!session?.user) {
        return {
            success: false,
            error: "Tidak terautentikasi"
        };
    }

    const schema = z.object({
        name: z.string().nonempty("Nama perusahaan tidak boleh kosong")
    });

    const rawFormData = Object.fromEntries(formData);
    const validatedFields = schema.safeParse(rawFormData);

    if (!validatedFields.success) {
        return {
            success: false,
            error: z.flattenError(validatedFields.error).fieldErrors
        };
    }

    let result = await db
        .select({ id: companiesTable.id })
        .from(companiesTable)
        .where(
            and(
                eq(companiesTable.id, companyId),
                eq(companiesTable.userId, session.user.id)
            )
        );

    if (result.length === 0) {
        return {
            success: false,
            error: "Perusahaan tidak ditemukan"
        };
    }

    result = await db
        .select({ id: companiesTable.id })
        .from(companiesTable)
        .where(
            and(
                ne(companiesTable.id, companyId),
                eq(companiesTable.name, rawFormData.name),
                eq(companiesTable.userId, session.user.id)
            )
        );

    if (result.length > 0) {
        return {
            success: false,
            error: "Nama perusahaan sudah digunakan di perusahaan lain"
        };
    }

    try {
        await db
            .update(companiesTable)
            .set(validatedFields.data)
            .where(
                and(
                    eq(companiesTable.id, companyId),
                    eq(companiesTable.userId, session.user.id)
                )
            );
    } catch (error) {
        return {
            success: false,
            error: "Gagal memperbarui perusahaan"
        };
    }

    refresh();

    return {
        success: true
    };
}

export async function deleteCompany(companyId) {
    const session = await auth();

    if (!session?.user) {
        return;
    }

    let result = await db
        .select({ id: companiesTable.id })
        .from(companiesTable)
        .where(
            and(
                eq(companiesTable.id, companyId),
                eq(companiesTable.userId, session.user.id)
            )
        );

    if (result.length === 0) {
        return {
            success: false,
            error: "Perusahaan tidak ditemukan"
        };
    }

    try {
        await db
            .delete(companiesTable)
            .where(
                and(
                    eq(companiesTable.id, companyId),
                    eq(companiesTable.userId, session.user.id)
                )
            );
    } catch (error) {
        return {
            success: false,
            error: "Gagal menghapus perusahaan"
        };
    }

    refresh();

    return {
        success: true
    };
}
