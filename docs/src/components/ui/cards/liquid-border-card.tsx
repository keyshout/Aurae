"use client";

/**
 * @component LiquidBorderCard
 * @description Card with an organically flowing, animated color border that moves
 * like liquid along the edges.
 * Based on animated conic border + blur + color transition.
 *
 * @example
 * ```tsx
 * import { LiquidBorderCard } from '@/components/cards/liquid-border-card';
 *
 * <LiquidBorderCard
 *   colors={['#f43f5e', '#8b5cf6', '#06b6d4']}
 *   className="w-80"
 * >
 *   <h3>Liquid Edges</h3>
 * </LiquidBorderCard>
 * ```
 */

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { toPositiveNumber } from "@/lib/utils";

export interface LiquidBorderCardProps {
    /** Card children */
    children: React.ReactNode;
    /** Border gradient colors. Default: rose/violet/cyan */
    colors?: string[];
    /** Border thickness. Default: 2 */
    borderWidth?: number;
    /** Animation speed multiplier. Default: 1 */
    speed?: number;
    /** Glow blur radius. Default: 12 */
    glowBlur?: number;
    /** Border radius. Default: 16 */
    borderRadius?: number;
    /** Additional class names */
    className?: string;
}

export const LiquidBorderCard: React.FC<LiquidBorderCardProps> = ({
    children,
    colors = ["#f43f5e", "#8b5cf6", "#06b6d4"],
    borderWidth = 2,
    speed = 1,
    glowBlur = 12,
    borderRadius = 16,
    className = "",
}) => {
    const prefersReducedMotion = useReducedMotion();
    const safeColors = colors.length >= 2 ? colors : ["#f43f5e", "#8b5cf6"];
    const safeBorderWidth = toPositiveNumber(borderWidth, 2, 0.1);
    const safeSpeed = toPositiveNumber(speed, 1, 0.01);
    const safeGlowBlur = toPositiveNumber(glowBlur, 12, 0.1);
    const safeBorderRadius = toPositiveNumber(borderRadius, 16, 0);
    const dur = 6 / safeSpeed;

    return (
        <div
            className={`relative ${className}`}
            style={{ borderRadius: safeBorderRadius }}
            role="article"
        >
            {/* Conic gradient border using CSS */}
            <motion.div
                className="absolute inset-0 pointer-events-none"
                style={{
                    borderRadius: safeBorderRadius,
                    padding: safeBorderWidth,
                    background: `conic-gradient(from 0deg, ${safeColors.join(", ")}, ${safeColors[0]})`,
                    WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                    WebkitMaskComposite: "xor",
                    maskComposite: "exclude",
                }}
                animate={prefersReducedMotion ? undefined : { rotate: 360 }}
                transition={
                    prefersReducedMotion ? undefined : { duration: dur, repeat: Infinity, ease: "linear" }
                }
                aria-hidden="true"
            />

            {/* Glow layer */}
            <motion.div
                className="absolute inset-0 pointer-events-none"
                style={{
                    borderRadius: safeBorderRadius,
                    padding: safeBorderWidth,
                    background: `conic-gradient(from 180deg, ${safeColors.join(", ")}, ${safeColors[0]})`,
                    WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                    WebkitMaskComposite: "xor",
                    maskComposite: "exclude",
                    filter: `blur(${safeGlowBlur}px)`,
                    opacity: 0.5,
                }}
                animate={prefersReducedMotion ? undefined : { rotate: 360 }}
                transition={
                    prefersReducedMotion ? undefined : { duration: dur, repeat: Infinity, ease: "linear" }
                }
                aria-hidden="true"
            />

            {/* Content area */}
            <div
                className="relative z-10 bg-gray-900 dark:bg-gray-950 h-full p-6"
                style={{
                    borderRadius: Math.max(0, safeBorderRadius - safeBorderWidth),
                    margin: safeBorderWidth,
                }}
            >
                {children}
            </div>
        </div>
    );
};

export default LiquidBorderCard;
