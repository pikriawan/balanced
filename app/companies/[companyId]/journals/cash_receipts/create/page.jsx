import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import SpecialJournalCreateForm from "@/components/special-journal-create-form";
import { getAccounts } from "@/data/account";
import { getLastJournalNumber } from "@/data/journal";

export default async function CashReceiptsournalCreatePage({ params }) {
    const { companyId } = await params;
    const accounts = await getAccounts(companyId);
    const lastJournalNumber = await getLastJournalNumber(companyId, "KM", "cash_receipts");

    return (
        <div className="p-4 flex flex-col items-start gap-4">
            <div className="flex items-center gap-4">
                <Link href={`/companies/${companyId}/journals/cash_receipts`}>
                    <ChevronLeft size={16} />
                </Link>
                <h2 className="font-medium text-2xl">Buat Jurnal Baru</h2>
            </div>
            <SpecialJournalCreateForm companyId={companyId} accounts={accounts} lastJournalNumber={lastJournalNumber} type="cash_receipts" />
        </div>
    );
}
