import Link from "next/link";
import { getCompanies } from "@/data/company";

export default async function Companies() {
    const companies = await getCompanies();

    return companies.length ? (
        <div className="w-full max-w-md flex flex-col">
            {companies.map((company) => (
                <Link className="flex items-center px-4 py-2 bg-neutral-950 border-x border-b border-neutral-800 first:border-t first:rounded-t-lg last:rounded-b-lg" key={company.id} href={`/company/${company.id}/accounts`}>
                    {company.name}
                </Link>
            ))}
        </div>
    ) : (
        <p>Kamu belum bikin perusahaan apapun. Ayo buat sekarang!</p>
    );
}
