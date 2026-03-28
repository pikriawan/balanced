"use client";

import { useRef, useState } from "react";
import { cn } from "@/lib/utils";

export default function Switch({ className, isEnabled: defaultIsEnabled, ...props }) {
    const [isEnabled, setIsEnabled] = useState(defaultIsEnabled);
    const inputRef = useRef();

    return (
        <>
            <input
                type="hidden"
                value={isEnabled}
                ref={inputRef}
                onChange={() => setIsEnabled(inputRef.current.value)}
                {...props}
            />
            <span className={cn("w-10 h-6 relative rounded-full bg-neutral-800 transition-[background-color]", isEnabled && "bg-neutral-50", className)} onClick={() => setIsEnabled((isEnabled) => !isEnabled)}>
                <span className={cn("w-4 h-4 absolute top-1 left-1 rounded-full bg-neutral-50 transition-[left,background-color]", isEnabled && "left-[calc(100%-1.25rem)] bg-neutral-950")}></span>
            </span>
        </>
    );
}
