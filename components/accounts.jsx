import { Fragment } from "react";
import { Table, TableCell, TableHead } from "@/components/ui/table";

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
                            {account.type}
                        </TableCell>
                        <TableCell>
                            {account.balance}
                        </TableCell>
                        <TableCell />
                    </Fragment>
                ))}
            </Table>
        </div>
    );
}
