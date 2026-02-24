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
    id: t.uuid().primaryKey().defaultRandom(),
    userId: t.integer("user_id").references(() => users.id),
    name: t.varchar().notNull(),
});

export const accountsTable = pgTable("accounts", {
    id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
    companyId: t.uuid("company_id").references(() => companies.id),
    code: t.integer().notNull(),
    type: accountTypesEnum().notNull(),
    balance: t.numeric().notNull()
});

export const journalEntriesTable = pgTable("journal_entries", {
    id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
    companyId: t.uuid("company_id").references(() => companies.id),
    number: t.varchar().notNull(),
    date: t.date().notNull(),
    description: t.text()
});

export const journalEntryDetailsTable = pgTable("journal_entry_details", {
    id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
    journalEntryId: t.integer("journal_entry_id").references(() => journalEntries.id),
    amount: t.numeric().notNull()
});
