import { SquarePen } from "lucide-react";
import ButtonLink from "@/components/ui/button-link";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getOpeningJournals } from "@/data/journal";

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

export default async function OpeningJournalPage({ params }) {
    const { companyId } = await params;
    const accounts = await getOpeningJournals(companyId);

    return (
        <div className="p-4 flex flex-col items-start gap-4">
            <h2 className="font-medium text-2xl">Jurnal Pembukaan</h2>
            <ButtonLink href={`/companies/${companyId}/journals/opening/edit`}>
                <SquarePen size={16} />
                Edit saldo awal akun
            </ButtonLink>
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
                                <TableCell hAlign="end">{formatRupiahFromString(account.balance)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
