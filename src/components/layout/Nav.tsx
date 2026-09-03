"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

import type { User } from "@/generated/prisma/client";

import LogoutButton from "@/components/layout/LogoutButton";
import { User as UserIcon } from "lucide-react";

export default function Nav({ user }: { user: User | null }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <header className="flex justify-between items-center h-20 px-12">
            <Link href="/" className="flex items-center gap-2">
                <Image src="/images/lexgarage-logo.png" alt="LexGarage Logo" width={32} height={32} />

                <div>
                    <span className="title-primary">Lex</span>
                    <span className="text-xl text-charcoal">Garage</span>
                </div>
            </Link>

            <nav className="flex items-center gap-12">
                <Link href="/my-builds">My Builds</Link>

                {user ? (
                    <div className="relative">
                        <button className="button button-primary" onClick={() => setIsOpen(!isOpen)}>
                            @{user.username}
                        </button>

                        {isOpen && (
                            <>
                                <div className="fixed inset-0 z-10" onClick={() => setIsOpen(!isOpen)}></div>

                                <div className="absolute right-0 mt-2 z-20 animate-[dropdown-in_150ms]">
                                    <LogoutButton />
                                </div>
                            </>
                        )}
                    </div>
                ) : (
                    <Link href="/login" className="button button-primary">
                        <UserIcon className="w-4 h-4" />
                        Sign In
                    </Link>
                )}
            </nav>
        </header>
    );
}
