"use client";

/**
 * @component LivingDivider
 * @description A divider line where segments thicken/thin with scroll or hover,
 * emitting a brief pulse at section transitions.
 * Based on segment-based stroke-width animation.
 *
 * @example
 * ```tsx
 * import { LivingDivider } from '@/components/decorative/living-divider';
 *
 * <LivingDivider
 *   segmentCount={20}
 *   color="#8b5cf6"
 *   className="w-full my-8"
 * />
 * ```
 */

import React, { useRef, useState, useCallback } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { toPositiveInt, toPositiveNumber } from "@/lib/utils";

export interface LivingDividerProps {
    /** Number of segments. Default: 20 */
    segmentCount?: number;
    /** Line color. Default: "#8b5cf6" */
    color?: string;
    /** Base thickness. Default: 1 */
    baseWidth?: number;
    /** Max thickness on hover. Default: 4 */
    maxWidth?: number;
    /** Trigger: hover or inView. Default: "hover" */
    triggerOn?: "hover" | "inView";
    /** Orientation. Default: "horizontal" */
    orientation?: "horizontal" | "vertical";
    /** Additional class names */
    className?: string;
}

export const LivingDivider: React.FC<LivingDividerProps> = ({
    segmentCount = 20,
    color = "#8b5cf6",
    baseWidth = 1,
    maxWidth = 4,
    triggerOn = "hover",
    orientation = "horizontal",
    className = "",
}) => {
    const prefersReducedMotion = useReducedMotion();
    const safeSegmentCount = toPositiveInt(segmentCount, 20, 1);
    const safeBaseWidth = toPositiveNumber(baseWidth, 1, 0.5);
    const safeMaxWidth = Math.max(safeBaseWidth, toPositiveNumber(maxWidth, 4, safeBaseWidth));
    const containerRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(containerRef, { amount: 0.5 });
    const [pointer, setPointer] = useState({ x: -1, y: -1 });
    const [isHovered, setIsHovered] = useState(false);

    const isActive = triggerOn === "hover" ? isHovered : isInView;

    const handlePointerMove = useCallback((e: React.PointerEvent) => {
        const rect = containerRef.current?.getBoundingClientRect();
        if (!rect) return;
        setPointer({
            x: ((e.clientX - rect.left) / rect.width) * 100,
            y: ((e.clientY - rect.top) / rect.height) * 100,
        });
    }, []);

    const isHorizontal = orientation === "horizontal";

    return (
        <div
            ref={containerRef}
            className={`relative ${className}`}
            style={{ height: isHorizontal ? safeMaxWidth * 2 : "100%", width: isHorizontal ? "100%" : safeMaxWidth * 2 }}
            onPointerMove={handlePointerMove}
            onPointerEnter={() => setIsHovered(true)}
            onPointerLeave={() => setIsHovered(false)}
            role="separator"
        >
            <div className="absolute inset-0" aria-hidden="true">
                {Array.from({ length: safeSegmentCount }, (_, i) => {
                    const frac = (i + 0.5) / safeSegmentCount;
                    const pointerFrac = isHorizontal ? pointer.x / 100 : pointer.y / 100;
                    const dist = Math.abs(frac - pointerFrac);
                    const intensity = prefersReducedMotion ? 0 : (isActive ? Math.max(0, 1 - dist * 4) : 0);
                    const strokeWidth = safeBaseWidth + intensity * (safeMaxWidth - safeBaseWidth);

                    if (isHorizontal) {
                        const x1 = (i / safeSegmentCount) * 100;
                        const width = 100 / safeSegmentCount;
                        return (
                            <motion.div
                                key={i}
                                className="absolute rounded-full"
                                style={{
                                    left: `${x1}%`,
                                    top: "50%",
                                    width: `${width}%`,
                                    transform: "translateY(-50%)",
                                    background: color,
                                    ...(intensity > 0.5 ? { filter: `drop-shadow(0 0 3px ${color})` } : {}),
                                }}
                                animate={{
                                    height: strokeWidth,
                                    opacity: 0.3 + intensity * 0.7,
                                }}
                                transition={{ duration: 0.15 }}
                            />
                        );
                    } else {
                        const y1 = (i / safeSegmentCount) * 100;
                        const height = 100 / safeSegmentCount;
                        return (
                            <motion.div
                                key={i}
                                className="absolute rounded-full"
                                style={{
                                    top: `${y1}%`,
                                    left: "50%",
                                    height: `${height}%`,
                                    transform: "translateX(-50%)",
                                    background: color,
                                    ...(intensity > 0.5 ? { filter: `drop-shadow(0 0 3px ${color})` } : {}),
                                }}
                                animate={{
                                    width: strokeWidth,
                                    opacity: 0.3 + intensity * 0.7,
                                }}
                                transition={{ duration: 0.15 }}
                            />
                        );
                    }
                })}
            </div>
        </div>
    );
};

export default LivingDivider;
