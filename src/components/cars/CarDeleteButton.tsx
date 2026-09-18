"use client";

import { useRouter } from "next/navigation";

import DeleteConfirmModal from "../ui/DeleteConfirmModal";
import { Trash2 } from "lucide-react";
import { useState } from "react";

export default function CarDeleteButton({ carID }: { carID: string }) {
    const router = useRouter();
    const [showConfirm, setShowConfirm] = useState(false);

    async function handleDelete() {
        const res = await fetch(`/api/cars/${carID}`, { method: "DELETE" });

        if (!res.ok) {
            alert("something went wrong deleting this build");
            return;
        }

        router.push("/my-builds");
        router.refresh();
    }

    return (
        <>
            <button
                onClick={() => setShowConfirm(true)}
                className="button button-secondary p-2 sm:px-4 sm:py-2 bg-pearl hover:border-danger hover:text-danger"
            >
                <Trash2 className="w-4 h-4" />
                <span className="hidden sm:inline">Delete</span>
            </button>

            <DeleteConfirmModal
                isOpen={showConfirm}
                itemName="Build"
                onConfirm={() => {
                    setShowConfirm(false);
                    handleDelete();
                }}
                onCancel={() => setShowConfirm(false)}
            />
        </>
    );
}
