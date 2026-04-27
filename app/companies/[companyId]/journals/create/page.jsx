import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import JournalCreateForm from "@/components/journal-create-form";
import { getAccounts } from "@/data/account";
import { getCompany } from "@/data/company";
import { getLastJournalNumber } from "@/data/journal";

export default async function JournalCreatePage({ params }) {
    const { companyId } = await params;
    const company = await getCompany(companyId);
    const accounts = await getAccounts(company.id);
    const lastJournalNumber = await getLastJournalNumber(company.id);

    return (
        <div className="p-4 flex flex-col items-start gap-4">
            <div className="flex items-center gap-4">
                <Link href={`/companies/${companyId}/journals`}>
                    <ChevronLeft size={16} />
                </Link>
                <h2 className="font-medium text-2xl">Buat Jurnal Baru</h2>
            </div>
            <JournalCreateForm companyId={company.id} accounts={accounts} lastJournalNumber={lastJournalNumber} />
        </div>
    );
}
