import { Plus } from "lucide-react";
import AccountCreateForm from "@/components/account-create-form";
import Accounts from "@/components/accounts";
import Button from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { getAccountBalance, getAccounts } from "@/data/account";
import { getCompany } from "@/data/company";

export default async function CompanyAccountsPage({ params }) {
    const { id } = await params;
    const company = await getCompany(id);
    const accounts = await getAccounts(company.id);

    for (let i = 0; i < accounts.length; i++) {
        const balance = await getAccountBalance(company.id, accounts[i].id);
        accounts[i].balance = balance;
    }

    return (
        <div className="p-4 flex flex-col items-start gap-4">
            <h2 className="font-medium text-2xl">Akun</h2>
            <Dialog>
                <DialogTrigger>
                    <Button>
                        <Plus size={16} />
                        Buat akun baru
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <AccountCreateForm companyId={company.id} />
                </DialogContent>
            </Dialog>
            <Accounts accounts={accounts} />
        </div>
    );
}
