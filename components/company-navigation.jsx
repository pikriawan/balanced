"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

function NavigationLink({ pathname, href, children }) {
    const isActive = href.startsWith(pathname);

    return (
        <Link className={cn("px-4 py-2 flex justify-start items-center gap-3 text-sm font-medium rounded-lg text-neutral-50 hover:bg-neutral-900", isActive && "bg-neutral-900 border border-neutral-800")} href={href}>
            {children}
        </Link>
    );
}

export default function CompanyNavigation({ className, company, ...props }) {
    const pathname = usePathname();

    return (
        <nav className={cn("flex flex-col", className)} {...props}>
            <NavigationLink pathname={pathname} href={`/companies/${company.id}/accounts`}>Akun</NavigationLink>
            <NavigationLink pathname={pathname} href={`/companies/${company.id}/journals`}>Jurnal</NavigationLink>
            <NavigationLink pathname={pathname} href={`/companies/${company.id}/ledger`}>Buku Besar</NavigationLink>
            <NavigationLink pathname={pathname} href={`/companies/${company.id}/reports`}>Laporan</NavigationLink>
        </nav>
    );
}
