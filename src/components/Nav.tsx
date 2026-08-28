"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

import type { User } from "@/generated/prisma/client";
import LogoutButton from "@/components/LogoutButton";

import { User as UserIcon } from "lucide-react";

export default function Nav({ user }: { user: User | null }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="flex justify-between items-center h-20 px-12 border-b-2 border-background-secondary">
            <Link href="/" className="flex items-center gap-2 text-xl">
                <Image src="/images/lexgarage-logo.png" alt="LexGarage Logo" width={32} height={32} />
                <span>
                    <span className="font-bold">Lex</span>
                    <span>Garage</span>
                </span>
            </Link>

            <div className="flex items-center gap-12">
                <Link href="/">About</Link>

                <Link href="/my-builds">My Builds</Link>

                {user ? (
                    <div className="relative">
                        <button className="cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
                            <span className="normal-case px-4 py-2 rounded-lg bg-text-primary text-background-primary hover:scale-102 transition-transform duration-300">
                                @{user.username}
                            </span>
                        </button>

                        {isOpen && (
                            <div className="absolute">
                                <LogoutButton />
                            </div>
                        )}
                    </div>
                ) : (
                    <Link
                        href="/login"
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-text-primary text-background-primary hover:scale-102 transition-transform duration-300"
                    >
                        <UserIcon className="w-4 h-4" />
                        Sign In
                    </Link>
                )}
            </div>
        </nav>
    );
}
