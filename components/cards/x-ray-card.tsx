"use client";

/**
 * @component XRayCard
 * @description On hover, the card surface becomes transparent, revealing content layers
 * at different z-depths that parallax move.
 * Based on clip-path mask + two-layer parallax transition.
 *
 * @example
 * ```tsx
 * import { XRayCard } from '@/components/cards/x-ray-card';
 *
 * <XRayCard
 *   frontContent={<div className="p-6"><h3>Surface</h3></div>}
 *   backContent={<div className="p-6 text-green-400 font-mono"><p>Hidden Data Layer</p></div>}
 *   className="w-80 h-48"
 * />
 * ```
 */

import React, { useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";

export interface XRayCardProps {
    /** Front (visible) content */
    frontContent: React.ReactNode;
    /** Back (hidden) content revealed on hover */
    backContent: React.ReactNode;
    /** Reveal radius in pixels. Default: 120 */
    revealRadius?: number;
    /** Parallax intensity. Default: 10 */
    parallaxIntensity?: number;
    /** Additional class names */
    className?: string;
}

export const XRayCard: React.FC<XRayCardProps> = ({
    frontContent,
    backContent,
    revealRadius = 120,
    parallaxIntensity = 10,
    className = "",
}) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const [pointer, setPointer] = useState({ x: 50, y: 50, px: 0, py: 0 });
    const [isHovered, setIsHovered] = useState(false);

    const handlePointerMove = useCallback(
        (e: React.PointerEvent) => {
            const el = cardRef.current;
            if (!el) return;
            const rect = el.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            setPointer({
                x,
                y,
                px: (x - 50) * (parallaxIntensity / 50),
                py: (y - 50) * (parallaxIntensity / 50),
            });
        },
        [parallaxIntensity]
    );

    return (
        <motion.div
            ref={cardRef}
            className={`relative overflow-hidden rounded-2xl cursor-pointer ${className}`}
            onPointerMove={handlePointerMove}
            onPointerEnter={() => setIsHovered(true)}
            onPointerLeave={() => setIsHovered(false)}
            role="article"
        >
            {/* Back layer (X-Ray content) — always present, parallax shifted */}
            <motion.div
                className="absolute inset-0 bg-gray-950 z-0"
                animate={{
                    x: isHovered ? -pointer.px * 1.5 : 0,
                    y: isHovered ? -pointer.py * 1.5 : 0,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
                <div className="absolute inset-0 p-2" style={{ opacity: isHovered ? 1 : 0.3 }}>
                    {backContent}
                </div>
                {/* Scan-line effect */}
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        backgroundImage:
                            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,100,0.03) 2px, rgba(0,255,100,0.03) 4px)",
                    }}
                    aria-hidden="true"
                />
            </motion.div>

            {/* Front layer with circular clip mask */}
            <motion.div
                className="relative z-10 bg-gradient-to-br from-gray-800 to-gray-900 h-full"
                style={{
                    clipPath: isHovered
                        ? `polygon(
                0% 0%, 100% 0%, 100% 100%, 0% 100%,
                0% 0%,
                ${pointer.x - revealRadius / 3}% ${pointer.y - revealRadius / 3}%,
                ${pointer.x - revealRadius / 3}% ${pointer.y + revealRadius / 3}%,
                ${pointer.x + revealRadius / 3}% ${pointer.y + revealRadius / 3}%,
                ${pointer.x + revealRadius / 3}% ${pointer.y - revealRadius / 3}%,
                ${pointer.x - revealRadius / 3}% ${pointer.y - revealRadius / 3}%
              )`
                        : undefined,
                }}
                animate={{
                    x: isHovered ? pointer.px : 0,
                    y: isHovered ? pointer.py : 0,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
                {frontContent}
            </motion.div>

            {/* Reveal ring glow */}
            {isHovered && (
                <div
                    className="absolute pointer-events-none z-20"
                    style={{
                        left: `${pointer.x}%`,
                        top: `${pointer.y}%`,
                        width: revealRadius * 2,
                        height: revealRadius * 2,
                        transform: "translate(-50%, -50%)",
                        borderRadius: "50%",
                        border: "1px solid rgba(0, 255, 100, 0.2)",
                        boxShadow: "0 0 20px rgba(0, 255, 100, 0.1), inset 0 0 20px rgba(0, 255, 100, 0.05)",
                    }}
                    aria-hidden="true"
                />
            )}
        </motion.div>
    );
};

export default XRayCard;

