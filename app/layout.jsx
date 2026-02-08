import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
    subsets: ["latin"],
    display: "swap",
    variable: "--font-inter"
});

export const metadata = {
    title: "Balanced"
};

export default function RootLayout({ children }) {
    return (
        <html className={`${inter.variable} antialiased`}>
            <body>
                {children}
            </body>
        </html>
    );
}
