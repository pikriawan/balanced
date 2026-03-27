import Button from "@/components/ui/button";
import { signOut } from "@/lib/auth";

export default function SignOutPage() {
    return (
        <main className="p-4 flex flex-col items-start gap-4">
            <h1 className="font-medium text-2xl">Sign Out</h1>
            <form
                action={async () => {
                    "use server";

                    await signOut({ redirectTo: "/signin" });
                }}
            >
                <Button variant="danger">Sign out</Button>
            </form>
        </main>
    );
}
