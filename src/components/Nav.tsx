import Link from "next/link";
import type { User } from "@/generated/prisma/client";

export default function Nav({ user }: { user: User | null }) {
    return (
        <nav className="flex items-center justify-between px-6 py-4 border-b">
            <Link href="/" className="font-bold text-lg">
                LexGarage
            </Link>

            <div className="flex items-center gap-4">
                {user ? (
                    <>
                        <span>{user.username}</span>
                        <Link href="/cars/new">Post a Build</Link>
                    </>
                ) : (
                    <>
                        <Link href="/login">Log In</Link>
                        <Link href="/signup">Sign Up</Link>
                    </>
                )}
            </div>
        </nav>
    );
}
