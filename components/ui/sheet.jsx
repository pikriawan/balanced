"use client";

import { createContext, useContext, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

export const SheetContext = createContext();

export function Sheet({ children }) {
    const [isShow, setIsShow] = useState(false);

    return (
        <SheetContext.Provider value={{ isShow, setIsShow }}>
            {children}
        </SheetContext.Provider>
    );
}

export function SheetTrigger({ children, ...props }) {
    const { setIsShow } = useContext(SheetContext);

    return (
        <div onClick={() => setIsShow(true)} {...props}>
            {children}
        </div>
    );
}

export function SheetClose({ children, ...props }) {
    const { setIsShow } = useContext(SheetContext);

    return (
        <div onClick={() => setIsShow(false)} {...props}>
            {children}
        </div>
    );
}

export function SheetContent({ className, children, ...props }) {
    const { isShow } = useContext(SheetContext);

    return isShow && createPortal(
        <>
            <SheetClose className="w-full h-full fixed top-0 left-0 bg-neutral-950 opacity-25 z-1" />
            <div className={cn("w-[80%] h-full fixed top-0 left-0 p-4 border-r border-neutral-800 bg-neutral-950 z-2 md:w-sm", className)} {...props}>
                {children}
            </div>
        </>,
        document.body
    );
}
