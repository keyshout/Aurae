"use client";

/**
 * @component DepthOfFieldText
 * @description Front characters are in focus, back ones have cinematic blur.
 * Scroll shifts the focal plane across the text.
 * Principle: z-index based blur scaling + scroll parallax focal plane.
 *
 * @example
 * ```tsx
 * import { DepthOfFieldText } from '@/components/text/depth-of-field-text';
 *
 * <DepthOfFieldText
 *   text="Cinematic"
 *   focalPoint={0.5}
 *   className="text-6xl font-black text-white"
 * />
 * ```
 */

import React, { useState, useCallback } from "react";
import { motion, useReducedMotion } from "framer-motion";

export interface DepthOfFieldTextProps {
    /** Text to display */
    text: string;
    /** Focal point position (0=left, 1=right). Default: 0.5 */
    focalPoint?: number;
    /** Maximum blur in px for out-of-focus characters. Default: 4 */
    maxBlur?: number;
    /** Depth of field width (0-1, portion of text in focus). Default: 0.3 */
    fieldWidth?: number;
    /** Track pointer for focal shift. Default: true */
    followPointer?: boolean;
    /** Additional class names */
    className?: string;
    /** ARIA label override */
    ariaLabel?: string;
}

export const DepthOfFieldText: React.FC<DepthOfFieldTextProps> = ({
    text,
    focalPoint = 0.5,
    maxBlur = 4,
    fieldWidth = 0.3,
    followPointer = true,
    className = "",
    ariaLabel,
}) => {
    const prefersReducedMotion = useReducedMotion();
    const [focus, setFocus] = useState(focalPoint);

    const handlePointerMove = useCallback((e: React.PointerEvent<HTMLSpanElement>) => {
        if (!followPointer || prefersReducedMotion) return;
        const rect = e.currentTarget.getBoundingClientRect();
        setFocus((e.clientX - rect.left) / rect.width);
    }, [followPointer, prefersReducedMotion]);

    const handlePointerLeave = useCallback(() => {
        setFocus(focalPoint);
    }, [focalPoint]);

    const chars = text.split("");

    return (
        <span
            className={`inline-flex flex-wrap ${className}`}
            role="text"
            aria-label={ariaLabel || text}
            onPointerMove={handlePointerMove}
            onPointerLeave={handlePointerLeave}
        >
            {chars.map((char, i) => {
                const charPos = chars.length > 1 ? i / (chars.length - 1) : 0.5;
                const distFromFocus = Math.abs(charPos - focus);
                const normalizedDist = Math.max(0, (distFromFocus - fieldWidth / 2) / (0.5 - fieldWidth / 2));
                const blur = prefersReducedMotion ? 0 : Math.min(maxBlur, normalizedDist * maxBlur);
                const opacity = prefersReducedMotion ? 1 : 1 - normalizedDist * 0.3;

                return (
                    <motion.span
                        key={i}
                        className="inline-block"
                        animate={{
                            filter: `blur(${blur}px)`,
                            opacity,
                        }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                        aria-hidden="true"
                    >
                        {char === " " ? "\u00A0" : char}
                    </motion.span>
                );
            })}
        </span>
    );
};

export default DepthOfFieldText;
