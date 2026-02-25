import Link from "next/link";
import { getCompany } from "../../../data/company";

export default async function CompanyPage({ params }) {
    const { id } = await params;
    const company = await getCompany(id);

    return (
        <div className="p-4 flex flex-col gap-4">
            {company ? (
                <div className="flex gap-4 items-center">
                    <Link href="/companies">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-left-icon lucide-chevron-left"><path d="m15 18-6-6 6-6"/></svg>
                    </Link>
                    <h1 className="text-4xl font-semibold tracking-tighter">{company.name}</h1>
                </div>
            ) : (
                <>
                    <div className="flex gap-4 items-center">
                        <Link href="/companies">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-left-icon lucide-chevron-left"><path d="m15 18-6-6 6-6"/></svg>
                        </Link>
                    </div>
                    <p>Perusahaan tidak ditemukan</p>
                </>
            )}
        </div>
    );
}
