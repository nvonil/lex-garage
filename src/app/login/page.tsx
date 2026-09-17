"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");

        const res = await fetch("/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        const data = await res.json();

        if (!res.ok) {
            setError(data.error || "something went wrong");
            return;
        }

        router.push("/");
        router.refresh();
    }

    return (
        <div className="flex flex-col items-center max-w-xs w-full mx-auto px-6 mt-16">
            <h1 className="title-primary mb-6">Log In</h1>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full" autoComplete="off">
                <input
                    type="email"
                    value={email}
                    placeholder="Email"
                    onChange={(e) => setEmail(e.target.value)}
                    className="input"
                    autoFocus
                />

                <input
                    type="password"
                    value={password}
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)}
                    className="input"
                />

                {error && <div className="text-sm text-[#e5383b] first-letter:capitalize text-center">{error}.</div>}

                <button type="submit" className="button button-primary justify-center mt-3 mb-6">
                    Log In
                </button>
            </form>

            <div className="text-secondary">
                Don&apos;t have an account?{" "}
                <Link href="/signup" className="text-charcoal underline">
                    Sign up
                </Link>
            </div>
        </div>
    );
}
