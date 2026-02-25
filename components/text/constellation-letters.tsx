"use client";

/**
 * @component ConstellationLetters
 * @description Letters appear as scattered star dots, then connect with lines to form words.
 * Lines fade away in the final phase, leaving clear text.
 * Based on dot positioning + sequential line drawing animation.
 *
 * @example
 * ```tsx
 * import { ConstellationLetters } from '@/components/text/constellation-letters';
 *
 * <ConstellationLetters
 *   text="Starmap"
 *   dotColor="#facc15"
 *   lineColor="#facc15"
 *   className="text-5xl font-bold"
 * />
 * ```
 */

import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { toPositiveNumber } from "../../lib/utils";

export interface ConstellationLettersProps {
    /** Text to display */
    text: string;
    /** Duration of total animation in seconds. Default: 3 */
    duration?: number;
    /** Color of star dots. Default: "#facc15" */
    dotColor?: string;
    /** Color of connecting lines. Default: "#facc1580" */
    lineColor?: string;
    /** Size of star dots in pixels. Default: 4 */
    dotSize?: number;
    /** Scatter radius for initial positions. Default: 60 */
    scatterRadius?: number;
    /** Trigger: mount or inView. Default: "mount" */
    triggerOn?: "mount" | "inView";
    /** Additional class names */
    className?: string;
    /** ARIA label override */
    ariaLabel?: string;
}

export const ConstellationLetters: React.FC<ConstellationLettersProps> = ({
    text,
    duration = 3,
    dotColor = "#facc15",
    lineColor = "#facc1580",
    dotSize = 4,
    scatterRadius = 60,
    triggerOn = "mount",
    className = "",
    ariaLabel,
}) => {
    const prefersReducedMotion = useReducedMotion();
    const safeDuration = toPositiveNumber(duration, 3, 0.01);
    const safeDotSize = toPositiveNumber(dotSize, 4, 1);
    const safeScatterRadius = toPositiveNumber(scatterRadius, 60, 0);
    const containerRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(containerRef, { once: true, amount: 0.5 });
    const [phase, setPhase] = useState<"stars" | "connecting" | "text">("stars");

    const shouldAnimate = triggerOn === "mount" || isInView;

    // Generate random star positions for each letter
    const starOffsets = useMemo(
        () =>
            text.split("").map(() => ({
                x: (Math.random() - 0.5) * safeScatterRadius * 2,
                y: (Math.random() - 0.5) * safeScatterRadius * 2,
            })),
        [text, safeScatterRadius]
    );

    useEffect(() => {
        if (!shouldAnimate) return;
        if (prefersReducedMotion) {
            setPhase("text");
            return;
        }

        const t1 = setTimeout(() => setPhase("connecting"), safeDuration * 300);
        const t2 = setTimeout(() => setPhase("text"), safeDuration * 700);

        return () => {
            clearTimeout(t1);
            clearTimeout(t2);
        };
    }, [shouldAnimate, safeDuration, prefersReducedMotion]);

    return (
        <div
            ref={containerRef}
            className={`relative inline-block ${className}`}
            role="text"
            aria-label={ariaLabel || text}
        >
            {/* Connecting lines */}
            {phase === "connecting" && (
                <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
                    {text.split("").map((_, i) => {
                        if (i >= text.length - 1) return null;
                        const charWidth = 100 / text.length;
                        const x1 = charWidth * (i + 0.5);
                        const x2 = charWidth * (i + 1.5);
                        const widthPct = Math.max(0, x2 - x1);
                        return (
                            <motion.div
                                key={`line-${i}`}
                                className="absolute top-1/2 h-px origin-left"
                                style={{
                                    left: `${x1}%`,
                                    width: `${widthPct}%`,
                                    background: lineColor,
                                }}
                                initial={{ scaleX: 0, opacity: 0 }}
                                animate={{ scaleX: 1, opacity: [0, 0.8, 0.8, 0] }}
                                transition={{
                                    duration: safeDuration * 0.3,
                                    delay: i * 0.05,
                                    ease: "easeInOut",
                                }}
                            />
                        );
                    })}
                </div>
            )}

            {/* Characters */}
            <span className="relative inline-flex">
                {text.split("").map((char, i) => {
                    const offset = starOffsets[i];
                    const isStarPhase = phase === "stars";
                    const isTextPhase = phase === "text";

                    return (
                        <motion.span
                            key={i}
                            className="inline-block relative"
                            animate={{
                                x: isStarPhase ? offset.x : 0,
                                y: isStarPhase ? offset.y : 0,
                                opacity: 1,
                                scale: isStarPhase ? 0.3 : 1,
                            }}
                            transition={{
                                type: "spring",
                                stiffness: 120,
                                damping: 14,
                                delay: i * 0.04,
                            }}
                            aria-hidden="true"
                        >
                            {/* Star dot overlay */}
                            {!isTextPhase && (
                                <motion.span
                                    className="absolute inset-0 flex items-center justify-center pointer-events-none"
                                    animate={{
                                        opacity: isTextPhase ? 0 : [0.6, 1, 0.6],
                                        scale: isStarPhase ? [1, 1.3, 1] : 1,
                                    }}
                                    transition={{
                                        duration: 1.5,
                                        repeat: isStarPhase ? Infinity : 0,
                                        delay: i * 0.1,
                                    }}
                                >
                                    <span
                                        className="rounded-full"
                                        style={{
                                            width: safeDotSize,
                                            height: safeDotSize,
                                            background: dotColor,
                                            boxShadow: `0 0 ${safeDotSize * 2}px ${dotColor}`,
                                        }}
                                    />
                                </motion.span>
                            )}

                            {/* Actual character */}
                            <motion.span
                                animate={{
                                    opacity: isTextPhase ? 1 : isStarPhase ? 0 : 0.5,
                                    filter: isTextPhase
                                        ? "blur(0px)"
                                        : `blur(${isStarPhase ? 8 : 2}px)`,
                                }}
                                transition={{ duration: safeDuration * 0.2 }}
                            >
                                {char === " " ? "\u00A0" : char}
                            </motion.span>
                        </motion.span>
                    );
                })}
            </span>
        </div>
    );
};

export default ConstellationLetters;
