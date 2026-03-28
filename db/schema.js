import { pgEnum, pgTable } from "drizzle-orm/pg-core";
import * as t from "drizzle-orm/pg-core";

export const accountTypesEnum = pgEnum("account_types", ["asset", "liability", "equity", "revenue", "expense"]);

export const cashflowCategoriesEnum = pgEnum("cashflow_categories", ["operating", "investing", "financing"]);

export const usersTable = pgTable("users", {
    id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
    name: t.varchar().notNull(),
    email: t.varchar().notNull().unique(),
    image: t.text()
});

export const companiesTable = pgTable("companies", {
    id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
    userId: t.integer("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
    name: t.varchar().notNull(),
});

export const accountsTable = pgTable("accounts", {
    id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
    companyId: t.integer("company_id").notNull().references(() => companiesTable.id, { onDelete: "cascade" }),
    code: t.varchar().notNull(),
    type: accountTypesEnum().notNull(),
    name: t.varchar().notNull(),
    isCash: t.boolean("is_cash").notNull(),
    cashflowCategory: cashflowCategoriesEnum()
});

export const journalEntriesTable = pgTable("journal_entries", {
    id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
    companyId: t.integer("company_id").notNull().references(() => companiesTable.id, { onDelete: "cascade" }),
    number: t.varchar().notNull(),
    date: t.date().notNull(),
    description: t.text()
});

export const journalEntryDetailsTable = pgTable("journal_entry_details", {
    id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
    journalEntryId: t.integer("journal_entry_id").notNull().references(() => journalEntriesTable.id, { onDelete: "cascade" }),
    accountId: t.integer("account_id").notNull().references(() => accountsTable.id, { onDelete: "cascade" }),
    debit: t.numeric().notNull().default("0"),
    credit: t.numeric().notNull().default("0")
});
