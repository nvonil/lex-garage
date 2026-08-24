"use client";

import { useRouter } from "next/navigation";
import type { Photo } from "@/generated/prisma/client";

export default function PhotoItem({ photo, isOwner }: { photo: Photo; isOwner: boolean }) {
    const router = useRouter();

    async function handleDelete() {
        const confirmed = window.confirm("Delete this photo?");
        if (!confirmed) {
            return;
        }

        const res = await fetch(`/api/photos/${photo.id}`, { method: "DELETE" });

        if (!res.ok) {
            alert("something went wrong deleting this photo");
            return;
        }

        router.refresh();
    }

    return (
        <div className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={photo.imageURL} alt="car photo" className="rounded-lg object-cover aspect-square w-full" />

            {isOwner && (
                <button
                    onClick={handleDelete}
                    className="absolute top-2 right-2 bg-black/70 text-white text-xs rounded px-2 py-1"
                >
                    Delete
                </button>
            )}
        </div>
    );
}
