import { auth, signIn, signOut } from "../lib/auth";

export default async function HomePage() {
    const session = await auth();

    return (
        <div className="p-4 flex flex-col gap-4">
            {session?.user ? (
                <>
                    <p>Signed in as {session.user.name}</p>
                    <form
                        action={async () => {
                            "use server";

                            await signOut();
                        }}
                    >
                        <button className="flex justify-center items-center px-4 py-2 rounded-lg bg-red-500 text-white cursor-pointer">
                            Sign Out
                        </button>
                    </form>
                </>
            ) : (
                <form
                    action={async () => {
                        "use server";

                        await signIn("google");
                    }}
                >
                    <button className="flex justify-center items-center px-4 py-2 rounded-lg bg-neutral-900 text-white cursor-pointer">
                        Sign In
                    </button>
                </form>
            )}
        </div>
    );
}
