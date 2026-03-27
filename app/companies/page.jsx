import { Plus } from "lucide-react";
import { createCompany } from "@/actions/company";
import Companies from "@/components/companies";
import CreateCompanyForm from "@/components/create-company-form";
import Button from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

export default function CompainesPage() {
    return (
        <main className="p-4 flex flex-col items-start gap-4">
            <h1 className="font-medium text-2xl">Perusahaan</h1>
            <Dialog>
                <DialogTrigger>
                    <Button>
                        <Plus size={16} />
                        Buat perusahaan baru
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <CreateCompanyForm />
                </DialogContent>
            </Dialog>
            <Companies />
        </main>
    );
}
