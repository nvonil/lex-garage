import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import GuestPrompt from "@/components/GuestPrompt";

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
        <main className="flex-1 max-w-5xl w-full mx-auto px-6 py-10">
            <h1 className="text-2xl font-bold mb-6">My Builds</h1>

            {cars.length === 0 ? (
                <p className="text-zinc-500">
                    You haven&apos;t posted any builds yet.{" "}
                    <Link href="/cars/new" className="underline">
                        Post one now
                    </Link>
                    .
                </p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {cars.map((car) => (
                        <Link
                            key={car.id}
                            href={`/cars/${car.id}`}
                            className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                            {car.photos[0] ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    src={car.photos[0].imageURL}
                                    alt={`${car.model} photo`}
                                    className="rounded-md aspect-video object-cover w-full mb-3"
                                />
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
