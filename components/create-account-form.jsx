"use client";

import { useContext, useEffect, useRef, useState } from "react";
import { createAccount } from "@/actions/account";
import Button from "@/components/ui/button";
import { DialogClose, DialogContext } from "@/components/ui/dialog";
import { Field, FieldLabel } from "@/components/ui/field";
import Select from "@/components/ui/select";
import TextField from "@/components/ui/text-field";

export default function CreateCompanyForm({ companyId }) {
    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState(null);
    const { isShow, setIsShow } = useContext(DialogContext);
    const autoFocusRef = useRef(null);

    async function onSubmit(event) {
        event.preventDefault();

        const formData = new FormData(event.target);

        setIsPending(true);
        setError(null);

        const response = await createAccount(companyId, formData);

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
                <FieldLabel htmlFor="createAccount_code">Kode akun</FieldLabel>
                <TextField id="createAccount_code" name="code" placeholder="1-1000" ref={autoFocusRef} />
                {error?.code?.length > 0 && (
                    <Field>
                        {error.code.map((e) => (
                            <p className="text-red-500 text-sm" key={e}>{e}</p>
                        ))}
                    </Field>
                )}
            </Field>
            <Field>
                <FieldLabel htmlFor="createAccount_type">Tipe akun</FieldLabel>
                <Select id="createAccount_type" name="type">
                    <option value="">Pilih tipe akun</option>
                    <option value="asset">Aset</option>
                    <option value="liability">Kewajiban</option>
                    <option value="equity">Modal</option>
                    <option value="revenue">Pendapatan</option>
                    <option value="expense">Beban</option>
                </Select>
                {error?.type?.length > 0 && (
                    <Field>
                        {error.type.map((e) => (
                            <p className="text-red-500 text-sm" key={e}>{e}</p>
                        ))}
                    </Field>
                )}
            </Field>
            <Field>
                <FieldLabel htmlFor="createAccount_name">Nama akun</FieldLabel>
                <TextField id="createAccount_name" name="name" placeholder="Kas" />
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
