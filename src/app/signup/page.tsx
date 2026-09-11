"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignupPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");

        const res = await fetch("/api/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, username, password }),
        });

        const data = await res.json();

        if (!res.ok) {
            setError(data.error || "something went wront");
            return;
        }

        router.push("/login");
    }

    return (
        <div className="flex flex-col items-center max-w-xs w-full mx-auto px-6 mt-16">
            <h1 className="title-primary mb-6">Sign Up</h1>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full">
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input"
                    autoFocus
                />

                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="input"
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input"
                />

                {error && <div className="text-sm text-[#e5383b] first-letter:capitalize text-center">{error}.</div>}

                <button type="submit" className="button button-primary justify-center mt-3 mb-6">
                    Sign Up
                </button>
            </form>

            <div className="text-secondary">
                Already have an account?{" "}
                <Link href="/login" className="text-charcoal underline">
                    Log in
                </Link>
            </div>
        </div>
    );
}
