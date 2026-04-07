"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useContext, useEffect, useRef } from "react";
import { SheetContext } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

function NavigationLink({ pathname, href, onClick, children }) {
    const isActive = href.startsWith(pathname);

    return (
        <Link className={cn("px-4 py-2 flex justify-start items-center gap-3 text-sm font-medium rounded-lg text-neutral-50 hover:bg-neutral-900", isActive && "bg-neutral-900 border border-neutral-800")} href={href} onClick={onClick}>
            {children}
        </Link>
    );
}

export default function CompanySheetNavigation({ className, company, ...props }) {
    const pathname = usePathname();
    const prevPathname = useRef();
    const { isShow, setIsShow } = useContext(SheetContext);

    useEffect(() => {
        if (prevPathname.current && prevPathname.current !== pathname && isShow) {
            setIsShow(false);
        }

        prevPathname.current = pathname;
    }, [pathname, isShow, setIsShow]);

    return (
        <nav className={cn("flex flex-col", className)} {...props}>
            <NavigationLink pathname={pathname} href={`/companies/${company.id}/accounts`}>Akun</NavigationLink>
            <NavigationLink pathname={pathname} href={`/companies/${company.id}/journals`}>Jurnal</NavigationLink>
            <NavigationLink pathname={pathname} href={`/companies/${company.id}/ledger`}>Buku Besar</NavigationLink>
            <NavigationLink pathname={pathname} href={`/companies/${company.id}/reports`}>Laporan</NavigationLink>
        </nav>
    );
}
