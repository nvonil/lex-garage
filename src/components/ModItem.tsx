"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Mod } from "@/generated/prisma/client";

type ModWithStringCost = Omit<Mod, "cost"> & { cost: string };

export default function ModItem({ mod, isOwner }: { mod: ModWithStringCost; isOwner: boolean }) {
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);
    const [category, setCategory] = useState(mod.category);
    const [brand, setBrand] = useState(mod.brand);
    const [name, setName] = useState(mod.name);
    const [cost, setCost] = useState(mod.cost.toString());
    const [url, setUrl] = useState(mod.url ?? "");
    const [error, setError] = useState("");

    async function handleSave(e: React.FormEvent) {
        e.preventDefault();
        setError("");

        const res = await fetch(`/api/mods/${mod.id}`, {
            method: "PATCH",
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

        setIsEditing(false);
        router.refresh();
    }

    async function handleDelete() {
        const confirmed = window.confirm("Delete this mod?");
        if (!confirmed) {
            return;
        }

        const res = await fetch(`/api/mods/${mod.id}`, { method: "DELETE" });

        if (!res.ok) {
            alert("something went wrong deleting this mod");
            return;
        }

        router.refresh();
    }

    function handleCancel() {
        setCategory(mod.category);
        setBrand(mod.brand);
        setName(mod.name);
        setCost(mod.cost);
        setUrl(mod.url ?? "");
        setError("");
        setIsEditing(false);
    }

    if (isEditing) {
        return (
            <li className="border rounded-lg p-3">
                <form onSubmit={handleSave} className="flex flex-col gap-2">
                    <input
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="border rounded px-2 py-1"
                        required
                    />

                    <input
                        value={brand}
                        onChange={(e) => setBrand(e.target.value)}
                        className="border rounded px-2 py-1"
                        required
                    />

                    <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="border rounded px-2 py-1"
                        required
                    />

                    <input
                        type="number"
                        step="0.01"
                        value={cost}
                        onChange={(e) => setCost(e.target.value)}
                        className="border rounded px-2 py-1"
                        required
                    />

                    <input
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        className="border rounded px-2 py-1"
                        placeholder="Link (optional)"
                    />

                    {error && <p className="text-red-600 text-sm">{error}</p>}

                    <div className="flex gap-3">
                        <button type="submit" className="bg-black text-white rounded px-3 py-1 text-sm">
                            Save
                        </button>

                        <button type="button" onClick={handleCancel} className="text-sm">
                            Cancel
                        </button>
                    </div>
                </form>
            </li>
        );
    }

    return (
        <li className="border rounded-lg p-3">
            <p className="font-medium">
                {mod.category} — {mod.brand} {mod.name}
            </p>

            <p className="text-sm text-zinc-600">
                ${mod.cost.toString()}
                {mod.url && (
                    <>
                        {" · "}
                        <a href={mod.url} className="underline" target="_blank">
                            link
                        </a>
                    </>
                )}
            </p>

            {isOwner && (
                <div className="flex gap-3 mt-2 text-sm">
                    <button onClick={() => setIsEditing(true)} className="underline">
                        Edit
                    </button>
                    <button onClick={handleDelete} className="underline text-red-600">
                        Delete
                    </button>
                </div>
            )}
        </li>
    );
}
