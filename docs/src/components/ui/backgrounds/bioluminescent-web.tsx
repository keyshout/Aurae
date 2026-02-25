"use client";

/**
 * @component BioluminescentWeb
 * @description On a pitch-black background, organic luminescent veins slowly
 * glow where the pointer has been, like jellyfish tentacles.
 * Based on mouse trail + SVG path glow + damping fade.
 *
 * @example
 * ```tsx
 * import { BioluminescentWeb } from '@/components/backgrounds/bioluminescent-web';
 *
 * <BioluminescentWeb
 *   glowColor="#06b6d4"
 *   trailLength={40}
 *   className="absolute inset-0"
 * />
 * ```
 */

import React, { useRef, useEffect } from "react";
import { hexToRgb } from "@/lib/utils";
import { useReducedMotion } from "framer-motion";

export interface BioluminescentWebProps {
    /** Glow color. Default: "#06b6d4" */
    glowColor?: string;
    /** Number of trail points stored. Default: 40 */
    trailLength?: number;
    /** Fade speed (0–1, higher = faster fade). Default: 0.015 */
    fadeSpeed?: number;
    /** Line width. Default: 2 */
    lineWidth?: number;
    /** Branch probability (0–1). Default: 0.15 */
    branchProbability?: number;
    /** Additional class names */
    className?: string;
}

interface TrailPoint {
    x: number;
    y: number;
    age: number;
    branches: Array<{ x: number; y: number; opacity: number }>;
}

export const BioluminescentWeb: React.FC<BioluminescentWebProps> = ({
    glowColor = "#06b6d4",
    trailLength = 40,
    fadeSpeed = 0.015,
    lineWidth = 2,
    branchProbability = 0.15,
    className = "",
}) => {
    const prefersReducedMotion = useReducedMotion();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const trailRef = useRef<TrailPoint[]>([]);
    const pointerRef = useRef({ x: -1, y: -1, active: false });
    const rafRef = useRef<number>(0);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const resize = () => {
            const rect = canvas.parentElement?.getBoundingClientRect();
            if (rect) {
                canvas.width = rect.width * window.devicePixelRatio;
                canvas.height = rect.height * window.devicePixelRatio;
                ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
            }
        };

        resize();
        window.addEventListener("resize", resize);

        const handleMove = (e: PointerEvent) => {
            const rect = canvas.getBoundingClientRect();
            pointerRef.current = {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
                active: true,
            };
        };

        const handleLeave = () => {
            pointerRef.current.active = false;
        };

        canvas.addEventListener("pointermove", handleMove);
        canvas.addEventListener("pointerleave", handleLeave);

        const rgb = hexToRgb(glowColor) ?? { r: 6, g: 182, b: 212 };

        const animate = () => {
            const rect = canvas.parentElement?.getBoundingClientRect();
            if (!rect) return;

            const w = rect.width;
            const h = rect.height;

            // Dim existing content
            ctx.fillStyle = `rgba(0, 0, 0, ${fadeSpeed * 3})`;
            ctx.fillRect(0, 0, w, h);

            const pointer = pointerRef.current;

            // Add new trail point
            if (pointer.active && pointer.x >= 0) {
                const lastPoint = trailRef.current[trailRef.current.length - 1];
                const dist = lastPoint
                    ? Math.sqrt((pointer.x - lastPoint.x) ** 2 + (pointer.y - lastPoint.y) ** 2)
                    : 999;

                if (dist > 8) {
                    const branches: TrailPoint["branches"] = [];

                    // Randomly create branches
                    if (Math.random() < branchProbability) {
                        const angle = Math.random() * Math.PI * 2;
                        const branchLen = 30 + Math.random() * 50;
                        branches.push({
                            x: pointer.x + Math.cos(angle) * branchLen,
                            y: pointer.y + Math.sin(angle) * branchLen,
                            opacity: 0.6,
                        });
                    }

                    trailRef.current.push({
                        x: pointer.x,
                        y: pointer.y,
                        age: 0,
                        branches,
                    });

                    if (trailRef.current.length > trailLength) {
                        trailRef.current.shift();
                    }
                }
            }

            // Draw trail
            const trail = trailRef.current;
            if (trail.length > 1) {
                for (let i = 1; i < trail.length; i++) {
                    const prev = trail[i - 1];
                    const curr = trail[i];
                    const alpha = Math.max(0, 1 - curr.age * fadeSpeed);

                    if (alpha > 0.01) {
                        ctx.beginPath();
                        ctx.moveTo(prev.x, prev.y);
                        ctx.lineTo(curr.x, curr.y);
                        ctx.strokeStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
                        ctx.lineWidth = lineWidth;
                        ctx.shadowColor = glowColor;
                        ctx.shadowBlur = 12 * alpha;
                        ctx.stroke();

                        // Draw branches
                        curr.branches.forEach((branch: TrailPoint["branches"][number]) => {
                            if (branch.opacity > 0.01) {
                                ctx.beginPath();
                                ctx.moveTo(curr.x, curr.y);
                                ctx.lineTo(branch.x, branch.y);
                                ctx.strokeStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${branch.opacity * alpha})`;
                                ctx.lineWidth = lineWidth * 0.5;
                                ctx.shadowBlur = 8 * branch.opacity;
                                ctx.stroke();
                                branch.opacity *= 0.98;
                            }
                        });
                    }

                    curr.age++;
                }
            }

            ctx.shadowBlur = 0;
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
            canvas.removeEventListener("pointerleave", handleLeave);
        };
    }, [glowColor, trailLength, fadeSpeed, lineWidth, branchProbability]);

    return (
        <div
            className={`relative bg-black ${className}`}
            role="presentation"
            aria-hidden="true"
        >
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
        </div>
    );
};

export default BioluminescentWeb;
