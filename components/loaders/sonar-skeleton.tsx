"use client";

/**
 * @component SonarSkeleton
 * @description Ping waves radiate outward, illuminating skeleton placeholder areas
 * in sequence. Content fades in when loaded.
 * Principle: radial wave propagation + position-based trigger timing.
 *
 * @example
 * ```tsx
 * import { SonarSkeleton } from '@/components/loaders/sonar-skeleton';
 *
 * <SonarSkeleton
 *   rows={3}
 *   pingColor="#22d3ee"
 *   className="w-80"
 * />
 * ```
 */

import React from "react";
import { motion, useReducedMotion } from "framer-motion";

export interface SonarSkeletonProps {
    /** Number of skeleton rows. Default: 3 */
    rows?: number;
    /** Ping wave color. Default: "#22d3ee" */
    pingColor?: string;
    /** Ping interval in seconds. Default: 2 */
    pingInterval?: number;
    /** Additional class names */
    className?: string;
}

export const SonarSkeleton: React.FC<SonarSkeletonProps> = ({
    rows = 3,
    pingColor = "#22d3ee",
    pingInterval = 2,
    className = "",
}) => {
    const prefersReducedMotion = useReducedMotion();

    const rowConfigs = Array.from({ length: rows }, (_, i) => ({
        widthPercent: i === 0 ? 60 : i === rows - 1 ? 40 : 80 + Math.floor(Math.sin(i) * 15),
        height: i === 0 ? 20 : 14,
    }));

    return (
        <div className={`relative space-y-3 ${className}`} role="status" aria-label="Loading content">
            {/* Sonar ping origin */}
            {!prefersReducedMotion && (
                <motion.div
                    className="absolute -top-2 -left-2 w-4 h-4 rounded-full pointer-events-none z-10"
                    style={{ backgroundColor: pingColor }}
                    animate={{
                        boxShadow: [
                            `0 0 0 0px ${pingColor}40`,
                            `0 0 0 80px ${pingColor}00`,
                        ],
                        opacity: [1, 0],
                    }}
                    transition={{
                        duration: pingInterval,
                        repeat: Infinity,
                        ease: "easeOut",
                    }}
                    aria-hidden="true"
                />
            )}

            {/* Skeleton rows */}
            {rowConfigs.map((config, i) => (
                <motion.div
                    key={i}
                    className="rounded-md"
                    style={{
                        width: `${config.widthPercent}%`,
                        height: config.height,
                        background: `linear-gradient(90deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.06) 50%, rgba(255,255,255,0.03) 100%)`,
                    }}
                    animate={
                        prefersReducedMotion
                            ? { opacity: 0.5 }
                            : {
                                opacity: [0.3, 0.6, 0.3],
                                boxShadow: [
                                    `0 0 0 rgba(${pingColor}, 0)`,
                                    `0 0 8px ${pingColor}30`,
                                    `0 0 0 rgba(${pingColor}, 0)`,
                                ],
                            }
                    }
                    transition={{
                        duration: pingInterval,
                        delay: i * 0.15,
                        repeat: Infinity,
                    }}
                />
            ))}
        </div>
    );
};

export default SonarSkeleton;
