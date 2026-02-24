"use client";

/**
 * @component LiquidGridMemory
 * @description A grid background where touched areas deform like liquid.
 * Deformation traces persist briefly as "memory" before damping back.
 * Based on pointer displacement + damping reset.
 *
 * @example
 * ```tsx
 * import { LiquidGridMemory } from '@/components/backgrounds/liquid-grid-memory';
 *
 * <LiquidGridMemory
 *   columns={20}
 *   rows={15}
 *   dotColor="#8b5cf6"
 *   className="absolute inset-0 -z-10"
 * />
 * ```
 */

import React, { useRef, useEffect } from "react";
import { hexToRgbString } from "../../lib/utils";
import { useReducedMotion } from "framer-motion";

export interface LiquidGridMemoryProps {
    /** Grid columns. Default: 20 */
    columns?: number;
    /** Grid rows. Default: 15 */
    rows?: number;
    /** Dot color. Default: "#8b5cf6" */
    dotColor?: string;
    /** Influence radius in pixels. Default: 100 */
    influenceRadius?: number;
    /** Max displacement in pixels. Default: 15 */
    maxDisplacement?: number;
    /** Return speed (0–1, lower = slower). Default: 0.04 */
    returnSpeed?: number;
    /** Dot base size. Default: 2 */
    dotSize?: number;
    /** Additional class names */
    className?: string;
}

interface GridPoint {
    baseX: number;
    baseY: number;
    dx: number;
    dy: number;
    vx: number;
    vy: number;
}

export const LiquidGridMemory: React.FC<LiquidGridMemoryProps> = ({
    columns = 20,
    rows = 15,
    dotColor = "#8b5cf6",
    influenceRadius = 100,
    maxDisplacement = 15,
    returnSpeed = 0.04,
    dotSize = 2,
    className = "",
}) => {
    const prefersReducedMotion = useReducedMotion();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const pointsRef = useRef<GridPoint[]>([]);
    const pointerRef = useRef({ x: -9999, y: -9999 });
    const rafRef = useRef<number>(0);



    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const rgb = hexToRgbString(dotColor, "139, 92, 246");

        const resize = () => {
            const parent = canvas.parentElement;
            if (!parent) return;
            const rect = parent.getBoundingClientRect();
            canvas.width = rect.width * window.devicePixelRatio;
            canvas.height = rect.height * window.devicePixelRatio;
            ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);

            // Rebuild grid
            const cellW = rect.width / (columns + 1);
            const cellH = rect.height / (rows + 1);
            pointsRef.current = [];
            for (let r = 0; r < rows; r++) {
                for (let c = 0; c < columns; c++) {
                    pointsRef.current.push({
                        baseX: (c + 1) * cellW,
                        baseY: (r + 1) * cellH,
                        dx: 0,
                        dy: 0,
                        vx: 0,
                        vy: 0,
                    });
                }
            }
        };

        resize();
        window.addEventListener("resize", resize);

        const handleMove = (e: PointerEvent) => {
            const rect = canvas.getBoundingClientRect();
            pointerRef.current = {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
            };
        };

        canvas.addEventListener("pointermove", handleMove);

        const animate = () => {
            const parent = canvas.parentElement;
            if (!parent) return;
            const rect = parent.getBoundingClientRect();

            ctx.clearRect(0, 0, rect.width, rect.height);

            const pointer = pointerRef.current;

            pointsRef.current.forEach((p) => {
                const px = p.baseX + p.dx;
                const py = p.baseY + p.dy;
                const dx = px - pointer.x;
                const dy = py - pointer.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < influenceRadius) {
                    const force = ((influenceRadius - dist) / influenceRadius) * maxDisplacement;
                    const angle = Math.atan2(dy, dx);
                    p.vx += Math.cos(angle) * force * 0.1;
                    p.vy += Math.sin(angle) * force * 0.1;
                }

                // Spring back to origin
                p.vx += -p.dx * returnSpeed;
                p.vy += -p.dy * returnSpeed;
                p.vx *= 0.9;
                p.vy *= 0.9;
                p.dx += p.vx;
                p.dy += p.vy;

                // Clamp displacement
                const absDist = Math.sqrt(p.dx * p.dx + p.dy * p.dy);
                if (absDist > maxDisplacement * 2) {
                    p.dx *= (maxDisplacement * 2) / absDist;
                    p.dy *= (maxDisplacement * 2) / absDist;
                }

                // Draw
                const intensity = Math.min(1, absDist / maxDisplacement);
                const size = dotSize + intensity * 2;
                const alpha = 0.2 + intensity * 0.6;

                ctx.beginPath();
                ctx.arc(p.baseX + p.dx, p.baseY + p.dy, size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${rgb}, ${alpha})`;
                ctx.fill();

                if (intensity > 0.3) {
                    ctx.beginPath();
                    ctx.arc(p.baseX + p.dx, p.baseY + p.dy, size + 3, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(${rgb}, ${intensity * 0.15})`;
                    ctx.fill();
                }
            });

            rafRef.current = requestAnimationFrame(animate);
        };

        // Skip animation loop in reduced motion mode


        if (!prefersReducedMotion) {


            rafRef.current = requestAnimationFrame(animate);


        }
        return () => {
            cancelAnimationFrame(rafRef.current);
            window.removeEventListener("resize", resize);
            canvas.removeEventListener("pointermove", handleMove);
        };
    }, [columns, rows, dotColor, influenceRadius, maxDisplacement, returnSpeed, dotSize]);

    return (
        <div className={`relative ${className}`} role="presentation" aria-hidden="true">
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
        </div>
    );
};

export default LiquidGridMemory;
