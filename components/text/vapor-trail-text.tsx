"use client";

/**
 * @component VaporTrailText
 * @description Letters leave short-lived vapor trails as they appear,
 * simulating heat-distortion condensation behind moving characters.
 * Principle: trail opacity decay + gaussian blur dissipation.
 *
 * @example
 * ```tsx
 * import { VaporTrailText } from '@/components/text/vapor-trail-text';
 *
 * <VaporTrailText
 *   text="Vanishing"
 *   trailLength={4}
 *   className="text-5xl font-black text-white"
 * />
 * ```
 */

import React, { useState, useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";

export interface VaporTrailTextProps {
    /** Text to display */
    text: string;
    /** Trail length (number of fading copies). Default: 3 */
    trailLength?: number;
    /** Time between each character reveal in ms. Default: 60 */
    charDelay?: number;
    /** Trail fade duration in ms. Default: 800 */
    trailDuration?: number;
    /** Blur amount for trails in px. Default: 4 */
    trailBlur?: number;
    /** Additional class names */
    className?: string;
    /** ARIA label override */
    ariaLabel?: string;
}

export const VaporTrailText: React.FC<VaporTrailTextProps> = ({
    text,
    trailLength = 3,
    charDelay = 60,
    trailDuration = 800,
    trailBlur = 4,
    className = "",
    ariaLabel,
}) => {
    const prefersReducedMotion = useReducedMotion();
    const [revealedCount, setRevealedCount] = useState(0);
    const timerRef = useRef<ReturnType<typeof setTimeout>>();

    useEffect(() => {
        if (prefersReducedMotion) {
            setRevealedCount(text.length);
            return;
        }
        setRevealedCount(0);
        let i = 0;
        const tick = () => {
            i++;
            setRevealedCount(i);
            if (i < text.length) {
                timerRef.current = setTimeout(tick, charDelay);
            }
        };
        timerRef.current = setTimeout(tick, charDelay);
        return () => clearTimeout(timerRef.current);
    }, [text, charDelay, prefersReducedMotion]);

    return (
        <span
            className={`inline-block ${className}`}
            role="text"
            aria-label={ariaLabel || text}
        >
            {text.split("").map((char, i) => {
                const isRevealed = i < revealedCount;
                const distFromEdge = revealedCount - i;

                return (
                    <span key={i} className="relative inline-block" aria-hidden="true">
                        {/* Vapor trails */}
                        {isRevealed && distFromEdge <= trailLength && distFromEdge > 0 && !prefersReducedMotion && (
                            <motion.span
                                className="absolute inset-0 pointer-events-none"
                                initial={{ opacity: 0.6, y: -2, filter: `blur(${trailBlur}px)` }}
                                animate={{ opacity: 0, y: -8, filter: `blur(${trailBlur * 2}px)` }}
                                transition={{ duration: trailDuration / 1000, ease: "easeOut" }}
                                style={{ color: "inherit" }}
                            >
                                {char === " " ? "\u00A0" : char}
                            </motion.span>
                        )}

                        {/* Main character */}
                        <motion.span
                            className="relative"
                            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 6 }}
                            animate={isRevealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                        >
                            {char === " " ? "\u00A0" : char}
                        </motion.span>
                    </span>
                );
            })}
        </span>
    );
};

export default VaporTrailText;
