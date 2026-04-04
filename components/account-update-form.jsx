"use client";

import { useContext, useEffect, useRef, useState } from "react";
import { updateAccount } from "@/actions/account";
import Button from "@/components/ui/button";
import { DialogClose, DialogContext } from "@/components/ui/dialog";
import { Field, FieldLabel } from "@/components/ui/field";
import Select from "@/components/ui/select";
import Switch from "@/components/ui/switch";
import TextField from "@/components/ui/text-field";

export default function AccountUpdateForm({ account }) {
    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState(null);
    const [isAsset, setIsAsset] = useState(account.type === "asset");
    const { isShow, setIsShow } = useContext(DialogContext);
    const autoFocusRef = useRef(null);

    async function onSubmit(event) {
        event.preventDefault();

        const formData = new FormData(event.target);

        setIsPending(true);
        setError(null);

        const response = await updateAccount(account.id, formData);

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
                <FieldLabel htmlFor={`updateAccount_code_${account.id}`}>Kode akun</FieldLabel>
                <TextField id={`updateAccount_code_${account.id}`} name="code" placeholder="1001" ref={autoFocusRef} defaultValue={account.code} />
                {error?.code?.length > 0 && (
                    <Field>
                        {error.code.map((e) => (
                            <p className="text-red-500 text-sm" key={e}>{e}</p>
                        ))}
                    </Field>
                )}
            </Field>
            <Field>
                <FieldLabel htmlFor={`updateAccount_type_${account.id}`}>Tipe akun</FieldLabel>
                <Select id={`updateAccount_type_${account.id}`} name="type" onChange={(event) => setIsAsset(event.target.value === "asset")} defaultValue={account.type}>
                    <option value="">Pilih tipe akun</option>
                    <option value="asset">Aset</option>
                    <option value="liability">Utang</option>
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
                <FieldLabel htmlFor={`updateAccount_name_${account.id}`}>Nama akun</FieldLabel>
                <TextField id={`updateAccount_name_${account.id}`} name="name" placeholder="Kas" defaultValue={account.name} />
                {error?.name?.length > 0 && (
                    <Field>
                        {error.name.map((e) => (
                            <p className="text-red-500 text-sm" key={e}>{e}</p>
                        ))}
                    </Field>
                )}
            </Field>
            {isAsset && (
                <Field>
                    <FieldLabel htmlFor={`updateAccount_isCash_${account.id}`}>Termasuk akun kas atau setara kas?</FieldLabel>
                    <Switch id={`updateAccount_isCash_${account.id}`} name="isCash" defaultIsEnabled={account.isCash} />
                    {error?.isCash?.length > 0 && (
                        <Field>
                            {error.isCash.map((e) => (
                                <p className="text-red-500 text-sm" key={e}>{e}</p>
                            ))}
                        </Field>
                    )}
                </Field>
            )}
            {error && typeof error === "string" && (
                <p className="text-red-500 text-sm" key={error}>{error}</p>
            )}
            <div className="flex gap-4 items-center">
                <DialogClose className="w-full">
                    <Button className="w-full justify-center" variant="outlined" type="button" disabled={isPending}>Batal</Button>
                </DialogClose>
                <Button className="w-full justify-center" disabled={isPending}>Simpan perubahan</Button>
            </div>
        </form>
    );
}
