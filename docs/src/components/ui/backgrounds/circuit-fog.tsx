"use client";

/**
 * @component CircuitFog
 * @description Circuit traces with energy dots flowing along them, atmospheric
 * fog blobs appearing and fading in certain areas.
 * Canvas-based line rendering + CSS fog blobs.
 *
 * @example
 * ```tsx
 * import { CircuitFog } from '@/components/backgrounds/circuit-fog';
 *
 * <CircuitFog
 *   traceColor="#10b981"
 *   fogColor="#10b98140"
 *   traceCount={12}
 *   className="absolute inset-0 -z-10"
 * />
 * ```
 */

import React, { useMemo, useRef, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { toPositiveInt, toPositiveNumber } from "@/lib/utils";

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

interface Point {
    x: number;
    y: number;
}

interface TracePath {
    points: Point[];
    cumulative: number[];
    totalLength: number;
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

function generateTracePoints(
    index: number,
    total: number,
    width: number,
    height: number
): Point[] {
    const isHorizontal = index % 2 === 0;
    const points: Point[] = [];
    const stepCount = 3 + Math.floor(Math.random() * 4);

    if (isHorizontal) {
        const y = (height / (total / 2 + 1)) * (Math.floor(index / 2) + 1);
        let x = 0;
        points.push({ x: 0, y });
        for (let s = 0; s < stepCount; s++) {
            x += width / stepCount;
            const jog = (Math.random() - 0.5) * 40;
            points.push({ x, y: y + jog });
            if (Math.random() > 0.5) {
                const forkY = y + jog + (Math.random() > 0.5 ? 30 : -30);
                points.push({ x, y: forkY });
                points.push({ x: x + 20, y: forkY });
            }
        }
    } else {
        const x = (width / (total / 2 + 1)) * (Math.floor(index / 2) + 1);
        let y = 0;
        points.push({ x, y: 0 });
        for (let s = 0; s < stepCount; s++) {
            y += height / stepCount;
            const jog = (Math.random() - 0.5) * 40;
            points.push({ x: x + jog, y });
        }
    }

    return points;
}

function computeCumulative(points: Point[]) {
    const cumulative = [0];
    let totalLength = 0;

    for (let i = 1; i < points.length; i++) {
        const dx = points[i].x - points[i - 1].x;
        const dy = points[i].y - points[i - 1].y;
        totalLength += Math.sqrt(dx * dx + dy * dy);
        cumulative.push(totalLength);
    }

    return { cumulative, totalLength };
}

function pointAtDistance(trace: TracePath, distance: number): Point {
    if (trace.points.length === 0) return { x: 0, y: 0 };
    if (trace.points.length === 1) return trace.points[0];
    if (distance <= 0) return trace.points[0];
    if (distance >= trace.totalLength) return trace.points[trace.points.length - 1];

    for (let i = 1; i < trace.cumulative.length; i++) {
        const prev = trace.cumulative[i - 1];
        const next = trace.cumulative[i];
        if (distance <= next) {
            const segmentDistance = next - prev || 1;
            const localT = (distance - prev) / segmentDistance;
            const p0 = trace.points[i - 1];
            const p1 = trace.points[i];
            return {
                x: p0.x + (p1.x - p0.x) * localT,
                y: p0.y + (p1.y - p0.y) * localT,
            };
        }
    }

    return trace.points[trace.points.length - 1];
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
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const viewW = 800;
    const viewH = 600;
    const safeSpeed = toPositiveNumber(speed, 1, 0.01);
    const safeTraceCount = toPositiveInt(traceCount, 12, 1);
    const safeFogCount = toPositiveInt(fogCount, 6, 1);

    const traces: TracePath[] = useMemo(
        () =>
            Array.from({ length: safeTraceCount }, (_, i) => {
                const points = generateTracePoints(i, safeTraceCount, viewW, viewH);
                const { cumulative, totalLength } = computeCumulative(points);
                return {
                    points,
                    cumulative,
                    totalLength: Math.max(1, totalLength),
                    duration: (4 + Math.random() * 4) / safeSpeed,
                    delay: Math.random() * 3,
                };
            }),
        [safeTraceCount, safeSpeed]
    );

    const fogs: FogBlob[] = useMemo(
        () =>
            Array.from({ length: safeFogCount }, () => ({
                cx: `${10 + Math.random() * 80}%`,
                cy: `${10 + Math.random() * 80}%`,
                r: 40 + Math.random() * 60,
                duration: (6 + Math.random() * 6) / safeSpeed,
                delay: Math.random() * 4,
            })),
        [safeFogCount, safeSpeed]
    );

    const nodes = useMemo(
        () =>
            Array.from({ length: Math.min(6, safeTraceCount) }, () => ({
                x: 100 + Math.random() * (viewW - 200),
                y: 100 + Math.random() * (viewH - 200),
                duration: 2 + Math.random() * 2,
                delay: Math.random() * 3,
            })),
        [safeTraceCount]
    );

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let frame = 0;
        let resizeObserver: ResizeObserver | null = null;
        let drawWidth = 0;
        let drawHeight = 0;

        const resize = () => {
            const rect = canvas.getBoundingClientRect();
            drawWidth = Math.max(1, rect.width);
            drawHeight = Math.max(1, rect.height);
            const dpr = window.devicePixelRatio || 1;
            canvas.width = Math.max(1, Math.floor(drawWidth * dpr));
            canvas.height = Math.max(1, Math.floor(drawHeight * dpr));
            canvas.style.width = `${drawWidth}px`;
            canvas.style.height = `${drawHeight}px`;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        };

        resize();
        resizeObserver = new ResizeObserver(resize);
        resizeObserver.observe(canvas);

        const drawTrace = (trace: TracePath) => {
            if (trace.points.length < 2) return;
            ctx.beginPath();
            ctx.moveTo((trace.points[0].x / viewW) * drawWidth, (trace.points[0].y / viewH) * drawHeight);
            for (let i = 1; i < trace.points.length; i++) {
                ctx.lineTo((trace.points[i].x / viewW) * drawWidth, (trace.points[i].y / viewH) * drawHeight);
            }
            ctx.strokeStyle = traceColor;
            ctx.lineWidth = 1;
            ctx.globalAlpha = 0.15;
            ctx.stroke();
            ctx.globalAlpha = 1;
        };

        const drawNode = (elapsedSec: number, node: { x: number; y: number; duration: number; delay: number }) => {
            const t = ((elapsedSec + node.delay) % node.duration) / node.duration;
            const pulse = 0.2 + Math.sin(t * Math.PI * 2) * 0.35 + 0.35;
            const radius = 2 + pulse * 2;
            const x = (node.x / viewW) * drawWidth;
            const y = (node.y / viewH) * drawHeight;
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fillStyle = traceColor;
            ctx.globalAlpha = Math.max(0.2, Math.min(0.9, pulse));
            ctx.shadowColor = traceColor;
            ctx.shadowBlur = 6;
            ctx.fill();
            ctx.shadowBlur = 0;
            ctx.globalAlpha = 1;
        };

        const draw = (ts: number) => {
            const elapsedSec = ts / 1000;
            ctx.clearRect(0, 0, drawWidth, drawHeight);

            traces.forEach(drawTrace);

            if (!prefersReducedMotion) {
                traces.forEach((trace) => {
                    const progress = ((elapsedSec + trace.delay) % trace.duration) / trace.duration;
                    const point = pointAtDistance(trace, progress * trace.totalLength);
                    const x = (point.x / viewW) * drawWidth;
                    const y = (point.y / viewH) * drawHeight;

                    ctx.beginPath();
                    ctx.arc(x, y, 2.4, 0, Math.PI * 2);
                    ctx.fillStyle = traceColor;
                    ctx.globalAlpha = 0.85;
                    ctx.shadowColor = traceColor;
                    ctx.shadowBlur = 6;
                    ctx.fill();
                    ctx.shadowBlur = 0;
                    ctx.globalAlpha = 1;
                });
            }

            nodes.forEach((node) => drawNode(elapsedSec, node));

            frame = requestAnimationFrame(draw);
        };

        frame = requestAnimationFrame(draw);

        return () => {
            cancelAnimationFrame(frame);
            if (resizeObserver) resizeObserver.disconnect();
        };
    }, [traces, traceColor, nodes, prefersReducedMotion]);

    return (
        <div className={`relative overflow-hidden ${className}`} role="presentation" aria-hidden="true">
            <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full"
            />

            {fogs.map((fog, i) => (
                <motion.div
                    key={`fog-${i}`}
                    className="absolute rounded-full pointer-events-none"
                    style={{
                        left: fog.cx,
                        top: fog.cy,
                        width: fog.r * 2,
                        height: fog.r * 2,
                        marginLeft: -fog.r,
                        marginTop: -fog.r,
                        background: fogColor,
                        filter: "blur(20px)",
                    }}
                    animate={
                        prefersReducedMotion
                            ? { opacity: 0.2, scale: 1 }
                            : {
                                opacity: [0, 0.4, 0.2, 0.5, 0],
                                scale: [0.8, 1.1, 0.9, 1.2, 0.8],
                            }
                    }
                    transition={
                        prefersReducedMotion
                            ? undefined
                            : {
                                duration: fog.duration,
                                delay: fog.delay,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }
                    }
                />
            ))}
        </div>
    );
};

export default CircuitFog;
