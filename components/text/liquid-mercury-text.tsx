"use client";

/**
 * @component LiquidMercuryText
 * @description Characters flow and merge like liquid mercury, with metaball-style
 * surface tension at connection points using SVG filter effects.
 * Principle: SVG feMerge + feGaussianBlur metaball simulation.
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

import React, { useId } from "react";
import { motion, useReducedMotion } from "framer-motion";

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
    const filterId = useId();

    return (
        <span
            className={`inline-block ${className}`}
            role="text"
            aria-label={ariaLabel || text}
        >
            {/* SVG filter for metaball/liquid merge effect */}
            <svg className="absolute w-0 h-0" aria-hidden="true">
                <defs>
                    <filter id={filterId}>
                        <feGaussianBlur in="SourceGraphic" stdDeviation={blurStrength} result="blur" />
                        <feColorMatrix
                            in="blur"
                            type="matrix"
                            values={`1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 ${threshold} -${threshold - 1}`}
                            result="sharp"
                        />
                        <feComposite in="SourceGraphic" in2="sharp" operator="atop" />
                    </filter>
                </defs>
            </svg>

            <span
                className="inline-flex"
                style={{ filter: prefersReducedMotion ? "none" : `url(#${filterId})`, color }}
            >
                {text.split("").map((char, i) => (
                    <motion.span
                        key={i}
                        className="inline-block"
                        initial={prefersReducedMotion ? {} : { opacity: 0, scaleX: 0.3, scaleY: 1.8 }}
                        animate={{ opacity: 1, scaleX: 1, scaleY: 1 }}
                        transition={{
                            duration: prefersReducedMotion ? 0 : 0.6,
                            delay: prefersReducedMotion ? 0 : i * stagger,
                            ease: [0.22, 1, 0.36, 1],
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
