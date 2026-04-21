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

export default function JournalCreateForm({ companyId, accounts, lastJournalNumber }) {
    const [journalLines, setJournalLines] = useState([
        {
            id: 0,
            accountId: "",
            debit: "",
            credit: ""
        },
        {
            id: 1,
            accountId: "",
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
        const journalLinesString = JSON.stringify(journalLines.map(({ accountId, debit, credit }) => ({ accountId, debit, credit })));
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
                <FieldLabel htmlFor="journalCreate_date">Tanggal</FieldLabel>
                <TextField className="w-full max-w-3xs" id="journalCreate_date" name="date" type="date" ref={autoFocusRef} />
                {error?.date?.length > 0 && (
                    <Field>
                        {error.date.map((e) => (
                            <p className="text-red-500 text-sm" key={e}>{e}</p>
                        ))}
                    </Field>
                )}
            </Field>
            <Field className="w-full">
                <FieldLabel htmlFor="journalCreate_number">Nomor jurnal</FieldLabel>
                <TextField className="w-full max-w-3xs" id="journalCreate_number" name="number" placeholder="JU00001" defaultValue={lastJournalNumber} />
                {error?.number?.length > 0 && (
                    <Field>
                        {error.number.map((e) => (
                            <p className="text-red-500 text-sm" key={e}>{e}</p>
                        ))}
                    </Field>
                )}
            </Field>
            <Field className="w-full">
                <FieldLabel htmlFor="journalCreate_description">Keterangan</FieldLabel>
                <TextArea className="w-full max-w-3xs" id="journalCreate_description" name="description" placeholder="Keterangan" />
                {error?.description?.length > 0 && (
                    <Field>
                        {error.description.map((e) => (
                            <p className="text-red-500 text-sm" key={e}>{e}</p>
                        ))}
                    </Field>
                )}
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
                                    <Select
                                        value={journalLine.accountId}
                                        onChange={(event) => {
                                            setJournalLines(journalLines.map((j) => {
                                                if (j.id === journalLine.id) {
                                                    return {
                                                        id: j.id,
                                                        accountId: event.target.value,
                                                        debit: j.debit,
                                                        credit: j.credit
                                                    };
                                                }

                                                return j;
                                            }));
                                        }}
                                    >
                                        <option value="">Pilih akun</option>
                                        {accounts.length > 0 && accounts.map((account) => (
                                            <option key={account.id} value={account.id}>{account.name}</option>
                                        ))}
                                    </Select>
                                    <TextField
                                        type="number"
                                        step="any"
                                        placeholder="0"
                                        value={journalLine.debit}
                                        onChange={(event) => {
                                            setJournalLines(journalLines.map((j) => {
                                                if (j.id === journalLine.id) {
                                                    return {
                                                        id: j.id,
                                                        accountId: j.accountId,
                                                        debit: event.target.value,
                                                        credit: j.credit
                                                    };
                                                }

                                                return j;
                                            }));
                                        }}
                                    />
                                    <TextField
                                        type="number"
                                        step="any"
                                        placeholder="0"
                                        value={journalLine.credit}
                                        onChange={(event) => {
                                            setJournalLines(journalLines.map((j) => {
                                                if (j.id === journalLine.id) {
                                                    return {
                                                        id: j.id,
                                                        accountId: j.accountId,
                                                        debit: j.debit,
                                                        credit: event.target.value
                                                    };
                                                }

                                                return j;
                                            }));
                                        }}
                                    />
                                    <Trash2
                                        size={16}
                                        color="oklch(63.7% 0.237 25.331)"
                                        onClick={() => {
                                            setJournalLines(journalLines.filter((j) => j.id !== journalLine.id));
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
                    setJournalLines(journalLines.concat({
                        id: journalLines.length === 0 ? 0 : journalLines.at(-1).id + 1,
                        accountId: "",
                        debit: "",
                        credit: ""
                    }));
                }}
            >
                <Plus size={16} />
                Tambah baris baru
            </Button>
            {error && typeof error === "string" && (
                <p className="text-red-500 text-sm" key={error}>{error}</p>
            )}
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
