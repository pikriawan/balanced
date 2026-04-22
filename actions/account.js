"use server";

import { and, eq, ne } from "drizzle-orm";
import { refresh } from "next/cache";
import { z } from "zod";
import { accountsTable, companiesTable, journalEntryDetailsTable, journalLinesTable } from "@/db/schema";
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

export async function updateAccount(accountId, formData) {
    const session = await auth();

    if (!session?.user) {
        return {
            success: false,
            error: "Tidak terautentikasi"
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

    let result = await db
        .select({ companyId: accountsTable.companyId })
        .from(accountsTable)
        .where(eq(accountsTable.id, accountId));

    if (result.length === 0) {
        return {
            success: false,
            error: "Akun tidak ditemukan"
        };
    }

    const { companyId } = result[0];

    result = await db
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
            error: "Anda tidak memiliki akses untuk mengubah akun ini"
        };
    }

    result = await db
        .select({ name: accountsTable.name })
        .from(accountsTable)
        .where(
            and(
                eq(accountsTable.name, validatedFields.data.name),
                eq(accountsTable.companyId, companyId),
                ne(accountsTable.id, accountId)
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
            .update(accountsTable)
            .set({
                ...validatedFields.data,
                cashflowCategory
            })
            .where(eq(accountsTable.id, accountId));
    } catch (error) {
        return {
            success: false,
            error: "Gagal memperbarui akun"
        };
    }

    refresh();

    return {
        success: true
    };
}

export async function deleteAccount(accountId) {
    const session = await auth();

    if (!session?.user) {
        return {
            success: false,
            error: "Tidak terautentikasi"
        };
    }

    let result = await db
        .select({ companyId: accountsTable.companyId })
        .from(accountsTable)
        .where(eq(accountsTable.id, accountId));

    if (result.length === 0) {
        return {
            success: false,
            error: "Akun tidak ditemukan"
        };
    }

    const { companyId } = result[0];

    result = await db
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
            error: "Anda tidak memiliki akses untuk menghapus akun ini"
        };
    }

    result = await db
        .select({ id: journalLinesTable.id })
        .from(journalLinesTable)
        .where(eq(journalLinesTable.accountId, accountId))
        .limit(1);

    if (result.length > 0) {
        return {
            success: false,
            error: "Akun tidak dapat dihapus karena sudah digunakan dalam transaksi jurnal"
        };
    }

    try {
        await db
            .delete(accountsTable)
            .where(eq(accountsTable.id, accountId));
    } catch (error) {
        return {
            success: false,
            error: "Gagal menghapus akun"
        };
    }

    refresh();

    return {
        success: true
    };
}
