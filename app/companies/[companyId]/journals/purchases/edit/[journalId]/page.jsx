import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import SpecialJournalEditForm from "@/components/special-journal-edit-form";
import { getAccounts } from "@/data/account";
import { getJournal } from "@/data/journal";

export default async function GeneralJournalEditPage({ params }) {
    const { companyId, journalId } = await params;
    const accounts = await getAccounts(companyId);
    const journal = await getJournal(companyId, journalId, "purchases");

    return (
        <div className="p-4 flex flex-col items-start gap-4">
            <div className="flex items-center gap-4">
                <Link href={`/companies/${companyId}/journals/general`}>
                    <ChevronLeft size={16} />
                </Link>
                <h2 className="font-medium text-2xl">Edit Jurnal</h2>
            </div>
            <SpecialJournalEditForm companyId={companyId} accounts={accounts} journal={journal} type="purchases" />
        </div>
    );
}
