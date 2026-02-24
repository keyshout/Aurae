"use client";

/**
 * @component GravityLens
 * @description Space-time curvature around the pointer — background grid warps
 * with gravitational lensing effect based on distance.
 * Principle: radial deformation + distance-based displacement.
 *
 * @example
 * ```tsx
 * import { GravityLens } from '@/components/backgrounds/gravity-lens';
 *
 * <GravityLens gridColor="#334155" lensStrength={30} className="w-full h-96" />
 * ```
 */

import React, { useRef, useEffect, useCallback } from "react";
import { useReducedMotion } from "framer-motion";
import { hexToRgbString } from "../../lib/utils";

export interface GravityLensProps {
    /** Grid line color. Default: "#334155" */
    gridColor?: string;
    /** Lens strength (displacement px). Default: 25 */
    lensStrength?: number;
    /** Grid spacing in px. Default: 30 */
    gridSpacing?: number;
    /** Lens radius in px. Default: 150 */
    lensRadius?: number;
    /** Additional class names */
    className?: string;
}

export const GravityLens: React.FC<GravityLensProps> = ({
    gridColor = "#334155",
    lensStrength = 25,
    gridSpacing = 30,
    lensRadius = 150,
    className = "",
}) => {
    const prefersReducedMotion = useReducedMotion();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const pointerRef = useRef({ x: -9999, y: -9999 });
    const rafRef = useRef<number>(0);

    const draw = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const dpr = window.devicePixelRatio;
        const w = canvas.width / dpr;
        const h = canvas.height / dpr;
        const pointer = pointerRef.current;
        const rgb = hexToRgbString(gridColor, "51, 65, 85");

        ctx.clearRect(0, 0, w, h);

        // Draw warped grid
        for (let gx = 0; gx < w + gridSpacing; gx += gridSpacing) {
            ctx.beginPath();
            for (let gy = 0; gy <= h; gy += 2) {
                const dx = gx - pointer.x;
                const dy = gy - pointer.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                let warpedX = gx;
                if (dist < lensRadius && dist > 0) {
                    const force = (1 - dist / lensRadius) * lensStrength;
                    warpedX += (dx / dist) * force;
                }

                if (gy === 0) ctx.moveTo(warpedX, gy);
                else ctx.lineTo(warpedX, gy);
            }
            ctx.strokeStyle = `rgba(${rgb}, 0.3)`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
        }

        for (let gy = 0; gy < h + gridSpacing; gy += gridSpacing) {
            ctx.beginPath();
            for (let gx = 0; gx <= w; gx += 2) {
                const dx = gx - pointer.x;
                const dy = gy - pointer.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                let warpedY = gy;
                if (dist < lensRadius && dist > 0) {
                    const force = (1 - dist / lensRadius) * lensStrength;
                    warpedY += (dy / dist) * force;
                }

                if (gx === 0) ctx.moveTo(gx, warpedY);
                else ctx.lineTo(gx, warpedY);
            }
            ctx.strokeStyle = `rgba(${rgb}, 0.3)`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
        }

        if (!prefersReducedMotion) {
            rafRef.current = requestAnimationFrame(draw);
        }
    }, [gridColor, lensStrength, gridSpacing, lensRadius, prefersReducedMotion]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const resize = () => {
            const parent = canvas.parentElement;
            if (!parent) return;
            canvas.width = parent.clientWidth * window.devicePixelRatio;
            canvas.height = parent.clientHeight * window.devicePixelRatio;
            ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
        };
        resize();
        window.addEventListener("resize", resize);

        const handleMove = (e: PointerEvent) => {
            const rect = canvas.getBoundingClientRect();
            pointerRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
        };
        const handleLeave = () => {
            pointerRef.current = { x: -9999, y: -9999 };
        };

        canvas.addEventListener("pointermove", handleMove);
        canvas.addEventListener("pointerleave", handleLeave);

        if (!prefersReducedMotion) {
            rafRef.current = requestAnimationFrame(draw);
        } else {
            draw();
        }

        return () => {
            cancelAnimationFrame(rafRef.current);
            window.removeEventListener("resize", resize);
            canvas.removeEventListener("pointermove", handleMove);
            canvas.removeEventListener("pointerleave", handleLeave);
        };
    }, [draw, prefersReducedMotion]);

    return (
        <div className={`relative ${className}`} role="presentation" aria-hidden="true">
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
        </div>
    );
};

export default GravityLens;
