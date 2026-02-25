"use client";

/**
 * @component GhostLayoutLoader
 * @description A ghost of the real layout appears with microscopic subpixel drift.
 * When content arrives, it snaps into exact alignment.
 * Based on subpixel drift + snap animation.
 *
 * @example
 * ```tsx
 * import { GhostLayoutLoader } from '@/components/loaders/ghost-layout-loader';
 *
 * <GhostLayoutLoader isLoading={true} className="w-80 h-48" />
 * ```
 */

import React from "react";
import { motion } from "framer-motion";
import { toPositiveNumber } from "@/lib/utils";

export interface GhostLayoutLoaderProps {
    /** Active state. Default: true */
    isLoading?: boolean;
    /** Ghost color. Default: "rgba(255,255,255,0.04)" */
    ghostColor?: string;
    /** Drift amount in px. Default: 1.5 */
    driftAmount?: number;
    /** Speed multiplier. Default: 1 */
    speed?: number;
    /** Additional class names */
    className?: string;
}

export const GhostLayoutLoader: React.FC<GhostLayoutLoaderProps> = ({
    isLoading = true,
    ghostColor = "rgba(255,255,255,0.04)",
    driftAmount = 1.5,
    speed = 1,
    className = "",
}) => {
    if (!isLoading) return null;

    const safeSpeed = toPositiveNumber(speed, 1, 0.01);
    const dur = 4 / safeSpeed;

    const blocks = [
        { w: "100%", h: "36px", y: 0 },
        { w: "45%", h: "80px", y: 48 },
        { w: "50%", h: "80px", y: 48, x: "52%" },
        { w: "70%", h: "12px", y: 142 },
        { w: "100%", h: "12px", y: 162 },
        { w: "40%", h: "12px", y: 182 },
    ];

    return (
        <div className={`relative ${className}`} role="progressbar" aria-label="Loading layout">
            {blocks.map((block, i) => (
                <motion.div
                    key={i}
                    className="absolute rounded"
                    style={{
                        width: block.w,
                        height: block.h,
                        top: block.y,
                        left: block.x || 0,
                        background: ghostColor,
                        border: `1px solid rgba(255,255,255,0.03)`,
                    }}
                    animate={{
                        x: [0, driftAmount, -driftAmount * 0.7, driftAmount * 0.3, 0],
                        y: [0, -driftAmount * 0.5, driftAmount * 0.8, -driftAmount * 0.3, 0],
                        opacity: [0.5, 0.7, 0.4, 0.6, 0.5],
                    }}
                    transition={{
                        duration: dur,
                        delay: i * 0.2,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                    aria-hidden="true"
                />
            ))}

            {/* Shimmer sweep */}
            <motion.div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background: "linear-gradient(90deg, transparent 20%, rgba(255,255,255,0.02) 50%, transparent 80%)",
                    backgroundSize: "200% 100%",
                }}
                animate={{ backgroundPosition: ["200% 0%", "-200% 0%"] }}
                transition={{ duration: dur * 0.8, repeat: Infinity, ease: "linear" }}
                aria-hidden="true"
            />
        </div>
    );
};

export default GhostLayoutLoader;

