"use client";

import { useContext, useState } from "react";
import { deleteCompany } from "@/actions/company";
import Button from "@/components/ui/button";
import { DialogClose, DialogContext } from "@/components/ui/dialog";

export default function CompanyDeleteForm({ company }) {
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
                <Button variant="danger" className="w-full justify-center truncate" disabled={isPending}>
                    <span className="truncate">
                        Ya, hapus
                    </span>
                </Button>
            </div>
        </form>
    );
}
