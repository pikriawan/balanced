import Decimal from "decimal.js";
import { SquarePen, Trash2 } from "lucide-react";
import Link from "next/link";
import PurchasesJournalDeleteForm from "@/components/purchases-journal-delete-form";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

function formatDateFromString(value) {
    const date = new Date(value);

    let [year, month, dateOfMonth] = [
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
    ];

    const monthStrings = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "Mei",
        "Jun",
        "Jul",
        "Agu",
        "Sep",
        "Okt",
        "Nov",
        "Des"
    ];

    return {
        year,
        month: monthStrings[month],
        date: dateOfMonth
    };
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

function getAccountBalance(cell) {
    return cell ? formatRupiahFromString(cell) : "-";
}

export default async function PurchasesJournals({ companyId, journals }) {
    const debitColumns = [
        ...(new Set(
            journals
                .filter((row) => !(new Decimal(row.journal_lines.debit).isZero()))
                .toSorted((a, b) => a.accounts.code.localeCompare(b.accounts.code))
                .map((row) => row.accounts.name)
        ).values())
    ];

    const creditColumns = [
        ...(new Set(
            journals
                .filter((row) => !(new Decimal(row.journal_lines.credit).isZero()))
                .toSorted((a, b) => a.accounts.code.localeCompare(b.accounts.code))
                .map((row) => row.accounts.name)
        ).values())
    ];

    let rows = Object.values(
        journals.reduce((acc, row) => {
            const journalId = row.journals.id;
            const accountId = row.accounts.id;

            if (!acc[journalId]) {
                acc[journalId] = {
                    id: journalId,
                    number: row.journals.number,
                    date: row.journals.date,
                    description: row.journals.description,
                    accounts: {}
                };
            }

            const journal = acc[journalId];

            if (!journal.accounts[accountId]) {
                journal.accounts[accountId] = {
                    id: accountId,
                    code: row.accounts.code,
                    name: row.accounts.name,
                    debit: new Decimal("0"),
                    credit: new Decimal("0")
                };
            }

            const account = journal.accounts[accountId];

            account.debit = account.debit.plus(
                new Decimal(row.journal_lines.debit)
            );

            account.credit = account.credit.plus(
                new Decimal(row.journal_lines.credit)
            );

            return acc;
        }, {})
    );

    rows = rows.map((row, i) => {
        const shouldDisplayYearAndMonth = rows.findIndex((r) => {
            const date = new Date(r.date);
            const [year, month] = [date.getFullYear(), date.getMonth()];

            const compareDate = new Date(row.date);
            const [compareYear, compareMonth] = [compareDate.getFullYear(), compareDate.getMonth()];

            return year === compareYear && month === compareMonth;
        }) === i;

        return {
            ...row,
            shouldDisplayYearAndMonth
        };
    });

    return (
        <div className="w-full relative overflow-x-auto bg-neutral-950 rounded-lg border border-neutral-800">
            <Table className="w-full">
                <TableHeader>
                    <TableRow>
                        <TableHead rowSpan="2" colSpan="2">Tanggal</TableHead>
                        <TableHead rowSpan="2">Nomor</TableHead>
                        <TableHead rowSpan="2">Keterangan</TableHead>
                        <TableHead colSpan={`${debitColumns.length}`} hAlign="center">Debit</TableHead>
                        <TableHead colSpan={`${creditColumns.length}`} hAlign="center">Kredit</TableHead>
                        <TableHead rowSpan="2">Aksi</TableHead>
                    </TableRow>
                    <TableRow>
                        {debitColumns.length > 0 && debitColumns.map((col) => (
                            <TableHead key={col} hAlign="center">{col}</TableHead>
                        ))}
                        {creditColumns.length > 0 && creditColumns.map((col) => (
                            <TableHead key={col} hAlign="center">{col}</TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {rows.length > 0 && rows.map((row) => (
                        <TableRow key={row.id}>
                            <TableCell>{row.shouldDisplayYearAndMonth && (
                                `${formatDateFromString(row.date).year} ${formatDateFromString(row.date).month}`
                            )}</TableCell>
                            <TableCell hAlign="end">{formatDateFromString(row.date).date}</TableCell>
                            <TableCell>{row.number}</TableCell>
                            <TableCell>{row.description || "-"}</TableCell>
                            {debitColumns.length > 0 && debitColumns.map((col) => (
                                <TableCell key={col} hAlign="end">{getAccountBalance(Object.values(row.accounts).find((a) => a.name === col)?.debit?.toString())}</TableCell>
                            ))}
                            {creditColumns.length > 0 && creditColumns.map((col) => (
                                <TableCell key={col} hAlign="end">{getAccountBalance(Object.values(row.accounts).find((a) => a.name === col)?.credit?.toString())}</TableCell>
                            ))}
                            <TableCell>
                                <Link href={`/companies/${companyId}/journals/purchases/edit/${row.id}`}>
                                    <SquarePen size={16} color="oklch(98.5% 0 0)" />
                                </Link>
                                <Dialog>
                                    <DialogTrigger>
                                        <Trash2 size={16} color="oklch(63.7% 0.237 25.331)" />
                                    </DialogTrigger>
                                    <DialogContent>
                                        <PurchasesJournalDeleteForm journal={{ id: row.id, number: row.number }} />
                                    </DialogContent>
                                </Dialog>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
