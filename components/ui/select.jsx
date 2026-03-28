import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Select({ className, children, ...props }) {
    return (
        <div className="relative flex">
            <select className={cn("p-2 w-full appearance-none flex justify-start items-center text-sm rounded-lg bg-neutral-950 text-neutral-50 border border-neutral-800 placeholder:text-neutral-600 focus:outline-4 focus:outline-neutral-800 focus:border-neutral-600", className)} {...props}>
                {children}
            </select>
            <span className="absolute top-1/2 transform-[translateY(-50%)] right-2 flex justify-center items-center">
                <ChevronDown size={16} />
            </span>
        </div>
    );
}
