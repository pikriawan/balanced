"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

export default function Switch({ className, defaultIsEnabled = false, ...props }) {
    const [value, setValue] = useState(defaultIsEnabled ? "on" : "off");

    return (
        <>
            <input
                type="hidden"
                value={value}
                onChange={(event) => setValue(event.target.value)}
                {...props}
            />
            <button
                type="button"
                className={cn(
                    "w-10 h-6 relative rounded-full bg-neutral-800 transition-[background-color]",
                    value === "on" && "bg-neutral-50",
                    className
                )}
                onClick={() => setValue((value) => value === "on" ? "off" : "on")}
            >
                <span
                    className={cn(
                        "w-4 h-4 absolute top-1 left-1 rounded-full bg-neutral-50 transition-[left,background-color]",
                        value === "on" && "left-[calc(100%-1.25rem)] bg-neutral-950"
                    )}
                />
            </button>
        </>
    );
}
