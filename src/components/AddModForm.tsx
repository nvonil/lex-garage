"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddModForm({ carID }: { carID: string }) {
    const router = useRouter();
    const [category, setCategory] = useState("");
    const [brand, setBrand] = useState("");
    const [name, setName] = useState("");
    const [cost, setCost] = useState("");
    const [url, setUrl] = useState("");
    const [error, setError] = useState("");

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");

        const res = await fetch(`/api/cars/${carID}/mods`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                category,
                brand,
                name,
                cost: parseFloat(cost),
                url: url || undefined,
            }),
        });

        const data = await res.json();

        if (!res.ok) {
            setError(data.error || "something went wrong");
            return;
        }

        setCategory("");
        setBrand("");
        setName("");
        setCost("");
        setUrl("");
        router.refresh();
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 border rounded-lg p-4 mt-4">
            <h3 className="font-semibold">Add a Mod</h3>

            <input
                type="text"
                placeholder="Category (e.g. Suspension)"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="border rounded px-3 py-2"
                required
            />

            <input
                type="text"
                placeholder="Brand"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="border rounded px-3 py-2"
                required
            />

            <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border rounded px-3 py-2"
                required
            />

            <input
                type="number"
                step="0.01"
                placeholder="Cost"
                value={cost}
                onChange={(e) => setCost(e.target.value)}
                className="border rounded px-3 py-2"
                required
            />

            <input
                type="url"
                placeholder="Link (optional)"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="border rounded px-3 py-2"
            />

            {error && <p className="text-red-600 text-sm">{error}</p>}

            <button type="submit" className="bg-black text-white rounded px-3 py-2 w-fit">
                Add Mod
            </button>
        </form>
    );
}
