import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const fontDisplay = Inter({ subsets: ["latin"], variable: "--font-display" });

export const metadata: Metadata = {
    title: "Aurae - Modern UI Library",
    description: "A collection of production-ready animated React components to build stunning UIs.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="dark" suppressHydrationWarning>
            <body
                className={`${fontDisplay.variable} bg-background-light text-text-main min-h-screen flex flex-col font-display selection:bg-primary selection:text-white overflow-x-hidden`}
            >
                {children}
            </body>
        </html>
    );
}
