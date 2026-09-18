"use client";

export default function DeleteConfirmModal({
    isOpen,
    itemName,
    onConfirm,
    onCancel,
}: {
    isOpen: boolean;
    itemName: string;
    onConfirm: () => void;
    onCancel: () => void;
}) {
    return (
        <div
            onClick={onCancel}
            className={`modal-backdrop ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className={`max-w-sm w-full mx-6 p-6 rounded-lg bg-pearl transition-transform duration-300`}
            >
                <h2 className="title-primary mb-2">Delete {itemName}?</h2>
                <div className="text-secondary mb-6">This action is permanent and cannot be undone.</div>

                <div className="flex justify-end gap-4">
                    <button
                        onClick={onConfirm}
                        className="button bg-danger text-pearl hover:scale-105 transition-transform duration-300"
                    >
                        Delete
                    </button>

                    <button onClick={onCancel} className="button button-secondary justify-center">
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}
