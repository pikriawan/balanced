"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export default function Switch({
    className,
    isEnabled,
    onChange,
    defaultIsEnabled = false,
    ...props
}) {
    const isControlled = isEnabled !== undefined;

    const [internalIsEnabled, setInternalIsEnabled] = useState(defaultIsEnabled);

    const isOn = isControlled ? isEnabled : internalIsEnabled;

    useEffect(() => {
        if (isControlled) {
            return;
        }

        setInternalIsEnabled(defaultIsEnabled);
    }, [defaultIsEnabled, isControlled]);

    function toggle() {
        const newValue = !isOn;

        if (!isControlled) {
            setInternalIsEnabled(newValue);
        }

        onChange?.(newValue);
    }

    return (
        <>
            <input type="hidden" value={isOn ? "on" : "off"} {...props} />
            <button
                type="button"
                role="switch"
                aria-checked={isOn}
                className={cn(
                    "w-10 h-6 relative rounded-full bg-neutral-800 transition-[background-color]",
                    isOn && "bg-neutral-50",
                    className
                )}
                onClick={toggle}
            >
                <span
                    className={cn(
                        "w-4 h-4 absolute top-1 left-1 rounded-full bg-neutral-50 transition-[left,background-color]",
                        isOn && "left-[calc(100%-1.25rem)] bg-neutral-950"
                    )}
                />
            </button>
        </>
    );
}
