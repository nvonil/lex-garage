import Link from "next/link";

import { prisma } from "@/lib/prisma";

import HeroCarousel from "@/components/home/HeroCarousel";
import CarBrowseGrid from "@/components/cars/CarBrowseGrid";

export default async function Home() {
    const cars = await prisma.car.findMany({
        orderBy: { datePosted: "desc" },
        include: { user: true, mods: true, photos: true },
    });

    const carsWithStringCost = cars.map((car) => ({
        ...car,
        mods: car.mods.map((mod) => ({ ...mod, cost: mod.cost.toString() })),
    }));

    return (
        <main>
            <HeroCarousel />

            <section className="flex justify-between items-center h-20 px-24 bg-charcoal">
                <div className="text-xl text-pearl">Post your build. Track every mod. Connect with owners.</div>

                <Link href="/my-builds" className="button button-secondary">
                    Start Your Build
                </Link>
            </section>

            <section className="flex flex-col gap-6 max-w-6xl w-full mx-auto py-12">
                <h1 className="title-primary">Browse Builds</h1>

                {cars.length === 0 ? (
                    <div className="text-secondary text-center">No builds posted yet</div>
                ) : (
                    <CarBrowseGrid cars={carsWithStringCost} />
                )}
            </section>
        </main>
    );
}
