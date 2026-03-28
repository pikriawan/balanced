import { Plus } from "lucide-react";
import CreateAccountForm from "@/components/create-account-form";
import Button from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { getCompany } from "@/data/company";

export default async function CompanyAccountsPage({ params }) {
    const { id } = await params;
    const company = await getCompany(id);

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
                    <CreateAccountForm companyId={company.id} />
                </DialogContent>
            </Dialog>
        </div>
    );
}
