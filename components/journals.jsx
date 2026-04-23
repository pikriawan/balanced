import Decimal from "decimal.js";
import { SquarePen, Trash2 } from "lucide-react";
import { Fragment } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

function formatDateFromString(value) {
    const date = new Date(value);

    let [year, month, dateOfMonth] = [
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
    ];

    const monthStrings = [
        "Januari",
        "Februari",
        "Maret",
        "April",
        "Mei",
        "Juni",
        "Juli",
        "Agustus",
        "September",
        "Oktober",
        "November",
        "Desember"
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

export default async function Journals({ journals }) {
    const rows = journals.map((journal, i) => {
        const shouldDisplayDate = journals.findIndex((j) => j.journals.id === journal.journals.id) === i;
        const shouldDisplayDescription = journals.findLastIndex((j) => j.journals.id === journal.journals.id) === i;

        const shouldDisplayYearAndMonth = journals.findIndex((j) => {
            const date = new Date(j.journals.date);
            const [year, month] = [date.getFullYear(), date.getMonth()];

            const compareDate = new Date(journal.journals.date);
            const [compareYear, compareMonth] = [compareDate.getFullYear(), compareDate.getMonth()];

            return year === compareYear && month === compareMonth;
        }) === i;

        return {
            ...journal,
            shouldDisplayDate,
            shouldDisplayDescription,
            shouldDisplayYearAndMonth
        };
    });

    const totalDebit = rows.reduce((prev, curr) => new Decimal(prev).plus(new Decimal(curr.journal_lines.debit)), new Decimal("0")).toString();
    const totalCredit = rows.reduce((prev, curr) => new Decimal(prev).plus(new Decimal(curr.journal_lines.credit)), new Decimal("0")).toString();

    return (
        <div className="w-full relative overflow-x-auto bg-neutral-950 rounded-lg border border-neutral-800">
            <Table className="w-full">
                <TableHeader>
                    <TableRow>
                        <TableHead colSpan="2">Tanggal</TableHead>
                        <TableHead>Nomor</TableHead>
                        <TableHead>Deskripsi</TableHead>
                        <TableHead>Ref</TableHead>
                        <TableHead hAlign="end">Debit</TableHead>
                        <TableHead hAlign="end">Kredit</TableHead>
                        <TableHead>Aksi</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {rows.length > 0 && rows.map((row) => (
                        <Fragment key={row.journal_lines.id}>
                            <TableRow>
                                <TableCell>{row.shouldDisplayYearAndMonth && (
                                    `${formatDateFromString(row.journals.date).year} ${formatDateFromString(row.journals.date).month}`
                                )}</TableCell>
                                <TableCell hAlign="end">{row.shouldDisplayDate && formatDateFromString(row.journals.date).date}</TableCell>
                                <TableCell>{row.shouldDisplayDate && row.journals.number}</TableCell>
                                <TableCell className={row.journal_lines.credit !== "0" && "pl-16"}>{row.accounts.name}</TableCell>
                                <TableCell>{row.accounts.code}</TableCell>
                                <TableCell hAlign="end">{row.journal_lines.debit === "0" ? "-" : formatRupiahFromString(row.journal_lines.debit)}</TableCell>
                                <TableCell hAlign="end">{row.journal_lines.credit === "0" ? "-" : formatRupiahFromString(row.journal_lines.credit)}</TableCell>
                                <TableCell>
                                    {row.shouldDisplayDate && (
                                        <>
                                            <SquarePen size={16} color="oklch(98.5% 0 0)" />
                                            <Trash2 size={16} color="oklch(63.7% 0.237 25.331)" />
                                        </>
                                    )}
                                </TableCell>
                            </TableRow>
                            {(row.shouldDisplayDescription && row.journals.description !== "") && (
                                <TableRow>
                                    <TableCell />
                                    <TableCell />
                                    <TableCell>({row.journals.description})</TableCell>
                                    <TableCell />
                                    <TableCell />
                                    <TableCell />
                                    <TableCell />
                                </TableRow>
                            )}
                        </Fragment>
                    ))}
                    <TableRow>
                        <TableCell colSpan="2">Jumlah</TableCell>
                        <TableCell />
                        <TableCell />
                        <TableCell />
                        <TableCell hAlign="end">{formatRupiahFromString(totalDebit)}</TableCell>
                        <TableCell hAlign="end">{formatRupiahFromString(totalCredit)}</TableCell>
                        <TableCell />
                    </TableRow>
                </TableBody>
            </Table>
        </div>
    );
}
