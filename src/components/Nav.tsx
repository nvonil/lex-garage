"use client";

import Link from "next/link";
import { useState } from "react";

import type { User } from "@/generated/prisma/client";
import LogoutButton from "@/components/LogoutButton";

import { User as UserIcon } from "lucide-react";

export default function Nav({ user }: { user: User | null }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="flex justify-between items-center px-12 py-6 border-b-2 border-background-secondary">
            <Link href="/" className="font-bold text-2xl">
                LexGarage
            </Link>

            <div className="flex items-center gap-8 uppercase text-sm font-semibold">
                <Link href="/my-builds">My Builds</Link>

                {user ? (
                    <div className="relative">
                        <button className="cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
                            <span className="normal-case">@{user.username}</span>
                        </button>

                        {isOpen && (
                            <div className="absolute">
                                <LogoutButton />
                            </div>
                        )}
                    </div>
                ) : (
                    <Link href="/login" className="flex items-center gap-2">
                        <UserIcon className="w-4 h-4" />
                        Sign In
                    </Link>
                )}
            </div>
        </nav>
    );
}
