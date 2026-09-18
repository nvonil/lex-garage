import Link from "next/link";

export default function GuestPrompt({ message }: { message: string }) {
    return (
        <main className="flex flex-col items-center gap-3 max-w-xs w-full mx-auto px-6 mt-16">
            <h1 className="title-primary">Sign in required</h1>

            <div className="text-secondary">{message}</div>

            <div className="flex gap-3 mt-6">
                <Link href="/login" className="button button-primary">
                    Log In
                </Link>

                <Link href="/signup" className="button button-secondary">
                    Sign Up
                </Link>
            </div>
        </main>
    );
}
