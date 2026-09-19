"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

import type { Photo } from "@/generated/prisma/client";

import DeleteConfirmModal from "@/components/ui/DeleteConfirmModal";
import { Trash2, ChevronLeft, ChevronRight } from "lucide-react";

export default function PhotoGallery({ photos, isOwner }: { photos: Photo[]; isOwner: boolean }) {
    const router = useRouter();
    const [activeIndex, setActiveIndex] = useState(0);
    const [showConfirm, setShowConfirm] = useState(false);

    if (photos.length === 0) {
        return (
            <div className="aspect-square w-full flex justify-center items-center rounded-lg bg-mist text-secondary">
                No Photos Yet
            </div>
        );
    }

    async function confirmDelete() {
        setShowConfirm(false);

        const res = await fetch(`/api/photos/${photos[activeIndex].id}`, { method: "DELETE" });

        if (!res.ok) {
            alert("something went wrong deleting this photo");
            return;
        }

        setActiveIndex(0);
        router.refresh();
    }

    function goPrev() {
        setActiveIndex((prev) => (prev - 1 + photos.length) % photos.length);
    }

    function goNext() {
        setActiveIndex((prev) => (prev + 1) % photos.length);
    }

    return (
        <>
            <div className="flex flex-col gap-4">
                <div className="flex items-start gap-4">
                    {photos.length > 1 && (
                        <div className="custom-scrollbar hidden md:flex flex-col gap-2 max-h-137.5 pr-2 overflow-y-auto">
                            {photos.map((photo, index) => (
                                <button
                                    key={photo.id}
                                    onClick={() => setActiveIndex(index)}
                                    className={`relative w-16 h-16 shrink-0 border-2 rounded-lg cursor-pointer overflow-hidden transition-colors duration-300 ${
                                        index === activeIndex ? "border-slate" : "border-transparent"
                                    }`}
                                >
                                    <Image src={photo.imageURL} alt="" fill sizes="64px" className="object-cover" />
                                </button>
                            ))}
                        </div>
                    )}

                    <div className="relative aspect-square flex-1 rounded-lg overflow-hidden">
                        <Image
                            src={photos[activeIndex].imageURL}
                            alt=""
                            fill
                            priority
                            sizes="(max-width: 768px) 100vw, 60vw"
                            className="object-cover"
                        />

                        {isOwner && (
                            <button
                                onClick={() => setShowConfirm(true)}
                                className="absolute top-4 right-4 p-2 rounded-full bg-charcoal/70 text-pearl cursor-pointer hover:text-danger transition-colors duration-300"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        )}

                        {photos.length > 1 && (
                            <>
                                <button
                                    onClick={goPrev}
                                    className="md:hidden absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-charcoal/70 text-pearl cursor-pointer"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                </button>

                                <button
                                    onClick={goNext}
                                    className="md:hidden absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-charcoal/70 text-pearl cursor-pointer"
                                >
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {photos.length > 1 && (
                    <div className="md:hidden flex justify-center gap-2">
                        {photos.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setActiveIndex(index)}
                                className={`w-2 h-2 rounded-full cursor-pointer transition-colors duration-300 ${
                                    index === activeIndex ? "bg-charcoal" : "bg-mist"
                                }`}
                            />
                        ))}
                    </div>
                )}
            </div>

            <DeleteConfirmModal
                isOpen={showConfirm}
                itemName="Photo"
                onConfirm={confirmDelete}
                onCancel={() => setShowConfirm(false)}
            />
        </>
    );
}
