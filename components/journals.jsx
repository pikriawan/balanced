import Decimal from "decimal.js";
import { SquarePen, Trash2 } from "lucide-react";
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
        return {
            ...journal,
            isFirstRow: journals.findIndex((j) => j.journals.id === journal.journals.id) === i,
            rowSpan: journals.filter((j) => j.journals.id === journal.journals.id).length
        };
    });

    const totalDebit = rows.reduce((prev, curr) => new Decimal(prev).plus(new Decimal(curr.journal_lines.debit)), new Decimal("0")).toString();
    const totalCredit = rows.reduce((prev, curr) => new Decimal(prev).plus(new Decimal(curr.journal_lines.credit)), new Decimal("0")).toString();

    return (
        <div className="w-full relative overflow-x-auto bg-neutral-950 rounded-lg border border-neutral-800">
            <Table className="w-full">
                <TableHeader>
                    <TableRow>
                        <TableHead className="border-r">Tanggal</TableHead>
                        <TableHead className="border-r">Nomor</TableHead>
                        <TableHead className="border-r">Deskripsi</TableHead>
                        <TableHead className="border-r">Debit</TableHead>
                        <TableHead className="border-r">Kredit</TableHead>
                        <TableHead className="border-r">Aksi</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {rows.length > 0 && rows.map((row) => (
                        <TableRow key={row.journal_lines.id}>
                            {row.isFirstRow && (
                                <>
                                    <TableCell className="border-r" rowSpan={row.rowSpan}>{row.journals.date}</TableCell>
                                    <TableCell className="border-r" rowSpan={row.rowSpan}>{row.journals.number}</TableCell>
                                </>
                            )}
                            <TableCell className="border-r">{row.journal_lines.accountId}</TableCell>
                            <TableCell className="border-r justify-end">{row.journal_lines.debit === "0" ? "-" : formatRupiahFromString(row.journal_lines.debit)}</TableCell>
                            <TableCell className="border-r justify-end">{row.journal_lines.credit === "0" ? "-" : formatRupiahFromString(row.journal_lines.credit)}</TableCell>
                            {row.isFirstRow && (
                                <TableCell className="border-r" rowSpan={row.rowSpan}>
                                    <SquarePen size={16} color="oklch(98.5% 0 0)" />
                                    <Trash2 size={16} color="oklch(63.7% 0.237 25.331)" />
                                </TableCell>
                            )}
                        </TableRow>
                    ))}
                    <TableRow>
                        <TableCell className="border-r" colSpan="3">Jumlah</TableCell>
                        <TableCell className="border-r">{formatRupiahFromString(totalDebit)}</TableCell>
                        <TableCell className="border-r">{formatRupiahFromString(totalCredit)}</TableCell>
                        <TableCell className="border-r" />
                    </TableRow>
                </TableBody>
            </Table>
        </div>
    );
}
