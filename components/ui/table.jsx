import { cn } from "@/lib/utils";

export function Table({ className, children, ...props }) {
    return (
        <table className={cn("border-separate border-spacing-0 border border-neutral-800 rounded-lg", className)} {...props}>
            {children}
        </table>
    );
}

export function TableHeader({ className, children, ...props }) {
    return (
        <thead className={cn("", className)} {...props}>
            {children}
        </thead>
    );
}

export function TableRow({ className, children, ...props }) {
    return (
        <tr className={cn("", className)} {...props}>
            {children}
        </tr>
    );
}

export function TableHead({ className, children, ...props }) {
    return (
        <th className={cn("min-w-48 text-left px-4 py-2 font-medium bg-neutral-900 first:rounded-tl-md last:rounded-tr-md", className)} {...props}>
            {children}
        </th>
    );
}

export function TableBody({ className, children, ...props }) {
    return (
        <tbody className={cn("", className)} {...props}>
            {children}
        </tbody>
    );
}

export function TableCell({ className, children, ...props }) {
    return (
        <td className={cn("min-w-48 px-4 py-2 first:rounded-bl-md last:rounded-br-md ", className)} {...props}>
            {children}
        </td>
    );
}
