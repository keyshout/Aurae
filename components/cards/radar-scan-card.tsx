"use client";

/**
 * @component RadarScanCard
 * @description A rotating radar sweep line scans across the card on hover,
 * highlighting elements as it passes over them.
 * Principle: conic gradient rotation + element highlight on intersect.
 *
 * @example
 * ```tsx
 * import { RadarScanCard } from '@/components/cards/radar-scan-card';
 *
 * <RadarScanCard scanColor="#22d3ee" className="w-80 p-6">
 *   <h3>Scanning...</h3>
 * </RadarScanCard>
 * ```
 */

import React, { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

export interface RadarScanCardProps {
    children: React.ReactNode;
    /** Scan line color. Default: "#22d3ee" */
    scanColor?: string;
    /** Rotation speed in seconds per full revolution. Default: 3 */
    rotationSpeed?: number;
    /** Border radius. Default: 16 */
    borderRadius?: number;
    /** Additional class names */
    className?: string;
}

export const RadarScanCard: React.FC<RadarScanCardProps> = ({
    children,
    scanColor = "#22d3ee",
    rotationSpeed = 3,
    borderRadius = 16,
    className = "",
}) => {
    const prefersReducedMotion = useReducedMotion();
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.div
            className={`relative overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 ${className}`}
            style={{ borderRadius }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            role="article"
        >
            {/* Radar sweep */}
            {isHovered && !prefersReducedMotion && (
                <motion.div
                    className="absolute inset-0 pointer-events-none z-10"
                    style={{
                        borderRadius,
                        background: `conic-gradient(from 0deg at 50% 50%,
                            ${scanColor}20 0deg,
                            ${scanColor}60 5deg,
                            transparent 30deg,
                            transparent 360deg
                        )`,
                    }}
                    animate={{ rotate: 360 }}
                    transition={{
                        duration: rotationSpeed,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                    aria-hidden="true"
                />
            )}

            {/* Radar center ping */}
            {isHovered && !prefersReducedMotion && (
                <motion.div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none z-10"
                    style={{ width: 4, height: 4, backgroundColor: scanColor }}
                    animate={{
                        boxShadow: [
                            `0 0 0 0 ${scanColor}40`,
                            `0 0 0 20px ${scanColor}00`,
                        ],
                    }}
                    transition={{
                        duration: 1.5,
                        repeat: Infinity,
                    }}
                    aria-hidden="true"
                />
            )}

            {/* Concentric radar rings */}
            <motion.div
                className="absolute inset-0 pointer-events-none"
                style={{
                    borderRadius,
                    background: `
                        radial-gradient(circle at 50% 50%, transparent 15%, ${scanColor}08 15.5%, transparent 16%),
                        radial-gradient(circle at 50% 50%, transparent 30%, ${scanColor}06 30.5%, transparent 31%),
                        radial-gradient(circle at 50% 50%, transparent 45%, ${scanColor}04 45.5%, transparent 46%)
                    `,
                }}
                animate={{ opacity: isHovered ? 1 : 0 }}
                transition={{ duration: 0.3 }}
                aria-hidden="true"
            />

            <div className="relative z-20">{children}</div>
        </motion.div>
    );
};

export default RadarScanCard;
