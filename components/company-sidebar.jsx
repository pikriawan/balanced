"use client";

import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

function SidebarLink({ pathname, href, children }) {
    const isActive = href.startsWith(pathname);

    return (
        <Link className={`flex px-2 py-1 hover:bg-neutral-300 transition-colors rounded${isActive ? " bg-neutral-600 text-white" : ""}`} href={href}>
            {children}
        </Link>
    );
}

export default function CompanySidebar({ company }) {
    const pathname = usePathname();

    return (
        <aside className="w-xs h-full flex flex-col p-4 gap-4 shadow-[-0.0625rem_0_0_#CCCCCC_inset]">
            <header className="flex gap-4 items-center">
                <Link href="/companies">
                    <ChevronLeft size={16} />
                </Link>
                <h1 className="font-medium tracking-tighter">{company.name}</h1>
            </header>
            <nav className="w-full h-full flex flex-col">
                <SidebarLink pathname={pathname} href={`/company/${company.id}/accounts`}>Akun</SidebarLink>
                <SidebarLink pathname={pathname} href={`/company/${company.id}/journals`}>Jurnal</SidebarLink>
                <SidebarLink pathname={pathname} href={`/company/${company.id}/ledger`}>Buku Besar</SidebarLink>
                <SidebarLink pathname={pathname} href={`/company/${company.id}/reports`}>Laporan</SidebarLink>
            </nav>
        </aside>
    );
}
