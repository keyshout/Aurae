"use client";

/**
 * @component SilkAurora
 * @description Silky, organic, slowly moving color waves. Not static blur but
 * flowing and breathing fabric-like gradients.
 * Based on multi-layer color animation + blur blending.
 *
 * @example
 * ```tsx
 * import { SilkAurora } from '@/components/backgrounds/silk-aurora';
 *
 * <SilkAurora
 *   colors={['#7c3aed', '#2dd4bf', '#f43f5e']}
 *   speed={0.8}
 *   className="absolute inset-0 -z-10"
 * />
 * ```
 */

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { toPositiveNumber } from "../../lib/utils";

export interface SilkAuroraProps {
    /** Array of gradient colors (2–5 recommended). Default: purple/teal/rose */
    colors?: string[];
    /** Animation speed multiplier. Default: 1 */
    speed?: number;
    /** Blur intensity in pixels. Default: 80 */
    blur?: number;
    /** Overall opacity. Default: 0.6 */
    opacity?: number;
    /** Additional class names */
    className?: string;
}

export const SilkAurora: React.FC<SilkAuroraProps> = ({
    colors = ["#7c3aed", "#2dd4bf", "#f43f5e", "#facc15"],
    speed = 1,
    blur = 80,
    opacity = 0.6,
    className = "",
}) => {
    const prefersReducedMotion = useReducedMotion();
    const safeSpeed = toPositiveNumber(speed, 1, 0.01);
    const safeColors = colors.length >= 2 ? colors : ["#7c3aed", "#2dd4bf"];

    return (
        <div
            className={`overflow-hidden ${className}`}
            role="presentation"
            aria-hidden="true"
            style={{ opacity }}
        >
            {/* Aurora layers */}
            <div
                className="absolute inset-0"
                style={{
                    filter: `blur(${blur}px)`,
                }}
            >
                {safeColors.map((color, i) => {
                    const angle = (360 / safeColors.length) * i;
                    const duration = (18 + i * 4) / safeSpeed;
                    const size = 60 + i * 10;

                    return (
                        <motion.div
                            key={i}
                            className="absolute rounded-full"
                            style={{
                                width: `${size}%`,
                                height: `${size}%`,
                                background: `radial-gradient(ellipse at center, ${color}90 0%, ${color}20 50%, transparent 70%)`,
                                top: `${20 + Math.sin(angle * (Math.PI / 180)) * 30}%`,
                                left: `${20 + Math.cos(angle * (Math.PI / 180)) * 30}%`,
                            }}
                            animate={{
                                x: prefersReducedMotion ? 0 : [0, 50 * Math.cos(angle), -30 * Math.sin(angle), 0],
                                y: prefersReducedMotion ? 0 : [0, -40 * Math.sin(angle), 50 * Math.cos(angle), 0],
                                scale: prefersReducedMotion ? 1 : [1, 1.2, 0.9, 1],
                                rotate: prefersReducedMotion ? 0 : [0, 120, 240, 360],
                            }}
                            transition={{
                                duration,
                                repeat: prefersReducedMotion ? 0 : Infinity,
                                ease: "easeInOut",
                            }}
                        />
                    );
                })}
            </div>

            {/* Breathing overlay */}
            <motion.div
                className="absolute inset-0"
                style={{
                    background:
                        "radial-gradient(ellipse at 40% 50%, transparent 30%, rgba(0,0,0,0.3) 100%)",
                }}
                animate={{
                    opacity: prefersReducedMotion ? 0.3 : [0.3, 0.5, 0.3],
                }}
                transition={{
                    duration: 8 / safeSpeed,
                    repeat: prefersReducedMotion ? 0 : Infinity,
                    ease: "easeInOut",
                }}
            />
        </div>
    );
};

export default SilkAurora;
