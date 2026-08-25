import Link from "next/link";
import { prisma } from "@/lib/prisma";
import Image from "next/image";

export default async function Home() {
    const cars = await prisma.car.findMany({
        orderBy: { datePosted: "desc" },
        include: { photos: true },
    });

    return (
        <main className="flex-1 max-w-5xl w-full mx-auto px-6 py-10">
            <h1 className="text-2xl font-bold mb-6">Browse Builds</h1>

            {cars.length === 0 ? (
                <p className="text-zinc-500">No builds posted yet.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {cars.map((car) => (
                        <Link
                            key={car.id}
                            href={`/cars/${car.id}`}
                            className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                            {car.photos[0] ? (
                                <div className="relative aspect-video w-full mb-3">
                                    <Image
                                        src={car.photos[0].imageURL}
                                        alt={`${car.model} photo`}
                                        fill
                                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                                        className="rounded-md object-cover"
                                    />
                                </div>
                            ) : (
                                <div className="rounded-md aspect-video bg-zinc-100 w-full mb-3 flex items-center justify-center text-zinc-400 text-sm">
                                    No photo
                                </div>
                            )}
                            <h2 className="font-semibold text-lg">
                                {car.year} {car.model}
                            </h2>
                            <p className="text-zinc-600">{car.color}</p>
                        </Link>
                    ))}
                </div>
            )}
        </main>
    );
}
