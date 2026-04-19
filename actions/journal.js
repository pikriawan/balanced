"use server";

import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { accountsTable, companiesTable, journalLinesTable, journalsTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import db from "@/lib/db";

export async function createJournal(companyId, formData) {
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

    for await (const journalLine of journalLines) {
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

    let totalDebit = 0;
    let totalCredit = 0;

    for (const journalLine of journalLines) {
        totalDebit += journalLine.debit;
        totalCredit += journalLine.credit;
    }

    if (totalDebit !== totalCredit) {
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
                date: validatedFields.data.date,
                number: validatedFields.data.number,
                description: validatedFields.data.description
            })
            .returning({ id: journalsTable.id });

        await db
            .insert(journalLinesTable)
            .values(journalLines.map((journalLine) => ({
                journalId: result[0].id,
                ...journalLine
            })));
    } catch {
        return {
            success: false,
            error: "Gagal membuat jurnal baru"
        };
    }

    return { success: true };
}
