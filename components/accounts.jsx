import { SquarePen, Trash2 } from "lucide-react";
import AccountDeleteForm from "@/components/account-delete-form";
import AccountEditForm from "@/components/account-edit-form";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

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

export default async function Accounts({ accounts }) {
    return (
        <div className="w-full relative overflow-x-auto bg-neutral-950 rounded-lg border border-neutral-800">
            <Table className="w-full">
                <TableHeader>
                    <TableRow>
                        <TableHead>Kode akun</TableHead>
                        <TableHead>Nama akun</TableHead>
                        <TableHead>Tipe akun</TableHead>
                        <TableHead hAlign="end">Saldo</TableHead>
                        <TableHead>Aksi</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {accounts.length > 0 && accounts.map((account) => (
                        <TableRow key={account.id}>
                            <TableCell>{account.code}</TableCell>
                            <TableCell>{account.name}</TableCell>
                            <TableCell>{getAccountTypeText(account.type)}</TableCell>
                            <TableCell hAlign="end">{formatRupiahFromString(account.balance)}</TableCell>
                            <TableCell>
                                <Dialog>
                                    <DialogTrigger>
                                        <SquarePen size={16} color="oklch(98.5% 0 0)" />
                                    </DialogTrigger>
                                    <DialogContent>
                                        <AccountEditForm account={account} />
                                    </DialogContent>
                                </Dialog>
                                <Dialog>
                                    <DialogTrigger>
                                        <Trash2 size={16} color="oklch(63.7% 0.237 25.331)" />
                                    </DialogTrigger>
                                    <DialogContent>
                                        <AccountDeleteForm account={account} />
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
