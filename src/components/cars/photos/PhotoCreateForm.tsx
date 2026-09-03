"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PhotoCreateForm({ carID }: { carID: string }) {
    const router = useRouter();
    const [file, setFile] = useState<File | null>(null);
    const [error, setError] = useState("");
    const [uploading, setUploading] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");

        if (!file) {
            setError("choose a photo first");
            return;
        }

        setUploading(true);

        const formData = new FormData();
        formData.append("photo", file);

        const res = await fetch(`/api/cars/${carID}/photos`, {
            method: "POST",
            body: formData,
        });

        const data = await res.json();

        setUploading(false);

        if (!res.ok) {
            setError(data.error || "something went wrong");
            return;
        }

        setFile(null);
        router.refresh();
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 border rounded-lg p-4 mt-4">
            <h3 className="font-semibold">Add a Photo</h3>

            <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                className="border rounded px-3 py-2"
            />

            {error && <p className="text-red-600 text-sm">{error}</p>}

            <button
                type="submit"
                disabled={uploading}
                className="bg-black text-white rounded px-3 py-2 w-fit disabled:opacity-50"
            >
                {uploading ? "Uploading..." : "Upload"}
            </button>
        </form>
    );
}
