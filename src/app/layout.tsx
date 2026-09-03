import { getCurrentUser } from "@/lib/session";
import Nav from "@/components/layout/Nav";

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "LexGarage",
    description: "Social Platform for Lexus Enthusiasts",
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const user = await getCurrentUser();

    return (
        <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
            <body className="font-sans min-h-full flex flex-col">
                <Nav user={user} />
                {children}
            </body>
        </html>
    );
}
