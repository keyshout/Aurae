"use client";

/**
 * @component LogoCarousel
 * @description Infinite-scroll logo carousel. Hover pauses and magnifies the hovered logo.
 * Principle: CSS marquee animation + hover pause + scale.
 *
 * @example
 * ```tsx
 * import { LogoCarousel } from '@/components/sections/logo-carousel';
 *
 * <LogoCarousel
 *   logos={[
 *     { name: "Vercel", imageUrl: "/logos/vercel.svg" },
 *     { name: "Next.js", imageUrl: "/logos/nextjs.svg" },
 *   ]}
 * />
 * ```
 */

import React, { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

interface Logo {
    name: string;
    /** Image URL, or use emoji/text in `fallback` */
    imageUrl?: string;
    /** Fallback text/emoji if no image */
    fallback?: string;
}

export interface LogoCarouselProps {
    /** Logos to display */
    logos: Logo[];
    /** Scroll speed in seconds for full cycle. Default: 20 */
    speed?: number;
    /** Additional class names */
    className?: string;
}

export const LogoCarousel: React.FC<LogoCarouselProps> = ({
    logos,
    speed = 20,
    className = "",
}) => {
    const prefersReducedMotion = useReducedMotion();
    const [isPaused, setIsPaused] = useState(false);
    const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

    // Duplicate logos for seamless loop
    const displayLogos = [...logos, ...logos];

    return (
        <section className={`py-12 overflow-hidden ${className}`}>
            <motion.div
                className="flex gap-12 items-center"
                animate={
                    prefersReducedMotion
                        ? {}
                        : {
                            x: [`0%`, `-50%`],
                        }
                }
                transition={{
                    x: {
                        duration: speed,
                        repeat: Infinity,
                        ease: "linear",
                        ...(isPaused ? { repeatType: "loop" as const } : {}),
                    },
                }}
                style={isPaused ? { animationPlayState: "paused" } : {}}
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => { setIsPaused(false); setHoveredIdx(null); }}
            >
                {displayLogos.map((logo, i) => (
                    <motion.div
                        key={`${logo.name}-${i}`}
                        className="flex-shrink-0 flex items-center justify-center px-6 cursor-pointer select-none"
                        animate={{
                            scale: hoveredIdx === (i % logos.length) ? 1.2 : 1,
                            opacity: hoveredIdx !== null && hoveredIdx !== (i % logos.length) ? 0.4 : 0.7,
                        }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        onMouseEnter={() => setHoveredIdx(i % logos.length)}
                    >
                        {logo.imageUrl ? (
                            <img
                                src={logo.imageUrl}
                                alt={logo.name}
                                className="h-8 w-auto object-contain grayscale hover:grayscale-0 transition-all"
                            />
                        ) : (
                            <span className="text-2xl font-bold text-gray-500">
                                {logo.fallback || logo.name}
                            </span>
                        )}
                    </motion.div>
                ))}
            </motion.div>
        </section>
    );
};

export default LogoCarousel;
