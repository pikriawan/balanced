"use client";

import { useContext, useState } from "react";
import { deleteCompany } from "@/actions/company";
import Button from "@/components/ui/button";
import { DialogClose, DialogContext } from "@/components/ui/dialog";

export default function DeleteCompanyForm({ company }) {
    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState(null);
    const { setIsShow } = useContext(DialogContext);

    async function onSubmit(event) {
        event.preventDefault();

        setIsPending(true);
        setError(null);

        const response = await deleteCompany(company.id);

        setIsPending(false);

        if (response.success) {
            setIsShow(false);
        } else {
            setError(response.error);
        }
    }

    return (
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
            <p>Anda yakin ingin menghapus perusahaan "{company.name}"?</p>
            <div className="flex gap-4 items-center">
                <DialogClose className="w-full">
                    <Button className="w-full justify-center" variant="outlined" type="button" disabled={isPending}>Batal</Button>
                </DialogClose>
                <Button variant="danger" className="w-full justify-center" disabled={isPending}>Ya, hapus</Button>
            </div>
        </form>
    );
}
