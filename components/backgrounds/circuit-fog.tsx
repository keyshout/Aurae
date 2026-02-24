"use client";

/**
 * @component CircuitFog
 * @description Circuit traces with energy dots flowing along them, atmospheric
 * fog blobs appearing and fading in certain areas.
 * Based on SVG stroke-dashoffset + gaussian blur points.
 *
 * @example
 * ```tsx
 * import { CircuitFog } from '@/components/backgrounds/circuit-fog';
 *
 * <CircuitFog
 *   traceColor="#10b981"
 *   fogColor="#10b981"
 *   traceCount={12}
 *   className="absolute inset-0 -z-10"
 * />
 * ```
 */

import React, { useId, useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";

export interface CircuitFogProps {
    /** Trace/line color. Default: "#10b981" */
    traceColor?: string;
    /** Fog blob color. Default: "#10b98140" */
    fogColor?: string;
    /** Number of circuit traces. Default: 12 */
    traceCount?: number;
    /** Number of fog blobs. Default: 6 */
    fogCount?: number;
    /** Speed multiplier. Default: 1 */
    speed?: number;
    /** Additional class names */
    className?: string;
}

interface TracePath {
    d: string;
    length: number;
    duration: number;
    delay: number;
}

interface FogBlob {
    cx: string;
    cy: string;
    r: number;
    duration: number;
    delay: number;
}

function generateTrace(
    index: number,
    total: number,
    width: number,
    height: number
): string {
    const isHorizontal = index % 2 === 0;
    const segments: string[] = [];
    const stepCount = 3 + Math.floor(Math.random() * 4);

    if (isHorizontal) {
        const y = (height / (total / 2 + 1)) * (Math.floor(index / 2) + 1);
        let x = 0;
        segments.push(`M 0 ${y}`);
        for (let s = 0; s < stepCount; s++) {
            x += width / stepCount;
            const jog = (Math.random() - 0.5) * 40;
            segments.push(`L ${x} ${y + jog}`);
            if (Math.random() > 0.5) {
                segments.push(`L ${x} ${y + jog + (Math.random() > 0.5 ? 30 : -30)}`);
                segments.push(`L ${x + 20} ${y + jog + (Math.random() > 0.5 ? 30 : -30)}`);
            }
        }
    } else {
        const x = (width / (total / 2 + 1)) * (Math.floor(index / 2) + 1);
        let y = 0;
        segments.push(`M ${x} 0`);
        for (let s = 0; s < stepCount; s++) {
            y += height / stepCount;
            const jog = (Math.random() - 0.5) * 40;
            segments.push(`L ${x + jog} ${y}`);
        }
    }

    return segments.join(" ");
}

export const CircuitFog: React.FC<CircuitFogProps> = ({
    traceColor = "#10b981",
    fogColor = "#10b98140",
    traceCount = 12,
    fogCount = 6,
    speed = 1,
    className = "",
}) => {
    const prefersReducedMotion = useReducedMotion();
    const id = useId();
    const viewW = 800;
    const viewH = 600;

    const traces: TracePath[] = useMemo(
        () =>
            Array.from({ length: traceCount }, (_, i) => ({
                d: generateTrace(i, traceCount, viewW, viewH),
                length: 600 + Math.random() * 400,
                duration: (4 + Math.random() * 4) / speed,
                delay: Math.random() * 3,
            })),
        [traceCount, speed]
    );

    const fogs: FogBlob[] = useMemo(
        () =>
            Array.from({ length: fogCount }, () => ({
                cx: `${10 + Math.random() * 80}%`,
                cy: `${10 + Math.random() * 80}%`,
                r: 40 + Math.random() * 60,
                duration: (6 + Math.random() * 6) / speed,
                delay: Math.random() * 4,
            })),
        [fogCount, speed]
    );

    return (
        <div className={`relative overflow-hidden ${className}`} role="presentation" aria-hidden="true">
            <svg
                className="absolute inset-0 w-full h-full"
                viewBox={`0 0 ${viewW} ${viewH}`}
                preserveAspectRatio="xMidYMid slice"
            >
                <defs>
                    <filter id={`fog-blur-${id}`}>
                        <feGaussianBlur stdDeviation="20" />
                    </filter>
                </defs>

                {/* Circuit traces (static) */}
                {traces.map((trace, i) => (
                    <path
                        key={`trace-bg-${i}`}
                        d={trace.d}
                        fill="none"
                        stroke={traceColor}
                        strokeWidth={1}
                        strokeOpacity={0.15}
                    />
                ))}

                {/* Energy dots flowing along traces */}
                {traces.map((trace, i) => (
                    <motion.path
                        key={`trace-energy-${i}`}
                        d={trace.d}
                        fill="none"
                        stroke={traceColor}
                        strokeWidth={2}
                        strokeOpacity={0.8}
                        strokeDasharray={`20 ${trace.length}`}
                        initial={{ strokeDashoffset: trace.length }}
                        animate={{ strokeDashoffset: -trace.length }}
                        transition={{
                            duration: trace.duration,
                            delay: trace.delay,
                            repeat: Infinity,
                            ease: "linear",
                        }}
                        style={{
                            filter: `drop-shadow(0 0 4px ${traceColor})`,
                        }}
                    />
                ))}

                {/* Fog blobs */}
                {fogs.map((fog, i) => (
                    <motion.circle
                        key={`fog-${i}`}
                        cx={fog.cx}
                        cy={fog.cy}
                        r={fog.r}
                        fill={fogColor}
                        filter={`url(#fog-blur-${id})`}
                        animate={{
                            opacity: [0, 0.4, 0.2, 0.5, 0],
                            scale: [0.8, 1.1, 0.9, 1.2, 0.8],
                        }}
                        transition={{
                            duration: fog.duration,
                            delay: fog.delay,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    />
                ))}

                {/* Junction nodes (glow points at intersections) */}
                {traces.slice(0, 6).map((_, i) => {
                    const x = 100 + Math.random() * (viewW - 200);
                    const y = 100 + Math.random() * (viewH - 200);
                    return (
                        <motion.circle
                            key={`node-${i}`}
                            cx={x}
                            cy={y}
                            r={3}
                            fill={traceColor}
                            animate={{
                                opacity: [0.2, 0.9, 0.2],
                                r: [2, 4, 2],
                            }}
                            transition={{
                                duration: 2 + Math.random() * 2,
                                delay: Math.random() * 3,
                                repeat: Infinity,
                            }}
                            style={{ filter: `drop-shadow(0 0 6px ${traceColor})` }}
                        />
                    );
                })}
            </svg>
        </div>
    );
};

export default CircuitFog;
