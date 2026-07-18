"use server";

import Decimal from "decimal.js";
import { and, eq, ne } from "drizzle-orm";
import { refresh } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { accountsTable, companiesTable, journalLinesTable, journalsTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import db from "@/lib/db";

export async function editOpeningJournal(companyId, formData) {
    const session = await auth();

    if (!session?.user) {
        return {
            success: false,
            error: "Tidak terautentikasi"
        };
    }

    const schema = z.object({
        accounts: z.string()
    });

    const rawFormData = Object.fromEntries(formData);
    const validatedFields = schema.safeParse(rawFormData);

    if (!validatedFields.success) {
        return {
            success: false,
            error: z.flattenError(validatedFields.error).fieldErrors
        };
    }

    let accounts;

    try {
        accounts = JSON.parse(validatedFields.data.accounts);
    } catch {
        return {
            success: false,
            error: "Data tidak valid"
        };
    }

    let balance = new Decimal("0");

    for (const account of accounts) {
        balance = balance
            .plus(new Decimal(account.debit))
            .minus(new Decimal(account.credit));
    }

    if (!balance.isZero()) {
        return {
            success: false,
            error: "Jumlah sisa harus nol"
        };
    }

    const company = await db
        .select({
            id: companiesTable.id,
            firstMonth: companiesTable.firstMonth,
            firstYear: companiesTable.firstYear
        })
        .from(companiesTable)
        .where(
            and(
                eq(companiesTable.id, companyId),
                eq(companiesTable.userId, session.user.id)
            )
        );

    console.log(company[0]);

    if (company.length === 0) {
        return {
            success: false,
            error: "Perusahaan tidak ditemukan"
        };
    }

    try {
        const openingJournal = await db
            .select({ id: journalsTable.id })
            .from(journalsTable)
            .where(
                and(
                    eq(journalsTable.companyId, companyId),
                    eq(journalsTable.type, "opening")
                )
            );

        if (openingJournal.length > 0) {
            await db
                .delete(journalsTable)
                .where(eq(journalsTable.id, openingJournal[0].id));
        }

        let result = await db
            .insert(journalsTable)
            .values({
                companyId,
                type: "opening",
                date: `${company[0].firstYear}-${company[0].firstMonth}-1`,
                number: "JPB00001"
            })
            .returning({ id: journalsTable.id });

        await db
            .insert(journalLinesTable)
            .values(accounts.map((account, i) => ({
                journalId: result[0].id,
                position: i,
                ...account
            })));
    } catch (error) {
        console.log(error);

        return {
            success: false,
            error: "Gagal mengedit saldo awal akun"
        };
    }

    redirect(`/companies/${companyId}/journals/opening`);
}

export async function createGeneralJournal(companyId, formData) {
    const session = await auth();
    
    if (!session?.user) {
        return {
            success: false,
            error: "Tidak terautentikasi"
        };
    }

    const schema = z.object({
        date: z.iso.date("Tanggal jurnal tidak valid"),
        number: z.string().nonempty("Nomor jurnal tidak boleh kosong"),
        description: z.string().optional(),
        journalLines: z.string()
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
        .select({
            id: companiesTable.id,
            firstMonth: companiesTable.firstMonth,
            firstYear: companiesTable.firstYear
        })
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

    const journalDate = new Date(validatedFields.data.date);

    if (
        journalDate.getFullYear() < result[0].firstYear ||
        (journalDate.getFullYear() === result[0].firstYear && journalDate.getMonth() + 1 < result[0].firstMonth)
    ) {
        return {
            success: false,
            error: "Tanggal jurnal harus setelah tanggal pembukuan awal perusahaan (1/" +
                result[0].firstMonth +
                "/" +
                result[0].firstYear +
                ")"
        };
    }

    result = await db
        .select({ id: journalsTable.id })
        .from(journalsTable)
        .where(
            and(
                eq(journalsTable.number, rawFormData.number),
                eq(journalsTable.companyId, companyId)
            )
        );

    if (result.length > 0) {
        return {
            success: false,
            error: "Nomor jurnal sudah digunakan di jurnal lain"
        };
    }

    let journalLines;

    try {
        journalLines = JSON.parse(validatedFields.data.journalLines);
        journalLines = journalLines.map((journalLine) => ({
            accountId: Number(journalLine.accountId),
            debit: Number(journalLine.debit),
            credit: Number(journalLine.credit)
        }));
    } catch {
        return {
            success: false,
            error: "Baris jurnal tidak valid"
        };
    }

    if (journalLines.length < 2) {
        return {
            success: false,
            error: "Baris jurnal harus minimal 2 baris"
        };
    }

    for (const journalLine of journalLines) {
        let result = await db
            .select({ id: accountsTable.id })
            .from(accountsTable)
            .where(eq(accountsTable.id, journalLine.accountId));

        if (result.length === 0) {
            return {
                success: false,
                error: "Akun tidak ditemukan"
            };
        }
    }

    for (const journalLine of journalLines) {
        if (
            !(
                (journalLine.debit > 0 && journalLine.credit === 0) ||
                (journalLine.debit === 0 && journalLine.credit > 0)
            )
        ) {
            return {
                success: false,
                error: "Salah satu dari debit atau kredit harus bernilai nol"
            };
        }
    }

    let balance = new Decimal("0");

    for (const journalLine of journalLines) {
        balance = balance
            .plus(new Decimal(journalLine.debit.toString()))
            .minus(new Decimal(journalLine.credit.toString()));
    }

    if (!balance.isZero()) {
        return {
            success: false,
            error: "Jumlah debit dan kredit harus seimbang"
        };
    }

    try {
        result = await db
            .insert(journalsTable)
            .values({
                companyId,
                type: "general",
                date: validatedFields.data.date,
                number: validatedFields.data.number,
                description: validatedFields.data.description
            })
            .returning({ id: journalsTable.id });

        await db
            .insert(journalLinesTable)
            .values(journalLines.map((journalLine, i) => ({
                journalId: result[0].id,
                position: i,
                ...journalLine
            })));
    } catch {
        return {
            success: false,
            error: "Gagal membuat jurnal baru"
        };
    }
    
    redirect(`/companies/${companyId}/journals/general`);
}

export async function editGeneralJournal(companyId, journalId, formData) {
    const session = await auth();
    
    if (!session?.user) {
        return {
            success: false,
            error: "Tidak terautentikasi"
        };
    }

    const schema = z.object({
        date: z.iso.date("Tanggal jurnal tidak valid"),
        number: z.string().nonempty("Nomor jurnal tidak boleh kosong"),
        description: z.string().optional(),
        journalLines: z.string()
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
        .select({ id: journalsTable.id })
        .from(journalsTable)
        .where(
            and(
                eq(journalsTable.id, journalId),
                eq(journalsTable.companyId, companyId)
            ),
        );

    if (result.length === 0) {
        return {
            success: false,
            error: "Jurnal tidak ditemukan"
        };
    }

    result = await db
        .select({ id: journalsTable.id })
        .from(journalsTable)
        .where(
            and(
                eq(journalsTable.number, rawFormData.number),
                eq(journalsTable.companyId, companyId),
                ne(journalsTable.id, journalId)
            )
        );

    if (result.length > 0) {
        return {
            success: false,
            error: "Nomor jurnal sudah digunakan di jurnal lain"
        };
    }

    let journalLines;

    try {
        journalLines = JSON.parse(validatedFields.data.journalLines);
        journalLines = journalLines.map((journalLine) => ({
            accountId: Number(journalLine.accountId),
            debit: Number(journalLine.debit),
            credit: Number(journalLine.credit)
        }));
    } catch {
        return {
            success: false,
            error: "Baris jurnal tidak valid"
        };
    }

    if (journalLines.length < 2) {
        return {
            success: false,
            error: "Baris jurnal harus minimal 2 baris"
        };
    }

    for (const journalLine of journalLines) {
        let result = await db
            .select({ id: accountsTable.id })
            .from(accountsTable)
            .where(eq(accountsTable.id, journalLine.accountId));

        if (result.length === 0) {
            return {
                success: false,
                error: "Akun tidak ditemukan"
            };
        }
    }

    for (const journalLine of journalLines) {
        if (
            !(
                (journalLine.debit > 0 && journalLine.credit === 0) ||
                (journalLine.debit === 0 && journalLine.credit > 0)
            )
        ) {
            return {
                success: false,
                error: "Salah satu dari debit atau kredit harus bernilai nol"
            };
        }
    }

    let balance = new Decimal("0");

    for (const journalLine of journalLines) {
        balance = balance
            .plus(new Decimal(journalLine.debit.toString()))
            .minus(new Decimal(journalLine.credit.toString()));
    }

    if (!balance.isZero()) {
        return {
            success: false,
            error: "Jumlah debit dan kredit harus seimbang"
        };
    }

    try {
        result = await db
            .update(journalsTable)
            .set({
                companyId,
                date: validatedFields.data.date,
                number: validatedFields.data.number,
                description: validatedFields.data.description
            })
            .where(eq(journalsTable.id, journalId))
            .returning({ id: journalsTable.id });

        await db
            .delete(journalLinesTable)
            .where(eq(journalLinesTable.journalId, result[0].id));

        await db
            .insert(journalLinesTable)
            .values(journalLines.map((journalLine, i) => ({
                journalId: result[0].id,
                position: i,
                ...journalLine
            })));
    } catch {
        return {
            success: false,
            error: "Gagal memperbarui jurnal"
        };
    }
    
    redirect(`/companies/${companyId}/journals/general`);
}

export async function deleteGeneralJournal(journalId) {
    const session = await auth();

    if (!session?.user) {
        return {
            success: false,
            error: "Tidak terautentikasi"
        };
    }

    let result = await db
        .select({ companyId: journalsTable.companyId })
        .from(journalsTable)
        .where(eq(journalsTable.id, journalId));

    if (result.length === 0) {
        return {
            success: false,
            error: "Jurnal tidak ditemukan"
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
            error: "Anda tidak memiliki akses untuk menghapus jurnal ini"
        };
    }

    try {
        await db
            .delete(journalLinesTable)
            .where(eq(journalLinesTable.journalId, journalId));

        await db
            .delete(journalsTable)
            .where(eq(journalsTable.id, journalId));
    } catch (error) {
        return {
            success: false,
            error: "Gagal menghapus jurnal"
        };
    }

    refresh();

    return {
        success: true
    };
}
