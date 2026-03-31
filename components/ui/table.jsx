import { cn } from "@/lib/utils";

export function Table({ className, children, ...props }) {
    return (
        <table className={cn("", className)} {...props}>
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
        <th className={cn("", className)} {...props}>
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
        <td className={cn("", className)} {...props}>
            {children}
        </td>
    );
}
