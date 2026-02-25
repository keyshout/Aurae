"use client";

/**
 * @component TornEdgeCard
 * @description Card bottom edge has a torn paper appearance.
 * On hover, the torn edge ripples with subtle wave animation.
 * Principle: polygon clip-path noise deformation + hover wave animation.
 *
 * @example
 * ```tsx
 * import { TornEdgeCard } from '@/components/cards/torn-edge-card';
 *
 * <TornEdgeCard tearColor="#1f2937" className="w-80 p-6">
 *   <h3>Torn Paper</h3>
 * </TornEdgeCard>
 * ```
 */

import React, { useState, useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";

export interface TornEdgeCardProps {
    children: React.ReactNode;
    /** Tear depth in px. Default: 12 */
    tearDepth?: number;
    /** Background color matching parent. Default: "transparent" */
    tearColor?: string;
    /** Border radius for top corners. Default: 16 */
    borderRadius?: number;
    /** Additional class names */
    className?: string;
}

export const TornEdgeCard: React.FC<TornEdgeCardProps> = ({
    children,
    tearDepth = 12,
    tearColor = "transparent",
    borderRadius = 16,
    className = "",
}) => {
    const prefersReducedMotion = useReducedMotion();
    const [isHovered, setIsHovered] = useState(false);

    const tearClipPath = useMemo(() => {
        const segments = 40;
        const maxDepthPercent = Math.min(20, Math.max(2, tearDepth));
        const baseY = 100 - maxDepthPercent;
        const points: string[] = [`0% 0%`, `100% 0%`, `100% ${baseY}%`];

        for (let i = segments; i >= 0; i--) {
            const x = (i / segments) * 100;
            const noise = Math.sin(i * 12.9898 + 78.233) * 43758.5453;
            const offset = (noise - Math.floor(noise)) * maxDepthPercent;
            points.push(`${x.toFixed(1)}% ${(baseY + offset).toFixed(1)}%`);
        }

        return `polygon(${points.join(", ")})`;
    }, [tearDepth]);

    return (
        <div
            className={`relative ${className}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            role="article"
        >
            <motion.div
                className="relative bg-gradient-to-br from-gray-800 to-gray-900"
                style={{
                    borderRadius: `${borderRadius}px ${borderRadius}px 0 0`,
                    clipPath: tearClipPath,
                    paddingBottom: tearDepth,
                }}
                animate={
                    isHovered && !prefersReducedMotion
                        ? { y: [0, -1, 0, 1, 0] }
                        : { y: 0 }
                }
                transition={{
                    duration: 0.6,
                    repeat: isHovered ? Infinity : 0,
                    ease: "easeInOut",
                }}
            >
                {children}
            </motion.div>

            {/* Shadow beneath torn edge */}
            <div
                className="absolute bottom-0 left-0 right-0 h-2 pointer-events-none"
                style={{
                    background: `linear-gradient(to bottom, rgba(0,0,0,0.1), ${tearColor})`,
                }}
                aria-hidden="true"
            />
        </div>
    );
};

export default TornEdgeCard;
