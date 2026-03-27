import Link from "next/link";
import { cn } from "@/lib/utils";

export default function ButtonLink({
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
        <Link className={cn("px-4 py-2 flex justify-start items-center gap-3 text-sm no-underline font-medium rounded-lg", variantClassNames, className)} {...props}>
            {children}
        </Link>
    );
}
