import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default async function JournalEditPage({ params }) {
    const { id } = await params;

    return (
        <div className="p-4 flex flex-col items-start gap-4">
            <div className="flex items-center gap-4">
                <Link href={`/companies/${id}/journals`}>
                    <ChevronLeft size={16} />
                </Link>
                <h2 className="font-medium text-2xl">Edit Jurnal</h2>
            </div>
        </div>
    );
}
