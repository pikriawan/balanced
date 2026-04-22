import Decimal from "decimal.js";
import { SquarePen, Trash2 } from "lucide-react";
import { Fragment } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

function formatRupiahFromString(value, digits = 2) {
    const isNegative = value.startsWith("-");

    const number = isNegative ? value.slice(1) : value;

    const formatted = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: digits,
        maximumFractionDigits: digits
    }).format(Number(number));

    return isNegative ? `(${formatted})` : formatted;
}

export default async function Journals({ journals }) {
    const rows = journals.map((journal, i) => {
        const isFirstRow = journals.findIndex((j) => j.journals.id === journal.journals.id) === i;
        const isLastRow = journals.findLastIndex((j) => j.journals.id === journal.journals.id) === i;

        return { ...journal, isFirstRow, isLastRow };
    });

    const totalDebit = rows.reduce((prev, curr) => new Decimal(prev).plus(new Decimal(curr.journal_lines.debit)), new Decimal("0")).toString();
    const totalCredit = rows.reduce((prev, curr) => new Decimal(prev).plus(new Decimal(curr.journal_lines.credit)), new Decimal("0")).toString();

    return (
        <div className="w-full relative overflow-x-auto bg-neutral-950 rounded-lg border border-neutral-800">
            <Table className="w-full">
                <TableHeader>
                    <TableRow>
                        <TableHead>Tanggal</TableHead>
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
                                <TableCell>{row.isFirstRow && row.journals.date}</TableCell>
                                <TableCell>{row.isFirstRow && row.journals.number}</TableCell>
                                <TableCell>{row.accounts.name}</TableCell>
                                <TableCell>{row.accounts.code}</TableCell>
                                <TableCell hAlign="end">{row.journal_lines.debit === "0" ? "-" : formatRupiahFromString(row.journal_lines.debit)}</TableCell>
                                <TableCell hAlign="end">{row.journal_lines.credit === "0" ? "-" : formatRupiahFromString(row.journal_lines.credit)}</TableCell>
                                <TableCell>
                                    {row.isFirstRow && (
                                        <>
                                            <SquarePen size={16} color="oklch(98.5% 0 0)" />
                                            <Trash2 size={16} color="oklch(63.7% 0.237 25.331)" />
                                        </>
                                    )}
                                </TableCell>
                            </TableRow>
                            {(row.isLastRow && row.journals.description !== "") && (
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
                        <TableCell>Jumlah</TableCell>
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
