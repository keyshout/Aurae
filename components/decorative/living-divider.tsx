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
            style={{ height: isHorizontal ? maxWidth * 2 : "100%", width: isHorizontal ? "100%" : maxWidth * 2 }}
            onPointerMove={handlePointerMove}
            onPointerEnter={() => setIsHovered(true)}
            onPointerLeave={() => setIsHovered(false)}
            role="separator"
        >
            <svg
                className="w-full h-full"
                preserveAspectRatio="none"
                aria-hidden="true"
            >
                {Array.from({ length: segmentCount }, (_, i) => {
                    const frac = (i + 0.5) / segmentCount;
                    const pointerFrac = isHorizontal ? pointer.x / 100 : pointer.y / 100;
                    const dist = Math.abs(frac - pointerFrac);
                    const intensity = isActive ? Math.max(0, 1 - dist * 4) : 0;
                    const strokeWidth = baseWidth + intensity * (maxWidth - baseWidth);

                    if (isHorizontal) {
                        const x1 = `${(i / segmentCount) * 100}%`;
                        const x2 = `${((i + 1) / segmentCount) * 100}%`;
                        return (
                            <motion.line
                                key={i}
                                x1={x1} y1="50%" x2={x2} y2="50%"
                                stroke={color}
                                strokeLinecap="round"
                                animate={{
                                    strokeWidth,
                                    strokeOpacity: 0.3 + intensity * 0.7,
                                }}
                                transition={{ duration: 0.15 }}
                                style={intensity > 0.5 ? { filter: `drop-shadow(0 0 3px ${color})` } : undefined}
                            />
                        );
                    } else {
                        const y1 = `${(i / segmentCount) * 100}%`;
                        const y2 = `${((i + 1) / segmentCount) * 100}%`;
                        return (
                            <motion.line
                                key={i}
                                x1="50%" y1={y1} x2="50%" y2={y2}
                                stroke={color}
                                strokeLinecap="round"
                                animate={{
                                    strokeWidth,
                                    strokeOpacity: 0.3 + intensity * 0.7,
                                }}
                                transition={{ duration: 0.15 }}
                                style={intensity > 0.5 ? { filter: `drop-shadow(0 0 3px ${color})` } : undefined}
                            />
                        );
                    }
                })}
            </svg>
        </div>
    );
};

export default LivingDivider;
