"use client";

/**
 * @component FluidFillLoader
 * @description An empty container gradually fills with liquid. The liquid surface
 * has realistic wave ripples using SVG path animation.
 * Principle: SVG wave path + fill level animation.
 *
 * @example
 * ```tsx
 * import { FluidFillLoader } from '@/components/loaders/fluid-fill-loader';
 *
 * <FluidFillLoader progress={0.65} color="#8b5cf6" className="w-20 h-20" />
 * ```
 */

import React, { useId } from "react";
import { motion, useReducedMotion } from "framer-motion";

export interface FluidFillLoaderProps {
    /** Fill progress (0-1). Default: auto-animating */
    progress?: number;
    /** Fluid color. Default: "#8b5cf6" */
    color?: string;
    /** Wave amplitude. Default: 4 */
    waveAmplitude?: number;
    /** Wave speed in seconds. Default: 2 */
    waveSpeed?: number;
    /** Additional class names */
    className?: string;
}

export const FluidFillLoader: React.FC<FluidFillLoaderProps> = ({
    progress,
    color = "#8b5cf6",
    waveAmplitude = 4,
    waveSpeed = 2,
    className = "",
}) => {
    const prefersReducedMotion = useReducedMotion();
    const clipId = useId();
    const isAutoProgress = progress === undefined;

    // Auto progress animates 0→100→0 loop
    const fillPercent = progress !== undefined ? Math.min(1, Math.max(0, progress)) * 100 : 50;

    return (
        <div
            className={`relative inline-flex items-center justify-center overflow-hidden rounded-xl bg-gray-800/50 border border-gray-700/30 ${className}`}
            role="status"
            aria-label={`Loading ${Math.round(fillPercent)}%`}
        >
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <defs>
                    <clipPath id={clipId}>
                        <rect x="0" y="0" width="100" height="100" rx="4" />
                    </clipPath>
                </defs>

                <g clipPath={`url(#${clipId})`}>
                    {/* Fluid fill */}
                    <motion.rect
                        x="0"
                        width="100"
                        height="100"
                        fill={color}
                        fillOpacity={0.3}
                        animate={
                            isAutoProgress
                                ? { y: [90, 10, 90] }
                                : { y: 100 - fillPercent }
                        }
                        transition={
                            isAutoProgress
                                ? { duration: 4, repeat: Infinity, ease: "easeInOut" }
                                : { duration: 0.5, ease: "easeOut" }
                        }
                    />

                    {/* Wave surface */}
                    {!prefersReducedMotion && (
                        <motion.path
                            d={`M0,${100 - fillPercent} Q25,${100 - fillPercent - waveAmplitude} 50,${100 - fillPercent} T100,${100 - fillPercent} V100 H0 Z`}
                            fill={color}
                            fillOpacity={0.15}
                            animate={
                                isAutoProgress
                                    ? {
                                        d: [
                                            `M0,70 Q25,${70 - waveAmplitude} 50,70 T100,70 V100 H0 Z`,
                                            `M0,30 Q25,${30 + waveAmplitude} 50,30 T100,30 V100 H0 Z`,
                                            `M0,70 Q25,${70 - waveAmplitude} 50,70 T100,70 V100 H0 Z`,
                                        ],
                                    }
                                    : {
                                        d: [
                                            `M0,${100 - fillPercent} Q25,${100 - fillPercent - waveAmplitude} 50,${100 - fillPercent} T100,${100 - fillPercent} V100 H0 Z`,
                                            `M0,${100 - fillPercent} Q25,${100 - fillPercent + waveAmplitude} 50,${100 - fillPercent} T100,${100 - fillPercent} V100 H0 Z`,
                                        ],
                                    }
                            }
                            transition={{
                                duration: isAutoProgress ? 4 : waveSpeed,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                        />
                    )}
                </g>
            </svg>

            {/* Percentage text */}
            <span
                className="relative z-10 text-xs font-mono font-bold"
                style={{ color }}
            >
                {Math.round(fillPercent)}%
            </span>
        </div>
    );
};

export default FluidFillLoader;
