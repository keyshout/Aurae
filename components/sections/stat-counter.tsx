"use client";

/**
 * @component StatCounter
 * @description Numbers animate from 0 to target using cubic-bezier easing,
 * simulating realistic acceleration. Uses requestAnimationFrame.
 * Principle: cubic-bezier easing + rAF counter.
 *
 * @example
 * ```tsx
 * import { StatCounter } from '@/components/sections/stat-counter';
 *
 * <StatCounter
 *   stats={[
 *     { value: 75, label: "Components", suffix: "+" },
 *     { value: 99.9, label: "Uptime", suffix: "%" },
 *   ]}
 * />
 * ```
 */

import React, { useRef, useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

interface Stat {
    value: number;
    label: string;
    prefix?: string;
    suffix?: string;
    decimals?: number;
}

export interface StatCounterProps {
    /** Stats to display */
    stats: Stat[];
    /** Animation duration in ms. Default: 2000 */
    duration?: number;
    /** Additional class names */
    className?: string;
}

export const StatCounter: React.FC<StatCounterProps> = ({
    stats,
    duration = 2000,
    className = "",
}) => {
    const prefersReducedMotion = useReducedMotion();
    const [displayValues, setDisplayValues] = useState<number[]>(
        stats.map((s) => (prefersReducedMotion ? s.value : 0))
    );
    const rafRef = useRef<number>(0);
    const startTimeRef = useRef<number>(0);

    useEffect(() => {
        if (prefersReducedMotion) {
            setDisplayValues(stats.map((s) => s.value));
            return;
        }

        startTimeRef.current = performance.now();

        const animate = (now: number) => {
            const elapsed = now - startTimeRef.current;
            const progress = Math.min(1, elapsed / duration);

            // Cubic ease-out: deceleration curve
            const eased = 1 - Math.pow(1 - progress, 3);

            setDisplayValues(stats.map((s) => s.value * eased));

            if (progress < 1) {
                rafRef.current = requestAnimationFrame(animate);
            } else {
                setDisplayValues(stats.map((s) => s.value));
            }
        };

        rafRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(rafRef.current);
    }, [stats, duration, prefersReducedMotion]);

    return (
        <section className={`py-20 px-6 ${className}`}>
            <div className="flex flex-wrap justify-center gap-12 max-w-4xl mx-auto">
                {stats.map((stat, i) => (
                    <div key={i} className="text-center">
                        <div className="text-4xl md:text-5xl font-black text-white mb-1 font-mono tabular-nums">
                            {stat.prefix}
                            {(displayValues[i] ?? 0).toFixed(stat.decimals ?? 0)}
                            {stat.suffix}
                        </div>
                        <div className="text-sm text-gray-500 font-medium">{stat.label}</div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default StatCounter;
