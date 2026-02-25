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
import { useReducedMotion } from "framer-motion";
import { toPositiveNumber } from "../../lib/utils";

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
    const canvasRef = React.useRef<HTMLCanvasElement>(null);
    const safeSignalSpeed = toPositiveNumber(signalSpeed, 2, 0.01);
    const minX = Math.min(from.x, to.x) - 10;
    const minY = Math.min(from.y, to.y) - 10;
    const width = Math.abs(to.x - from.x) + 20;
    const height = Math.abs(to.y - from.y) + 20;

    // Bezier control points for organic curve
    const midX = (from.x + to.x) / 2;
    const cp1x = midX;
    const cp1y = from.y;
    const cp2x = midX;
    const cp2y = to.y;

    const localStart = { x: from.x - minX, y: from.y - minY };
    const localEnd = { x: to.x - minX, y: to.y - minY };
    const localCp1 = { x: cp1x - minX, y: cp1y - minY };
    const localCp2 = { x: cp2x - minX, y: cp2y - minY };

    React.useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const dpr = window.devicePixelRatio || 1;
        canvas.width = Math.max(1, Math.floor(width * dpr));
        canvas.height = Math.max(1, Math.floor(height * dpr));
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        const dashPattern = lineStyle === "dashed" ? [8, 4] : lineStyle === "dotted" ? [2, 4] : [];

        const pointOnCurve = (t: number) => {
            const mt = 1 - t;
            const x =
                mt * mt * mt * localStart.x +
                3 * mt * mt * t * localCp1.x +
                3 * mt * t * t * localCp2.x +
                t * t * t * localEnd.x;
            const y =
                mt * mt * mt * localStart.y +
                3 * mt * mt * t * localCp1.y +
                3 * mt * t * t * localCp2.y +
                t * t * t * localEnd.y;
            return { x, y };
        };

        const draw = (progress: number) => {
            ctx.clearRect(0, 0, width, height);

            ctx.beginPath();
            ctx.moveTo(localStart.x, localStart.y);
            ctx.bezierCurveTo(localCp1.x, localCp1.y, localCp2.x, localCp2.y, localEnd.x, localEnd.y);
            ctx.lineWidth = 1;
            ctx.strokeStyle = color;
            ctx.globalAlpha = active ? 0.3 : 0.1;
            ctx.setLineDash(dashPattern);
            ctx.stroke();
            ctx.setLineDash([]);
            ctx.globalAlpha = 1;

            const endpointOpacity = active ? 0.8 : 0.3;
            ctx.fillStyle = color;
            ctx.globalAlpha = endpointOpacity;
            ctx.beginPath();
            ctx.arc(localStart.x, localStart.y, 3, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(localEnd.x, localEnd.y, 3, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1;

            if (active) {
                const p = pointOnCurve(progress);
                ctx.shadowColor = color;
                ctx.shadowBlur = 8;
                ctx.fillStyle = color;
                ctx.beginPath();
                ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
                ctx.fill();
                ctx.shadowBlur = 0;
            }
        };

        if (!active || prefersReducedMotion) {
            draw(0);
            return;
        }

        let frame = 0;
        const startTs = performance.now();
        const durationMs = safeSignalSpeed * 1000;
        const loop = (ts: number) => {
            const elapsed = ts - startTs;
            const progress = (elapsed % durationMs) / durationMs;
            draw(progress);
            frame = requestAnimationFrame(loop);
        };
        frame = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(frame);
    }, [
        width,
        height,
        lineStyle,
        color,
        active,
        localStart.x,
        localStart.y,
        localEnd.x,
        localEnd.y,
        localCp1.x,
        localCp1.y,
        localCp2.x,
        localCp2.y,
        safeSignalSpeed,
        prefersReducedMotion,
    ]);

    return (
        <canvas
            ref={canvasRef}
            className={`absolute pointer-events-none ${className}`}
            style={{ left: minX, top: minY, width, height, overflow: "visible" }}
            role="presentation"
            aria-hidden="true"
        />
    );
};

export default ThreadConnector;
