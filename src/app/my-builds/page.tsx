import Link from "next/link";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import GuestPrompt from "@/components/auth/GuestPrompt";
import CarThumbnail from "@/components/cars/CarThumbnail";

import { Plus } from "lucide-react";

export default async function MyBuildsPage() {
    const user = await getCurrentUser();

    if (!user) {
        return <GuestPrompt message="Log in to see your posted builds." />;
    }

    const cars = await prisma.car.findMany({
        where: { userID: user.id },
        orderBy: { datePosted: "desc" },
        include: { photos: true },
    });

    return (
        <main className="flex flex-col gap-12 max-w-7xl w-full mx-auto px-6 py-12">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-xl font-bold">My Builds</h1>
                    <p className="text-text-secondary">A list of your posted vehicles</p>
                </div>

                <Link
                    href="/cars/new"
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent uppercase text-background-primary text-sm font-semibold cursor-pointer hover:scale-102 transition-transform duration-300"
                >
                    <Plus className="w-4 h-4" />
                    Post a Build
                </Link>
            </div>

            {cars.length === 0 ? (
                <p className="text-text-secondary text-center">You have not posted any builds yet</p>
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
    );
}
