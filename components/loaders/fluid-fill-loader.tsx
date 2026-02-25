"use client";

/**
 * @component FluidFillLoader
 * @description An empty container gradually fills with liquid. The liquid surface
 * has wave-like ripples using gradient layers.
 * Principle: layered fill + animated radial wave pattern.
 *
 * @example
 * ```tsx
 * import { FluidFillLoader } from '@/components/loaders/fluid-fill-loader';
 *
 * <FluidFillLoader progress={0.65} color="#8b5cf6" className="w-20 h-20" />
 * ```
 */

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { toPositiveNumber } from "../../lib/utils";

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
    const isAutoProgress = progress === undefined;
    const safeAmplitude = toPositiveNumber(waveAmplitude, 4, 0.1);
    const safeWaveSpeed = toPositiveNumber(waveSpeed, 2, 0.01);

    // Auto progress animates 0→100→0 loop
    const fillPercent = progress !== undefined ? Math.min(1, Math.max(0, progress)) * 100 : 50;

    return (
        <div
            className={`relative inline-flex items-center justify-center overflow-hidden rounded-xl bg-gray-800/50 border border-gray-700/30 ${className}`}
            role="status"
            aria-label={`Loading ${Math.round(fillPercent)}%`}
        >
            <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
                <motion.div
                    className="absolute inset-x-0 bottom-0"
                    style={{
                        background: `linear-gradient(180deg, ${color}40 0%, ${color}80 100%)`,
                    }}
                    animate={
                        isAutoProgress
                            ? { height: ["10%", "90%", "10%"] }
                            : { height: `${fillPercent}%` }
                    }
                    transition={
                        isAutoProgress
                            ? { duration: 4, repeat: Infinity, ease: "easeInOut" }
                            : { duration: 0.5, ease: "easeOut" }
                    }
                />

                {!prefersReducedMotion && (
                    <motion.div
                        className="absolute inset-x-0 rounded-[999px]"
                        style={{
                            height: Math.max(10, safeAmplitude * 4),
                            top: `calc(${100 - fillPercent}% - ${safeAmplitude * 2}px)`,
                            background: `repeating-radial-gradient(circle at 0% 50%, ${color}80 0 6px, transparent 7px 14px)`,
                            filter: `blur(${safeAmplitude * 0.15}px)`,
                        }}
                        animate={isAutoProgress ? { top: ["80%", "20%", "80%"], backgroundPositionX: ["0px", "56px"] } : { y: [-safeAmplitude, safeAmplitude, -safeAmplitude], backgroundPositionX: ["0px", "56px"] }}
                        transition={{
                            duration: isAutoProgress ? 4 : safeWaveSpeed,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    />
                )}
            </div>

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
