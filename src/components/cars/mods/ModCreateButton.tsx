"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Plus } from "lucide-react";

export default function ModCreateButton({ carID }: { carID: string }) {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    const [category, setCategory] = useState("");
    const [brand, setBrand] = useState("");
    const [name, setName] = useState("");
    const [cost, setCost] = useState("");
    const [url, setUrl] = useState("");
    const [error, setError] = useState("");

    function openModal() {
        setIsOpen(true);
        requestAnimationFrame(() => setIsVisible(true));
    }

    function closeModal() {
        setIsVisible(false);
        setTimeout(() => {
            setIsOpen(false);
            setCategory("");
            setBrand("");
            setName("");
            setCost("");
            setUrl("");
            setError("");
        }, 300);
    }

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

        router.refresh();
        closeModal();
    }

    return (
        <>
            <button onClick={openModal} className="button button-primary">
                <Plus className="w-4 h-4" />
                Add Mod
            </button>

            {isOpen && (
                <div onClick={closeModal} className={`modal-backdrop ${isVisible ? "opacity-100" : "opacity-0"}`}>
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="max-w-sm w-full mx-auto p-6 rounded-lg bg-pearl"
                    >
                        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                            <div className="flex flex-col gap-2">
                                <label htmlFor="category" className="font-semibold">
                                    Category
                                </label>

                                <input
                                    id="category"
                                    type="text"
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="input"
                                    autoFocus
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label htmlFor="brand" className="font-semibold">
                                    Brand
                                </label>

                                <input
                                    id="brand"
                                    type="text"
                                    value={brand}
                                    onChange={(e) => setBrand(e.target.value)}
                                    className="input"
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label htmlFor="name" className="font-semibold">
                                    Name
                                </label>

                                <input
                                    id="name"
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="input"
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label htmlFor="cost" className="font-semibold">
                                    Cost
                                </label>

                                <input
                                    id="cost"
                                    type="number"
                                    min="0"
                                    value={cost}
                                    onChange={(e) => setCost(e.target.value)}
                                    className="input"
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label htmlFor="url" className="font-semibold">
                                    Link (Optional)
                                </label>

                                <input
                                    id="url"
                                    type="url"
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    className="input"
                                />
                            </div>

                            {error && (
                                <div className="text-sm text-[#e5383b] first-letter:capitalize text-center">
                                    {error}.
                                </div>
                            )}

                            <div className="flex gap-3 mt-2">
                                <button type="submit" className="button button-primary flex-1 justify-center">
                                    Add Mod
                                </button>

                                <button type="button" onClick={closeModal} className="button button-secondary">
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
