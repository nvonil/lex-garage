import Link from "next/link";

export default function GuestPrompt({ message }: { message: string }) {
    return (
        <main className="flex-1 max-w-sm w-full mx-auto px-4 mt-16 text-center">
            <h1 className="text-xl font-bold mb-3">Sign in required</h1>

            <p className="text-zinc-600 mb-6">{message}</p>

            <div className="flex gap-3 justify-center">
                <Link href="/login" className="bg-black text-white rounded px-4 py-2">
                    Log In
                </Link>

                <Link href="/signup" className="border rounded px-4 py-2">
                    Sign Up
                </Link>
            </div>
        </main>
    );
}
