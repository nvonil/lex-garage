"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

const images = [
    { src: "/images/hero-1.jpeg", position: "bottom" },
    { src: "/images/hero-2.jpeg", position: "center" },
    { src: "/images/hero-3.jpeg", position: "bottom" },
];
const SLIDE_DURATION_MS = 5000;

export default function HeroCarousel() {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % images.length);
        }, SLIDE_DURATION_MS);

        return () => clearInterval(timer);
    }, []);

    return (
        <section className="relative h-[600px]">
            <Image
                src={images[current].src}
                alt="LC 500"
                fill
                priority
                className="object-cover"
                style={{ objectPosition: images[current].position }}
            />

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                {images.map((_, index) => (
                    <div key={index} className="w-16 h-1 bg-background-primary/30 rounded-full overflow-hidden">
                        {index === current && (
                            <div
                                key={current}
                                className="h-full origin-left bg-background-primary"
                                style={{ animation: `progress-fill ${SLIDE_DURATION_MS}ms linear forwards` }}
                            />
                        )}
                    </div>
                ))}
            </div>

            <p className="absolute bottom-4 right-4 text-xs text-background-primary/80">
                Photo by Brandon Russell on Unsplash
            </p>
        </section>
    );
}
