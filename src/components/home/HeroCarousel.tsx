"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

const images = [
    { src: "/images/hero-01.jpeg", position: "bottom" },
    { src: "/images/hero-02.jpeg", position: "center" },
    { src: "/images/hero-03.jpeg", position: "bottom" },
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
        <section className="relative h-150">
            <Image
                src={images[current].src}
                alt="Lexus LC 500"
                fill
                priority
                className="object-cover"
                style={{ objectPosition: images[current].position }}
            />

            <div className="absolute flex gap-2 bottom-6 left-1/2 -translate-x-1/2">
                {images.map((_, index) => (
                    <div key={index} className="w-16 h-1 rounded-lg bg-pearl/30 overflow-hidden">
                        {index === current && (
                            <div
                                key={current}
                                className="h-full origin-left bg-pearl"
                                style={{ animation: `progress-fill ${SLIDE_DURATION_MS}ms linear forwards` }}
                            />
                        )}
                    </div>
                ))}
            </div>

            <div className="absolute bottom-6 right-6 text-xs text-pearl/70">Photo by Brandon Russell on Unsplash</div>
        </section>
    );
}
