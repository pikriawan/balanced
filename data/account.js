import Decimal from "decimal.js";
import { and, eq } from "drizzle-orm";
import { accountsTable, companiesTable, journalLinesTable } from "@/db/schema";
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
        .where(eq(accountsTable.companyId, companyId))
        .orderBy(accountsTable.code);

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
        .from(journalLinesTable)
        .where(eq(journalLinesTable.accountId, accountId));

    if (result.length === 0) {
        return new Decimal("0").toString();
    }

    let balance = new Decimal("0");

    for (const journalLine of result) {
        balance = balance.plus(new Decimal(journalLine.debit));
        balance = balance.minus(new Decimal(journalLine.credit));
    }

    return balance.toString();
}
