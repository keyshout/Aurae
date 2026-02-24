"use client";

/**
 * @component BlueprintExpandCard
 * @description On hover, card adds technical blueprint-style dimension lines,
 * annotations, and measurement indicators that fade in/out.
 * Principle: SVG stroke draw animation + annotation fade.
 *
 * @example
 * ```tsx
 * import { BlueprintExpandCard } from '@/components/cards/blueprint-expand-card';
 *
 * <BlueprintExpandCard annotationColor="#06b6d4" className="w-80 p-6">
 *   <h3>Dimensions</h3>
 * </BlueprintExpandCard>
 * ```
 */

import React, { useState, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";

export interface BlueprintExpandCardProps {
    children: React.ReactNode;
    /** Annotation color. Default: "#06b6d4" */
    annotationColor?: string;
    /** Border radius. Default: 16 */
    borderRadius?: number;
    /** Additional class names */
    className?: string;
}

export const BlueprintExpandCard: React.FC<BlueprintExpandCardProps> = ({
    children,
    annotationColor = "#06b6d4",
    borderRadius = 16,
    className = "",
}) => {
    const prefersReducedMotion = useReducedMotion();
    const [isHovered, setIsHovered] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);

    const show = isHovered && !prefersReducedMotion;

    return (
        <div
            ref={cardRef}
            className={`relative ${className}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            role="article"
        >
            <div
                className="relative bg-gradient-to-br from-gray-800 to-gray-900 overflow-hidden"
                style={{ borderRadius }}
            >
                {children}
            </div>

            {/* Blueprint annotations */}
            <svg
                className="absolute -inset-6 w-[calc(100%+48px)] h-[calc(100%+48px)] pointer-events-none"
                aria-hidden="true"
            >
                {/* Width dimension line — top */}
                <motion.line
                    x1="24" y1="12" x2="calc(100% - 24)" y2="12"
                    stroke={annotationColor}
                    strokeWidth={1}
                    strokeDasharray="4 2"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: show ? 1 : 0, opacity: show ? 0.6 : 0 }}
                    transition={{ duration: 0.4 }}
                />
                {/* Width end caps */}
                <motion.line x1="24" y1="8" x2="24" y2="16" stroke={annotationColor} strokeWidth={1}
                    animate={{ opacity: show ? 0.6 : 0 }} transition={{ duration: 0.3 }} />
                <motion.line x1="calc(100% - 24)" y1="8" x2="calc(100% - 24)" y2="16" stroke={annotationColor} strokeWidth={1}
                    animate={{ opacity: show ? 0.6 : 0 }} transition={{ duration: 0.3 }} />

                {/* Height dimension line — right */}
                <motion.line
                    x1="calc(100% - 12)" y1="24" x2="calc(100% - 12)" y2="calc(100% - 24)"
                    stroke={annotationColor}
                    strokeWidth={1}
                    strokeDasharray="4 2"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: show ? 1 : 0, opacity: show ? 0.6 : 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                />

                {/* Corner brackets */}
                {[
                    "M24,28 L24,24 L28,24",
                    `M${-24},28 L${-24},24 L${-28},24`,
                ].map((d, i) => (
                    <motion.path
                        key={i}
                        d={d}
                        fill="none"
                        stroke={annotationColor}
                        strokeWidth={1}
                        animate={{ opacity: show ? 0.4 : 0 }}
                        transition={{ duration: 0.3, delay: 0.2 }}
                    />
                ))}
            </svg>

            {/* Dimension labels */}
            <motion.div
                className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-mono pointer-events-none"
                style={{ color: annotationColor }}
                animate={{ opacity: show ? 0.7 : 0, y: show ? 0 : 4 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                aria-hidden="true"
            >
                W: 320px
            </motion.div>
            <motion.div
                className="absolute top-1/2 -right-6 -translate-y-1/2 text-[10px] font-mono pointer-events-none"
                style={{ color: annotationColor, writingMode: "vertical-rl" }}
                animate={{ opacity: show ? 0.7 : 0, x: show ? 0 : -4 }}
                transition={{ duration: 0.3, delay: 0.3 }}
                aria-hidden="true"
            >
                H: 200px
            </motion.div>
        </div>
    );
};

export default BlueprintExpandCard;
