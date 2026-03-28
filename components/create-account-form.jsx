"use client";

import { useContext, useEffect, useRef, useState } from "react";
import { createAccount } from "@/actions/account";
import Button from "@/components/ui/button";
import { DialogClose, DialogContext } from "@/components/ui/dialog";
import { Field, FieldLabel } from "@/components/ui/field";
import Select from "@/components/ui/select";
import TextField from "@/components/ui/text-field";

function focusErrorField(fields) {
    const firstError = fields.findIndex((field) => field.error.length);

    if (firstError !== -1) {
        fields[firstError].ref.current.focus();
    }
}

export default function CreateCompanyForm({ companyId }) {
    const [error, setError] = useState({});
    const { isShow, setIsShow } = useContext(DialogContext);
    const codeTextFieldRef = useRef();
    const typeSelectRef = useRef();
    const nameTextFieldRef = useRef();

    async function onSubmit(event) {
        event.preventDefault();

        const formData = new FormData(event.target);
        const response = await createAccount.bind(null, companyId)(formData);

        if (response.success) {
            setIsShow(false);
        } else {
            setError(response.error);

            focusErrorField([
                {
                    ref: codeTextFieldRef,
                    error: response.error.code
                },
                {
                    ref: typeSelectRef,
                    error: response.error.type
                },
                {
                    ref: nameTextFieldRef,
                    error: response.error.name
                }
            ]);
        }
    }

    useEffect(() => {
        if (isShow) {
            codeTextFieldRef.current.focus();
        }
    }, [isShow]);

    return (
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
            <Field>
                <FieldLabel htmlFor="createAccount_code">Kode akun</FieldLabel>
                <TextField ref={codeTextFieldRef} id="createAccount_code" name="code" placeholder="1-1000" />
                {error.code && (
                    <Field>
                        {error.code.map((e) => (
                            <p className="text-red-500 text-sm" key={e}>{e}</p>
                        ))}
                    </Field>
                )}
            </Field>
            <Field>
                <FieldLabel htmlFor="createAccount_type">Tipe akun</FieldLabel>
                <Select ref={typeSelectRef} className="has-[option:checked[value='']]:text-neutral-700" id="createAccount_type" name="type">
                    <option value="">Pilih tipe akun</option>
                    <option value="asset">Asset</option>
                    <option value="liability">Liability</option>
                    <option value="equity">Equity</option>
                    <option value="revenue">Revenue</option>
                    <option value="expense">Expense</option>
                </Select>
                {error.type && (
                    <Field>
                        {error.type.map((e) => (
                            <p className="text-red-500 text-sm" key={e}>{e}</p>
                        ))}
                    </Field>
                )}
            </Field>
            <Field>
                <FieldLabel htmlFor="createAccount_name">Nama akun</FieldLabel>
                <TextField ref={nameTextFieldRef} id="createAccount_name" name="name" placeholder="Kas" />
                {error.name && (
                    <Field>
                        {error.name.map((e) => (
                            <p className="text-red-500 text-sm" key={e}>{e}</p>
                        ))}
                    </Field>
                )}
            </Field>
            {error.error && (
                <Field>
                    {error.error.map((e) => (
                        <p className="text-red-500 text-sm" key={e}>{e}</p>
                    ))}
                </Field>
            )}
            <div className="flex gap-4 items-center">
                <DialogClose className="w-full">
                    <Button className="w-full justify-center" variant="outlined" type="button">Batal</Button>
                </DialogClose>
                <Button className="w-full justify-center">Buat</Button>
            </div>
        </form>
    );
}
