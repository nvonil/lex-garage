"use client";

import Image from "next/image";
import { useState } from "react";

import type { User, Car, Mod, Photo } from "@/generated/prisma/client";

import CarThumbnail from "@/components/cars/CarThumbnail";
import { X, ExternalLink } from "lucide-react";

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
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="max-w-4xl w-full max-h-[75vh] mx-6 p-6 rounded-lg bg-pearl overflow-y-auto"
                    >
                        <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center gap-4">
                                <span className="title-primary">{selectedCar.model}</span>

                                <div className="flex gap-2">
                                    <span className="badge">{selectedCar.year}</span>
                                    <span className="badge">{selectedCar.color}</span>
                                </div>
                            </div>

                            <button
                                onClick={() => closeModal()}
                                className="text-secondary flex md:hidden justify-center items-center cursor-pointer hover:text-charcoal transition-colors duration-300"
                            >
                                <X className="w-4 h-4" />
                            </button>

                            <button onClick={() => closeModal()} className="button button-secondary hidden md:flex">
                                Close
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-[6fr_4fr] gap-6 md:gap-8 items-start">
                            <div className="flex flex-col gap-4 min-w-0">
                                <div className="text-secondary block md:hidden">
                                    Posted by @{selectedCar.user.username}
                                </div>

                                <CarThumbnail
                                    imageURL={selectedCar.photos[activePhotoIndex]?.imageURL}
                                    alt={`${selectedCar.model}`}
                                />

                                {selectedCar.photos.length > 1 && (
                                    <div className="custom-scrollbar flex gap-2 pb-2 overflow-x-auto">
                                        {selectedCar.photos.map((photo, index) => (
                                            <button
                                                key={photo.id}
                                                onClick={() => setActivePhotoIndex(index)}
                                                className={`relative w-12 h-12 shrink-0 border-2 rounded-lg cursor-pointer overflow-hidden transition-colors duration-300 ${
                                                    index === activePhotoIndex ? "border-slate" : "border-transparent"
                                                }`}
                                            >
                                                <Image
                                                    src={photo.imageURL}
                                                    alt=""
                                                    fill
                                                    sizes="48px"
                                                    className="object-cover"
                                                />
                                            </button>
                                        ))}
                                    </div>
                                )}

                                <div className="text-secondary hidden md:block">
                                    Posted by @{selectedCar.user.username}
                                </div>
                            </div>

                            <div className="flex flex-col gap-4">
                                <div className="title-secondary hidden md:block">Mods</div>

                                {selectedCar.mods.length === 0 ? (
                                    <div className="text-secondary">No mods listed yet</div>
                                ) : (
                                    <ul className="custom-scrollbar flex flex-col gap-2 md:max-h-75 md:pr-2 md:overflow-y-auto">
                                        {selectedCar.mods.map((mod) => (
                                            <li key={mod.id}>
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

                                                <div className="pl-4 text-secondary">${mod.cost}</div>
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
