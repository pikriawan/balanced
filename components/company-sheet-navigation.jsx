"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useContext, useEffect, useRef, useState } from "react";
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

function NavigationGroup({ name, pathname, startPathname, children }) {
    const [show, setShow] = useState(pathname.startsWith(startPathname));

    useEffect(() => {
        setShow(pathname.startsWith(startPathname));
    }, [pathname, startPathname]);

    return (
        <div className="flex flex-col">
            <div className="relative px-4 py-2 flex justify-start items-center gap-3 text-sm font-medium rounded-lg text-neutral-50 hover:bg-neutral-900" onClick={() => setShow(!show)}>
                {name}
                <button className="absolute top-1/2 right-1.5 -translate-y-1/2 flex justify-center items-center p-1">
                    <ChevronRight className={cn("text-neutral-50 transition-transform", show && "rotate-90")} size={16} />
                </button>
            </div>
            <div className={cn("hidden", show && "grid grid-cols-[auto_1fr]")}>
                <div className="w-8 h-full py-1 flex justify-center items-center">
                    <span className="w-px h-full bg-neutral-800" />
                </div>
                <div className="w-full flex flex-col">
                    {children}
                </div>
            </div>
        </div>
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
            <NavigationGroup name="Laporan" pathname={pathname} startPathname={`/companies/${company.id}/reports`}>
                <NavigationLink pathname={pathname} href={`/companies/${company.id}/reports/income-statement`}>Laba Rugi</NavigationLink>
                <NavigationLink pathname={pathname} href={`/companies/${company.id}/reports/statement-of-changes-in-equity`}>Perubahan Modal</NavigationLink>
                <NavigationLink pathname={pathname} href={`/companies/${company.id}/reports/balance-sheet`}>Neraca</NavigationLink>
                <NavigationLink pathname={pathname} href={`/companies/${company.id}/reports/cash-flow-statement`}>Arus Kas</NavigationLink>
            </NavigationGroup>
        </nav>
    );
}
