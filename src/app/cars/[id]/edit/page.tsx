import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import EditCarForm from "@/components/EditCarForm";

export default async function EditCarPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const car = await prisma.car.findUnique({ where: { id } });

    if (!car) {
        notFound();
    }

    const user = await getCurrentUser();

    if (user?.id !== car.userID) {
        redirect(`/cars/${id}`);
    }

    return (
        <main className="flex-1 max-w-sm w-full mx-auto px-4 mt-16">
            <h1 className="text-2xl font-bold mb-6">Edit Build</h1>
            <EditCarForm car={car} />
        </main>
    );
}
