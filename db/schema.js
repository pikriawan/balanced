import { pgEnum, pgTable } from "drizzle-orm/pg-core";
import * as t from "drizzle-orm/pg-core";

export const accountTypesEnum = pgEnum("account_types", ["asset", "liability", "equity", "revenue", "expense"]);

export const usersTable = pgTable("users", {
    id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
    name: t.varchar().notNull(),
    email: t.varchar().notNull().unique(),
    image: t.text()
});

export const companiesTable = pgTable("companies", {
    id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
    userId: t.integer("user_id").references(() => usersTable.id),
    name: t.varchar().notNull(),
});

export const accountsTable = pgTable("accounts", {
    id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
    companyId: t.integer("company_id").references(() => companiesTable.id),
    code: t.varchar().notNull(),
    type: accountTypesEnum().notNull(),
    name: t.varchar().notNull(),
    isCash: t.boolean("is_cash").notNull()
});

export const journalEntriesTable = pgTable("journal_entries", {
    id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
    companyId: t.integer("company_id").references(() => companiesTable.id),
    number: t.varchar().notNull(),
    date: t.date().notNull(),
    description: t.text()
});

export const journalEntryDetailsTable = pgTable("journal_entry_details", {
    id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
    journalEntryId: t.integer("journal_entry_id").references(() => journalEntriesTable.id),
    accountId: t.integer("account_id").references(() => accountsTable.id),
    debit: t.numeric().default("0"),
    credit: t.numeric().default("0")
});
