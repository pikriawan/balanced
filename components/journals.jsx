import Decimal from "decimal.js";
import { SquarePen, Trash2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default async function Journals({ journals }) {
    const rows = journals.map((journal) => {
        return {
            ...journal,
            shouldDisplayDate: journals.filter((j) => j.journals.id === journal.journals.id).findIndex((j) => j.journal_lines.id === journal.journal_lines.id) === 0
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
                        <TableHead className="border-r">Deskripsi</TableHead>
                        <TableHead className="border-r">Debit</TableHead>
                        <TableHead className="border-r">Kredit</TableHead>
                        <TableHead className="border-r">Aksi</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {rows.length > 0 && rows.map((row) => (
                        <TableRow key={row.journal_lines.id}>
                            <TableCell className="border-r">{row.shouldDisplayDate && row.journals.date}</TableCell>
                            <TableCell className="border-r">{row.journal_lines.accountId}</TableCell>
                            <TableCell className="border-r justify-end">{row.journal_lines.debit === "0" ? "-" : row.journal_lines.debit}</TableCell>
                            <TableCell className="border-r justify-end">{row.journal_lines.credit === "0" ? "-" : row.journal_lines.credit}</TableCell>
                            <TableCell className="border-r">
                                {row.shouldDisplayDate && (
                                    <>
                                        <SquarePen size={16} color="oklch(98.5% 0 0)" />
                                        <Trash2 size={16} color="oklch(63.7% 0.237 25.331)" />
                                    </>
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                    <TableRow>
                        <TableCell className="border-r">Jumlah</TableCell>
                        <TableCell className="border-r" />
                        <TableCell className="border-r">{totalDebit}</TableCell>
                        <TableCell className="border-r">{totalCredit}</TableCell>
                        <TableCell className="border-r" />
                    </TableRow>
                </TableBody>
            </Table>
        </div>
    );
}
