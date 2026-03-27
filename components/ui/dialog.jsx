"use client";

import { createContext, useContext, useState } from "react";
import { cn } from "@/lib/utils";

export const DialogContext = createContext();

export function Dialog({ children }) {
    const [isShow, setIsShow] = useState(false);

    return (
        <DialogContext.Provider value={{ isShow, setIsShow }}>
            {children}
        </DialogContext.Provider>
    );
}

export function DialogTrigger({ children, ...props }) {
    const { setIsShow } = useContext(DialogContext);

    return (
        <div onClick={() => setIsShow(true)} {...props}>
            {children}
        </div>
    );
}

export function DialogClose({ children, ...props }) {
    const { setIsShow } = useContext(DialogContext);

    return (
        <div onClick={() => setIsShow(false)} {...props}>
            {children}
        </div>
    );
}

export function DialogContent({ className, children, ...props }) {
    const { isShow, setIsShow } = useContext(DialogContext);

    return isShow && (
        <>
            <DialogClose className="w-full h-full fixed top-0 left-0 bg-neutral-950 opacity-25 z-1" />
            <div className={cn("w-[calc(100%-2rem)] fixed top-4 left-1/2 transform-[translateX(-50%)] p-4 border border-neutral-800 rounded-2xl bg-neutral-950 z-2 md:w-sm md:top-1/2 md:left-1/2 md:transform-[translate(-50%,-50%)]", className)} {...props}>
                {children}
            </div>
        </>
    );
}
