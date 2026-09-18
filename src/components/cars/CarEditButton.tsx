"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import type { Car } from "@/generated/prisma/client";

import { Pencil } from "lucide-react";

export default function CarEditButton({ car }: { car: Car }) {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    const [model, setModel] = useState(car.model);
    const [year, setYear] = useState(car.year);
    const [color, setColor] = useState(car.color);
    const [error, setError] = useState("");

    function openModal() {
        setIsOpen(true);
        requestAnimationFrame(() => setIsVisible(true));
    }

    function closeModal() {
        setIsVisible(false);
        setTimeout(() => {
            setIsOpen(false);
            setError("");
        }, 300);
    }

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

        router.refresh();
        closeModal();
    }

    return (
        <>
            <button onClick={openModal} className="button button-secondary p-2 sm:px-4 sm:py-2">
                <Pencil className="w-4 h-4" />
                <span className="hidden sm:inline">Edit</span>
            </button>

            {isOpen && (
                <div onClick={closeModal} className={`modal-backdrop ${isVisible ? "opacity-100" : "opacity-0"}`}>
                    <div onClick={(e) => e.stopPropagation()} className="max-w-sm w-full mx-6 p-6 rounded-lg bg-pearl">
                        <form onSubmit={handleSubmit} className="flex flex-col gap-6" autoComplete="off">
                            <div className="flex flex-col gap-2">
                                <label htmlFor="model" className="font-semibold">
                                    Model
                                </label>

                                <input
                                    id="model"
                                    type="text"
                                    placeholder="e.g. IS 350"
                                    value={model}
                                    onChange={(e) => setModel(e.target.value)}
                                    className="input"
                                    autoFocus
                                    required
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label htmlFor="year" className="font-semibold">
                                    Year
                                </label>

                                <input
                                    id="year"
                                    type="number"
                                    min="1800"
                                    max="2099"
                                    placeholder="e.g. 2023"
                                    value={year}
                                    onChange={(e) => setYear(e.target.value)}
                                    className="input"
                                    required
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label htmlFor="color" className="font-semibold">
                                    Color
                                </label>

                                <input
                                    id="color"
                                    type="text"
                                    placeholder="e.g. Caviar"
                                    value={color}
                                    onChange={(e) => setColor(e.target.value)}
                                    className="input"
                                    required
                                />
                            </div>

                            {error && (
                                <div className="text-sm text-[#e5383b] first-letter:capitalize text-center">
                                    {error}.
                                </div>
                            )}

                            <div className="flex gap-3 mt-2">
                                <button type="submit" className="button button-primary flex-1 justify-center">
                                    Save
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
