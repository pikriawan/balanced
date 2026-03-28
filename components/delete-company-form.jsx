"use client";

import { useContext, useState } from "react";
import { deleteCompany } from "@/actions/company";
import Button from "@/components/ui/button";
import { DialogClose, DialogContext } from "@/components/ui/dialog";

export default function DeleteCompanyForm({ company }) {
    const { setIsShow } = useContext(DialogContext);

    async function onSubmit(event) {
        event.preventDefault();

        const formData = new FormData(event.target);
        const response = await deleteCompany(formData);

        if (response.success) {
            setIsShow(false);
        }
    }

    return (
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
            <h3>Anda yakin ingin menghapus perusahaan "{company.name}"?</h3>
            <input type="hidden" name="id" value={company.id} />
            <div className="flex gap-4 items-center">
                <DialogClose className="w-full">
                    <Button className="w-full justify-center" variant="outlined" type="button">Batal</Button>
                </DialogClose>
                <Button variant="danger" className="w-full justify-center">Ya, hapus</Button>
            </div>
        </form>
    );
}
