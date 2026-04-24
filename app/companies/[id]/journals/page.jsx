import { Plus } from "lucide-react";
import Journals from "@/components/journals";
import ButtonLink from "@/components/ui/button-link";
import { getCompany } from "@/data/company";
import { getJournals } from "@/data/journal";

export default async function JournalsPage({ params }) {
    const { id } = await params;
    const company = await getCompany(id);
    const journals = await getJournals(company.id);

    return (
        <div className="p-4 flex flex-col items-start gap-4">
            <h2 className="font-medium text-2xl">Jurnal</h2>
            <ButtonLink href={`/companies/${id}/journals/create`}>
                <Plus size={16} />
                Buat jurnal baru
            </ButtonLink>
            <Journals journals={journals} companyId={company.id} />
        </div>
    );
}
