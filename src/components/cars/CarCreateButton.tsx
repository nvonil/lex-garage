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

    function resetForm() {
        setModel("");
        setYear("");
        setColor("");
        setError("");
    }

    function closeModal() {
        setIsVisible(false);
        setTimeout(() => {
            setIsOpen(false);
            resetForm();
        }, 300);
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

        resetForm();
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
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="max-w-sm w-full mx-auto p-6 rounded-lg bg-pearl"
                    >
                        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                            <div className="flex flex-col gap-2">
                                <label htmlFor="model" className="font-semibold">
                                    Model
                                </label>

                                <input
                                    type="text"
                                    placeholder="e.g. IS 350"
                                    value={model}
                                    onChange={(e) => setModel(e.target.value)}
                                    className="input"
                                    autoFocus
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label htmlFor="year" className="font-semibold">
                                    Year
                                </label>

                                <input
                                    type="text"
                                    placeholder="e.g. 2023"
                                    value={year}
                                    onChange={(e) => setYear(e.target.value)}
                                    className="input"
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label htmlFor="color" className="font-semibold">
                                    Color
                                </label>

                                <input
                                    type="text"
                                    placeholder="e.g. Caviar"
                                    value={color}
                                    onChange={(e) => setColor(e.target.value)}
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
                                    Post Build
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
