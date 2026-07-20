import { Plus } from "lucide-react";
import DateFilter from "@/components/date-filter";
import PurchasesJournals from "@/components/purchases-journals";
import ButtonLink from "@/components/ui/button-link";
import { getPurchasesJournals } from "@/data/journal";

export default async function PurchasesJournalPage({ params, searchParams }) {
    const { companyId } = await params;
    const { start_date = "", end_date = "" } = await searchParams;
    const journals = await getPurchasesJournals(companyId, start_date, end_date);

    return (
        <div className="p-4 flex flex-col items-start gap-4">
            <h2 className="font-medium text-2xl">Jurnal Pembelian</h2>
            <ButtonLink href={`/companies/${companyId}/journals/purchases/create`}>
                <Plus size={16} />
                Buat jurnal baru
            </ButtonLink>
            <DateFilter />
            <PurchasesJournals journals={journals} companyId={companyId} />
        </div>
    );
}
