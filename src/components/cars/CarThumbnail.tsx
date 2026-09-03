import Image from "next/image";

export default function CarThumbnail({ imageURL, alt }: { imageURL: string | undefined; alt: string }) {
    return imageURL ? (
        <div className="relative aspect-video w-full">
            <Image
                src={imageURL}
                alt={alt}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                className="object-cover rounded-lg"
            />
        </div>
    ) : (
        <div className="aspect-video w-full flex justify-center items-center rounded-lg bg-mist text-secondary">
            No Photo
        </div>
    );
}
