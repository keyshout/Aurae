"use client";

/**
 * @component SignalStrengthCard
 * @description Border segments light up like signal bars based on pointer proximity.
 * Edges near the pointer glow at full strength, far ones are dim.
 * Based on distance-based opacity + border segment animation.
 *
 * @example
 * ```tsx
 * import { SignalStrengthCard } from '@/components/cards/signal-strength-card';
 *
 * <SignalStrengthCard
 *   segmentsPerSide={10}
 *   signalColor="#22d3ee"
 *   className="w-80"
 * >
 *   <h3>Signal Detected</h3>
 * </SignalStrengthCard>
 * ```
 */

import React, { useRef, useState, useCallback, useMemo, useLayoutEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { toPositiveInt, toPositiveNumber } from "../../lib/utils";

export interface SignalStrengthCardProps {
    /** Card children */
    children: React.ReactNode;
    /** Segments per side. Default: 10 */
    segmentsPerSide?: number;
    /** Signal color. Default: "#22d3ee" */
    signalColor?: string;
    /** Influence radius in pixels. Default: 200 */
    influenceRadius?: number;
    /** Border radius. Default: 16 */
    borderRadius?: number;
    /** Additional class names */
    className?: string;
}

interface Segment {
    side: "top" | "right" | "bottom" | "left";
    x1: number;
    y1: number;
    x2: number;
    y2: number;
}

export const SignalStrengthCard: React.FC<SignalStrengthCardProps> = ({
    children,
    segmentsPerSide = 10,
    signalColor = "#22d3ee",
    influenceRadius = 200,
    borderRadius = 16,
    className = "",
}) => {
    const prefersReducedMotion = useReducedMotion();
    const safeSegmentsPerSide = toPositiveInt(segmentsPerSide, 10, 1);
    const safeInfluenceRadius = toPositiveNumber(influenceRadius, 200, 1);
    const cardRef = useRef<HTMLDivElement>(null);
    const [pointer, setPointer] = useState({ x: -9999, y: -9999 });
    const [isHovered, setIsHovered] = useState(false);
    const [dims, setDims] = useState({ w: 300, h: 200 });

    // Measure dimensions via useLayoutEffect instead of during render
    useLayoutEffect(() => {
        const el = cardRef.current;
        if (!el) return;
        const ro = new ResizeObserver(([entry]) => {
            setDims({ w: entry.contentRect.width, h: entry.contentRect.height });
        });
        ro.observe(el);
        return () => ro.disconnect();
    }, []);

    const handlePointerMove = useCallback((e: React.PointerEvent) => {
        const el = cardRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        setPointer({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        });
    }, []);

    // Generate segment positions (percentages)
    const segments: Segment[] = useMemo(() => {
        const segs: Segment[] = [];
        const n = safeSegmentsPerSide;
        for (let i = 0; i < n; i++) {
            const f1 = (i / n) * 100;
            const f2 = ((i + 1) / n) * 100;
            segs.push({ side: "top", x1: f1, y1: 0, x2: f2, y2: 0 });
            segs.push({ side: "right", x1: 100, y1: f1, x2: 100, y2: f2 });
            segs.push({ side: "bottom", x1: f2, y1: 100, x2: f1, y2: 100 });
            segs.push({ side: "left", x1: 0, y1: f2, x2: 0, y2: f1 });
        }
        return segs;
    }, [safeSegmentsPerSide]);

    return (
        <div
            ref={cardRef}
            className={`relative ${className}`}
            onPointerMove={handlePointerMove}
            onPointerEnter={() => setIsHovered(true)}
            onPointerLeave={() => setIsHovered(false)}
            role="article"
        >
            {/* Signal border segments */}
            <div className="absolute inset-0 pointer-events-none z-20" aria-hidden="true">
                {segments.map((seg, i) => {
                    // Use measured dimensions
                    const midX = ((seg.x1 + seg.x2) / 200) * dims.w;
                    const midY = ((seg.y1 + seg.y2) / 200) * dims.h;
                    const dx = pointer.x - midX;
                    const dy = pointer.y - midY;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    const intensity = isHovered && !prefersReducedMotion
                        ? Math.max(0.05, 1 - dist / safeInfluenceRadius)
                        : 0.05;
                    const isHorizontal = seg.y1 === seg.y2;
                    const left = `${Math.min(seg.x1, seg.x2)}%`;
                    const top = `${Math.min(seg.y1, seg.y2)}%`;
                    const width = `${Math.max(0.4, Math.abs(seg.x2 - seg.x1))}%`;
                    const height = `${Math.max(0.4, Math.abs(seg.y2 - seg.y1))}%`;

                    return (
                        <motion.div
                            key={i}
                            className="absolute rounded-full"
                            style={{
                                left,
                                top,
                                width: isHorizontal ? width : "2px",
                                height: isHorizontal ? "2px" : height,
                                background: signalColor,
                                transform: isHorizontal ? "translateY(-1px)" : "translateX(-1px)",
                            }}
                            animate={{
                                opacity: intensity,
                                boxShadow: intensity > 0.3 ? `0 0 ${intensity * 6}px ${signalColor}` : "none",
                            }}
                            transition={{ duration: 0.1 }}
                        />
                    );
                })}
            </div>

            {/* Card content */}
            <div
                className="relative z-10 p-6 bg-gradient-to-br from-gray-800 to-gray-900 dark:from-gray-800 dark:to-gray-950"
                style={{ borderRadius }}
            >
                {children}
            </div>
        </div>
    );
};

export default SignalStrengthCard;
