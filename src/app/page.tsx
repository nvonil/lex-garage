import Link from "next/link";

import { prisma } from "@/lib/prisma";
import HeroCarousel from "@/components/home/HeroCarousel";
import CarBrowseGrid from "@/components/cars/CarBrowseGrid";

export default async function Home() {
    const cars = await prisma.car.findMany({
        orderBy: { datePosted: "desc" },
        include: { photos: true, mods: true, user: true },
    });

    const carsWithStringCost = cars.map((car) => ({
        ...car,
        mods: car.mods.map((mod) => ({ ...mod, cost: mod.cost.toString() })),
    }));

    return (
        <>
            <HeroCarousel />

            <section className="flex justify-between items-center h-20 px-20 bg-text-primary">
                <span className="text-background-primary text-xl">
                    Post your build. Track every mod. Connect with owners.
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
                    <CarBrowseGrid cars={carsWithStringCost} />
                )}
            </main>
        </>
    );
}
