"use server";

import { and, eq } from "drizzle-orm";
import { refresh } from "next/cache";
import { z } from "zod";
import { accountsTable, companiesTable, usersTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import db from "@/lib/db";

export async function createAccount(companyId, formData) {
    const session = await auth();

    if (!session?.user) {
        return {
            success: false,
            error: "Tidak terautentikasi"
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

    const schema = z.object({
        code: z.string().nonempty("Kode akun tidak boleh kosong"),
        type: z.enum(["asset", "liability", "equity", "revenue", "expense"], "Tipe akun tidak valid"),
        name: z.string().nonempty("Nama akun tidak boleh kosong")
    });

    const rawFormData = {
        code: formData.get("code"),
        type: formData.get("type"),
        name: formData.get("name")
    };

    const validatedFields = schema.safeParse(rawFormData);

    if (!validatedFields.success) {
        return {
            success: false,
            error: z.flattenError(validatedFields.error).fieldErrors
        };
    }

    result = await db
        .select({ id: accountsTable.id })
        .from(accountsTable)
        .where(
            and(
                eq(accountsTable.code, rawFormData.code),
                eq(accountsTable.companyId, companyId)
            )
        );

    if (result.length > 0) {
        return {
            success: false,
            error: "Kode akun sudah digunakan di akun lain"
        };
    }

    result = await db
        .select({ id: accountsTable.id })
        .from(accountsTable)
        .where(
            and(
                eq(accountsTable.name, rawFormData.name),
                eq(accountsTable.companyId, companyId)
            )
        );

    if (result.length > 0) {
        return {
            success: false,
            error: "Nama akun sudah digunakan di akun lain"
        };
    }

    try {
        await db
            .insert(accountsTable)
            .values({
                companyId,
                code: rawFormData.code,
                type: rawFormData.type,
                name: rawFormData.name,
                isCash: false
            });
    } catch (error) {
        return {
            success: false,
            error: "Gagal membuat akun baru"
        };
    }

    refresh();

    return {
        success: true
    };
}
