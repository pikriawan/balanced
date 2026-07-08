import Decimal from "decimal.js";
import { and, eq, or } from "drizzle-orm";
import { accountsTable, journalLinesTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import db from "@/lib/db";

export async function getIncomeStatement(companyId) {
    const session = await auth();

    if (!session?.user) {
        return null;
    }

    let result = await db
        .select()
        .from(accountsTable)
        .where(
            and(
                eq(accountsTable.companyId, companyId),
                or(
                    eq(accountsTable.type, "revenue"),
                    eq(accountsTable.type, "expense")
                )
            )
        )
        .leftJoin(journalLinesTable, eq(journalLinesTable.accountId, accountsTable.id))
        .orderBy(accountsTable.code);

    const accounts = [];

    for (const row of result) {
        if (!accounts.some((a) => a.id === row.accounts.id)) {
            accounts.push(row.accounts);
        }
    }

    for (const row of result) {
        const accountIndex = accounts.findIndex((a) => a.id === row.accounts.id);

        if (!accounts[accountIndex].balance) {
            accounts[accountIndex].balance = "0";
        }

        accounts[accountIndex].balance = new Decimal(accounts[accountIndex].balance)
            .plus(new Decimal(row.journal_lines?.debit || "0"))
            .minus(new Decimal(row.journal_lines?.credit || "0"))
            .toString();
    }

    const revenues = accounts.filter((a) => a.type === "revenue");
    const expenses = accounts.filter((a) => a.type === "expense");

    for (let i = 0; i < accounts.length; i++) {
        if (accounts[i].type === "revenue") {
            const balance = new Decimal(accounts[i].balance);

            if (balance.isPositive()) {
                accounts[i].balance = new Decimal("0").minus(balance).toString();
            } else {
                accounts[i].balance = balance.abs().toString();
            }
        }
    }

    let totalRevenue = new Decimal("0");

    for (const account of revenues) {
        totalRevenue = totalRevenue.plus(new Decimal(account.balance));
    }

    let totalExpense = new Decimal("0");

    for (const account of expenses) {
        totalExpense = totalExpense.plus(new Decimal(account.balance));
    }

    const income = totalRevenue.minus(totalExpense).toString();

    return {
        revenues,
        expenses,
        revenue: totalRevenue.toString(),
        expense: totalExpense.toString(),
        income
    };
}
