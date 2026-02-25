"use client";

/**
 * @component LiquidMercuryText
 * @description Characters flow and merge like liquid mercury, with metaball-style
 * surface tension at connection points using layered blur/contrast.
 * Principle: stacked text layers + blur/contrast blending.
 *
 * @example
 * ```tsx
 * import { LiquidMercuryText } from '@/components/text/liquid-mercury-text';
 *
 * <LiquidMercuryText
 *   text="Mercury"
 *   className="text-6xl font-black"
 * />
 * ```
 */

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { toPositiveNumber } from "@/lib/utils";

export interface LiquidMercuryTextProps {
    /** Text to display */
    text: string;
    /** Metaball blur strength. Default: 8 */
    blurStrength?: number;
    /** Color threshold for metaball effect. Default: 18 */
    threshold?: number;
    /** Stagger delay per character in seconds. Default: 0.06 */
    stagger?: number;
    /** Text color. Default: "#e2e8f0" */
    color?: string;
    /** Additional class names */
    className?: string;
    /** ARIA label override */
    ariaLabel?: string;
}

export const LiquidMercuryText: React.FC<LiquidMercuryTextProps> = ({
    text,
    blurStrength = 8,
    threshold = 18,
    stagger = 0.06,
    color = "#e2e8f0",
    className = "",
    ariaLabel,
}) => {
    const prefersReducedMotion = useReducedMotion();
    const safeBlurStrength = toPositiveNumber(blurStrength, 8, 0);
    const safeThreshold = toPositiveNumber(threshold, 18, 1);
    const safeStagger = toPositiveNumber(stagger, 0.06, 0);
    const chars = text.split("");

    return (
        <span
            className={`inline-block relative ${className}`}
            role="text"
            aria-label={ariaLabel || text}
        >
            {!prefersReducedMotion && (
                <span
                    className="absolute inset-0 inline-flex pointer-events-none"
                    style={{
                        color,
                        opacity: 0.65,
                        filter: `blur(${safeBlurStrength}px) contrast(${safeThreshold * 8}%)`,
                        mixBlendMode: "screen",
                    }}
                    aria-hidden="true"
                >
                    {chars.map((char, i) => (
                        <span key={`blur-${i}`} className="inline-block">
                            {char === " " ? "\u00A0" : char}
                        </span>
                    ))}
                </span>
            )}

            <span className="relative z-10 inline-flex" style={{ color }}>
                {chars.map((char, i) => (
                    <motion.span
                        key={i}
                        className="inline-block"
                        initial={prefersReducedMotion ? {} : { opacity: 0, scaleX: 0.3, scaleY: 1.8 }}
                        animate={{ opacity: 1, scaleX: 1, scaleY: 1 }}
                        transition={{
                            duration: prefersReducedMotion ? 0 : 0.6,
                            delay: prefersReducedMotion ? 0 : i * safeStagger,
                            ease: [0.22, 1, 0.36, 1],
                        }}
                        style={{
                            textShadow: prefersReducedMotion ? undefined : `0 0 ${safeBlurStrength * 1.5}px ${color}80`,
                        }}
                        aria-hidden="true"
                    >
                        {char === " " ? "\u00A0" : char}
                    </motion.span>
                ))}
            </span>
        </span>
    );
};

export default LiquidMercuryText;
