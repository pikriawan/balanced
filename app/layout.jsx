import { Geist } from "next/font/google";
import "@/app/globals.css";
import ErudaNoSsr from "@/components/eruda-no-ssr";

const geist = Geist({
    subsets: ["latin"],
    display: "swap",
    variable: "--font-geist"
});

export const metadata = {
    title: "Balanced"
};

export default function RootLayout({ children }) {
    return (
        <html className={`${geist.variable} antialiased scheme-dark bg-neutral-950`}>
            <body className="bg-neutral-950 text-neutral-50">
                {children}
                {process.env.NODE_ENV !== "production" && <ErudaNoSsr />}
            </body>
        </html>
    );
}
