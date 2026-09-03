"use client";

import { useRouter } from "next/navigation";

export default function CarDeleteButton({ carID }: { carID: string }) {
    const router = useRouter();

    async function handleDelete() {
        const confimed = window.confirm("Delete this build? This cannot be undone.");

        const res = await fetch(`/api/cars/${carID}`, { method: "DELETE" });

        if (!res.ok) {
            alert("something went wrong deleting this build");
            return;
        }

        router.push("/");
        router.refresh();
    }

    return (
        <button onClick={handleDelete} className="text-red-600 underline">
            Delete Build
        </button>
    );
}
