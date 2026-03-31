"use server";

import { and, eq } from "drizzle-orm";
import { refresh } from "next/cache";
import { z } from "zod";
import { accountsTable, companiesTable } from "@/db/schema";
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
        name: z.string().nonempty("Nama akun tidak boleh kosong"),
        isCash: z.stringbool().optional()
    });

    const rawFormData = Object.fromEntries(formData);
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

    let cashflowCategory = null;

    if (!validatedFields.data.isCash) {
        if (validatedFields.data.type === "asset") {
            cashflowCategory = "investing";
        } else if (validatedFields.data.type === "liability" || validatedFields.data.type === "equity") {
            cashflowCategory = "financing";
        } else {
            cashflowCategory = "operating";
        }
    }


    try {
        await db
            .insert(accountsTable)
            .values({
                companyId,
                ...validatedFields.data,
                cashflowCategory
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
