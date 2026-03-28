ALTER TABLE "accounts" DROP CONSTRAINT "accounts_company_id_companies_id_fk";
--> statement-breakpoint
ALTER TABLE "companies" DROP CONSTRAINT "companies_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "journal_entries" DROP CONSTRAINT "journal_entries_company_id_companies_id_fk";
--> statement-breakpoint
ALTER TABLE "journal_entry_details" DROP CONSTRAINT "journal_entry_details_journal_entry_id_journal_entries_id_fk";
--> statement-breakpoint
ALTER TABLE "journal_entry_details" DROP CONSTRAINT "journal_entry_details_account_id_accounts_id_fk";
--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "companies" ADD CONSTRAINT "companies_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "journal_entries" ADD CONSTRAINT "journal_entries_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "journal_entry_details" ADD CONSTRAINT "journal_entry_details_journal_entry_id_journal_entries_id_fk" FOREIGN KEY ("journal_entry_id") REFERENCES "public"."journal_entries"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "journal_entry_details" ADD CONSTRAINT "journal_entry_details_account_id_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."accounts"("id") ON DELETE cascade ON UPDATE no action;