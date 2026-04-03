import { Fragment } from "react";
import { Table, TableCell, TableHead } from "@/components/ui/table";

export default function Accounts({ companyId, accounts }) {
    return (
        <div className="w-full">
            <Table className="w-full overflow-auto grid-cols-[repeat(4,minmax(16rem,1fr))]">
                <TableHead>Kode akun</TableHead>
                <TableHead>Nama akun</TableHead>
                <TableHead>Tipe akun</TableHead>
                <TableHead>Aksi</TableHead>
                {accounts.length > 0 && accounts.map((account) => (
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
                        <TableCell />
                    </Fragment>
                ))}
            </Table>
        </div>
    );
}
