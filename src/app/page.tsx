import Link from "next/link";

import { prisma } from "@/lib/prisma";
import HeroCarousel from "@/components/HeroCarousel";
import CarThumbnail from "@/components/CarThumbnail";

export default async function Home() {
    const cars = await prisma.car.findMany({
        orderBy: { datePosted: "desc" },
        include: { photos: true },
    });

    return (
        <>
            <HeroCarousel />

            <section className="flex justify-between items-center h-20 px-20 bg-black">
                <span className="text-background-primary text-xl">
                    Document your build. Showcase your mods. Connect with others.
                </span>

                <div className="flex gap-4">
                    <Link
                        href="/my-builds"
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-background-primary text-text-primary hover:scale-102 transition-transform duration-300"
                    >
                        Start Your Build
                    </Link>

                    <Link
                        href="/my-builds"
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-background-primary text-text-primary hover:scale-102 transition-transform duration-300"
                    >
                        Learn More
                    </Link>
                </div>
            </section>

            <main className="flex flex-col gap-12 max-w-7xl w-full mx-auto px-6 py-12">
                <h1 className="text-xl font-bold">Browse Builds</h1>

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
