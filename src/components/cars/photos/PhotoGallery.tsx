"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

import type { Photo } from "@/generated/prisma/client";

import { Trash2 } from "lucide-react";

export default function PhotoGallery({ photos, isOwner }: { photos: Photo[]; isOwner: boolean }) {
    const router = useRouter();
    const [activeIndex, setActiveIndex] = useState(0);

    if (photos.length === 0) {
        return (
            <div className="aspect-square w-full flex justify-center items-center rounded-lg bg-mist text-secondary">
                No Photos Yet
            </div>
        );
    }

    async function handleDelete(photoId: string) {
        const confirmed = window.confirm("Delete this photo?");

        if (!confirmed) {
            return;
        }

        const res = await fetch(`/api/photos/${photoId}`, { method: "DELETE" });

        if (!res.ok) {
            alert("something went wrong deleting this photo");
            return;
        }

        setActiveIndex(0);
        router.refresh();
    }

    return (
        <div className="flex gap-4">
            {photos.length > 1 && (
                <div className="flex flex-col gap-2">
                    {photos.map((photo, index) => (
                        <button
                            key={photo.id}
                            onClick={() => setActiveIndex(index)}
                            className={`relative w-16 h-16 border-2 rounded-lg cursor-pointer overflow-hidden transition-colors duration-300 ${
                                index === activeIndex ? "border-charcoal" : "border-transparent"
                            }`}
                        >
                            <Image src={photo.imageURL} alt="" fill className="object-cover" />
                        </button>
                    ))}
                </div>
            )}

            <div className="relative aspect-square flex-1 rounded-lg overflow-hidden">
                <Image src={photos[activeIndex].imageURL} alt="" fill className="object-cover" />

                {isOwner && (
                    <button
                        onClick={() => handleDelete(photos[activeIndex].id)}
                        className="absolute top-4 right-4 p-2 rounded-full bg-charcoal/70 text-pearl cursor-pointer"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                )}
            </div>
        </div>
    );
}
