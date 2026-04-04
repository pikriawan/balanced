import { cn } from "@/lib/utils";

export function Table({ children, ...props }) {
    return (
        <table {...props}>
            {children}
        </table>
    );
}

export function TableHeader({ className, children, ...props }) {
    return (
        <thead className={cn("bg-neutral-900 border-b border-neutral-800", className)} {...props}>
            {children}
        </thead>
    );
}

export function TableBody({ children, ...props }) {
    return (
        <tbody {...props}>
            {children}
        </tbody>
    );
}

export function TableRow({ children, ...props }) {
    return (
        <tr {...props}>
            {children}
        </tr>
    );
}

export function TableHead({ className, children, ...props }) {
    return (
        <th className={cn("px-4 py-2 font-medium bg-neutral-900 border-b border-neutral-800", className)} {...props}>
            <div className="flex items-center gap-4 whitespace-nowrap">
                {children}
            </div>
        </th>
    );
}

export function TableCell({ className, children, ...props }) {
    return (
        <td className={cn("px-4 py-2 bg-neutral-950 border-b border-neutral-800", className)} {...props}>
            <div className="flex items-center gap-4 whitespace-nowrap">
                {children}
            </div>
        </td>
    );
}
