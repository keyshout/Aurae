"use client";

/**
 * @component BlueprintLoader
 * @description Before content loads, an engineering wireframe sketch is drawn.
 * When data arrives, real UI settles on top.
 * Based on sequential SVG stroke draw animation.
 *
 * @example
 * ```tsx
 * import { BlueprintLoader } from '@/components/loaders/blueprint-loader';
 *
 * <BlueprintLoader
 *   isLoading={true}
 *   lineColor="#3b82f6"
 *   width={300}
 *   height={200}
 * />
 * ```
 */

import React from "react";
import { motion, useReducedMotion } from "framer-motion";

export interface BlueprintLoaderProps {
    /** Whether the loader is active. Default: true */
    isLoading?: boolean;
    /** Line color. Default: "#3b82f6" */
    lineColor?: string;
    /** Width in pixels. Default: 300 */
    width?: number;
    /** Height in pixels. Default: 200 */
    height?: number;
    /** Animation speed multiplier. Default: 1 */
    speed?: number;
    /** Additional class names */
    className?: string;
}

export const BlueprintLoader: React.FC<BlueprintLoaderProps> = ({
    isLoading = true,
    lineColor = "#3b82f6",
    width = 300,
    height = 200,
    speed = 1,
    className = "",
}) => {
    const prefersReducedMotion = useReducedMotion();
    if (!isLoading) return null;

    const dur = 1.5 / speed;

    // Blueprint wireframe paths
    const paths = [
        // Header bar
        `M 20 20 L ${width - 20} 20`,
        `M 20 20 L 20 50 L ${width - 20} 50 L ${width - 20} 20`,
        // Content blocks
        `M 20 65 L ${width * 0.6} 65 L ${width * 0.6} 90 L 20 90 Z`,
        `M ${width * 0.65} 65 L ${width - 20} 65 L ${width - 20} 90 L ${width * 0.65} 90 Z`,
        // Text lines
        `M 20 105 L ${width * 0.7} 105`,
        `M 20 120 L ${width * 0.5} 120`,
        `M 20 135 L ${width * 0.8} 135`,
        // Bottom bar
        `M 20 ${height - 40} L ${width - 20} ${height - 40} L ${width - 20} ${height - 20} L 20 ${height - 20} Z`,
        // Grid reference marks
        `M 10 10 L 10 15`, `M 10 10 L 15 10`,
        `M ${width - 10} 10 L ${width - 10} 15`, `M ${width - 10} 10 L ${width - 15} 10`,
    ];

    return (
        <div
            className={`relative ${className}`}
            style={{ width, height }}
            role="progressbar"
            aria-label="Loading content"
        >
            {/* Grid background */}
            <div
                className="absolute inset-0 opacity-10"
                style={{
                    backgroundImage: `
            linear-gradient(${lineColor}30 1px, transparent 1px),
            linear-gradient(90deg, ${lineColor}30 1px, transparent 1px)
          `,
                    backgroundSize: "20px 20px",
                }}
                aria-hidden="true"
            />

            <svg
                className="absolute inset-0"
                width={width}
                height={height}
                aria-hidden="true"
            >
                {paths.map((d, i) => (
                    <motion.path
                        key={i}
                        d={d}
                        fill="none"
                        stroke={lineColor}
                        strokeWidth={1.5}
                        strokeLinecap="round"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 0.6 }}
                        transition={{
                            pathLength: {
                                duration: dur,
                                delay: i * 0.15 / speed,
                                ease: "easeInOut",
                            },
                            opacity: { duration: 0.3, delay: i * 0.15 / speed },
                        }}
                    />
                ))}

                {/* Scanning line */}
                <motion.line
                    x1={0}
                    y1={0}
                    x2={width}
                    y2={0}
                    stroke={lineColor}
                    strokeWidth={2}
                    strokeOpacity={0.3}
                    animate={{ y1: [0, height, 0], y2: [0, height, 0] }}
                    transition={{
                        duration: 3 / speed,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                    style={{ filter: `drop-shadow(0 0 4px ${lineColor})` }}
                />
            </svg>
        </div>
    );
};

export default BlueprintLoader;
