"use client";

/**
 * @component ThreadWeaveLoader
 * @description Thin lines from diagonal directions weave each other, filling the loading area.
 * Based on diagonal line layers + opacity accumulation.
 *
 * @example
 * ```tsx
 * import { ThreadWeaveLoader } from '@/components/loaders/thread-weave-loader';
 *
 * <ThreadWeaveLoader width={200} height={150} threadColor="#f59e0b" />
 * ```
 */

import React from "react";
import { motion } from "framer-motion";
import { toPositiveInt, toPositiveNumber } from "@/lib/utils";

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
    const safeWidth = toPositiveNumber(width, 200, 1);
    const safeHeight = toPositiveNumber(height, 150, 1);
    const safeSpeed = toPositiveNumber(speed, 1, 0.01);
    const safeThreadCount = toPositiveInt(threadCount, 8, 1);
    const dur = 2 / safeSpeed;

    const toLineStyle = (x1: number, y1: number, x2: number, y2: number) => {
        const dx = x2 - x1;
        const dy = y2 - y1;
        const length = Math.sqrt(dx * dx + dy * dy);
        const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
        return {
            left: x1,
            top: y1,
            width: length,
            transform: `translateY(-0.5px) rotate(${angle}deg)`,
        };
    };

    return (
        <div
            className={`relative overflow-hidden ${className}`}
            style={{ width: safeWidth, height: safeHeight }}
            role="progressbar"
            aria-label="Loading"
        >
            <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
                {Array.from({ length: safeThreadCount }, (_, i) => {
                    const offset = ((i + 1) / (safeThreadCount + 1)) * (safeWidth + safeHeight);
                    const x1 = Math.max(0, offset - safeHeight);
                    const y1 = Math.max(0, safeHeight - offset);
                    const x2 = Math.min(safeWidth, offset);
                    const y2 = Math.min(safeHeight, offset);
                    const lineStyle = toLineStyle(x1, y1, x2, y2);
                    return (
                        <motion.div
                            key={`fwd-${i}`}
                            className="absolute h-px origin-left"
                            style={{
                                ...lineStyle,
                                background: threadColor,
                            }}
                            initial={{ scaleX: 0, opacity: 0 }}
                            animate={{
                                scaleX: [0, 1],
                                opacity: [0, 0.5, 0.3],
                            }}
                            transition={{
                                duration: dur,
                                delay: i * 0.12 / safeSpeed,
                                repeat: Infinity,
                                repeatDelay: 0.5,
                            }}
                        />
                    );
                })}

                {Array.from({ length: safeThreadCount }, (_, i) => {
                    const offset = ((i + 1) / (safeThreadCount + 1)) * (safeWidth + safeHeight);
                    const x1 = safeWidth - Math.max(0, offset - safeHeight);
                    const y1 = Math.max(0, safeHeight - offset);
                    const x2 = safeWidth - Math.min(safeWidth, offset);
                    const y2 = Math.min(safeHeight, offset);
                    const lineStyle = toLineStyle(x1, y1, x2, y2);
                    return (
                        <motion.div
                            key={`bwd-${i}`}
                            className="absolute h-px origin-left"
                            style={{
                                ...lineStyle,
                                background: threadColor,
                            }}
                            initial={{ scaleX: 0, opacity: 0 }}
                            animate={{
                                scaleX: [0, 1],
                                opacity: [0, 0.4, 0.25],
                            }}
                            transition={{
                                duration: dur,
                                delay: (safeThreadCount + i) * 0.1 / safeSpeed,
                                repeat: Infinity,
                                repeatDelay: 0.5,
                            }}
                        />
                    );
                })}

                {Array.from({ length: 4 }, (_, i) => (
                    <motion.div
                        key={`glow-${i}`}
                        className="absolute rounded-full"
                        style={{
                            left: safeWidth * (0.25 + (i % 2) * 0.5) - 2,
                            top: safeHeight * (0.25 + Math.floor(i / 2) * 0.5) - 2,
                            width: 4,
                            height: 4,
                            background: threadColor,
                            boxShadow: `0 0 4px ${threadColor}`,
                        }}
                        animate={{
                            opacity: [0, 0.8, 0],
                            scale: [0.5, 1.5, 0.5],
                        }}
                        transition={{
                            duration: 1.5 / safeSpeed,
                            delay: i * 0.3,
                            repeat: Infinity,
                        }}
                    />
                ))}
            </div>
        </div>
    );
};

export default ThreadWeaveLoader;
