import { cn } from "@/lib/utils";

export function Field({ className, children, ...props }) {
    return (
        <div className={cn("flex flex-col gap-2", className)} {...props}>
            {children}
        </div>
    );
}

export function FieldLabel({ className, children, ...props }) {
    return (
        <label className={cn("text-sm font-medium", className)} {...props}>
            {children}
        </label>
    );
}
