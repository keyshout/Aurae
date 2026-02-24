"use client";

/**
 * @component SignalAcquisitionLoader
 * @description Scanner lines roam over target areas, segments stabilize when "lock" is found.
 * Based on sweep animation + segment stabilization.
 *
 * @example
 * ```tsx
 * import { SignalAcquisitionLoader } from '@/components/loaders/signal-acquisition-loader';
 *
 * <SignalAcquisitionLoader size={80} color="#22d3ee" />
 * ```
 */

import React, { useState, useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";

export interface SignalAcquisitionLoaderProps {
    /** Loader size. Default: 80 */
    size?: number;
    /** Signal color. Default: "#22d3ee" */
    color?: string;
    /** Speed multiplier. Default: 1 */
    speed?: number;
    /** Number of segments. Default: 4 */
    segments?: number;
    /** Additional class names */
    className?: string;
}

export const SignalAcquisitionLoader: React.FC<SignalAcquisitionLoaderProps> = ({
    size = 80,
    color = "#22d3ee",
    speed = 1,
    segments = 4,
    className = "",
}) => {
    const prefersReducedMotion = useReducedMotion();
    const [lockedSegments, setLockedSegments] = useState<number[]>([]);
    const timerRefs = useRef<ReturnType<typeof setTimeout>[]>([]);
    const dur = 3 / speed;

    useEffect(() => {
        // Clear any previous timers
        timerRefs.current.forEach(clearTimeout);
        timerRefs.current = [];

        const addTimer = (cb: () => void, delay: number) => {
            const id = setTimeout(cb, delay);
            timerRefs.current.push(id);
        };

        // Initial lock sequence
        for (let i = 0; i < segments; i++) {
            addTimer(() => {
                setLockedSegments((prev) => [...prev, i]);
            }, dur * 250 * (i + 1));
        }

        // Reset after all segments lock
        addTimer(() => {
            setLockedSegments([]);
        }, dur * 250 * (segments + 1));

        // Repeating cycle
        const interval = setInterval(() => {
            setLockedSegments([]);
            for (let i = 0; i < segments; i++) {
                addTimer(() => {
                    setLockedSegments((prev) => [...prev, i]);
                }, dur * 250 * (i + 1));
            }
        }, dur * 250 * (segments + 2));

        return () => {
            timerRefs.current.forEach(clearTimeout);
            timerRefs.current = [];
            clearInterval(interval);
        };
    }, [dur, segments]);

    const segmentSize = size / segments;

    return (
        <div
            className={`relative ${className}`}
            style={{ width: size, height: size }}
            role="progressbar"
            aria-label="Acquiring signal"
        >
            {/* Target segments */}
            {Array.from({ length: segments }, (_, i) => {
                const isLocked = lockedSegments.includes(i);
                const row = Math.floor(i / 2);
                const col = i % 2;

                return (
                    <motion.div
                        key={i}
                        className="absolute border"
                        style={{
                            width: segmentSize - 4,
                            height: segmentSize - 4,
                            left: col * segmentSize + 2,
                            top: row * segmentSize + 2,
                            borderColor: isLocked ? color : `${color}30`,
                            borderWidth: isLocked ? 2 : 1,
                        }}
                        animate={{
                            opacity: isLocked ? 1 : [0.3, 0.6, 0.3],
                            boxShadow: isLocked ? `0 0 8px ${color}60` : "none",
                        }}
                        transition={{ duration: isLocked ? 0.2 : 1.5, repeat: isLocked ? 0 : Infinity }}
                        aria-hidden="true"
                    >
                        {/* Lock indicator */}
                        {isLocked && (
                            <motion.div
                                className="absolute inset-1 flex items-center justify-center"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                <div
                                    className="w-1.5 h-1.5 rounded-full"
                                    style={{ background: color, boxShadow: `0 0 6px ${color}` }}
                                />
                            </motion.div>
                        )}
                    </motion.div>
                );
            })}

            {/* Sweep scanner line */}
            <motion.div
                className="absolute left-0 right-0 h-0.5"
                style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }}
                animate={{ top: [0, size, 0] }}
                transition={{ duration: dur * 0.5, repeat: Infinity, ease: "linear" }}
                aria-hidden="true"
            />

            {/* Crosshair */}
            <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
                <div
                    className="absolute left-1/2 top-0 bottom-0 w-px"
                    style={{ background: `${color}15` }}
                />
                <div
                    className="absolute top-1/2 left-0 right-0 h-px"
                    style={{ background: `${color}15` }}
                />
            </div>
        </div>
    );
};

export default SignalAcquisitionLoader;
