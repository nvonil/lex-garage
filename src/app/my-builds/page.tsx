import Link from "next/link";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";

import GuestPrompt from "@/components/auth/GuestPrompt";
import CarCreateButton from "@/components/cars/CarCreateButton";
import CarThumbnail from "@/components/cars/CarThumbnail";

export default async function MyBuilds() {
    const user = await getCurrentUser();

    if (!user) {
        return <GuestPrompt message="Log in to see your posted builds" />;
    }

    const cars = await prisma.car.findMany({
        where: { userID: user.id },
        orderBy: { datePosted: "desc" },
        include: { photos: true },
    });

    return (
        <main className="flex flex-col gap-6 max-w-6xl w-full mx-auto px-6 py-12">
            <div className="flex justify-between items-center">
                <h1 className="title-primary">My Builds</h1>
                <CarCreateButton />
            </div>

            {cars.length === 0 ? (
                <div className="text-secondary text-center">You have not posted any builds yet</div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {cars.map((car) => (
                        <Link key={car.id} href={`/cars/${car.id}`} className="card-interactive">
                            <CarThumbnail imageURL={car.photos[0]?.imageURL} alt={`${car.model}`} />

                            <div className="flex items-center gap-4">
                                <span className="title-secondary">{car.model}</span>

                                <div className="flex gap-2">
                                    <span className="badge">{car.year}</span>
                                    <span className="badge">{car.color}</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </main>
    );
}
