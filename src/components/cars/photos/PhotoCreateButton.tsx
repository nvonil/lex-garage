"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Plus } from "lucide-react";

export default function PhotoCreateButton({ carID }: { carID: string }) {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [error, setError] = useState("");
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (!file) {
            setPreviewUrl(null);
            return;
        }

        const url = URL.createObjectURL(file);
        setPreviewUrl(url);

        return () => URL.revokeObjectURL(url);
    }, [file]);

    function openModal() {
        setIsOpen(true);
        requestAnimationFrame(() => setIsVisible(true));
    }

    function closeModal() {
        setIsVisible(false);
        setTimeout(() => {
            setIsOpen(false);
            setFile(null);
            setError("");
        }, 300);
    }

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

        router.refresh();
        closeModal();
    }

    return (
        <>
            <button onClick={openModal} className="button button-primary">
                <Plus className="w-4 h-4" />
                Add Photo
            </button>

            {isOpen && (
                <div onClick={closeModal} className={`modal-backdrop ${isVisible ? "opacity-100" : "opacity-0"}`}>
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="max-w-sm w-full mx-auto p-6 rounded-lg bg-pearl"
                    >
                        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                            <div className="flex flex-col gap-2">
                                <label htmlFor="photo" className="font-semibold">
                                    Photo
                                </label>

                                <label
                                    htmlFor="photo"
                                    className="relative aspect-square w-full flex justify-center items-center border-2 border-dashed rounded-lg border-mist cursor-pointer overflow-hidden"
                                >
                                    {previewUrl ? (
                                        <img
                                            src={previewUrl}
                                            alt="Selected photo preview"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-secondary">Click to upload a photo</span>
                                    )}
                                </label>

                                <input
                                    id="photo"
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp"
                                    onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                                    className="hidden"
                                />
                            </div>

                            {error && (
                                <div className="text-sm text-[#e5383b] first-letter:capitalize text-center">
                                    {error}.
                                </div>
                            )}

                            <div className="flex gap-3 mt-2">
                                <button
                                    type="submit"
                                    disabled={uploading}
                                    className="button button-primary flex-1 justify-center disabled:opacity-70"
                                >
                                    {uploading ? "Uploading..." : "Upload Photo"}
                                </button>

                                <button type="button" onClick={closeModal} className="button button-secondary">
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
