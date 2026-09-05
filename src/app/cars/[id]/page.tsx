import Link from "next/link";
import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";

import CarDeleteButton from "@/components/cars/CarDeleteButton";
import PhotoCreateButton from "@/components/cars/photos/PhotoCreateButton";
import ModCreateButton from "@/components/cars/mods/ModCreateButton";
import PhotoGallery from "@/components/cars/photos/PhotoGallery";
import ModListItem from "@/components/cars/mods/ModListItem";
import { Pencil } from "lucide-react";

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
        <main className="flex flex-col gap-12 max-w-6xl w-full mx-auto px-6 py-12">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <span className="title-primary">{car.model}</span>

                    <div className="flex gap-2">
                        <span className="badge">{car.year}</span>
                        <span className="badge">{car.color}</span>
                    </div>
                </div>

                {isOwner && (
                    <div className="flex gap-4">
                        <Link href={`/cars/${car.id}/edit`} className="button button-secondary">
                            <Pencil className="w-4 h-4" />
                            Edit Build
                        </Link>

                        <CarDeleteButton carID={car.id} />
                    </div>
                )}
            </div>

            <div className="grid grid-cols-[6fr_4fr] gap-8 items-start">
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <div className="title-secondary">Photos</div>

                        {isOwner && <PhotoCreateButton carID={car.id} />}
                    </div>

                    <PhotoGallery photos={car.photos} isOwner={isOwner} />
                </div>

                <div>
                    <div className="flex justify-between items-center mb-4">
                        <div className="title-secondary">Mods</div>

                        {isOwner && <ModCreateButton carID={car.id} />}
                    </div>

                    {car.mods.length === 0 ? (
                        <div className="text-secondary">No mods listed yet</div>
                    ) : (
                        <ul className="flex flex-col gap-4">
                            {car.mods.map((mod) => (
                                <ModListItem
                                    key={mod.id}
                                    mod={{ ...mod, cost: mod.cost.toString() }}
                                    isOwner={isOwner}
                                />
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </main>
    );
}
