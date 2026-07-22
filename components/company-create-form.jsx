"use client";

import { useContext, useEffect, useRef, useState } from "react";
import { createCompany } from "@/actions/company";
import Button from "@/components/ui/button";
import { DialogClose, DialogContext } from "@/components/ui/dialog";
import { Field, FieldLabel } from "@/components/ui/field";
import Select from "@/components/ui/select";
import TextField from "@/components/ui/text-field";

export default function CompanyCreateForm() {
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
            <Field>
                <FieldLabel htmlFor="createCompany_firstMonth">Bulan mulai pembukuan</FieldLabel>
                <Select id="createCompany_firstMonth" name="firstMonth" defaultValue={new Date().getMonth() + 1}>
                    <option value="">Pilih bulan mulai pembukuan</option>
                    <option value="1">Januari</option>
                    <option value="2">Februari</option>
                    <option value="3">Maret</option>
                    <option value="4">April</option>
                    <option value="5">Mei</option>
                    <option value="6">Juni</option>
                    <option value="7">Juli</option>
                    <option value="8">Agustus</option>
                    <option value="9">September</option>
                    <option value="10">Oktober</option>
                    <option value="11">November</option>
                    <option value="12">Desember</option>
                </Select>
                {error?.firstMonth?.length > 0 && (
                    <Field>
                        {error.firstMonth.map((e) => (
                            <p className="text-red-500 text-sm" key={e}>{e}</p>
                        ))}
                    </Field>
                )}
            </Field>
            <Field>
                <FieldLabel htmlFor="createCompany_firstYear">Tahun mulai pembukuan</FieldLabel>
                <Select id="createCompany_firstYear" name="firstYear" defaultValue={new Date().getFullYear()}>
                    <option value="">Pilih tahun mulai pembukuan</option>
                    {new Array(2100 - 1899).fill(null).map((_, i) => (
                        <option value={`${i + 1900}`} key={i}>{i + 1900}</option>
                    ))}
                </Select>
                {error?.firstYear?.length > 0 && (
                    <Field>
                        {error.firstYear.map((e) => (
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
                        Buat
                    </span>
                </Button>
            </div>
        </form>
    );
}
