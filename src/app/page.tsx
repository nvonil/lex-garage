import Link from "next/link";
import Image from "next/image";

import { prisma } from "@/lib/prisma";
import CarThumbnail from "@/components/CarThumbnail";

export default async function Home() {
    const cars = await prisma.car.findMany({
        orderBy: { datePosted: "desc" },
        include: { photos: true },
    });

    return (
        <>
            <section className="relative h-[625px]">
                <Image
                    src="/images/lexgarage-hero.jpg"
                    alt="Lexus LC parked at a roadside stand"
                    fill
                    priority
                    className="object-cover object-bottom -scale-x-100"
                />
            </section>

            <main className="flex flex-col gap-12 max-w-7xl w-full mx-auto px-6 py-12">
                <div>
                    <h1 className="text-xl font-bold">Browse Builds</h1>
                    <p className="text-text-secondary">Collection of posted builds</p>
                </div>

                {cars.length === 0 ? (
                    <p className="text-text-secondary text-center">No builds posted yet</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {cars.map((car) => (
                            <Link
                                key={car.id}
                                href={`/cars/${car.id}`}
                                className="flex flex-col gap-4 border rounded-lg p-4 hover:scale-102 transition-transform duration-300"
                            >
                                <CarThumbnail imageURL={car.photos[0]?.imageURL} alt={`${car.model} Photo`} />

                                <div className="flex items-center gap-4 ">
                                    <span className="text-lg font-semibold">{car.model}</span>
                                    <div className="flex gap-2 ">
                                        <span className="px-2 py-1 border border-accent rounded-xl text-text-secondary text-sm">
                                            {car.year}
                                        </span>
                                        <span className="px-2 py-1 border border-accent rounded-xl text-text-secondary text-sm">
                                            {car.color}
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </main>
        </>
    );
}
