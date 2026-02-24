"use client";

/**
 * @component LiquidBorderCard
 * @description Card with an organically flowing, animated color border that moves
 * like liquid along the edges.
 * Based on SVG animated border + blur + color transition.
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

import React, { useId } from "react";
import { motion, useReducedMotion } from "framer-motion";

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
    const id = useId();
    const gradientId = `liquid-border-${id}`;
    const dur = 6 / speed;

    return (
        <div
            className={`relative ${className}`}
            style={{ borderRadius }}
            role="article"
        >
            {/* Animated border SVG */}
            <svg
                className="absolute inset-0 w-full h-full pointer-events-none"
                style={{ borderRadius, overflow: "visible" }}
                aria-hidden="true"
            >
                <defs>
                    <linearGradient id={gradientId} gradientUnits="userSpaceOnUse">
                        {colors.map((color, i) => (
                            <stop
                                key={i}
                                offset={`${(i / (colors.length - 1)) * 100}%`}
                                stopColor={color}
                            />
                        ))}
                        <animateTransform
                            attributeName="gradientTransform"
                            type="rotate"
                            from="0 0.5 0.5"
                            to="360 0.5 0.5"
                            dur={`${dur}s`}
                            repeatCount="indefinite"
                        />
                    </linearGradient>

                    <filter id={`glow-${id}`}>
                        <feGaussianBlur stdDeviation={glowBlur / 2} result="blur" />
                        <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                <rect
                    x={borderWidth / 2}
                    y={borderWidth / 2}
                    width={`calc(100% - ${borderWidth}px)`}
                    height={`calc(100% - ${borderWidth}px)`}
                    rx={borderRadius}
                    ry={borderRadius}
                    fill="none"
                    stroke={`url(#${gradientId})`}
                    strokeWidth={borderWidth}
                    filter={`url(#glow-${id})`}
                />
            </svg>

            {/* Conic gradient border using CSS */}
            <motion.div
                className="absolute inset-0 pointer-events-none"
                style={{
                    borderRadius,
                    padding: borderWidth,
                    background: `conic-gradient(from 0deg, ${colors.join(", ")}, ${colors[0]})`,
                    WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                    WebkitMaskComposite: "xor",
                    maskComposite: "exclude",
                }}
                animate={{ rotate: 360 }}
                transition={{ duration: dur, repeat: Infinity, ease: "linear" }}
                aria-hidden="true"
            />

            {/* Glow layer */}
            <motion.div
                className="absolute inset-0 pointer-events-none"
                style={{
                    borderRadius,
                    padding: borderWidth,
                    background: `conic-gradient(from 180deg, ${colors.join(", ")}, ${colors[0]})`,
                    WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                    WebkitMaskComposite: "xor",
                    maskComposite: "exclude",
                    filter: `blur(${glowBlur}px)`,
                    opacity: 0.5,
                }}
                animate={{ rotate: 360 }}
                transition={{ duration: dur, repeat: Infinity, ease: "linear" }}
                aria-hidden="true"
            />

            {/* Content area */}
            <div
                className="relative z-10 bg-gray-900 dark:bg-gray-950 h-full p-6"
                style={{
                    borderRadius: borderRadius - borderWidth,
                    margin: borderWidth,
                }}
            >
                {children}
            </div>
        </div>
    );
};

export default LiquidBorderCard;
