import { Plus } from "lucide-react";
import DateFilter from "@/components/date-filter";
import Journals from "@/components/journals";
import ButtonLink from "@/components/ui/button-link";
import { getCompany } from "@/data/company";
import { getGeneralJournals } from "@/data/journal";

export default async function GeneralJournalPage({ params, searchParams }) {
    const { companyId } = await params;
    const { start_date = "", end_date = "" } = await searchParams;
    const company = await getCompany(companyId);
    const journals = await getGeneralJournals(company.id, start_date, end_date);

    return (
        <div className="p-4 flex flex-col items-start gap-4">
            <h2 className="font-medium text-2xl">Jurnal Umum</h2>
            <ButtonLink href={`/companies/${companyId}/journals/general/create`}>
                <Plus size={16} />
                Buat jurnal baru
            </ButtonLink>
            <DateFilter />
            <Journals journals={journals} companyId={company.id} />
        </div>
    );
}
