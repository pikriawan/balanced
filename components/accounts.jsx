import { SquarePen, Trash2 } from "lucide-react";
import { Fragment } from "react";
import AccountDeleteForm from "@/components/account-delete-form";
import AccountUpdateForm from "@/components/account-update-form";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableCell, TableHead } from "@/components/ui/table";

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

export default async function Accounts({ companyId, accounts }) {
    return (
        <div className="w-full">
            <Table className="w-full overflow-auto grid-cols-[repeat(5,minmax(16rem,1fr))]">
                <TableHead>Kode akun</TableHead>
                <TableHead>Nama akun</TableHead>
                <TableHead>Tipe akun</TableHead>
                <TableHead>Saldo</TableHead>
                <TableHead>Aksi</TableHead>
                {accounts.length > 0 && accounts.map((account, i) => (
                    <Fragment key={account.id}>
                        <TableCell>
                            {account.code}
                        </TableCell>
                        <TableCell>
                            {account.name}
                        </TableCell>
                        <TableCell>
                            {getAccountTypeText(account.type)}
                        </TableCell>
                        <TableCell>
                            {account.balance}
                        </TableCell>
                        <TableCell>
                            <Dialog>
                                <div className="flex items-center pr-4 py-2">
                                    <DialogTrigger>
                                        <SquarePen size={16} color="oklch(98.5% 0 0)" />
                                    </DialogTrigger>
                                </div>
                                <DialogContent>
                                    <AccountUpdateForm account={account} />
                                </DialogContent>
                            </Dialog>
                            <Dialog>
                                <div className="flex items-center pr-4 py-2">
                                    <DialogTrigger>
                                        <Trash2 size={16} color="oklch(63.7% 0.237 25.331)" />
                                    </DialogTrigger>
                                </div>
                                <DialogContent>
                                    <AccountDeleteForm account={account} />
                                </DialogContent>
                            </Dialog>
                        </TableCell>
                    </Fragment>
                ))}
            </Table>
        </div>
    );
}
