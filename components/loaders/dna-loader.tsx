"use client";

/**
 * @component DNALoader
 * @description Two helixes intertwine and rotate, color transitions express helix depth.
 * Based on sine wave + 3D perspective simulation.
 *
 * @example
 * ```tsx
 * import { DNALoader } from '@/components/loaders/dna-loader';
 *
 * <DNALoader
 *   size={60}
 *   colors={['#8b5cf6', '#06b6d4']}
 *   speed={1}
 * />
 * ```
 */

import React, { useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";

export interface DNALoaderProps {
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

export const DNALoader: React.FC<DNALoaderProps> = ({
    size = 60,
    colors = ["#8b5cf6", "#06b6d4"],
    speed = 1,
    nodeCount = 10,
    className = "",
}) => {
    const prefersReducedMotion = useReducedMotion();
    const width = size * 1.5;
    const height = size;
    const dur = 2 / speed;

    const nodes = useMemo(
        () =>
            Array.from({ length: nodeCount }, (_, i) => {
                const t = i / (nodeCount - 1);
                return { t, x: t * width };
            }),
        [nodeCount, width]
    );

    return (
        <div
            className={`relative inline-flex items-center justify-center ${className}`}
            style={{ width, height }}
            role="progressbar"
            aria-label="Loading"
        >
            <svg width={width} height={height} aria-hidden="true">
                {/* Connecting rungs */}
                {nodes.map((node, i) => {
                    const phaseOffset = (i / nodeCount) * Math.PI * 2;
                    return (
                        <motion.line
                            key={`rung-${i}`}
                            x1={node.x}
                            x2={node.x}
                            stroke="rgba(255,255,255,0.1)"
                            strokeWidth={1}
                            animate={{
                                y1: [
                                    height / 2 + Math.sin(phaseOffset) * (height * 0.35),
                                    height / 2 + Math.sin(phaseOffset + Math.PI) * (height * 0.35),
                                    height / 2 + Math.sin(phaseOffset + Math.PI * 2) * (height * 0.35),
                                ],
                                y2: [
                                    height / 2 + Math.sin(phaseOffset + Math.PI) * (height * 0.35),
                                    height / 2 + Math.sin(phaseOffset + Math.PI * 2) * (height * 0.35),
                                    height / 2 + Math.sin(phaseOffset + Math.PI * 3) * (height * 0.35),
                                ],
                            }}
                            transition={{ duration: dur, repeat: Infinity, ease: "linear" }}
                        />
                    );
                })}

                {/* Strand 1 */}
                {nodes.map((node, i) => {
                    const phaseOffset = (i / nodeCount) * Math.PI * 2;
                    return (
                        <motion.circle
                            key={`s1-${i}`}
                            cx={node.x}
                            r={3}
                            fill={colors[0]}
                            animate={{
                                cy: [
                                    height / 2 + Math.sin(phaseOffset) * (height * 0.35),
                                    height / 2 + Math.sin(phaseOffset + Math.PI * 2) * (height * 0.35),
                                ],
                                opacity: [
                                    Math.sin(phaseOffset) > 0 ? 1 : 0.4,
                                    Math.sin(phaseOffset + Math.PI * 2) > 0 ? 1 : 0.4,
                                ],
                                scale: [
                                    Math.sin(phaseOffset) > 0 ? 1.2 : 0.8,
                                    Math.sin(phaseOffset + Math.PI * 2) > 0 ? 1.2 : 0.8,
                                ],
                            }}
                            transition={{ duration: dur, repeat: Infinity, ease: "linear" }}
                            style={{ filter: `drop-shadow(0 0 3px ${colors[0]})` }}
                        />
                    );
                })}

                {/* Strand 2 */}
                {nodes.map((node, i) => {
                    const phaseOffset = (i / nodeCount) * Math.PI * 2 + Math.PI;
                    return (
                        <motion.circle
                            key={`s2-${i}`}
                            cx={node.x}
                            r={3}
                            fill={colors[1]}
                            animate={{
                                cy: [
                                    height / 2 + Math.sin(phaseOffset) * (height * 0.35),
                                    height / 2 + Math.sin(phaseOffset + Math.PI * 2) * (height * 0.35),
                                ],
                                opacity: [
                                    Math.sin(phaseOffset) > 0 ? 1 : 0.4,
                                    Math.sin(phaseOffset + Math.PI * 2) > 0 ? 1 : 0.4,
                                ],
                                scale: [
                                    Math.sin(phaseOffset) > 0 ? 1.2 : 0.8,
                                    Math.sin(phaseOffset + Math.PI * 2) > 0 ? 1.2 : 0.8,
                                ],
                            }}
                            transition={{ duration: dur, repeat: Infinity, ease: "linear" }}
                            style={{ filter: `drop-shadow(0 0 3px ${colors[1]})` }}
                        />
                    );
                })}
            </svg>
        </div>
    );
};

export default DNALoader;
