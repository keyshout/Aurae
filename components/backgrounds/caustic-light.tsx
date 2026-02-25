"use client";

/**
 * @component CausticLight
 * @description Underwater light refraction patterns — organic, shimmering pools of light
 * using layered gradients and blur fields.
 * Principle: multi-layer radial/repeating gradients with drift animation.
 *
 * @example
 * ```tsx
 * import { CausticLight } from '@/components/backgrounds/caustic-light';
 *
 * <CausticLight color="#06b6d4" intensity={0.6} className="w-full h-64" />
 * ```
 */

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { toPositiveNumber } from "../../lib/utils";

export interface CausticLightProps {
    /** Light color. Default: "#06b6d4" */
    color?: string;
    /** Light intensity (0-1). Default: 0.5 */
    intensity?: number;
    /** Animation speed. Default: 1 */
    speed?: number;
    /** Additional class names */
    className?: string;
}

export const CausticLight: React.FC<CausticLightProps> = ({
    color = "#06b6d4",
    intensity = 0.5,
    speed = 1,
    className = "",
}) => {
    const prefersReducedMotion = useReducedMotion();
    const safeSpeed = toPositiveNumber(speed, 1, 0.01);
    const safeIntensity = Math.max(0, Math.min(1, intensity));

    return (
        <div className={`relative overflow-hidden ${className}`} role="presentation" aria-hidden="true">
            <div
                className="absolute inset-0"
                style={{
                    background: `radial-gradient(circle at 50% 50%, ${color}${Math.round(safeIntensity * 255).toString(16).padStart(2, "0")} 0%, transparent 70%)`,
                }}
            />

            <motion.div
                className="absolute -inset-[12%]"
                style={{
                    opacity: safeIntensity * 0.8,
                    background: `
                        repeating-radial-gradient(
                            circle at 30% 40%,
                            ${color}55 0 10px,
                            transparent 12px 28px
                        ),
                        repeating-radial-gradient(
                            circle at 70% 60%,
                            ${color}44 0 8px,
                            transparent 10px 24px
                        )
                    `,
                    filter: "blur(10px)",
                    mixBlendMode: "screen",
                }}
                animate={
                    prefersReducedMotion
                        ? undefined
                        : {
                            backgroundPosition: ["0% 0%, 0% 0%", "20% -10%, -15% 20%", "0% 0%, 0% 0%"],
                            x: ["-4%", "2%", "-4%"],
                            y: ["-2%", "3%", "-2%"],
                        }
                }
                transition={
                    prefersReducedMotion
                        ? undefined
                        : {
                            duration: 18 / safeSpeed,
                            repeat: Infinity,
                            ease: "linear",
                        }
                }
            />

            <motion.div
                className="absolute -inset-[8%]"
                style={{
                    opacity: safeIntensity * 0.55,
                    background: `
                        radial-gradient(circle at 40% 35%, ${color}66 0%, transparent 55%),
                        radial-gradient(circle at 65% 65%, ${color}50 0%, transparent 60%)
                    `,
                    filter: "blur(18px)",
                    mixBlendMode: "screen",
                }}
                animate={
                    prefersReducedMotion
                        ? undefined
                        : {
                            x: ["-2%", "5%", "-2%"],
                            y: ["0%", "-4%", "0%"],
                            scale: [1, 1.08, 1],
                        }
                }
                transition={
                    prefersReducedMotion
                        ? undefined
                        : {
                            duration: 22 / safeSpeed,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }
                }
            />
        </div>
    );
};

export default CausticLight;
