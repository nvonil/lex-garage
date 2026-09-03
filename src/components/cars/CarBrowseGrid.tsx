"use client";

import Image from "next/image";
import { useState } from "react";

import type { User, Car, Mod, Photo } from "@/generated/prisma/client";

import CarThumbnail from "@/components/cars/CarThumbnail";

type ModWithStringCost = Omit<Mod, "cost"> & { cost: string };

type CarWithDetails = Car & {
    user: User;
    mods: ModWithStringCost[];
    photos: Photo[];
};

export default function CarBrowseGrid({ cars }: { cars: CarWithDetails[] }) {
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
        <section>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {cars.map((car) => (
                    <button key={car.id} onClick={() => openModal(car)} className="card-interactive">
                        <CarThumbnail imageURL={car.photos[0]?.imageURL} alt={`${car.model}`} />

                        <div className="flex items-center gap-4">
                            <span className="title-secondary">{car.model}</span>

                            <div className="flex gap-2">
                                <span className="badge">{car.year}</span>
                                <span className="badge">{car.color}</span>
                            </div>
                        </div>
                    </button>
                ))}
            </div>

            {selectedCar && (
                <div
                    onClick={() => closeModal()}
                    className={`modal-backdrop ${isVisible ? "opacity-100" : "opacity-0"}`}
                >
                    <div onClick={(e) => e.stopPropagation()} className="max-w-4xl w-full p-6 rounded-lg bg-pearl">
                        <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center gap-4">
                                <span className="title-primary">{selectedCar.model}</span>

                                <div className="flex gap-2">
                                    <span className="badge">{selectedCar.year}</span>
                                    <span className="badge">{selectedCar.color}</span>
                                </div>
                            </div>

                            <button onClick={() => closeModal()} className="button button-secondary">
                                Close
                            </button>
                        </div>

                        <div className="grid grid-cols-[6fr_4fr] gap-8 items-start">
                            <div className="flex flex-col gap-4">
                                <CarThumbnail
                                    imageURL={selectedCar.photos[activePhotoIndex]?.imageURL}
                                    alt={`${selectedCar.model}`}
                                />

                                {selectedCar.photos.length > 1 && (
                                    <div className="flex gap-2">
                                        {selectedCar.photos.map((photo, index) => (
                                            <button
                                                key={photo.id}
                                                onClick={() => setActivePhotoIndex(index)}
                                                className={`relative w-12 h-12 border-2 rounded-lg cursor-pointer overflow-hidden transition-colors duration-300 ${
                                                    index === activePhotoIndex ? "border-slate" : "border-transparent"
                                                }`}
                                            >
                                                <Image src={photo.imageURL} alt="" fill className="object-cover" />
                                            </button>
                                        ))}
                                    </div>
                                )}

                                <div className="text-secondary">Posted by @{selectedCar.user.username}</div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <div className="title-secondary">Mods</div>

                                {selectedCar.mods.length === 0 ? (
                                    <div className="text-secondary">No mods listed yet</div>
                                ) : (
                                    <ul className="flex flex-col gap-1">
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
        </section>
    );
}
