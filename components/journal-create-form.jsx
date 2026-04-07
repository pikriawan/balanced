"use client";

import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import Button from "@/components/ui/button";
import ButtonLink from "@/components/ui/button-link";
import Select from "@/components/ui/select";
import TextField from "@/components/ui/text-field";
import { Field, FieldLabel } from "@/components/ui/field";

export default function JournalCreateForm({ companyId, accounts }) {
    const [journalLines, setJournalLines] = useState([
        {
            id: 0,
            name: "",
            debit: 0,
            credit: 0
        },
        {
            id: 1,
            name: "",
            debit: 0,
            credit: 0
        }
    ]);

    return (
        <div className="w-full flex flex-col items-start gap-4">
            <Field>
                <FieldLabel htmlFor="journalCreate_date">Tanggal</FieldLabel>
                <TextField id="journalCreate_date" type="date" />
            </Field>
            <Field>
                <FieldLabel htmlFor="journalCreate_description">Nomor jurnal</FieldLabel>
                <TextField id="journalCreate_description" />
            </Field>
            <Field>
                <FieldLabel htmlFor="journalCreate_description">Keterangan</FieldLabel>
                <TextField id="journalCreate_description" />
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
                                    <TextField type="number" defaultValue={journalLine.debit} />
                                    <TextField type="number" defaultValue={journalLine.credit} />
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
                            debit: 0,
                            credit: 0
                        });
                    });
                }}
            >
                <Plus size={16} />
                Tambah baris baru
            </Button>
            <div className="flex items-center gap-4">
                <ButtonLink href={`/companies/${companyId}/journals`} variant="outlined">Batal</ButtonLink>
                <Button>Record</Button>
            </div>
        </div>
    );
}
