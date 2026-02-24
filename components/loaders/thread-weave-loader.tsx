"use client";

/**
 * @component ThreadWeaveLoader
 * @description Thin lines from diagonal directions weave each other, filling the loading area.
 * Based on diagonal SVG line animation + opacity accumulation.
 *
 * @example
 * ```tsx
 * import { ThreadWeaveLoader } from '@/components/loaders/thread-weave-loader';
 *
 * <ThreadWeaveLoader width={200} height={150} threadColor="#f59e0b" />
 * ```
 */

import React from "react";
import { motion, useReducedMotion } from "framer-motion";

export interface ThreadWeaveLoaderProps {
    /** Width. Default: 200 */
    width?: number;
    /** Height. Default: 150 */
    height?: number;
    /** Thread color. Default: "#f59e0b" */
    threadColor?: string;
    /** Thread count per direction. Default: 8 */
    threadCount?: number;
    /** Speed multiplier. Default: 1 */
    speed?: number;
    /** Additional class names */
    className?: string;
}

export const ThreadWeaveLoader: React.FC<ThreadWeaveLoaderProps> = ({
    width = 200,
    height = 150,
    threadColor = "#f59e0b",
    threadCount = 8,
    speed = 1,
    className = "",
}) => {
    const prefersReducedMotion = useReducedMotion();
    const dur = 2 / speed;

    return (
        <div
            className={`relative overflow-hidden ${className}`}
            style={{ width, height }}
            role="progressbar"
            aria-label="Loading"
        >
            <svg
                width={width}
                height={height}
                className="absolute inset-0"
                aria-hidden="true"
            >
                {/* Forward diagonal threads (top-left to bottom-right) */}
                {Array.from({ length: threadCount }, (_, i) => {
                    const offset = ((i + 1) / (threadCount + 1)) * (width + height);
                    return (
                        <motion.line
                            key={`fwd-${i}`}
                            x1={Math.max(0, offset - height)}
                            y1={Math.max(0, height - offset)}
                            x2={Math.min(width, offset)}
                            y2={Math.min(height, offset)}
                            stroke={threadColor}
                            strokeWidth={1}
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{
                                pathLength: [0, 1],
                                opacity: [0, 0.5, 0.3],
                            }}
                            transition={{
                                duration: dur,
                                delay: i * 0.12 / speed,
                                repeat: Infinity,
                                repeatDelay: 0.5,
                            }}
                        />
                    );
                })}

                {/* Backward diagonal threads (top-right to bottom-left) */}
                {Array.from({ length: threadCount }, (_, i) => {
                    const offset = ((i + 1) / (threadCount + 1)) * (width + height);
                    return (
                        <motion.line
                            key={`bwd-${i}`}
                            x1={width - Math.max(0, offset - height)}
                            y1={Math.max(0, height - offset)}
                            x2={width - Math.min(width, offset)}
                            y2={Math.min(height, offset)}
                            stroke={threadColor}
                            strokeWidth={1}
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{
                                pathLength: [0, 1],
                                opacity: [0, 0.4, 0.25],
                            }}
                            transition={{
                                duration: dur,
                                delay: (threadCount + i) * 0.1 / speed,
                                repeat: Infinity,
                                repeatDelay: 0.5,
                            }}
                        />
                    );
                })}

                {/* Intersection glow dots */}
                {Array.from({ length: 4 }, (_, i) => (
                    <motion.circle
                        key={`glow-${i}`}
                        cx={width * (0.25 + (i % 2) * 0.5)}
                        cy={height * (0.25 + Math.floor(i / 2) * 0.5)}
                        r={2}
                        fill={threadColor}
                        animate={{
                            opacity: [0, 0.8, 0],
                            scale: [0.5, 1.5, 0.5],
                        }}
                        transition={{
                            duration: 1.5 / speed,
                            delay: i * 0.3,
                            repeat: Infinity,
                        }}
                        style={{ filter: `drop-shadow(0 0 4px ${threadColor})` }}
                    />
                ))}
            </svg>
        </div>
    );
};

export default ThreadWeaveLoader;
