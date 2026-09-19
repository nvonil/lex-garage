"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
    const router = useRouter();

    async function handleLogout() {
        await fetch("/api/logout", { method: "POST" });
        router.push("/");
        router.refresh();
    }

    return (
        <button className="button button-primary" onClick={handleLogout}>
            Log Out
        </button>
    );
}
