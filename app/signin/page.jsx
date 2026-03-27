import Button from "@/components/ui/button";
import { signIn } from "@/lib/auth";

export default function SignInPage() {
    return (
        <main className="p-4 flex flex-col items-start gap-4">
            <h1 className="font-medium text-2xl">Sign In</h1>
            <form
                action={async () => {
                    "use server";

                    await signIn("google", { redirectTo: "/companies" });
                }}
            >
                <Button>Sign in with Google</Button>
            </form>
        </main>
    );
}
