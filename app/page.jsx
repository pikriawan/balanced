import ButtonLink from "@/components/ui/button-link";

export default function HomePage() {
    return (
        <main className="p-4 flex flex-col items-start gap-4">
            <h1 className="font-medium text-2xl">Halaman Utama</h1>
            <ButtonLink href="/sign-in">Sign in</ButtonLink>
        </main>
    );
}
