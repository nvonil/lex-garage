"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import type { Mod } from "@/generated/prisma/client";

import { ExternalLink, Pencil, Trash2 } from "lucide-react";

type ModWithStringCost = Omit<Mod, "cost"> & { cost: string };

export default function ModListItem({ mod, isOwner }: { mod: ModWithStringCost; isOwner: boolean }) {
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
            <li className="p-4 border border-charcoal rounded-lg">
                <form onSubmit={handleSave} className="flex flex-col gap-3" autoComplete="off">
                    <input value={category} onChange={(e) => setCategory(e.target.value)} className="input" required />

                    <input value={brand} onChange={(e) => setBrand(e.target.value)} className="input" required />

                    <input value={name} onChange={(e) => setName(e.target.value)} className="input" required />

                    <input
                        type="number"
                        min="0"
                        value={cost}
                        onChange={(e) => setCost(e.target.value)}
                        className="input"
                        required
                    />

                    <input
                        type="url"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        className="input"
                        placeholder="Link (optional)"
                    />

                    {error && (
                        <div className="text-sm text-[#e5383b] first-letter:capitalize text-center">{error}.</div>
                    )}

                    <div className="flex gap-3 mt-1.5">
                        <button type="submit" className="button button-primary">
                            Save
                        </button>

                        <button type="button" onClick={handleCancel} className="button button-secondary">
                            Cancel
                        </button>
                    </div>
                </form>
            </li>
        );
    }

    return (
        <li className="flex flex-col gap-2 p-4 border border-charcoal rounded-lg">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 font-medium">
                    <span>
                        {mod.category} — {mod.brand} {mod.name}
                    </span>

                    {mod.url && (
                        <a
                            href={mod.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-slate cursor-pointer hover:text-charcoal transition-colors duration-300"
                        >
                            <ExternalLink className="w-4 h-4" />
                        </a>
                    )}
                </div>

                {isOwner && (
                    <div className="flex gap-2">
                        <button
                            onClick={() => setIsEditing(true)}
                            className="text-slate cursor-pointer hover:text-charcoal transition-colors duration-300"
                        >
                            <Pencil className="w-4 h-4" />
                        </button>

                        <button
                            onClick={handleDelete}
                            className="text-slate cursor-pointer hover:text-[#e5383b] transition-colors duration-300"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                )}
            </div>

            <div className="text-secondary">${mod.cost.toString()}</div>
        </li>
    );
}
