"use client";

/**
 * @component PeelCard
 * @description Card peels from a corner to reveal alternate content underneath.
 * Uses CSS 3D perspective to simulate paper peeling.
 * Principle: CSS perspective + rotateY peel animation + shadow mapping.
 *
 * @example
 * ```tsx
 * import { PeelCard } from '@/components/cards/peel-card';
 *
 * <PeelCard
 *   front={<div className="p-6"><h3>Front</h3></div>}
 *   back={<div className="p-6"><h3>Hidden!</h3></div>}
 *   className="w-80 h-48"
 * />
 * ```
 */

import React, { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

export interface PeelCardProps {
    /** Front face content */
    front: React.ReactNode;
    /** Back face content revealed on peel */
    back: React.ReactNode;
    /** Peel corner. Default: "top-right" */
    corner?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
    /** Border radius. Default: 16 */
    borderRadius?: number;
    /** Additional class names */
    className?: string;
}

export const PeelCard: React.FC<PeelCardProps> = ({
    front,
    back,
    corner = "top-right",
    borderRadius = 16,
    className = "",
}) => {
    const prefersReducedMotion = useReducedMotion();
    const [isPeeled, setIsPeeled] = useState(false);

    const originMap = {
        "top-right": "top right",
        "top-left": "top left",
        "bottom-right": "bottom right",
        "bottom-left": "bottom left",
    };

    return (
        <div
            className={`relative ${className}`}
            style={{ perspective: 800, borderRadius }}
            onMouseEnter={() => setIsPeeled(true)}
            onMouseLeave={() => setIsPeeled(false)}
            role="article"
        >
            {/* Back face */}
            <div
                className="absolute inset-0 overflow-hidden bg-gradient-to-br from-gray-700 to-gray-800"
                style={{ borderRadius }}
            >
                {back}
            </div>

            {/* Front face (peels away) */}
            <motion.div
                className="relative overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900"
                style={{
                    borderRadius,
                    transformOrigin: originMap[corner],
                    transformStyle: "preserve-3d",
                    backfaceVisibility: "hidden",
                }}
                animate={{
                    rotateY: isPeeled && !prefersReducedMotion
                        ? (corner.includes("right") ? -45 : 45)
                        : 0,
                    rotateX: isPeeled && !prefersReducedMotion
                        ? (corner.includes("top") ? 10 : -10)
                        : 0,
                }}
                transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 25,
                    duration: prefersReducedMotion ? 0 : undefined,
                }}
            >
                {front}

                {/* Peel shadow */}
                <motion.div
                    className="absolute inset-0 pointer-events-none"
                    animate={{
                        background: isPeeled && !prefersReducedMotion
                            ? "linear-gradient(135deg, transparent 60%, rgba(0,0,0,0.3) 100%)"
                            : "transparent",
                    }}
                    transition={{ duration: 0.3 }}
                    style={{ borderRadius }}
                    aria-hidden="true"
                />
            </motion.div>
        </div>
    );
};

export default PeelCard;
