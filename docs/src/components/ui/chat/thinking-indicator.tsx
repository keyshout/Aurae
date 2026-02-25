"use client";

/**
 * @component ThinkingIndicator
 * @description AI "thinking" animation: neural network graph nodes pulse
 * with propagation delay, not cliché 3 bouncing dots.
 * Principle: graph node pulsing + propagation delay via adjacency.
 *
 * @example
 * ```tsx
 * import { ThinkingIndicator } from '@/components/chat/thinking-indicator';
 *
 * <ThinkingIndicator color="#8b5cf6" />
 * ```
 */

import React, { useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { toPositiveInt, toPositiveNumber } from "@/lib/utils";

export interface ThinkingIndicatorProps {
    /** Node color. Default: "#8b5cf6" */
    color?: string;
    /** Number of nodes. Default: 7 */
    nodeCount?: number;
    /** Pulse speed in seconds. Default: 1.5 */
    pulseSpeed?: number;
    /** Additional class names */
    className?: string;
}

export const ThinkingIndicator: React.FC<ThinkingIndicatorProps> = ({
    color = "#8b5cf6",
    nodeCount = 7,
    pulseSpeed = 1.5,
    className = "",
}) => {
    const prefersReducedMotion = useReducedMotion();
    const safeNodeCount = toPositiveInt(nodeCount, 7, 2);
    const safePulseSpeed = toPositiveNumber(pulseSpeed, 1.5, 0.01);
    const width = 80;
    const height = 32;

    // Generate node positions in a small network layout
    const nodes = useMemo(() => {
        const positions: { x: number; y: number }[] = [];
        const center = { x: width / 2, y: height / 2 };

        for (let i = 0; i < safeNodeCount; i++) {
            const angle = (i / safeNodeCount) * Math.PI * 2 + Math.PI / 6;
            const radius = i % 2 === 0 ? 12 : 8;
            positions.push({
                x: center.x + Math.cos(angle) * radius,
                y: center.y + Math.sin(angle) * radius,
            });
        }
        return positions;
    }, [safeNodeCount]);

    // Generate connections between nearby nodes
    const edges = useMemo(() => {
        const connections: { from: number; to: number }[] = [];
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const dx = nodes[i].x - nodes[j].x;
                const dy = nodes[i].y - nodes[j].y;
                if (Math.sqrt(dx * dx + dy * dy) < 18) {
                    connections.push({ from: i, to: j });
                }
            }
        }
        return connections;
    }, [nodes]);

    return (
        <div className={`inline-flex items-center gap-2 ${className}`} role="status" aria-label="AI is thinking">
            <div className="relative overflow-visible" style={{ width, height }} aria-hidden="true">
                {edges.map((e, i) => {
                    const x1 = nodes[e.from].x;
                    const y1 = nodes[e.from].y;
                    const x2 = nodes[e.to].x;
                    const y2 = nodes[e.to].y;
                    const dx = x2 - x1;
                    const dy = y2 - y1;
                    const length = Math.sqrt(dx * dx + dy * dy);
                    const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
                    return (
                        <motion.div
                            key={`e-${i}`}
                            className="absolute h-px origin-left"
                            style={{
                                left: x1,
                                top: y1,
                                width: length,
                                background: color,
                                transform: `translateY(-0.5px) rotate(${angle}deg)`,
                            }}
                            animate={prefersReducedMotion ? { opacity: 0.2 } : { opacity: [0.1, 0.4, 0.1] }}
                            transition={{
                                duration: safePulseSpeed,
                                delay: i * 0.1,
                                repeat: Infinity,
                            }}
                        />
                    );
                })}

                {nodes.map((n, i) => (
                    <motion.div
                        key={`n-${i}`}
                        className="absolute rounded-full"
                        style={{
                            left: n.x - 2,
                            top: n.y - 2,
                            width: 4,
                            height: 4,
                            background: color,
                        }}
                        animate={prefersReducedMotion ? { opacity: 0.5 } : {
                            opacity: [0.3, 1, 0.3],
                            scale: [0.75, 1.25, 0.75],
                        }}
                        transition={{
                            duration: safePulseSpeed,
                            delay: i * (safePulseSpeed / safeNodeCount),
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    />
                ))}
            </div>
            <span className="text-xs text-gray-500 font-mono">thinking</span>
        </div>
    );
};

export default ThinkingIndicator;
