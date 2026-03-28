"use server";

import { and, eq } from "drizzle-orm";
import { refresh } from "next/cache";
import { accountsTable, companiesTable, usersTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import db from "@/lib/db";

export async function createAccount(companyId, formData) {
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

    if (!result.length) {
        return {
            success: false,
            error: {
                error: ["Perusahaan tidak ditemukan"]
            }
        };
    }

    const rawFormData = {
        code: formData.get("code"),
        type: formData.get("type"),
        name: formData.get("name")
    };

    const error = {
        code: [],
        type: [],
        name: []
    };

    if (!rawFormData.code?.length) {
        error.code.push("Kode akun tidak boleh kosong")
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

    console.log(result);

    if (result.length) {
        error.code.push("Kode akun ini sudah dipakai akun lainnya");
    }

    if (!rawFormData.type?.length) {
        error.type.push("Tipe akun tidak boleh kosong")
    }

    if (!rawFormData.name?.length) {
        error.name.push("Nama akun tidak boleh kosong")
    }

    if (Object.values(error).some((errors) => errors.length)) {
        return {
            success: false,
            error
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
            error: {
                error: ["Gagal membuat akun baru", error.message]
            }
        };
    }

    refresh();

    return {
        success: true
    };
}
