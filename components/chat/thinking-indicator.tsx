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

    // Generate node positions in a small network layout
    const nodes = useMemo(() => {
        const positions: { x: number; y: number }[] = [];
        const center = { x: 40, y: 16 };

        for (let i = 0; i < nodeCount; i++) {
            const angle = (i / nodeCount) * Math.PI * 2 + Math.PI / 6;
            const radius = i % 2 === 0 ? 12 : 8;
            positions.push({
                x: center.x + Math.cos(angle) * radius,
                y: center.y + Math.sin(angle) * radius,
            });
        }
        return positions;
    }, [nodeCount]);

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
            <svg width={80} height={32} className="overflow-visible">
                {/* Edges */}
                {edges.map((e, i) => (
                    <motion.line
                        key={`e-${i}`}
                        x1={nodes[e.from].x}
                        y1={nodes[e.from].y}
                        x2={nodes[e.to].x}
                        y2={nodes[e.to].y}
                        stroke={color}
                        strokeWidth={0.5}
                        animate={prefersReducedMotion ? { opacity: 0.2 } : {
                            opacity: [0.1, 0.4, 0.1],
                        }}
                        transition={{
                            duration: pulseSpeed,
                            delay: i * 0.1,
                            repeat: Infinity,
                        }}
                    />
                ))}

                {/* Nodes */}
                {nodes.map((n, i) => (
                    <motion.circle
                        key={`n-${i}`}
                        cx={n.x}
                        cy={n.y}
                        r={2}
                        fill={color}
                        animate={prefersReducedMotion ? { opacity: 0.5 } : {
                            opacity: [0.3, 1, 0.3],
                            r: [1.5, 2.5, 1.5],
                        }}
                        transition={{
                            duration: pulseSpeed,
                            delay: i * (pulseSpeed / nodeCount),
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    />
                ))}
            </svg>
            <span className="text-xs text-gray-500 font-mono">thinking</span>
        </div>
    );
};

export default ThinkingIndicator;
