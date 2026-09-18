"use client";

import { useRouter } from "next/navigation";

import { Trash2 } from "lucide-react";

export default function CarDeleteButton({ carID }: { carID: string }) {
    const router = useRouter();

    async function handleDelete() {
        const confirmed = window.confirm("Delete this build? This cannot be undone.");

        if (!confirmed) {
            return;
        }

        const res = await fetch(`/api/cars/${carID}`, { method: "DELETE" });

        if (!res.ok) {
            alert("something went wrong deleting this build");
            return;
        }

        router.push("/my-builds");
        router.refresh();
    }

    return (
        <button
            onClick={handleDelete}
            className="button button-secondary p-2 sm:px-4 sm:py-2 bg-pearl hover:border-[#e5383b] hover:text-[#e5383b]"
        >
            <Trash2 className="w-4 h-4" />
            <span className="hidden sm:inline">Delete</span>
        </button>
    );
}
