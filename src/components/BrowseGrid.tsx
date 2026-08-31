"use client";

import Image from "next/image";
import { useState } from "react";

import CarThumbnail from "@/components/CarThumbnail";
import type { Car, Mod, Photo, User } from "@/generated/prisma/client";

type ModWithStringCost = Omit<Mod, "cost"> & { cost: string };

type CarWithDetails = Car & {
    photos: Photo[];
    mods: ModWithStringCost[];
    user: User;
};

export default function BrowseGrid({ cars }: { cars: CarWithDetails[] }) {
    const [selectedCar, setSelectedCar] = useState<CarWithDetails | null>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [activePhotoIndex, setActivePhotoIndex] = useState(0);

    function openModal(car: CarWithDetails) {
        setSelectedCar(car);
        setActivePhotoIndex(0);
        requestAnimationFrame(() => setIsVisible(true));
    }

    function closeModal() {
        setIsVisible(false);
        setTimeout(() => setSelectedCar(null), 300);
    }

    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {cars.map((car) => (
                    <button
                        key={car.id}
                        onClick={() => openModal(car)}
                        className="flex flex-col gap-4 border rounded-lg p-4 text-left cursor-pointer hover:scale-102 transition-transform duration-300"
                    >
                        <CarThumbnail imageURL={car.photos[0]?.imageURL} alt={`${car.model} photo`} />

                        <div className="flex items-center gap-4">
                            <span className="text-lg font-semibold">{car.model}</span>

                            <div className="flex gap-2">
                                <span className="px-2 py-1 border border-accent rounded-xl text-text-secondary text-sm">
                                    {car.year}
                                </span>

                                <span className="px-2 py-1 border border-accent rounded-xl text-text-secondary text-sm">
                                    {car.color}
                                </span>
                            </div>
                        </div>
                    </button>
                ))}
            </div>

            {selectedCar && (
                <div
                    onClick={() => closeModal()}
                    className={`fixed inset-0 z-50 flex justify-center items-center bg-text-primary/60 px-6 transition-opacity duration-300 ${
                        isVisible ? "opacity-100" : "opacity-0"
                    }`}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="bg-background-primary rounded-lg p-6 max-w-5xl w-full"
                    >
                        <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center gap-4">
                                <span className="text-xl font-bold">{selectedCar.model}</span>

                                <div className="flex gap-2">
                                    <span className="px-2 py-1 border border-accent rounded-xl text-text-secondary text-sm">
                                        {selectedCar.year}
                                    </span>

                                    <span className="px-2 py-1 border border-accent rounded-xl text-text-secondary text-sm">
                                        {selectedCar.color}
                                    </span>
                                </div>
                            </div>

                            <button onClick={() => closeModal()} className="text-text-secondary cursor-pointer">
                                Close
                            </button>
                        </div>

                        <div className="grid grid-cols-[3fr_2fr] gap-4 items-start">
                            <div className="flex flex-col gap-4">
                                <CarThumbnail
                                    imageURL={selectedCar.photos[activePhotoIndex]?.imageURL}
                                    alt={`${selectedCar.model} photo`}
                                />

                                {selectedCar.photos.length > 1 && (
                                    <div className="flex gap-2">
                                        {selectedCar.photos.map((photo, index) => (
                                            <button
                                                key={photo.id}
                                                onClick={() => setActivePhotoIndex(index)}
                                                className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 cursor-pointer transition-colors duration-300 ${
                                                    index === activePhotoIndex ? "border-accent" : "border-transparent"
                                                }`}
                                            >
                                                <Image src={photo.imageURL} alt="" fill className="object-cover" />
                                            </button>
                                        ))}
                                    </div>
                                )}

                                <p className="text-text-secondary">Posted by @{selectedCar.user.username}</p>
                            </div>

                            <div>
                                <div className="text-lg font-semibold mb-2">Mods</div>

                                {selectedCar.mods.length === 0 ? (
                                    <p className="text-text-secondary">No mods listed yet</p>
                                ) : (
                                    <ul className="flex flex-col gap-2">
                                        {selectedCar.mods.map((mod) => (
                                            <li key={mod.id} className="pl-4">
                                                <span className="font-medium">{mod.category}</span> — {mod.brand}{" "}
                                                {mod.name} (${mod.cost})
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
