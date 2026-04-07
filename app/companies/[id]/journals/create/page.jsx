import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { getCompany } from "@/data/company";

export default async function JournalCreatePage({ params }) {
    const { id } = await params;
    const company = await getCompany(id);

    return (
        <div className="p-4 flex flex-col gap-4">
            <div className="flex items-center gap-4">
                <Link href={`/companies/${id}/journals`}>
                    <ChevronLeft size={16} />
                </Link>
                <h2 className="font-medium text-2xl">Buat Jurnal Baru</h2>
            </div>
        </div>
    );
}
