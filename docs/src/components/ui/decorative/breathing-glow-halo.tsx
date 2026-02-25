"use client";

/**
 * @component BreathingGlowHalo
 * @description Outer and inner halos alternate opacity and scale at different rhythms,
 * creating a premium ambient light effect.
 * Based on dual-layer box-shadow + async animation loops.
 *
 * @example
 * ```tsx
 * import { BreathingGlowHalo } from '@/components/decorative/breathing-glow-halo';
 *
 * <BreathingGlowHalo color="#8b5cf6" size={200}>
 *   <img src="/logo.svg" alt="Logo" className="w-20 h-20" />
 * </BreathingGlowHalo>
 * ```
 */

import React from "react";
import { motion } from "framer-motion";

export interface BreathingGlowHaloProps {
    /** Content to wrap with the halo */
    children: React.ReactNode;
    /** Glow color. Default: "#8b5cf6" */
    color?: string;
    /** Halo diameter in pixels. Default: 200 */
    size?: number;
    /** Outer halo breath duration in seconds. Default: 4 */
    outerDuration?: number;
    /** Inner halo breath duration in seconds. Default: 2.5 */
    innerDuration?: number;
    /** Max outer glow opacity. Default: 0.3 */
    outerOpacity?: number;
    /** Max inner glow opacity. Default: 0.5 */
    innerOpacity?: number;
    /** Additional class names */
    className?: string;
}

export const BreathingGlowHalo: React.FC<BreathingGlowHaloProps> = ({
    children,
    color = "#8b5cf6",
    size = 200,
    outerDuration = 4,
    innerDuration = 2.5,
    outerOpacity = 0.3,
    innerOpacity = 0.5,
    className = "",
}) => {
    return (
        <div
            className={`relative inline-flex items-center justify-center ${className}`}
            style={{ width: size, height: size }}
        >
            {/* Outer halo */}
            <motion.div
                className="absolute inset-0 rounded-full pointer-events-none"
                style={{
                    background: `radial-gradient(circle, ${color}00 40%, ${color}30 60%, ${color}00 80%)`,
                }}
                animate={{
                    opacity: [outerOpacity * 0.3, outerOpacity, outerOpacity * 0.3],
                    scale: [0.9, 1.1, 0.9],
                }}
                transition={{
                    duration: outerDuration,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                aria-hidden="true"
            />

            {/* Inner halo */}
            <motion.div
                className="absolute rounded-full pointer-events-none"
                style={{
                    width: size * 0.65,
                    height: size * 0.65,
                    background: `radial-gradient(circle, ${color}40 0%, ${color}15 50%, ${color}00 70%)`,
                }}
                animate={{
                    opacity: [innerOpacity * 0.5, innerOpacity, innerOpacity * 0.5],
                    scale: [1.05, 0.95, 1.05],
                }}
                transition={{
                    duration: innerDuration,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                aria-hidden="true"
            />

            {/* Soft shadow ring */}
            <motion.div
                className="absolute rounded-full pointer-events-none"
                style={{
                    width: size * 0.8,
                    height: size * 0.8,
                    boxShadow: `0 0 ${size * 0.15}px ${color}20, 0 0 ${size * 0.3}px ${color}10`,
                }}
                animate={{
                    opacity: [0.5, 0.8, 0.5],
                }}
                transition={{
                    duration: (outerDuration + innerDuration) / 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                aria-hidden="true"
            />

            {/* Content */}
            <div className="relative z-10">{children}</div>
        </div>
    );
};

export default BreathingGlowHalo;

