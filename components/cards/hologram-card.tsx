"use client";

/**
 * @component HologramCard
 * @description Holographic foil simulation that shifts colors based on viewing angle.
 * Mouse movement changes the light refraction pattern.
 * Based on mouse angle → hue-rotate + conic gradient overlay.
 *
 * @example
 * ```tsx
 * import { HologramCard } from '@/components/cards/hologram-card';
 *
 * <HologramCard className="w-80">
 *   <h3>Holographic</h3>
 *   <p>Tilt to see the rainbow</p>
 * </HologramCard>
 * ```
 */

import React, { useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";

export interface HologramCardProps {
    /** Card children */
    children: React.ReactNode;
    /** Hologram intensity (0–1). Default: 0.6 */
    intensity?: number;
    /** Rainbow spectrum saturation. Default: 80 */
    saturation?: number;
    /** Additional class names */
    className?: string;
}

export const HologramCard: React.FC<HologramCardProps> = ({
    children,
    intensity = 0.6,
    saturation = 80,
    className = "",
}) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const [pointer, setPointer] = useState({ x: 50, y: 50 });
    const [isHovered, setIsHovered] = useState(false);

    const handlePointerMove = useCallback((e: React.PointerEvent) => {
        const el = cardRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        setPointer({
            x: ((e.clientX - rect.left) / rect.width) * 100,
            y: ((e.clientY - rect.top) / rect.height) * 100,
        });
    }, []);

    const hueAngle = ((pointer.x + pointer.y) / 200) * 360;
    const tiltX = -(pointer.y - 50) * 0.15;
    const tiltY = (pointer.x - 50) * 0.15;

    return (
        <motion.div
            ref={cardRef}
            className={`relative overflow-hidden rounded-2xl ${className}`}
            style={{ perspective: 800 }}
            onPointerMove={handlePointerMove}
            onPointerEnter={() => setIsHovered(true)}
            onPointerLeave={() => setIsHovered(false)}
            animate={{
                rotateX: isHovered ? tiltX : 0,
                rotateY: isHovered ? tiltY : 0,
            }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            role="article"
        >
            {/* Base content */}
            <div className="relative z-10 p-6 bg-gradient-to-br from-gray-800 to-gray-900 dark:from-gray-800 dark:to-gray-950 h-full">
                {children}
            </div>

            {/* Holographic rainbow overlay */}
            <motion.div
                className="absolute inset-0 pointer-events-none z-20"
                style={{
                    background: `conic-gradient(
            from ${hueAngle}deg at ${pointer.x}% ${pointer.y}%,
            hsl(0, ${saturation}%, 60%),
            hsl(60, ${saturation}%, 60%),
            hsl(120, ${saturation}%, 60%),
            hsl(180, ${saturation}%, 60%),
            hsl(240, ${saturation}%, 60%),
            hsl(300, ${saturation}%, 60%),
            hsl(360, ${saturation}%, 60%)
          )`,
                    mixBlendMode: "overlay",
                }}
                animate={{ opacity: isHovered ? intensity : 0 }}
                transition={{ duration: 0.3 }}
                aria-hidden="true"
            />

            {/* Specular light stripe */}
            <motion.div
                className="absolute inset-0 pointer-events-none z-20"
                style={{
                    background: `linear-gradient(
            ${90 + (pointer.x - 50) * 2}deg,
            transparent 30%,
            rgba(255,255,255,0.15) 45%,
            rgba(255,255,255,0.25) 50%,
            rgba(255,255,255,0.15) 55%,
            transparent 70%
          )`,
                }}
                animate={{
                    opacity: isHovered ? 1 : 0,
                    x: isHovered ? (pointer.x - 50) * 0.5 : 0,
                }}
                transition={{ duration: 0.1 }}
                aria-hidden="true"
            />

            {/* Micro-pattern overlay (dot grid) */}
            <div
                className="absolute inset-0 pointer-events-none z-20"
                style={{
                    backgroundImage:
                        "radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)",
                    backgroundSize: "4px 4px",
                    opacity: isHovered ? 0.8 : 0.3,
                }}
                aria-hidden="true"
            />
        </motion.div>
    );
};

export default HologramCard;

