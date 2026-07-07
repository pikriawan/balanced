import Ledger from "@/components/ledger";
import { Table } from "@/components/ui/table";
import { getLedger } from "@/data/ledger";

export default async function LedgerPage({ params }) {
    const { companyId } = await params;
    const ledger = await getLedger(companyId);

    return (
        <div className="p-4 flex flex-col items-start gap-4">
            <h2 className="font-medium text-2xl">Buku Besar</h2>
            <div className="w-full flex flex-col gap-4">
                <div className="w-full relative overflow-x-auto bg-neutral-950 rounded-lg border border-neutral-800">
                    <Table className="w-full">
                        {ledger.length > 0 && ledger.map((account) => <Ledger account={account} key={account.code} />)}
                    </Table>
                </div>
            </div>
        </div>
    );
}
