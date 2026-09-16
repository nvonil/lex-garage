"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

import type { User } from "@/generated/prisma/client";

import LogoutButton from "@/components/layout/LogoutButton";
import { User as UserIcon } from "lucide-react";

export default function Nav({ user }: { user: User | null }) {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        setIsOpen(false);
    }, [user?.id]);

    return (
        <header className="flex justify-between items-center h-20 px-4 sm:px-8 md:px-12">
            <Link href="/" className="flex items-center gap-2">
                <Image src="/images/logo.png" alt="LexGarage Logo" width={32} height={32} />

                <div className="hidden sm:block">
                    <span className="title-primary">Lex</span>
                    <span className="text-xl">Garage</span>
                </div>
            </Link>

            <nav className="flex items-center gap-4 sm:gap-8 md:gap-12">
                <Link href="/my-builds">My Builds</Link>

                {user ? (
                    <div className="relative">
                        <button
                            className="button button-primary p-2 sm:px-4 sm:py-2"
                            onClick={() => setIsOpen(!isOpen)}
                        >
                            <UserIcon className="w-4 h-4 sm:hidden" />
                            <span className="hidden sm:inline">@{user.username}</span>
                        </button>

                        {isOpen && (
                            <div>
                                <div className="fixed inset-0 z-10" onClick={() => setIsOpen(!isOpen)}></div>

                                <div className="absolute right-0 mt-2 z-20 animate-[dropdown-in_150ms]">
                                    <LogoutButton />
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <Link href="/login" className="button button-primary p-2 sm:px-4 sm:py-2">
                        <UserIcon className="w-4 h-4" />
                        <span className="hidden sm:inline">Sign In</span>
                    </Link>
                )}
            </nav>
        </header>
    );
}
