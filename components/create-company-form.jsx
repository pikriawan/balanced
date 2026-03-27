"use client";

import { useContext, useEffect, useRef, useState } from "react";
import { createCompany } from "@/actions/company";
import Button from "@/components/ui/button";
import { DialogClose, DialogContext } from "@/components/ui/dialog";
import { Field, FieldLabel } from "@/components/ui/field";
import TextField from "@/components/ui/text-field";

export default function CreateCompanyForm() {
    const [error, setError] = useState({});
    const { isShow, setIsShow } = useContext(DialogContext);
    const textFieldRef = useRef();

    async function onSubmit(event) {
        event.preventDefault();

        const formData = new FormData(event.target);
        const response = await createCompany(formData);

        if (response.success) {
            setIsShow(false);
        } else {
            setError(response.error);
            textFieldRef.current.focus();
        }
    }

    useEffect(() => {
        textFieldRef.current.focus();
    }, [isShow]);

    return (
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
            <Field>
                <FieldLabel htmlFor="createCompany_name">Nama perusahaan</FieldLabel>
                <TextField ref={textFieldRef} id="createCompany_name" name="name" placeholder="Perusahaan Sukses Besar" />
                {error.name && (
                    <Field>
                        {error.name.map((e) => (
                            <p className="text-red-500 text-sm" key={e}>{e}</p>
                        ))}
                    </Field>
                )}
            </Field>
            <div className="flex gap-4 items-center">
                <DialogClose className="w-full">
                    <Button className="w-full justify-center" variant="outlined" type="button">Batal</Button>
                </DialogClose>
                <Button className="w-full justify-center">Buat</Button>
            </div>
        </form>
    );
}
