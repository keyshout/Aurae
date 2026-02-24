"use client";

/**
 * @component FrostCrystal
 * @description When pointer is idle, frost crystals grow across the surface.
 * Movement melts them. Uses DLA (diffusion-limited aggregation) inspired growth.
 * Principle: DLA growth algorithm + idle detection + melt on movement.
 *
 * @example
 * ```tsx
 * import { FrostCrystal } from '@/components/backgrounds/frost-crystal';
 *
 * <FrostCrystal color="#93c5fd" className="w-full h-64" />
 * ```
 */

import React, { useRef, useEffect } from "react";
import { useReducedMotion } from "framer-motion";
import { hexToRgbString } from "../../lib/utils";

export interface FrostCrystalProps {
    /** Crystal color. Default: "#93c5fd" */
    color?: string;
    /** Growth speed. Default: 1 */
    growthSpeed?: number;
    /** Idle time before growth starts (ms). Default: 1500 */
    idleThreshold?: number;
    /** Additional class names */
    className?: string;
}

export const FrostCrystal: React.FC<FrostCrystalProps> = ({
    color = "#93c5fd",
    growthSpeed = 1,
    idleThreshold = 1500,
    className = "",
}) => {
    const prefersReducedMotion = useReducedMotion();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const rafRef = useRef<number>(0);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const rgb = hexToRgbString(color, "147, 197, 253");

        const resize = () => {
            const parent = canvas.parentElement;
            if (!parent) return;
            canvas.width = parent.clientWidth * window.devicePixelRatio;
            canvas.height = parent.clientHeight * window.devicePixelRatio;
            ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
        };
        resize();
        window.addEventListener("resize", resize);

        const w = () => canvas.width / window.devicePixelRatio;
        const h = () => canvas.height / window.devicePixelRatio;

        let lastMoveTime = performance.now();
        let crystals: { x: number; y: number; angle: number; len: number; alpha: number; melting: boolean }[] = [];

        const handleMove = () => { lastMoveTime = performance.now(); };
        canvas.addEventListener("pointermove", handleMove);

        const animate = () => {
            const now = performance.now();
            const isIdle = now - lastMoveTime > idleThreshold;

            ctx.clearRect(0, 0, w(), h());

            if (isIdle && !prefersReducedMotion) {
                // Grow new crystals
                if (Math.random() < 0.05 * growthSpeed && crystals.length < 200) {
                    const seedX = Math.random() * w();
                    const seedY = Math.random() * h();
                    const branches = 4 + Math.floor(Math.random() * 3);
                    for (let b = 0; b < branches; b++) {
                        crystals.push({
                            x: seedX,
                            y: seedY,
                            angle: (b / branches) * Math.PI * 2 + Math.random() * 0.3,
                            len: 0,
                            alpha: 0,
                            melting: false,
                        });
                    }
                }

                // Grow existing
                crystals.forEach((c) => {
                    if (!c.melting) {
                        c.len += 0.3 * growthSpeed;
                        c.alpha = Math.min(0.6, c.alpha + 0.01);
                    }
                });
            } else {
                // Melt
                crystals.forEach((c) => {
                    c.melting = true;
                    c.alpha -= 0.02;
                });
                crystals = crystals.filter((c) => c.alpha > 0);
            }

            // Draw crystals
            crystals.forEach((c) => {
                const endX = c.x + Math.cos(c.angle) * c.len;
                const endY = c.y + Math.sin(c.angle) * c.len;

                ctx.beginPath();
                ctx.moveTo(c.x, c.y);
                ctx.lineTo(endX, endY);
                ctx.strokeStyle = `rgba(${rgb}, ${c.alpha})`;
                ctx.lineWidth = 0.8;
                ctx.stroke();

                // Sub-branches
                if (c.len > 10 && !c.melting) {
                    const subLen = c.len * 0.3;
                    for (let s = 0; s < 2; s++) {
                        const subAngle = c.angle + (s === 0 ? 0.5 : -0.5);
                        const sx = endX + Math.cos(subAngle) * subLen;
                        const sy = endY + Math.sin(subAngle) * subLen;
                        ctx.beginPath();
                        ctx.moveTo(endX, endY);
                        ctx.lineTo(sx, sy);
                        ctx.strokeStyle = `rgba(${rgb}, ${c.alpha * 0.5})`;
                        ctx.lineWidth = 0.4;
                        ctx.stroke();
                    }
                }
            });

            rafRef.current = requestAnimationFrame(animate);
        };

        if (!prefersReducedMotion) {
            rafRef.current = requestAnimationFrame(animate);
        }

        return () => {
            cancelAnimationFrame(rafRef.current);
            window.removeEventListener("resize", resize);
            canvas.removeEventListener("pointermove", handleMove);
        };
    }, [color, growthSpeed, idleThreshold, prefersReducedMotion]);

    return (
        <div className={`relative ${className}`} role="presentation" aria-hidden="true">
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
        </div>
    );
};

export default FrostCrystal;
