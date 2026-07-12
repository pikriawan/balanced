import DateFilter from "@/components/date-filter";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getIncomeStatement } from "@/data/report";

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

export default async function IncomeStatementPage({ params, searchParams }) {
    const { companyId } = await params;
    const { start_date = "", end_date = "" } = await searchParams;
    const incomeStatement = await getIncomeStatement(companyId, start_date, end_date);

    return (
        <div className="p-4 flex flex-col items-start gap-4">
            <h2 className="font-medium text-2xl">Laporan Laba Rugi</h2>
            <DateFilter />
            <div className="w-full flex flex-col gap-4">
                <div className="w-full relative overflow-x-auto bg-neutral-950 rounded-lg border border-neutral-800">
                    <Table className="w-full">
                        <TableHeader>
                            <TableRow>
                                <TableHead colSpan="3">Pendapatan</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {incomeStatement.revenues.length > 0 && incomeStatement.revenues.map((r) => (
                                <TableRow key={r.id}>
                                    <TableCell>{r.name}</TableCell>
                                    <TableCell hAlign="end">{formatRupiahFromString(r.balance)}</TableCell>
                                    <TableCell />
                                </TableRow>
                            ))}
                            <TableRow>
                                <TableCell>Total pendapatan</TableCell>
                                <TableCell />
                                <TableCell hAlign="end">{formatRupiahFromString(incomeStatement.revenue)}</TableCell>
                            </TableRow>
                        </TableBody>
                        <TableHeader>
                            <TableRow>
                                <TableHead colSpan="3">Beban</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {incomeStatement.expenses.length > 0 && incomeStatement.expenses.map((e) => (
                                <TableRow key={e.id}>
                                    <TableCell>{e.name}</TableCell>
                                    <TableCell hAlign="end">{formatRupiahFromString(e.balance)}</TableCell>
                                    <TableCell />
                                </TableRow>
                            ))}
                            <TableRow>
                                <TableCell>Total beban</TableCell>
                                <TableCell />
                                <TableCell hAlign="end">{formatRupiahFromString(incomeStatement.expense)}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Laba bersih</TableCell>
                                <TableCell />
                                <TableCell hAlign="end">{formatRupiahFromString(incomeStatement.income)}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
}
