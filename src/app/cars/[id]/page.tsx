import { notFound } from "next/navigation";
import Link from "next/link";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import ModCreateForm from "@/components/cars/mods/ModCreateForm";
import PhotoCreateForm from "@/components/cars/photos/PhotoCreateForm";
import CarDeleteButton from "@/components/cars/CarDeleteButton";
import ModListItem from "@/components/cars/mods/ModListItem";
import PhotoListItem from "@/components/cars/photos/PhotoListItem";

export default async function CarDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const car = await prisma.car.findUnique({
        where: { id },
        include: { mods: true, photos: true },
    });

    if (!car) {
        notFound();
    }

    const user = await getCurrentUser();
    const isOwner = user?.id === car.userID;

    return (
        <main className="flex-1 max-w-3xl w-full mx-auto px-6 py-10">
            <div className="flex items-center gap-4">
                <span className="text-xl font-bold">{car.model}</span>

                <div className="flex gap-2">
                    <span className="px-2 py-1 border border-accent rounded-xl text-text-secondary text-sm">
                        {car.year}
                    </span>

                    <span className="px-2 py-1 border border-accent rounded-xl text-text-secondary text-sm">
                        {car.color}
                    </span>
                </div>
            </div>

            {car.photos.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
                    {car.photos.map((photo) => (
                        <PhotoListItem key={photo.id} photo={photo} isOwner={isOwner} />
                    ))}
                </div>
            )}

            <h2 className="text-lg font-semibold mb-3">Mods</h2>
            {car.mods.length === 0 ? (
                <p className="text-zinc-500">No mods listed yet.</p>
            ) : (
                <ul className="flex flex-col gap-3">
                    {car.mods.map((mod) => (
                        <ModListItem key={mod.id} mod={{ ...mod, cost: mod.cost.toString() }} isOwner={isOwner} />
                    ))}
                </ul>
            )}

            {isOwner && (
                <>
                    <Link href={`/cars/${car.id}/edit`} className="underline">
                        Edit Build
                    </Link>
                    <CarDeleteButton carID={car.id} />
                    <ModCreateForm carID={car.id} /> <PhotoCreateForm carID={car.id} />
                </>
            )}
        </main>
    );
}
