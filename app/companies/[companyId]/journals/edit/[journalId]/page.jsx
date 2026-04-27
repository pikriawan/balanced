import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import JournalEditForm from "@/components/journal-edit-form";
import { getAccounts } from "@/data/account";
import { getCompany } from "@/data/company";
import { getJournal } from "@/data/journal";

export default async function JournalEditPage({ params }) {
    const { companyId, journalId } = await params;
    const company = await getCompany(companyId);
    const accounts = await getAccounts(company.id);
    const journal = await getJournal(company.id, journalId);

    return (
        <div className="p-4 flex flex-col items-start gap-4">
            <div className="flex items-center gap-4">
                <Link href={`/companies/${companyId}/journals`}>
                    <ChevronLeft size={16} />
                </Link>
                <h2 className="font-medium text-2xl">Edit Jurnal</h2>
            </div>
            <JournalEditForm companyId={company.id} accounts={accounts} journal={journal} />
        </div>
    );
}
