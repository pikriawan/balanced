"use client";

import { useContext, useEffect, useRef, useState } from "react";
import { editCompany } from "@/actions/company";
import Button from "@/components/ui/button";
import { DialogClose, DialogContext } from "@/components/ui/dialog";
import { Field, FieldLabel } from "@/components/ui/field";
import TextField from "@/components/ui/text-field";

export default function CompanyEditForm({ company }) {
    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState(null);
    const { isShow, setIsShow } = useContext(DialogContext);
    const autoFocusRef = useRef(null);

    async function onSubmit(event) {
        event.preventDefault();

        const formData = new FormData(event.target);

        setIsPending(true);
        setError(null);

        const response = await editCompany(company.id, formData);

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
            autoFocusRef.current.select();
        }
    }, [isShow]);

    return (
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
            <Field>
                <FieldLabel htmlFor="updateCompany_name">Nama perusahaan</FieldLabel>
                <TextField ref={autoFocusRef} defaultValue={company.name} id="updateCompany_name" name="name" placeholder="Perusahaan Sukses Besar" />
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
            <div className="grid grid-cols-2 gap-4">
                <DialogClose>
                    <Button className="w-full justify-center" variant="outlined" type="button" disabled={isPending}>
                        <span className="truncate">
                            Batal
                        </span>
                    </Button>
                </DialogClose>
                <Button className="w-full justify-center truncate" disabled={isPending}>
                    <span className="truncate">
                        Simpan perubahan
                    </span>
                </Button>
            </div>
        </form>
    );
}
