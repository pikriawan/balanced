"use client";

import { Plus, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createJournal } from "@/actions/journal";
import Button from "@/components/ui/button";
import ButtonLink from "@/components/ui/button-link";
import { Field, FieldLabel } from "@/components/ui/field";
import Select from "@/components/ui/select";
import TextArea from "@/components/ui/text-area";
import TextField from "@/components/ui/text-field";

export default function JournalCreateForm({ companyId, accounts }) {
    const [journalLines, setJournalLines] = useState([
        {
            id: 0,
            name: "",
            debit: "",
            credit: ""
        },
        {
            id: 1,
            name: "",
            debit: "",
            credit: ""
        }
    ]);
    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState(null);
    const autoFocusRef = useRef(null);

    async function onSubmit(event) {
        event.preventDefault();

        const formData = new FormData(event.target);
        const journalLinesString = JSON.stringify(journalLines.map((journalLine) => {
            return {
                name: journalLine.name,
                debit: journalLine.debit,
                credit: journalLine.credit
            };
        }));
        formData.append("journalLines", journalLinesString);

        setIsPending(true);
        setError(null);

        const response = await createJournal(companyId, formData);

        setIsPending(false);

        if (!response.success) {
            setError(response.error);
        }
    }

    useEffect(() => {
        if (error) {
            autoFocusRef.current.focus();
            autoFocusRef.current.select();
        }
    }, [error]);

    return (
        <form className="w-full flex flex-col items-start gap-4" onSubmit={onSubmit}>
            <Field className="w-full">
                <FieldLabel htmlFor="journalCreate_date" ref={autoFocusRef}>Tanggal</FieldLabel>
                <TextField className="w-full max-w-3xs" id="journalCreate_date" name="date" type="date" />
            </Field>
            <Field className="w-full">
                <FieldLabel htmlFor="journalCreate_number">Nomor jurnal</FieldLabel>
                <TextField className="w-full max-w-3xs" id="journalCreate_number" name="number" placeholder="JU00001" />
            </Field>
            <Field className="w-full">
                <FieldLabel htmlFor="journalCreate_description">Keterangan</FieldLabel>
                <TextArea className="w-full max-w-3xs" id="journalCreate_description" name="description" placeholder="Keterangan" />
            </Field>
            <div className="w-full p-1 overflow-x-auto">
                <div className="w-4xl flex flex-col gap-2">
                    <div className="grid grid-cols-[repeat(3,1fr)_auto] items-center gap-4">
                        <FieldLabel>Akun</FieldLabel>
                        <FieldLabel>Debit</FieldLabel>
                        <FieldLabel>Kredit</FieldLabel>
                        <span className="w-4 h-4 invisible" />
                    </div>
                    {journalLines.length > 0 && (
                        <div className="flex flex-col gap-4">
                            {journalLines.map((journalLine) => (
                                <div className="grid grid-cols-[repeat(3,1fr)_auto] items-center gap-4" key={journalLine.id}>
                                    <Select>
                                        <option value="">Pilih akun</option>
                                        {accounts.length > 0 && accounts.map((account) => (
                                            <option key={account.id} value={account.id}>{account.name}</option>
                                        ))}
                                    </Select>
                                    <TextField type="number" defaultValue={journalLine.debit} placeholder="0" />
                                    <TextField type="number" defaultValue={journalLine.credit} placeholder="0" />
                                    <Trash2
                                        size={16}
                                        color="oklch(63.7% 0.237 25.331)"
                                        onClick={() => {
                                            setJournalLines((prevJournalLines) => {
                                                return prevJournalLines.filter((prevJournalLine) => prevJournalLine.id !== journalLine.id);
                                            });
                                        }}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <Button
                type="button"
                variant="outlined"
                onClick={() => {
                    setJournalLines((prevJournalLines) => {
                        return prevJournalLines.concat({
                            id: prevJournalLines.length === 0 ? 0 : prevJournalLines.at(-1).id + 1,
                            name: "",
                            debit: "",
                            credit: ""
                        });
                    });
                }}
            >
                <Plus size={16} />
                Tambah baris baru
            </Button>
            <div className="grid grid-cols-2 gap-4">
                <ButtonLink className="w-full justify-center" href={`/companies/${companyId}/journals`} variant="outlined" disabled={isPending}>
                    <span className="truncate">
                        Batal
                    </span>
                </ButtonLink>
                <Button className="w-full justify-center truncate" disabled={isPending}>
                    <span className="truncate">
                        Simpan jurnal
                    </span>
                </Button>
            </div>
        </form>
    );
}
