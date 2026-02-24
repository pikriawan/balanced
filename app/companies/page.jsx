import { createCompany } from "../../actions/company";
import { getCompanies } from "../../data/company";

export default async function CompaniesPage() {
    const companies = await getCompanies();

    console.log(companies);

    return (
        <div className="p-4 flex flex-col gap-4">
            <h1 className="text-4xl font-semibold tracking-tighter">Perusahaan</h1>
            <form className="flex flex-col gap-4 items-start" action={createCompany}>
                <div className="flex flex-col gap-2">
                    <label htmlFor="companyName">Nama perusahaan</label>
                    <input className="px-4 py-2 rounded-lg focus:outline-0 border border-neutral-500 focus:border-neutral-900" id="companyName" name="name" />
                </div>
                <button className="flex justify-center items-center px-4 py-2 rounded-lg bg-neutral-900 text-white cursor-pointer">
                    Buat perusahaan baru
                </button>
            </form>
            {companies.length > 0 ? (
                <div className="flex flex-col gap-4 items-start">
                    {companies.map((company) => (
                        <div className="p-4 rounded-lg border border-neutral-500" key={company.id}>{company.name}</div>
                    ))}
                </div>
            ) : (
                <p>Kamu belum membuat perusahaan apapun</p>
            )}
        </div>
    );
}
