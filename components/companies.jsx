import { SquarePen, Trash2 } from "lucide-react";
import Link from "next/link";
import CompanyDeleteForm from "@/components/company-delete-form";
import CompanyUpdateForm from "@/components/company-update-form";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { getCompanies } from "@/data/company";

export default async function Companies() {
    const companies = await getCompanies();

    return companies.length ? (
        <div className="w-full max-w-md flex flex-col">
            {companies.map((company) => (
                <div className="flex bg-neutral-950 border-x border-b border-neutral-800 first:border-t first:rounded-t-lg last:rounded-b-lg" key={company.id}>
                    <Link title={company.name} className="w-full flex px-4 py-2 overflow-hidden" href={`/companies/${company.id}/accounts`}>
                        <p className="truncate">
                            {company.name}
                        </p>
                    </Link>
                    <Dialog>
                        <div className="flex items-center pr-4 py-2">
                            <DialogTrigger>
                                <SquarePen size={16} color="oklch(98.5% 0 0)" />
                            </DialogTrigger>
                        </div>
                        <DialogContent>
                            <CompanyUpdateForm company={company} />
                        </DialogContent>
                    </Dialog>
                    <Dialog>
                        <div className="flex items-center pr-4 py-2">
                            <DialogTrigger>
                                <Trash2 size={16} color="oklch(63.7% 0.237 25.331)" />
                            </DialogTrigger>
                        </div>
                        <DialogContent>
                            <CompanyDeleteForm company={company} />
                        </DialogContent>
                    </Dialog>
                </div>
            ))}
        </div>
    ) : (
        <p>Kamu belum punya perusahaan apapun. Ayo buat sekarang!</p>
    );
}
