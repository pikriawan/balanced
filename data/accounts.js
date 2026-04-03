import { and, eq } from "drizzle-orm";
import { accountsTable, companiesTable, journalEntryDetailsTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import db from "@/lib/db";

export async function getAccounts(companyId) {
    const session = await auth();

    if (!session?.user) {
        return null;
    }

    let result = await db
        .select()
        .from(accountsTable)
        .where(eq(accountsTable.companyId, companyId));

    return result;
}

export async function getAccountBalance(companyId, accountId) {
    const session = await auth();

    if (!session?.user) {
        return null;
    }

    let result = await db
        .select({ companyId: companiesTable.id })
        .from(companiesTable)
        .where(
            and(
                eq(companiesTable.id, companyId),
                eq(companiesTable.userId, session.user.id)
            )
        );

    if (result.length === 0) {
        return null;
    }

    result = await db
        .select()
        .from(accountsTable)
        .where(
            and(
                eq(accountsTable.id, accountId),
                eq(accountsTable.companyId, companyId)
            )
        );

    if (result.length === 0) {
        return null;
    }

    result = await db
        .select()
        .from(journalEntryDetailsTable)
        .where(eq(journalEntryDetailsTable.accountId, accountId));

    if (result.length === 0) {
        return 0;
    }

    let balance = 0;

    for (const journalEntryDetail of result) {
        balance += journalEntryDetail.debit;
        balance -= journalEntryDetail.credit;
    }

    return balance;
}
