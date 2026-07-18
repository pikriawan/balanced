import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import OpeningJournalEditForm from "@/components/opening-journal-edit-form";
import { getOpeningJournals } from "@/data/journal";

export default async function OpeningJournalEditPage({ params }) {
    const { companyId } = await params;
    const accounts = await getOpeningJournals(companyId);

    return (
        <div className="p-4 flex flex-col items-start gap-4">
            <div className="flex items-center gap-4">
                <Link href={`/companies/${companyId}/journals/opening`}>
                    <ChevronLeft size={16} />
                </Link>
                <h2 className="font-medium text-2xl">Edit Saldo Awal Akun</h2>
            </div>
            <OpeningJournalEditForm companyId={companyId} accounts={accounts} />
        </div>
    );
}
