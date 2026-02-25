"use client";

/**
 * @component GlitchWeaveText
 * @description Text emerges by weaving vertical and horizontal digital threads,
 * overlapping like fabric before resolving into clear text.
 * Based on SVG line animation + clip-path masking.
 *
 * @example
 * ```tsx
 * import { GlitchWeaveText } from '@/components/text/glitch-weave-text';
 *
 * <GlitchWeaveText
 *   text="Woven Data"
 *   duration={2}
 *   threadColor="#a855f7"
 *   className="text-5xl font-bold"
 * />
 * ```
 */

import React, { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";

export interface GlitchWeaveTextProps {
    /** Text to display */
    text: string;
    /** Total animation duration in seconds. Default: 2 */
    duration?: number;
    /** Thread color. Default: "#a855f7" */
    threadColor?: string;
    /** Number of horizontal threads. Default: 6 */
    horizontalThreads?: number;
    /** Number of vertical threads. Default: 8 */
    verticalThreads?: number;
    /** Trigger: mount or inView. Default: "mount" */
    triggerOn?: "mount" | "inView";
    /** Additional class names */
    className?: string;
    /** ARIA label override */
    ariaLabel?: string;
}

export const GlitchWeaveText: React.FC<GlitchWeaveTextProps> = ({
    text,
    duration = 2,
    threadColor = "#a855f7",
    horizontalThreads = 6,
    verticalThreads = 8,
    triggerOn = "mount",
    className = "",
    ariaLabel,
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(containerRef, { once: true, amount: 0.5 });
    const [phase, setPhase] = useState<"weaving" | "merging" | "done">("weaving");

    const shouldAnimate = triggerOn === "mount" || isInView;

    useEffect(() => {
        if (!shouldAnimate) return;

        const mergeTimer = setTimeout(
            () => setPhase("merging"),
            duration * 600
        );
        const doneTimer = setTimeout(() => setPhase("done"), duration * 1000);

        return () => {
            clearTimeout(mergeTimer);
            clearTimeout(doneTimer);
        };
    }, [shouldAnimate, duration]);

    const hThreads = Array.from({ length: horizontalThreads }, (_, i) => i);
    const vThreads = Array.from({ length: verticalThreads }, (_, i) => i);

    return (
        <div
            ref={containerRef}
            className={`relative inline-block ${className}`}
            role="text"
            aria-label={ariaLabel || text}
        >
            {/* Final clear text */}
            <motion.span
                className="relative z-10"
                animate={{
                    opacity: phase === "done" ? 1 : phase === "merging" ? 0.8 : 0.1,
                    filter: phase === "done" ? "blur(0px)" : `blur(${phase === "merging" ? 1 : 4}px)`,
                }}
                transition={{ duration: duration * 0.4 }}
                aria-hidden="true"
            >
                {text}
            </motion.span>

            {/* Thread overlay */}
            {phase !== "done" && (
                <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
                    {/* Horizontal threads */}
                    {hThreads.map((i) => {
                        const y = ((i + 0.5) / horizontalThreads) * 100;
                        const delay = (i / horizontalThreads) * duration * 0.3;
                        return (
                            <motion.div
                                key={`h-${i}`}
                                className="absolute left-0 right-0"
                                style={{
                                    top: `${y}%`,
                                    height: "2px",
                                    background: `linear-gradient(90deg, transparent, ${threadColor}, transparent)`,
                                }}
                                initial={{ scaleX: 0, originX: i % 2 === 0 ? 0 : 1 }}
                                animate={{
                                    scaleX: phase === "merging" ? 0 : 1,
                                    opacity: phase === "merging" ? 0 : [0, 0.9, 0.7],
                                }}
                                transition={{
                                    duration: duration * 0.4,
                                    delay,
                                    ease: "easeInOut",
                                }}
                            />
                        );
                    })}

                    {/* Vertical threads */}
                    {vThreads.map((i) => {
                        const x = ((i + 0.5) / verticalThreads) * 100;
                        const delay = (i / verticalThreads) * duration * 0.3 + 0.1;
                        return (
                            <motion.div
                                key={`v-${i}`}
                                className="absolute top-0 bottom-0"
                                style={{
                                    left: `${x}%`,
                                    width: "2px",
                                    background: `linear-gradient(180deg, transparent, ${threadColor}, transparent)`,
                                }}
                                initial={{ scaleY: 0, originY: i % 2 === 0 ? 0 : 1 }}
                                animate={{
                                    scaleY: phase === "merging" ? 0 : 1,
                                    opacity: phase === "merging" ? 0 : [0, 0.8, 0.6],
                                }}
                                transition={{
                                    duration: duration * 0.4,
                                    delay,
                                    ease: "easeInOut",
                                }}
                            />
                        );
                    })}

                    {/* Intersection glow points */}
                    {phase === "weaving" &&
                        hThreads.slice(0, 3).map((hi) =>
                            vThreads.slice(0, 4).map((vi) => {
                                const x = ((vi + 0.5) / verticalThreads) * 100;
                                const y = ((hi + 0.5) / horizontalThreads) * 100;
                                return (
                                    <motion.div
                                        key={`g-${hi}-${vi}`}
                                        className="absolute w-1 h-1 rounded-full"
                                        style={{
                                            left: `${x}%`,
                                            top: `${y}%`,
                                            background: threadColor,
                                            boxShadow: `0 0 6px ${threadColor}`,
                                        }}
                                        animate={{ opacity: [0, 1, 0], scale: [0.5, 1.5, 0.5] }}
                                        transition={{
                                            duration: duration * 0.5,
                                            delay: (hi + vi) * 0.05,
                                            repeat: 1,
                                        }}
                                    />
                                );
                            })
                        )}
                </div>
            )}
        </div>
    );
};

export default GlitchWeaveText;

