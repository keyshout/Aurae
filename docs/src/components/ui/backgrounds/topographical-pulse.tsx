"use client";

/**
 * @component TopographicalPulse
 * @description Contour map lines deform locally based on pointer position.
 * Clicking emits a ring-shaped wave that propagates outward.
 * Canvas-based contour rendering.
 *
 * @example
 * ```tsx
 * import { TopographicalPulse } from '@/components/backgrounds/topographical-pulse';
 *
 * <TopographicalPulse
 *   lineCount={15}
 *   lineColor="#22d3ee"
 *   className="absolute inset-0 -z-10"
 * />
 * ```
 */

import React, { useRef, useEffect } from "react";
import { useReducedMotion } from "framer-motion";
import { toPositiveInt, toPositiveNumber } from "@/lib/utils";

export interface TopographicalPulseProps {
    /** Number of contour lines. Default: 15 */
    lineCount?: number;
    /** Line color. Default: "#22d3ee" */
    lineColor?: string;
    /** Line opacity. Default: 0.3 */
    lineOpacity?: number;
    /** Deformation radius in pixels. Default: 120 */
    deformRadius?: number;
    /** Deformation strength. Default: 30 */
    deformStrength?: number;
    /** Pulse wave speed. Default: 3 */
    pulseSpeed?: number;
    /** Additional class names */
    className?: string;
}

interface Pulse {
    x: number;
    y: number;
    radius: number;
    opacity: number;
}

export const TopographicalPulse: React.FC<TopographicalPulseProps> = ({
    lineCount = 15,
    lineColor = "#22d3ee",
    lineOpacity = 0.3,
    deformRadius = 120,
    deformStrength = 30,
    pulseSpeed = 3,
    className = "",
}) => {
    const prefersReducedMotion = useReducedMotion();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const pointerRef = useRef({ x: -9999, y: -9999 });
    const pulsesRef = useRef<Pulse[]>([]);

    const safeLineCount = toPositiveInt(lineCount, 15, 1);
    const safeLineOpacity = Math.max(0, Math.min(1, toPositiveNumber(lineOpacity, 0.3, 0)));
    const safeDeformRadius = toPositiveNumber(deformRadius, 120, 1);
    const safeDeformStrength = toPositiveNumber(deformStrength, 30, 0);
    const safePulseSpeed = toPositiveNumber(pulseSpeed, 3, 0.01);

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

        const handleMove = (e: PointerEvent) => {
            const rect = canvas.getBoundingClientRect();
            pointerRef.current = {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
            };
        };

        const handleClick = (e: MouseEvent) => {
            if (prefersReducedMotion) return;
            const rect = canvas.getBoundingClientRect();
            pulsesRef.current.push({
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
                radius: 0,
                opacity: 1,
            });
        };

        canvas.addEventListener("pointermove", handleMove);
        canvas.addEventListener("click", handleClick);

        const drawContourLine = (lineIndex: number) => {
            const baseY = (drawHeight / (safeLineCount + 1)) * (lineIndex + 1);
            const segments = 40;

            ctx.beginPath();
            for (let j = 0; j <= segments; j++) {
                const x = (drawWidth / segments) * j;
                let y = baseY;
                y += Math.sin(x * 0.01 + lineIndex * 0.5) * 8;
                y += Math.cos(x * 0.02 - lineIndex * 0.3) * 5;

                const pointer = pointerRef.current;
                const dx = x - pointer.x;
                const dy = y - pointer.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < safeDeformRadius) {
                    const force = (1 - dist / safeDeformRadius) * safeDeformStrength;
                    y += force * Math.sign(dy || 1);
                }

                pulsesRef.current.forEach((pulse) => {
                    const pdx = x - pulse.x;
                    const pdy = y - pulse.y;
                    const pdist = Math.sqrt(pdx * pdx + pdy * pdy);
                    const ringDist = Math.abs(pdist - pulse.radius);
                    if (ringDist < 30) {
                        const waveForce = (1 - ringDist / 30) * 15 * pulse.opacity;
                        y += waveForce * Math.sin(pdist * 0.1);
                    }
                });

                if (j === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }

            ctx.strokeStyle = lineColor;
            ctx.lineWidth = 1;
            ctx.globalAlpha = safeLineOpacity;
            ctx.stroke();
            ctx.globalAlpha = 1;
        };

        const drawPulseRings = () => {
            pulsesRef.current.forEach((pulse) => {
                ctx.beginPath();
                ctx.arc(pulse.x, pulse.y, pulse.radius, 0, Math.PI * 2);
                ctx.strokeStyle = lineColor;
                ctx.lineWidth = 2;
                ctx.globalAlpha = pulse.opacity * 0.5;
                ctx.stroke();
                ctx.globalAlpha = 1;
            });
        };

        const draw = () => {
            ctx.clearRect(0, 0, drawWidth, drawHeight);

            pulsesRef.current = pulsesRef.current.filter((pulse) => {
                pulse.radius += safePulseSpeed;
                pulse.opacity *= 0.985;
                return pulse.opacity > 0.01;
            });

            for (let i = 0; i < safeLineCount; i++) drawContourLine(i);
            if (!prefersReducedMotion) drawPulseRings();

            frame = requestAnimationFrame(draw);
        };

        frame = requestAnimationFrame(draw);

        return () => {
            cancelAnimationFrame(frame);
            if (resizeObserver) resizeObserver.disconnect();
            canvas.removeEventListener("pointermove", handleMove);
            canvas.removeEventListener("click", handleClick);
        };
    }, [
        safeLineCount,
        safeLineOpacity,
        safeDeformRadius,
        safeDeformStrength,
        safePulseSpeed,
        lineColor,
        prefersReducedMotion,
    ]);

    return (
        <canvas
            ref={canvasRef}
            className={`w-full h-full ${className}`}
            role="presentation"
            aria-hidden="true"
        />
    );
};

export default TopographicalPulse;
