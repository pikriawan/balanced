"use client";

import { redirect, usePathname, useSearchParams } from "next/navigation";
import { Field, FieldLabel } from "@/components/ui/field";
import TextField from "@/components/ui/text-field";

export default function LedgerDateFilter() {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    function onStartDateChange(event) {
        const params = new URLSearchParams(searchParams.toString());
        params.set("start_date", event.target.value);
        redirect(`${pathname}?${params.toString()}`);
    }

    function onEndDateChange(event) {
        const params = new URLSearchParams(searchParams.toString());
        params.set("end_date", event.target.value);
        redirect(`${pathname}?${params.toString()}`);
    }

    return (
        <div className="w-full flex flex-col gap-2">
            <Field>
                <FieldLabel htmlFor="ledgerFilter_startDate">Dari</FieldLabel>
                <TextField
                    className="w-full max-w-3xs"
                    id="ledgerFilter_startDate"
                    name="startDate"
                    type="date"
                    defaultValue={searchParams.get("start_date")}
                    onChange={onStartDateChange}
                />
            </Field>
            <Field>
                <FieldLabel htmlFor="ledgerFilter_endDate">Hingga</FieldLabel>
                <TextField
                    className="w-full max-w-3xs"
                    id="ledgerFilter_endDate"
                    name="endDate"
                    type="date"
                    defaultValue={searchParams.get("end_date")}
                    onChange={onEndDateChange}
                />
            </Field>
        </div>
    );
}
