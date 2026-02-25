"use client";

/**
 * @component BlueprintLoader
 * @description Before content loads, an engineering wireframe sketch is drawn.
 * When data arrives, real UI settles on top.
 * Based on sequential line draw animation.
 *
 * @example
 * ```tsx
 * import { BlueprintLoader } from '@/components/loaders/blueprint-loader';
 *
 * <BlueprintLoader
 *   isLoading={true}
 *   lineColor="#3b82f6"
 *   width={300}
 *   height={200}
 * />
 * ```
 */

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { toPositiveNumber } from "@/lib/utils";

export interface BlueprintLoaderProps {
    /** Whether the loader is active. Default: true */
    isLoading?: boolean;
    /** Line color. Default: "#3b82f6" */
    lineColor?: string;
    /** Width in pixels. Default: 300 */
    width?: number;
    /** Height in pixels. Default: 200 */
    height?: number;
    /** Animation speed multiplier. Default: 1 */
    speed?: number;
    /** Additional class names */
    className?: string;
}

export const BlueprintLoader: React.FC<BlueprintLoaderProps> = ({
    isLoading = true,
    lineColor = "#3b82f6",
    width = 300,
    height = 200,
    speed = 1,
    className = "",
}) => {
    const prefersReducedMotion = useReducedMotion();
    if (!isLoading) return null;

    const safeWidth = toPositiveNumber(width, 300, 1);
    const safeHeight = toPositiveNumber(height, 200, 1);
    const safeSpeed = toPositiveNumber(speed, 1, 0.01);
    const dur = 1.5 / safeSpeed;
    const stroke = 1.5;

    const lines = [
        { x: 20, y: 20, w: safeWidth - 40, h: stroke },
        { x: 20, y: 50, w: safeWidth - 40, h: stroke },
        { x: 20, y: 20, w: stroke, h: 30 },
        { x: safeWidth - 20, y: 20, w: stroke, h: 30 },
        { x: 20, y: 65, w: safeWidth * 0.6 - 20, h: stroke },
        { x: 20, y: 90, w: safeWidth * 0.6 - 20, h: stroke },
        { x: 20, y: 65, w: stroke, h: 25 },
        { x: safeWidth * 0.6, y: 65, w: stroke, h: 25 },
        { x: safeWidth * 0.65, y: 65, w: safeWidth - 20 - safeWidth * 0.65, h: stroke },
        { x: safeWidth * 0.65, y: 90, w: safeWidth - 20 - safeWidth * 0.65, h: stroke },
        { x: safeWidth * 0.65, y: 65, w: stroke, h: 25 },
        { x: safeWidth - 20, y: 65, w: stroke, h: 25 },
        { x: 20, y: 105, w: safeWidth * 0.7 - 20, h: stroke },
        { x: 20, y: 120, w: safeWidth * 0.5 - 20, h: stroke },
        { x: 20, y: 135, w: safeWidth * 0.8 - 20, h: stroke },
        { x: 20, y: safeHeight - 40, w: safeWidth - 40, h: stroke },
        { x: 20, y: safeHeight - 20, w: safeWidth - 40, h: stroke },
        { x: 20, y: safeHeight - 40, w: stroke, h: 20 },
        { x: safeWidth - 20, y: safeHeight - 40, w: stroke, h: 20 },
        { x: 10, y: 10, w: stroke, h: 5 },
        { x: 10, y: 10, w: 5, h: stroke },
        { x: safeWidth - 10, y: 10, w: stroke, h: 5 },
        { x: safeWidth - 15, y: 10, w: 5, h: stroke },
    ];

    return (
        <div
            className={`relative ${className}`}
            style={{ width: safeWidth, height: safeHeight }}
            role="progressbar"
            aria-label="Loading content"
        >
            {/* Grid background */}
            <div
                className="absolute inset-0 opacity-10"
                style={{
                    backgroundImage: `
            linear-gradient(${lineColor}30 1px, transparent 1px),
            linear-gradient(90deg, ${lineColor}30 1px, transparent 1px)
          `,
                    backgroundSize: "20px 20px",
                }}
                aria-hidden="true"
            />

            <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
                {lines.map((line, i) => {
                    const isHorizontal = line.w >= line.h;
                    return (
                        <motion.div
                            key={i}
                            className="absolute rounded-full"
                            style={{
                                left: line.x,
                                top: line.y,
                                width: Math.max(stroke, line.w),
                                height: Math.max(stroke, line.h),
                                background: lineColor,
                                transformOrigin: isHorizontal ? "left center" : "center top",
                            }}
                            initial={isHorizontal ? { scaleX: 0, opacity: 0 } : { scaleY: 0, opacity: 0 }}
                            animate={isHorizontal ? { scaleX: 1, opacity: 0.6 } : { scaleY: 1, opacity: 0.6 }}
                            transition={{
                                duration: dur,
                                delay: i * 0.08 / safeSpeed,
                                ease: "easeInOut",
                            }}
                        />
                    );
                })}

                <motion.div
                    className="absolute left-0 right-0 h-0.5"
                    style={{
                        background: `linear-gradient(90deg, transparent, ${lineColor}, transparent)`,
                        boxShadow: `0 0 4px ${lineColor}`,
                    }}
                    animate={prefersReducedMotion ? undefined : { top: [0, safeHeight, 0] }}
                    transition={
                        prefersReducedMotion
                            ? undefined
                            : {
                                duration: 3 / safeSpeed,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }
                    }
                />
            </div>
        </div>
    );
};

export default BlueprintLoader;
