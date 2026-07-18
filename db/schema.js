import { pgEnum, pgTable } from "drizzle-orm/pg-core";
import * as t from "drizzle-orm/pg-core";

export const accountTypesEnum = pgEnum("account_types", ["asset", "liability", "equity", "revenue", "expense"]);

export const journalTypesEnum = pgEnum("journal_types", ["general", "opening", "purchases", "sales", "cash_receipts", "cash_disbursements"]);

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
    firstMonth: t.integer("first_month").notNull(),
    firstYear: t.integer("first_year").notNull()
});

export const accountsTable = pgTable("accounts", {
    id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
    companyId: t.integer("company_id").notNull().references(() => companiesTable.id, { onDelete: "cascade" }),
    code: t.varchar().notNull(),
    type: accountTypesEnum().notNull(),
    name: t.varchar().notNull(),
    isCash: t.boolean("is_cash").notNull().default(false),
    isCapital: t.boolean("is_capital").notNull().default(false),
    isDrawing: t.boolean("is_drawing").notNull().default(false),
    cashflowCategory: cashflowCategoriesEnum()
});

export const journalsTable = pgTable("journals", {
    id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
    companyId: t.integer("company_id").notNull().references(() => companiesTable.id, { onDelete: "cascade" }),
    number: t.varchar().notNull(),
    type: journalTypesEnum().notNull(),
    date: t.date().notNull(),
    description: t.text(),
    createdAt: t.timestamp("created_at").defaultNow(),
    updatedAt: t.timestamp("updated_at").defaultNow()
});

export const journalLinesTable = pgTable("journal_lines", {
    id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
    journalId: t.integer("journal_id").notNull().references(() => journalsTable.id, { onDelete: "cascade" }),
    accountId: t.integer("account_id").notNull().references(() => accountsTable.id, { onDelete: "cascade" }),
    debit: t.numeric().notNull().default("0"),
    credit: t.numeric().notNull().default("0"),
    position: t.integer().notNull()
});
