"use client";

import { useContext, useEffect, useRef, useState } from "react";
import { createCompany } from "@/actions/company";
import Button from "@/components/ui/button";
import { DialogClose, DialogContext } from "@/components/ui/dialog";
import { Field, FieldLabel } from "@/components/ui/field";
import TextField from "@/components/ui/text-field";

export default function CreateCompanyForm() {
    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState(null);
    const { isShow, setIsShow } = useContext(DialogContext);
    const autoFocusRef = useRef(null);

    async function onSubmit(event) {
        event.preventDefault();

        const formData = new FormData(event.target);

        setIsPending(true);
        setError(null);

        const response = await createCompany(formData);

        setIsPending(false);

        if (response.success) {
            setIsShow(false);
        } else {
            setError(response.error);
        }
    }

    useEffect(() => {
        if (isShow) {
            autoFocusRef.current.focus();
        }
    }, [isShow]);

    return (
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
            <Field>
                <FieldLabel htmlFor="createCompany_name">Nama perusahaan</FieldLabel>
                <TextField ref={autoFocusRef} id="createCompany_name" name="name" placeholder="Perusahaan Sukses Besar" />
                {error?.name?.length > 0 && (
                    <Field>
                        {error.name.map((e) => (
                            <p className="text-red-500 text-sm" key={e}>{e}</p>
                        ))}
                    </Field>
                )}
            </Field>
            {error && typeof error === "string" && (
                <p className="text-red-500 text-sm" key={error}>{error}</p>
            )}
            <div className="flex gap-4 items-center">
                <DialogClose className="w-full">
                    <Button className="w-full justify-center" variant="outlined" type="button" disabled={isPending}>Batal</Button>
                </DialogClose>
                <Button className="w-full justify-center" disabled={isPending}>Buat</Button>
            </div>
        </form>
    );
}
