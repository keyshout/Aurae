"use client";

/**
 * @component MagneticFieldLines
 * @description Pointer acts as a magnetic dipole, field lines are calculated
 * and rendered in real-time around the cursor position.
 * Canvas-based field rendering.
 *
 * @example
 * ```tsx
 * import { MagneticFieldLines } from '@/components/backgrounds/magnetic-field-lines';
 *
 * <MagneticFieldLines lineColor="#06b6d4" lineCount={20} className="w-full h-96" />
 * ```
 */

import React, { useRef, useState, useCallback, useEffect } from "react";
import { useReducedMotion } from "framer-motion";
import { toPositiveInt, toPositiveNumber } from "@/lib/utils";

export interface MagneticFieldLinesProps {
    /** Line color. Default: "#06b6d4" */
    lineColor?: string;
    /** Number of field lines. Default: 16 */
    lineCount?: number;
    /** Line opacity. Default: 0.4 */
    lineOpacity?: number;
    /** Additional class names */
    className?: string;
}

interface Point {
    x: number;
    y: number;
}

function generateFieldLines(pointer: Point, lineCount: number): Point[][] {
    const lines: Point[][] = [];
    const cx = pointer.x;
    const cy = pointer.y;

    for (let i = 0; i < lineCount; i++) {
        const startAngle = (i / lineCount) * Math.PI * 2;
        const points: Point[] = [];
        let x = cx + Math.cos(startAngle) * 3;
        let y = cy + Math.sin(startAngle) * 3;

        for (let step = 0; step < 40; step++) {
            points.push({ x, y });
            const dx = x - cx;
            const dy = y - cy;
            const r = Math.sqrt(dx * dx + dy * dy);
            if (r < 1 || r > 80) break;

            const theta = Math.atan2(dy, dx);
            const br = (2 * Math.cos(theta)) / (r * r);
            const bt = Math.sin(theta) / (r * r);
            const magnitude = Math.sqrt(br * br + bt * bt);
            if (magnitude < 0.0001) break;

            x += ((br * Math.cos(theta) - bt * Math.sin(theta)) / magnitude) * 2;
            y += ((br * Math.sin(theta) + bt * Math.cos(theta)) / magnitude) * 2;
        }

        if (points.length > 2) lines.push(points);
    }

    return lines;
}

export const MagneticFieldLines: React.FC<MagneticFieldLinesProps> = ({
    lineColor = "#06b6d4",
    lineCount = 16,
    lineOpacity = 0.4,
    className = "",
}) => {
    const prefersReducedMotion = useReducedMotion();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [pointer, setPointer] = useState({ x: 50, y: 50 });
    const [isActive, setIsActive] = useState(false);
    const safeLineCount = toPositiveInt(lineCount, 16, 1);
    const safeLineOpacity = Math.max(0, Math.min(1, toPositiveNumber(lineOpacity, 0.4, 0)));

    const handlePointerMove = useCallback((e: React.PointerEvent) => {
        if (prefersReducedMotion) return;
        const rect = e.currentTarget.getBoundingClientRect();
        setPointer({
            x: ((e.clientX - rect.left) / rect.width) * 100,
            y: ((e.clientY - rect.top) / rect.height) * 100,
        });
        setIsActive(true);
    }, [prefersReducedMotion]);

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

        const draw = () => {
            ctx.clearRect(0, 0, drawWidth, drawHeight);
            if (!isActive || prefersReducedMotion) return;

            const normalizedPointer = {
                x: (pointer.x / 100) * 100,
                y: (pointer.y / 100) * 100,
            };

            const lines = generateFieldLines(normalizedPointer, safeLineCount);
            lines.forEach((line) => {
                if (line.length < 2) return;
                ctx.beginPath();
                ctx.moveTo((line[0].x / 100) * drawWidth, (line[0].y / 100) * drawHeight);
                for (let i = 1; i < line.length; i++) {
                    ctx.lineTo((line[i].x / 100) * drawWidth, (line[i].y / 100) * drawHeight);
                }
                ctx.strokeStyle = lineColor;
                ctx.lineWidth = 1;
                ctx.globalAlpha = safeLineOpacity;
                ctx.stroke();
                ctx.globalAlpha = 1;
            });

            const cx = (pointer.x / 100) * drawWidth;
            const cy = (pointer.y / 100) * drawHeight;
            ctx.beginPath();
            ctx.arc(cx, cy, 4, 0, Math.PI * 2);
            ctx.fillStyle = lineColor;
            ctx.globalAlpha = 0.3;
            ctx.shadowColor = lineColor;
            ctx.shadowBlur = 10;
            ctx.fill();
            ctx.shadowBlur = 0;
            ctx.globalAlpha = 1;
        };

        const loop = () => {
            draw();
            frame = requestAnimationFrame(loop);
        };
        frame = requestAnimationFrame(loop);

        return () => {
            cancelAnimationFrame(frame);
            if (resizeObserver) resizeObserver.disconnect();
        };
    }, [pointer.x, pointer.y, isActive, safeLineCount, safeLineOpacity, lineColor, prefersReducedMotion]);

    return (
        <div
            className={`relative ${className}`}
            onPointerMove={handlePointerMove}
            onPointerLeave={() => setIsActive(false)}
            role="presentation"
            aria-hidden="true"
        >
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
        </div>
    );
};

export default MagneticFieldLines;
