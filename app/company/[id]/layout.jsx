import { ChevronLeft, EllipsisVertical } from "lucide-react";
import Link from "next/link";
import CompanyNavigation from "@/components/company-navigation";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { getCompany } from "@/data/company";

export default async function CompanyLayout({ children, params }) {
    const { id } = await params;
    const company = await getCompany(id);

    return (
        <div className="md:w-[calc(100%-20rem)] md:h-full md:fixed md:top-0 md:left-80 md:overflow-auto">
            <aside className="hidden md:block fixed w-xs h-full top-0 left-0 p-4 border-r border-neutral-800">
                <CompanyNavigation company={company} />
            </aside>
            <header className="sticky top-0 p-4 flex justify-between items-center gap-4 bg-neutral-950 border-b border-neutral-800">
                <div className="flex items-center gap-4">
                    <Link href="/companies">
                        <ChevronLeft size={16} />
                    </Link>
                    <h1 className="font-medium">{company.name}</h1>
                </div>
                <Sheet>
                    <SheetTrigger className="md:hidden">
                        <EllipsisVertical size={16} />
                    </SheetTrigger>
                    <SheetContent>
                        <CompanyNavigation company={company} />
                    </SheetContent>
                </Sheet>
            </header>
            <main>
                {children}
            </main>
        </div>
    );
}
