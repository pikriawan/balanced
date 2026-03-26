import CompanySidebar from "../../../components/company-sidebar";
import { getCompany } from "../../../data/company";

export default async function CompanyLayout({ children, params }) {
    const { id } = await params;
    const company = await getCompany(id);

    return (
        <div className="flex w-full h-full">
            <CompanySidebar company={company} />
            <div className="w-full h-full overflow-auto">{children}</div>
        </div>
    );
}
