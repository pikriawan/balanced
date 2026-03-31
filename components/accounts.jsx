import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";

export default function Accounts({ companyId, accounts }) {
    return (
        <Table className="w-full">
            <TableHeader>
                <TableRow>
                    <TableHead>Kode akun</TableHead>
                    <TableHead>Nama akun</TableHead>
                    <TableHead>Tipe akun</TableHead>
                    <TableHead>Aksi</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {accounts.length > 0 && accounts.map((account) => (
                    <TableRow key={account.id}>
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
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
