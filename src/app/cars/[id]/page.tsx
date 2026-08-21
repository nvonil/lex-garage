import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import AddModForm from "@/components/AddModForm";
import AddPhotoForm from "@/components/AddPhotoForm";
import DeleteCarButton from "@/components/DeleteCarButton";
import Link from "next/link";
import ModItem from "@/components/ModItem";
import PhotoItem from "@/components/PhotoItem";

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
            <h1 className="text-2xl font-bold">
                {car.year} {car.model}
            </h1>
            <p className="text-zinc-600 mb-6">{car.color}</p>

            {car.photos.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
                    {car.photos.map((photo) => (
                        <PhotoItem key={photo.id} photo={photo} isOwner={isOwner} />
                    ))}
                </div>
            )}

            <h2 className="text-lg font-semibold mb-3">Mods</h2>
            {car.mods.length === 0 ? (
                <p className="text-zinc-500">No mods listed yet.</p>
            ) : (
                <ul className="flex flex-col gap-3">
                    {car.mods.map((mod) => (
                        <ModItem key={mod.id} mod={{ ...mod, cost: mod.cost.toString() }} isOwner={isOwner} />
                    ))}
                </ul>
            )}

            {isOwner && (
                <>
                    <Link href={`/cars/${car.id}/edit`} className="underline">
                        Edit Build
                    </Link>
                    <DeleteCarButton carID={car.id} />
                    <AddModForm carID={car.id} /> <AddPhotoForm carID={car.id} />
                </>
            )}
        </main>
    );
}
