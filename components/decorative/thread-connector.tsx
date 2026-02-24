"use client";

/**
 * @component ThreadConnector
 * @description A thin connecting line between sections or cards with a signal
 * dot traveling along it; glows when active.
 * Based on stroke-dashoffset signal animation.
 *
 * @example
 * ```tsx
 * import { ThreadConnector } from '@/components/decorative/thread-connector';
 *
 * <ThreadConnector
 *   from={{ x: 100, y: 50 }}
 *   to={{ x: 400, y: 200 }}
 *   color="#10b981"
 *   active={true}
 * />
 * ```
 */

import React from "react";
import { motion, useReducedMotion } from "framer-motion";

export interface ThreadConnectorProps {
    /** Start point */
    from: { x: number; y: number };
    /** End point */
    to: { x: number; y: number };
    /** Line color. Default: "#10b981" */
    color?: string;
    /** Whether the connection is active. Default: true */
    active?: boolean;
    /** Signal dot speed in seconds. Default: 2 */
    signalSpeed?: number;
    /** Line style. Default: "solid" */
    lineStyle?: "solid" | "dashed" | "dotted";
    /** Additional class names */
    className?: string;
}

export const ThreadConnector: React.FC<ThreadConnectorProps> = ({
    from,
    to,
    color = "#10b981",
    active = true,
    signalSpeed = 2,
    lineStyle = "solid",
    className = "",
}) => {
    const prefersReducedMotion = useReducedMotion();
    const minX = Math.min(from.x, to.x) - 10;
    const minY = Math.min(from.y, to.y) - 10;
    const width = Math.abs(to.x - from.x) + 20;
    const height = Math.abs(to.y - from.y) + 20;

    // Bezier control points for organic curve
    const midX = (from.x + to.x) / 2;
    const midY = (from.y + to.y) / 2;
    const cp1x = midX;
    const cp1y = from.y;
    const cp2x = midX;
    const cp2y = to.y;

    const pathD = `M ${from.x - minX} ${from.y - minY} C ${cp1x - minX} ${cp1y - minY}, ${cp2x - minX} ${cp2y - minY}, ${to.x - minX} ${to.y - minY}`;

    const strokeDasharray =
        lineStyle === "dashed" ? "8 4" : lineStyle === "dotted" ? "2 4" : "none";

    // Approximate path length
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const pathLength = Math.sqrt(dx * dx + dy * dy) * 1.2;

    return (
        <svg
            className={`absolute pointer-events-none ${className}`}
            style={{ left: minX, top: minY, width, height, overflow: "visible" }}
            role="presentation"
            aria-hidden="true"
        >
            {/* Base line */}
            <path
                d={pathD}
                fill="none"
                stroke={color}
                strokeWidth={1}
                strokeOpacity={active ? 0.3 : 0.1}
                strokeDasharray={strokeDasharray}
            />

            {/* Signal dot traveling along path */}
            {active && (
                <motion.path
                    d={pathD}
                    fill="none"
                    stroke={color}
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeDasharray={`10 ${pathLength}`}
                    initial={{ strokeDashoffset: pathLength }}
                    animate={{ strokeDashoffset: -pathLength }}
                    transition={{ duration: signalSpeed, repeat: Infinity, ease: "linear" }}
                    style={{ filter: `drop-shadow(0 0 4px ${color})` }}
                />
            )}

            {/* Endpoint dots */}
            <circle
                cx={from.x - minX}
                cy={from.y - minY}
                r={3}
                fill={color}
                fillOpacity={active ? 0.8 : 0.3}
                style={active ? { filter: `drop-shadow(0 0 4px ${color})` } : undefined}
            />
            <circle
                cx={to.x - minX}
                cy={to.y - minY}
                r={3}
                fill={color}
                fillOpacity={active ? 0.8 : 0.3}
                style={active ? { filter: `drop-shadow(0 0 4px ${color})` } : undefined}
            />
        </svg>
    );
};

export default ThreadConnector;
