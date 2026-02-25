"use client";

/**
 * @component DataSand
 * @description Sand-grain data points that are pushed by the pointer
 * and flow back to defined flow lines over time.
 * Based on particle physics simulation + flow field.
 *
 * @example
 * ```tsx
 * import { DataSand } from '@/components/backgrounds/data-sand';
 *
 * <DataSand
 *   particleCount={500}
 *   sandColor="#d97706"
 *   className="absolute inset-0 -z-10"
 * />
 * ```
 */

import React, { useRef, useEffect, useCallback } from "react";
import { hexToRgbString } from "@/lib/utils";
import { useReducedMotion } from "framer-motion";

export interface DataSandProps {
    /** Number of particles. Default: 500 */
    particleCount?: number;
    /** Sand grain color. Default: "#d97706" */
    sandColor?: string;
    /** Push radius in pixels. Default: 80 */
    pushRadius?: number;
    /** Push force strength. Default: 5 */
    pushForce?: number;
    /** Flow field strength (0–1). Default: 0.3 */
    flowStrength?: number;
    /** Particle size. Default: 1.5 */
    particleSize?: number;
    /** Additional class names */
    className?: string;
}

interface Particle {
    x: number;
    y: number;
    homeX: number;
    homeY: number;
    vx: number;
    vy: number;
    size: number;
}

export const DataSand: React.FC<DataSandProps> = ({
    particleCount = 500,
    sandColor = "#d97706",
    pushRadius = 80,
    pushForce = 5,
    flowStrength = 0.3,
    particleSize = 1.5,
    className = "",
}) => {
    const prefersReducedMotion = useReducedMotion();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const particlesRef = useRef<Particle[]>([]);
    const pointerRef = useRef({ x: -9999, y: -9999, active: false });
    const rafRef = useRef<number>(0);



    // Flow field: returns desired direction at a point
    const getFlowAngle = useCallback((x: number, y: number, w: number, h: number) => {
        const nx = x / w;
        const ny = y / h;
        return Math.sin(nx * 4) * Math.cos(ny * 3) * Math.PI * 2;
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const rgb = hexToRgbString(sandColor, "217, 119, 6");

        const resize = () => {
            const parent = canvas.parentElement;
            if (!parent) return;
            const rect = parent.getBoundingClientRect();
            canvas.width = rect.width * window.devicePixelRatio;
            canvas.height = rect.height * window.devicePixelRatio;
            ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);

            // Initialize particles along flow lines
            const w = rect.width;
            const h = rect.height;
            particlesRef.current = Array.from({ length: particleCount }, () => {
                const x = Math.random() * w;
                const y = Math.random() * h;
                return {
                    x,
                    y,
                    homeX: x,
                    homeY: y,
                    vx: 0,
                    vy: 0,
                    size: particleSize * (0.5 + Math.random()),
                };
            });
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

        const animate = () => {
            const parent = canvas.parentElement;
            if (!parent) return;
            const rect = parent.getBoundingClientRect();
            const w = rect.width;
            const h = rect.height;
            const pointer = pointerRef.current;

            ctx.clearRect(0, 0, w, h);

            particlesRef.current.forEach((p) => {
                // Pointer push
                if (pointer.active) {
                    const dx = p.x - pointer.x;
                    const dy = p.y - pointer.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < pushRadius && dist > 0) {
                        const force = ((pushRadius - dist) / pushRadius) * pushForce;
                        p.vx += (dx / dist) * force;
                        p.vy += (dy / dist) * force;
                    }
                }

                // Flow field attraction
                const flowAngle = getFlowAngle(p.x, p.y, w, h);
                p.vx += Math.cos(flowAngle) * flowStrength * 0.1;
                p.vy += Math.sin(flowAngle) * flowStrength * 0.1;

                // Home attraction (gentle return)
                p.vx += (p.homeX - p.x) * 0.003;
                p.vy += (p.homeY - p.y) * 0.003;

                // Friction
                p.vx *= 0.92;
                p.vy *= 0.92;

                // Update position
                p.x += p.vx;
                p.y += p.vy;

                // Wrap around edges
                if (p.x < -10) p.x = w + 10;
                if (p.x > w + 10) p.x = -10;
                if (p.y < -10) p.y = h + 10;
                if (p.y > h + 10) p.y = -10;

                // Draw
                const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
                const alpha = 0.3 + Math.min(0.7, speed * 0.15);

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${rgb}, ${alpha})`;
                ctx.fill();
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
            canvas.removeEventListener("pointerleave", handleLeave);
        };
    }, [particleCount, sandColor, pushRadius, pushForce, flowStrength, particleSize, getFlowAngle]);

    return (
        <div className={`relative ${className}`} role="presentation" aria-hidden="true">
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
        </div>
    );
};

export default DataSand;
