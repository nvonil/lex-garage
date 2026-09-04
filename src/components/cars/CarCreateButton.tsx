"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Plus } from "lucide-react";

export default function CarCreateButton() {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    const [model, setModel] = useState("");
    const [year, setYear] = useState("");
    const [color, setColor] = useState("");
    const [error, setError] = useState("");

    function openModal() {
        setIsOpen(true);
        requestAnimationFrame(() => setIsVisible(true));
    }

    function closeModal() {
        setIsVisible(false);
        setTimeout(() => setIsOpen(false), 300);
    }

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
        <>
            <button onClick={openModal} className="button button-primary">
                <Plus className="w-4 h-4" />
                Post a Build
            </button>

            {isOpen && (
                <div onClick={closeModal} className={`modal-backdrop ${isVisible ? "opacity-100" : "opacity-0"}`}>
                    <div onClick={(e) => e.stopPropagation()} className="max-w-sm mx-auto p-6 rounded-lg bg-pearl">
                        <div className="title-primary mb-6">Post a Build</div>

                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            <input
                                type="text"
                                placeholder="Model (e.g. IS 350)"
                                value={model}
                                onChange={(e) => setModel(e.target.value)}
                                className="input"
                                autoFocus
                            />

                            <input
                                type="text"
                                placeholder="Year"
                                value={year}
                                onChange={(e) => setYear(e.target.value)}
                                className="input"
                            />

                            <input
                                type="text"
                                placeholder="Color"
                                value={color}
                                onChange={(e) => setColor(e.target.value)}
                                className="input"
                            />

                            {error && (
                                <div className="text-sm text-[#e5383b] first-letter:capitalize text-center">
                                    {error}.
                                </div>
                            )}

                            <div className="flex gap-2 mt-2">
                                <button type="submit" className="button button-primary flex-1 justify-center">
                                    Post
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
