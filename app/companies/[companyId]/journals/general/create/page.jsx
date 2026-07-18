import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import GeneralJournalCreateForm from "@/components/general-journal-create-form";
import { getAccounts } from "@/data/account";
import { getCompany } from "@/data/company";
import { getLastGeneralJournalNumber } from "@/data/journal";

export default async function GeneralJournalCreatePage({ params }) {
    const { companyId } = await params;
    const company = await getCompany(companyId);
    const accounts = await getAccounts(company.id);
    const lastJournalNumber = await getLastGeneralJournalNumber(company.id);

    return (
        <div className="p-4 flex flex-col items-start gap-4">
            <div className="flex items-center gap-4">
                <Link href={`/companies/${companyId}/journals/general`}>
                    <ChevronLeft size={16} />
                </Link>
                <h2 className="font-medium text-2xl">Buat Jurnal Baru</h2>
            </div>
            <GeneralJournalCreateForm companyId={company.id} accounts={accounts} lastJournalNumber={lastJournalNumber} />
        </div>
    );
}
