"use client";

/**
 * @component DiffractionCard
 * @description Rainbow diffraction patterns shift with viewing angle,
 * more geometric than hologram — based on interference pattern calculation.
 * Principle: angular-dependent interference colors via conic gradient rotation.
 *
 * @example
 * ```tsx
 * import { DiffractionCard } from '@/components/cards/diffraction-card';
 *
 * <DiffractionCard className="w-80 p-6">
 *   <h3>Diffraction</h3>
 * </DiffractionCard>
 * ```
 */

import React, { useState, useCallback } from "react";
import { motion, useReducedMotion } from "framer-motion";

export interface DiffractionCardProps {
    children: React.ReactNode;
    /** Diffraction intensity (0-1). Default: 0.3 */
    intensity?: number;
    /** Border radius. Default: 16 */
    borderRadius?: number;
    /** Additional class names */
    className?: string;
}

export const DiffractionCard: React.FC<DiffractionCardProps> = ({
    children,
    intensity = 0.3,
    borderRadius = 16,
    className = "",
}) => {
    const prefersReducedMotion = useReducedMotion();
    const [angle, setAngle] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    const handleMove = useCallback((e: React.PointerEvent) => {
        if (prefersReducedMotion) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        setAngle(Math.atan2(y - 0.5, x - 0.5) * (180 / Math.PI));
    }, [prefersReducedMotion]);

    const diffractionGradient = `conic-gradient(from ${angle}deg at 50% 50%,
        rgba(255,0,0,${intensity}) 0deg,
        rgba(255,127,0,${intensity}) 51deg,
        rgba(255,255,0,${intensity}) 102deg,
        rgba(0,255,0,${intensity}) 153deg,
        rgba(0,0,255,${intensity}) 204deg,
        rgba(75,0,130,${intensity}) 255deg,
        rgba(148,0,211,${intensity}) 306deg,
        rgba(255,0,0,${intensity}) 360deg
    )`;

    return (
        <motion.div
            className={`relative overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 ${className}`}
            style={{ borderRadius }}
            onPointerMove={handleMove}
            onPointerEnter={() => setIsHovered(true)}
            onPointerLeave={() => setIsHovered(false)}
            role="article"
        >
            {/* Diffraction overlay */}
            <motion.div
                className="absolute inset-0 pointer-events-none z-10 mix-blend-screen"
                style={{
                    borderRadius,
                    background: diffractionGradient,
                }}
                animate={{ opacity: isHovered && !prefersReducedMotion ? 1 : 0 }}
                transition={{ duration: 0.3 }}
                aria-hidden="true"
            />

            {/* Interference lines */}
            <motion.div
                className="absolute inset-0 pointer-events-none z-10"
                style={{
                    borderRadius,
                    background: `repeating-linear-gradient(
                        ${angle + 90}deg,
                        transparent,
                        transparent 2px,
                        rgba(255,255,255,0.03) 2px,
                        rgba(255,255,255,0.03) 4px
                    )`,
                }}
                animate={{ opacity: isHovered && !prefersReducedMotion ? 1 : 0 }}
                transition={{ duration: 0.3 }}
                aria-hidden="true"
            />

            <div className="relative z-20">{children}</div>
        </motion.div>
    );
};

export default DiffractionCard;
