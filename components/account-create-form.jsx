"use client";

import { useContext, useEffect, useRef, useState } from "react";
import { createAccount } from "@/actions/account";
import Button from "@/components/ui/button";
import { DialogClose, DialogContext } from "@/components/ui/dialog";
import { Field, FieldLabel } from "@/components/ui/field";
import Select from "@/components/ui/select";
import Switch from "@/components/ui/switch";
import TextField from "@/components/ui/text-field";

export default function AccountCreateForm({ companyId }) {
    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState(null);
    const [type, setType] = useState(null);
    const [isCash, setIsCash] = useState(false);
    const [defaultCashflowCategory, setDefaultCashflowCategory] = useState("");
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

    useEffect(() => {
        switch (type) {
            case "asset":
                setDefaultCashflowCategory("investing");
                break;
            case "liability":
                setDefaultCashflowCategory("financing");
                break;
            case "equity":
                setDefaultCashflowCategory("financing");
                break;
            case "revenue":
                setDefaultCashflowCategory("operating");
                break;
            case "expense":
                setDefaultCashflowCategory("operating");
                break;
            default:
                setDefaultCashflowCategory("");
        }
    }, [type]);

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
                <Select id="createAccount_type" name="type" onChange={(event) => setType(event.target.value)}>
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
            <Field>
                <FieldLabel htmlFor="createAccount_isCash">Termasuk akun kas atau setara kas?</FieldLabel>
                <Switch id="createAccount_isCash" name="isCash" isEnabled={isCash} onChange={setIsCash} />
                {error?.isCash?.length > 0 && (
                    <Field>
                        {error.isCash.map((e) => (
                            <p className="text-red-500 text-sm" key={e}>{e}</p>
                        ))}
                    </Field>
                )}
            </Field>
            {!isCash && (
                <Field>
                    <FieldLabel htmlFor="createAccount_cashflowCategory">Kategori arus kas</FieldLabel>
                    <Select
                        id="createAccount_cashflowCategory"
                        name="cashflowCategory"
                        value={defaultCashflowCategory}
                        onChange={(event) => setDefaultCashflowCategory(event.target.value)}
                    >
                        <option value="">Pilih kategori arus kas</option>
                        <option value="operating">Operasional</option>
                        <option value="investing">Investasi</option>
                        <option value="financing">Pendanaan</option>
                    </Select>
                    {error?.cashflowCategory?.length > 0 && (
                        <Field>
                            {error.cashflowCategory.map((e) => (
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
                <Button className="w-full justify-center" disabled={isPending}>Buat</Button>
            </div>
        </form>
    );
}
