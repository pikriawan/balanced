import { Plus } from "lucide-react";
import ButtonLink from "@/components/ui/button-link";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { getCompany } from "@/data/company";

export default async function JournalsPage({ params }) {
    const { id } = await params;
    const company = await getCompany(id);

    return (
        <div className="p-4 flex flex-col items-start gap-4">
            <h2 className="font-medium text-2xl">Jurnal</h2>
            <ButtonLink href={`/companies/${id}/journals/create`}>
                <Plus size={16} />
                Buat jurnal baru
            </ButtonLink>
        </div>
    );
}
