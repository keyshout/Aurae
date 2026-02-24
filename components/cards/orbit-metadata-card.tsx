"use client";

/**
 * @component OrbitMetadataCard
 * @description On hover, metadata chips orbit around the card in circular paths.
 * On exit, chips settle back to card corners.
 * Based on circular path animation + hover trigger.
 *
 * @example
 * ```tsx
 * import { OrbitMetadataCard } from '@/components/cards/orbit-metadata-card';
 *
 * <OrbitMetadataCard
 *   metadata={[
 *     { label: 'React', icon: '⚛' },
 *     { label: 'TypeScript', icon: '📘' },
 *     { label: 'MIT', icon: '📄' },
 *     { label: 'v2.0', icon: '🏷' },
 *   ]}
 *   className="w-80"
 * >
 *   <h3>Component Package</h3>
 * </OrbitMetadataCard>
 * ```
 */

import React, { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

export interface MetadataItem {
    /** Label text */
    label: string;
    /** Optional icon or emoji */
    icon?: string;
    /** Optional custom color */
    color?: string;
}

export interface OrbitMetadataCardProps {
    /** Card children */
    children: React.ReactNode;
    /** Metadata chips to orbit */
    metadata: MetadataItem[];
    /** Orbit radius in pixels. Default: 160 */
    orbitRadius?: number;
    /** Orbit duration in seconds. Default: 8 */
    orbitDuration?: number;
    /** Additional class names */
    className?: string;
}

const CORNER_POSITIONS = [
    { x: -8, y: -8 },
    { x: 8, y: -8 },
    { x: 8, y: 8 },
    { x: -8, y: 8 },
];

export const OrbitMetadataCard: React.FC<OrbitMetadataCardProps> = ({
    children,
    metadata,
    orbitRadius = 160,
    orbitDuration = 8,
    className = "",
}) => {
    const prefersReducedMotion = useReducedMotion();
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            className={`relative ${className}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            role="article"
        >
            {/* Orbit ring visual */}
            <motion.div
                className="absolute pointer-events-none z-0"
                style={{
                    width: orbitRadius * 2,
                    height: orbitRadius * 2,
                    left: "50%",
                    top: "50%",
                    transform: "translate(-50%, -50%)",
                    borderRadius: "50%",
                    border: "1px dashed rgba(255,255,255,0.08)",
                }}
                animate={{ opacity: isHovered ? 0.6 : 0, scale: isHovered ? 1 : 0.8 }}
                transition={{ duration: 0.4 }}
                aria-hidden="true"
            />

            {/* Orbiting chips */}
            {metadata.map((item, i) => {
                const angleOffset = (i / metadata.length) * 360;
                const corner = CORNER_POSITIONS[i % CORNER_POSITIONS.length];

                return (
                    <motion.div
                        key={i}
                        className="absolute z-30 pointer-events-none"
                        style={{
                            left: "50%",
                            top: "50%",
                        }}
                        animate={
                            isHovered
                                ? {
                                    rotate: [angleOffset, angleOffset + 360],
                                    x: "-50%",
                                    y: "-50%",
                                }
                                : {
                                    rotate: 0,
                                    x: corner.x,
                                    y: corner.y,
                                }
                        }
                        transition={
                            isHovered
                                ? {
                                    rotate: {
                                        duration: orbitDuration,
                                        repeat: Infinity,
                                        ease: "linear",
                                    },
                                    x: { duration: 0.4 },
                                    y: { duration: 0.4 },
                                }
                                : {
                                    type: "spring",
                                    stiffness: 150,
                                    damping: 15,
                                }
                        }
                    >
                        <motion.div
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap shadow-lg"
                            style={{
                                transform: isHovered ? `translateX(${orbitRadius}px)` : "none",
                                background: item.color || "rgba(139, 92, 246, 0.2)",
                                color: "rgba(255,255,255,0.9)",
                                border: "1px solid rgba(255,255,255,0.1)",
                                backdropFilter: "blur(8px)",
                            }}
                            animate={{
                                rotate: isHovered ? [-angleOffset, -angleOffset - 360] : 0,
                                scale: isHovered ? 1 : 0.85,
                            }}
                            transition={
                                isHovered
                                    ? {
                                        rotate: {
                                            duration: orbitDuration,
                                            repeat: Infinity,
                                            ease: "linear",
                                        },
                                    }
                                    : { type: "spring", stiffness: 150, damping: 15 }
                            }
                        >
                            {item.icon && <span>{item.icon}</span>}
                            <span>{item.label}</span>
                        </motion.div>
                    </motion.div>
                );
            })}

            {/* Main card */}
            <motion.div
                className="relative z-10 rounded-2xl p-6 bg-gradient-to-br from-gray-800 to-gray-900 dark:from-gray-800 dark:to-gray-950 border border-white/5"
                animate={{
                    scale: isHovered ? 1.02 : 1,
                    boxShadow: isHovered
                        ? "0 20px 40px rgba(0,0,0,0.4)"
                        : "0 4px 12px rgba(0,0,0,0.2)",
                }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
            >
                {children}
            </motion.div>
        </div>
    );
};

export default OrbitMetadataCard;
