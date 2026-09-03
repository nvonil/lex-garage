"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Car } from "@/generated/prisma/client";

export default function CarEditForm({ car }: { car: Car }) {
    const router = useRouter();
    const [model, setModel] = useState(car.model);
    const [year, setYear] = useState(car.year);
    const [color, setColor] = useState(car.color);
    const [error, setError] = useState("");

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");

        const res = await fetch(`/api/cars/${car.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ model, year, color }),
        });

        const data = await res.json();

        if (!res.ok) {
            setError(data.error || "something went wrong");
            return;
        }

        router.push(`/cars/${car.id}`);
        router.refresh();
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
                type="text"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="border rounded px-3 py-2"
                required
            />
            <input
                type="text"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="border rounded px-3 py-2"
                required
            />

            <input
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="border rounded px-3 py-2"
                required
            />

            {error && <p className="text-red-600 text-sm">{error}</p>}

            <div className="flex gap-3">
                <button type="submit" className="bg-black text-white rounded px-3 py-2">
                    Save
                </button>

                <a href={`/cars/${car.id}`} className="px-3 py-2">
                    Cancel
                </a>
            </div>
        </form>
    );
}
