import { cn } from "@/lib/utils";

export default function Button({
    className,
    variant,
    children,
    ...props
}) {
    let variantClassNames = "";

    switch (variant) {
        case "outlined":
            variantClassNames = "bg-neutral-900 text-neutral-50 border border-neutral-800";
            break;
        case "danger":
            variantClassNames = "bg-red-500 text-neutral-50";
            break;
        default:
            variantClassNames = "bg-neutral-50 text-neutral-950";
    }

    return (
        <button className={cn("px-4 py-2 flex justify-start items-center gap-3 text-sm font-medium rounded-lg transition disabled:bg-neutral-900 disabled:text-neutral-50 disabled:border-0 disabled:opacity-60", variantClassNames, className)} {...props}>
            {children}
        </button>
    );
}
