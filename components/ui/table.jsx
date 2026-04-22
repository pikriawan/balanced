import { cn } from "@/lib/utils";

const vAlignClass = {
    top: "align-top",
    middle: "align-middle",
    bottom: "align-bottom"
};

const justifyClass = {
    start: "justify-start",
    center: "justify-center",
    end: "justify-end"
};

const textAlignClass = {
    start: "text-start",
    center: "text-center",
    end: "text-end"
};

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

export function TableHead({ className, vAlign = "middle", hAlign = "start", children, ...props }) {
    return (
        <th className={cn("px-4 py-2 font-medium bg-neutral-900 border-r border-b border-neutral-800", vAlignClass[vAlign], className)} {...props}>
            <div className={cn("flex items-center gap-4 whitespace-nowrap", justifyClass[hAlign], textAlignClass[hAlign])}>
                {children}
            </div>
        </th>
    );
}

export function TableCell({ className, vAlign = "middle", hAlign = "start", children, ...props }) {
    return (
        <td className={cn("px-4 py-2 bg-neutral-950 border-r border-b border-neutral-800", vAlignClass[vAlign], className)} {...props}>
            <div className={cn("flex items-center gap-4 whitespace-nowrap", justifyClass[hAlign], textAlignClass[hAlign])}>
                {children}
            </div>
        </td>
    );
}
