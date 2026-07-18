"use client";

import Decimal from "decimal.js";
import { useState } from "react";
import Button from "@/components/ui/button";
import ButtonLink from "@/components/ui/button-link";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import TextField from "@/components/ui/text-field";

function getAccountTypeText(accountType) {
    switch (accountType) {
        case "asset":
            return "Aset";
        case "liability":
            return "Utang";
        case "equity":
            return "Modal";
        case "revenue":
            return "Pendapatan";
        case "expense":
            return "Beban";
    }
}

function formatRupiahFromString(value) {
    const isNegative = value.startsWith("-");

    const number = isNegative ? value.slice(1) : value;

    const formatted = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 2,
        maximumFractionDigits: 100
    }).format(Number(number));

    return isNegative ? `(${formatted})` : formatted;
}

export default function OpeningJournalEditForm({ companyId, accounts: initialAccounts }) {
    const [accounts, setAccounts] = useState(initialAccounts);

    function calculatRemainingBalance(accounts) {
        let result = new Decimal("0");

        for (const account of accounts) {
            result = result.plus(new Decimal(account.balance || "0"));
        }

        return result.toString();
    }

    return (
        <form className="w-full flex flex-col items-start gap-4">
            <div className="w-full relative overflow-x-auto bg-neutral-950 rounded-lg border border-neutral-800">
                <Table className="w-full">
                    <TableHeader>
                        <TableRow>
                            <TableHead>Kode akun</TableHead>
                            <TableHead>Nama akun</TableHead>
                            <TableHead>Tipe akun</TableHead>
                            <TableHead hAlign="end">Saldo awal</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {accounts.length > 0 && accounts.map((account) => (
                            <TableRow key={account.id}>
                                <TableCell>{account.code}</TableCell>
                                <TableCell>{account.name}</TableCell>
                                <TableCell>{getAccountTypeText(account.type)}</TableCell>
                                <TableCell hAlign="end">
                                    <TextField
                                        type="number"
                                        step="any"
                                        placeholder="0"
                                        value={account.balance}
                                        onChange={(event) => {
                                            setAccounts(accounts.map((a) => {
                                                if (a.id === account.id) {
                                                    return {
                                                        ...a,
                                                        balance: event.target.value
                                                    };
                                                }

                                                return a;
                                            }));
                                        }}
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                        <TableRow>
                            <TableCell colSpan="3">Sisa</TableCell>
                            <TableCell hAlign="end">{formatRupiahFromString(calculatRemainingBalance(accounts))}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <ButtonLink className="w-full justify-center" href={`/companies/${companyId}/journals/opening`} variant="outlined">
                    <span className="truncate">
                        Batal
                    </span>
                </ButtonLink>
                <Button className="w-full justify-center truncate">
                    <span className="truncate">
                        Simpan
                    </span>
                </Button>
            </div>
        </form>
    );
}
