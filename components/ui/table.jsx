import { cn } from "@/lib/utils";

export function Table({ className, children, ...props }) {
    return (
        <div className={cn("grid gap-y-px bg-neutral-800 border border-neutral-800 rounded-lg", className)} {...props}>
            {children}
        </div>
    );
}

export function TableHead({ className, children, ...props }) {
    return (
        <div className={cn("px-4 py-2 flex items-center gap-4 bg-neutral-900", className)} {...props}>
            {children}
        </div>
    );
}

export function TableCell({ className, children, ...props }) {
    return (
        <div className={cn("px-4 py-2 flex items-center gap-4 bg-neutral-950", className)} {...props}>
            {children}
        </div>
    );
}
