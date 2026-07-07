import { Fragment } from "react";
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

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

export default function Ledger({ account }) {
    if (account.rows.length === 0) {
        return (
            <>
                <TableHeader>
                    <TableRow>
                        <TableHead colSpan="2">{account.code}</TableHead>
                        <TableHead colSpan="5">{account.name}</TableHead>
                    </TableRow>
                    <TableRow>
                        <TableHead colSpan="2">Tanggal</TableHead>
                        <TableHead>Keterangan</TableHead>
                        <TableHead>Ref</TableHead>
                        <TableHead>Debit</TableHead>
                        <TableHead>Kredit</TableHead>
                        <TableHead>Saldo</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow>
                        <TableCell>-</TableCell>
                        <TableCell hAlign="end">-</TableCell>
                        <TableCell>-</TableCell>
                        <TableCell>-</TableCell>
                        <TableCell hAlign="end">-</TableCell>
                        <TableCell hAlign="end">-</TableCell>
                        <TableCell hAlign="end">{formatRupiahFromString("0")}</TableCell>
                    </TableRow>
                </TableBody>
            </>
        );
    }

    const rows = account.rows.map((row) => {
        const shouldDisplayYearAndMonth = account.rows.findIndex((r) => {
            const date = new Date(r.date);
            const [year, month] = [date.getFullYear(), date.getMonth()];

            const compareDate = new Date(row.date);
            const [compareYear, compareMonth] = [compareDate.getFullYear(), compareDate.getMonth()];

            return year === compareYear && month === compareMonth;
        }) !== 1;

        return { ...row, shouldDisplayYearAndMonth };
    });

    return (
        <>
            <TableHeader>
                <TableRow>
                    <TableHead colSpan="2">{account.code}</TableHead>
                    <TableHead colSpan="5">{account.name}</TableHead>
                </TableRow>
                <TableRow>
                    <TableHead colSpan="2">Tanggal</TableHead>
                    <TableHead>Keterangan</TableHead>
                    <TableHead>Ref</TableHead>
                    <TableHead>Debit</TableHead>
                    <TableHead>Kredit</TableHead>
                    <TableHead>Saldo</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {rows.map((row) => (
                    <Fragment key={row.id}>
                        <TableRow>
                            <TableCell>{row.shouldDisplayYearAndMonth && (
                                `${formatDateFromString(row.date).year} ${formatDateFromString(row.date).month}`
                            )}</TableCell>
                            <TableCell hAlign="end">{formatDateFromString(row.date).date}</TableCell>
                            <TableCell>{row.description}</TableCell>
                            <TableCell>{row.ref}</TableCell>
                            <TableCell hAlign="end">{row.debit === "0" ? "-" : formatRupiahFromString(row.debit)}</TableCell>
                            <TableCell hAlign="end">{row.credit === "0" ? "-" : formatRupiahFromString(row.credit)}</TableCell>
                            <TableCell hAlign="end">{formatRupiahFromString(row.balance)}</TableCell>
                        </TableRow>
                    </Fragment>
                ))}
            </TableBody>
        </>
    );
}
