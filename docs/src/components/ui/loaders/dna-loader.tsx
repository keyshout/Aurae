"use client";

/**
 * @component DnaLoader
 * @description Two helixes intertwine and rotate, color transitions express helix depth.
 * Based on sine wave + 3D perspective simulation.
 *
 * @example
 * ```tsx
 * import { DnaLoader } from '@/components/loaders/dna-loader';
 *
 * <DnaLoader
 *   size={60}
 *   colors={['#8b5cf6', '#06b6d4']}
 *   speed={1}
 * />
 * ```
 */

import React, { useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { toPositiveInt, toPositiveNumber } from "@/lib/utils";

export interface DnaLoaderProps {
    /** Loader size (height). Default: 60 */
    size?: number;
    /** Helix colors [strand1, strand2]. Default: violet/cyan */
    colors?: [string, string];
    /** Animation speed multiplier. Default: 1 */
    speed?: number;
    /** Number of nodes per strand. Default: 10 */
    nodeCount?: number;
    /** Additional class names */
    className?: string;
}

export const DnaLoader: React.FC<DnaLoaderProps> = ({
    size = 60,
    colors = ["#8b5cf6", "#06b6d4"],
    speed = 1,
    nodeCount = 10,
    className = "",
}) => {
    const prefersReducedMotion = useReducedMotion();
    const safeSize = toPositiveNumber(size, 60, 1);
    const safeSpeed = toPositiveNumber(speed, 1, 0.01);
    const safeNodeCount = toPositiveInt(nodeCount, 10, 2);
    const strandColors = colors.length >= 2 ? colors : ["#8b5cf6", "#06b6d4"];
    const width = safeSize * 1.5;
    const height = safeSize;
    const dur = 2 / safeSpeed;
    const amplitude = height * 0.35;

    const nodes = useMemo(
        () =>
            Array.from({ length: safeNodeCount }, (_, i) => {
                const t = i / (safeNodeCount - 1);
                return { t, x: t * width };
            }),
        [safeNodeCount, width]
    );

    return (
        <div
            className={`relative inline-flex items-center justify-center ${className}`}
            style={{ width, height }}
            role="progressbar"
            aria-label="Loading"
        >
            <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
                {nodes.map((node, i) => {
                    const phaseOffset = (i / safeNodeCount) * Math.PI * 2;
                    const y1a = height / 2 + Math.sin(phaseOffset) * amplitude;
                    const y1b = height / 2 + Math.sin(phaseOffset + Math.PI) * amplitude;
                    const y1c = height / 2 + Math.sin(phaseOffset + Math.PI * 2) * amplitude;
                    const y2a = height / 2 + Math.sin(phaseOffset + Math.PI) * amplitude;
                    const y2b = height / 2 + Math.sin(phaseOffset + Math.PI * 2) * amplitude;
                    const y2c = height / 2 + Math.sin(phaseOffset + Math.PI * 3) * amplitude;
                    return (
                        <motion.div
                            key={`rung-${i}`}
                            className="absolute"
                            style={{
                                left: node.x,
                                width: 1,
                                background: "rgba(255,255,255,0.12)",
                                transform: "translateX(-0.5px)",
                            }}
                            animate={prefersReducedMotion ? undefined : {
                                top: [Math.min(y1a, y2a), Math.min(y1b, y2b), Math.min(y1c, y2c)],
                                height: [Math.abs(y1a - y2a), Math.abs(y1b - y2b), Math.abs(y1c - y2c)],
                            }}
                            transition={prefersReducedMotion ? undefined : { duration: dur, repeat: Infinity, ease: "linear" }}
                        />
                    );
                })}

                {nodes.map((node, i) => {
                    const phaseOffset = (i / safeNodeCount) * Math.PI * 2;
                    const yA = Math.sin(phaseOffset) * amplitude;
                    const yB = Math.sin(phaseOffset + Math.PI) * amplitude;
                    return (
                        <motion.div
                            key={`s1-${i}`}
                            className="absolute rounded-full"
                            style={{
                                left: node.x - 3,
                                top: height / 2 - 3,
                                width: 6,
                                height: 6,
                                background: strandColors[0],
                                boxShadow: `0 0 3px ${strandColors[0]}`,
                            }}
                            animate={prefersReducedMotion ? { y: yA, opacity: 0.7 } : {
                                y: [yA, yB, yA],
                                opacity: [Math.sin(phaseOffset) > 0 ? 1 : 0.4, Math.sin(phaseOffset + Math.PI) > 0 ? 1 : 0.4, Math.sin(phaseOffset) > 0 ? 1 : 0.4],
                                scale: [Math.sin(phaseOffset) > 0 ? 1.2 : 0.8, Math.sin(phaseOffset + Math.PI) > 0 ? 1.2 : 0.8, Math.sin(phaseOffset) > 0 ? 1.2 : 0.8],
                            }}
                            transition={prefersReducedMotion ? undefined : { duration: dur, repeat: Infinity, ease: "linear" }}
                        />
                    );
                })}

                {nodes.map((node, i) => {
                    const phaseOffset = (i / safeNodeCount) * Math.PI * 2 + Math.PI;
                    const yA = Math.sin(phaseOffset) * amplitude;
                    const yB = Math.sin(phaseOffset + Math.PI) * amplitude;
                    return (
                        <motion.div
                            key={`s2-${i}`}
                            className="absolute rounded-full"
                            style={{
                                left: node.x - 3,
                                top: height / 2 - 3,
                                width: 6,
                                height: 6,
                                background: strandColors[1],
                                boxShadow: `0 0 3px ${strandColors[1]}`,
                            }}
                            animate={prefersReducedMotion ? { y: yA, opacity: 0.7 } : {
                                y: [yA, yB, yA],
                                opacity: [Math.sin(phaseOffset) > 0 ? 1 : 0.4, Math.sin(phaseOffset + Math.PI) > 0 ? 1 : 0.4, Math.sin(phaseOffset) > 0 ? 1 : 0.4],
                                scale: [Math.sin(phaseOffset) > 0 ? 1.2 : 0.8, Math.sin(phaseOffset + Math.PI) > 0 ? 1.2 : 0.8, Math.sin(phaseOffset) > 0 ? 1.2 : 0.8],
                            }}
                            transition={prefersReducedMotion ? undefined : { duration: dur, repeat: Infinity, ease: "linear" }}
                        />
                    );
                })}
            </div>
        </div>
    );
};

export default DnaLoader;
