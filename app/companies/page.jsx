import { Plus } from "lucide-react";
import CompanyCreateForm from "@/components/company-create-form";
import Companies from "@/components/companies";
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
                    <CompanyCreateForm />
                </DialogContent>
            </Dialog>
            <Companies />
        </main>
    );
}
