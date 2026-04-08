import { cn } from "@/lib/utils";

export default function TextArea({ className, ...props }) {
    return (
        <textarea className={cn("p-2 flex justify-start items-center text-sm rounded-lg bg-neutral-950 text-neutral-50 border border-neutral-800 placeholder:text-neutral-600 focus:outline-4 focus:outline-neutral-800 focus:border-neutral-600", className)} {...props} />
    );
}
