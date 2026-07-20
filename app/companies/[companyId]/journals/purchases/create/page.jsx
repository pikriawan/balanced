import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import PurchasesJournalCreateForm from "@/components/purchases-journal-create-form";
import { getAccounts } from "@/data/account";
import { getLastGeneralJournalNumber } from "@/data/journal";

export default async function PurchasesJournalCreatePage({ params }) {
    const { companyId } = await params;
    const accounts = await getAccounts(companyId);
    const lastJournalNumber = await getLastGeneralJournalNumber(companyId, "PB");

    return (
        <div className="p-4 flex flex-col items-start gap-4">
            <div className="flex items-center gap-4">
                <Link href={`/companies/${companyId}/journals/general`}>
                    <ChevronLeft size={16} />
                </Link>
                <h2 className="font-medium text-2xl">Buat Jurnal Baru</h2>
            </div>
            <PurchasesJournalCreateForm companyId={companyId} accounts={accounts} lastJournalNumber={lastJournalNumber} />
        </div>
    );
}
