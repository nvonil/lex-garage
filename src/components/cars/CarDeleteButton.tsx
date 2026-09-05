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

        router.push("/");
        router.refresh();
    }

    return (
        <button
            onClick={handleDelete}
            className="button button-secondary bg-pearl hover:border-[#e5383b] hover:text-[#e5383b]"
        >
            <Trash2 className="w-4 h-4" />
            Delete Build
        </button>
    );
}
