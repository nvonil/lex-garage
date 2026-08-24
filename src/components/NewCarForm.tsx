"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewCarForm() {
    const router = useRouter();
    const [model, setModel] = useState("");
    const [year, setYear] = useState("");
    const [color, setColor] = useState("");
    const [error, setError] = useState("");

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");

        const res = await fetch("/api/cars", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ model, year, color }),
        });

        const data = await res.json();

        if (!res.ok) {
            setError(data.error || "something went wrong");
            return;
        }

        router.push(`/cars/${data.id}`);
    }

    return (
        <div className="max-w-sm mx-auto mt-16 px-4">
            <h1 className="text-2xl font-bold mb-6">Post a Build</h1>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input
                    type="text"
                    placeholder="Model (e.g. IS300)"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    className="border rounded px-3 py-2"
                    required
                />

                <input
                    type="text"
                    placeholder="Year"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="border rounded px-3 py-2"
                    required
                />

                <input
                    type="text"
                    placeholder="Color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="border rounded px-3 py-2"
                    required
                />

                {error && <p className="text-red-600 text-sm">{error}</p>}

                <button type="submit" className="bg-black text-white rounded px-3 py-2">
                    Create
                </button>
            </form>
        </div>
    );
}
