"use client";

/**
 * @component ParticleCoalesceLoader
 * @description Scattered particles slowly coalesce into a target shape,
 * then the content becomes clear. Uses particle target interpolation.
 * Principle: particle-to-target interpolation + gaussian blur to clear.
 *
 * @example
 * ```tsx
 * import { ParticleCoalesceLoader } from '@/components/loaders/particle-coalesce-loader';
 *
 * <ParticleCoalesceLoader
 *   particleCount={30}
 *   color="#8b5cf6"
 *   className="w-full h-32"
 * />
 * ```
 */

import React, { useRef, useEffect } from "react";
import { useReducedMotion } from "framer-motion";
import { hexToRgbString } from "@/lib/utils";

export interface ParticleCoalesceLoaderProps {
    /** Number of particles. Default: 24 */
    particleCount?: number;
    /** Particle color. Default: "#8b5cf6" */
    color?: string;
    /** Coalesce duration in seconds. Default: 3 */
    duration?: number;
    /** Additional class names */
    className?: string;
}

interface Particle {
    x: number; y: number;
    targetX: number; targetY: number;
    size: number;
    vx: number; vy: number;
}

export const ParticleCoalesceLoader: React.FC<ParticleCoalesceLoaderProps> = ({
    particleCount = 24,
    color = "#8b5cf6",
    duration = 3,
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

        const rgb = hexToRgbString(color, "139, 92, 246");

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

        // Create particles with random positions and center targets
        const particles: Particle[] = Array.from({ length: particleCount }, () => ({
            x: Math.random() * (w() || 200),
            y: Math.random() * (h() || 100),
            targetX: (w() || 200) * (0.3 + Math.random() * 0.4),
            targetY: (h() || 100) * (0.3 + Math.random() * 0.4),
            size: 2 + Math.random() * 3,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2,
        }));

        const startTime = performance.now();
        const durationMs = duration * 1000;

        const animate = () => {
            const elapsed = performance.now() - startTime;
            const progress = Math.min(1, (elapsed % (durationMs * 2)) / durationMs);
            const phase = elapsed % (durationMs * 2) < durationMs ? progress : 1 - progress;

            ctx.clearRect(0, 0, w(), h());

            particles.forEach((p) => {
                // Interpolate toward target based on progress
                const ease = phase * phase * (3 - 2 * phase); // smoothstep
                const drawX = p.x + (p.targetX - p.x) * ease;
                const drawY = p.y + (p.targetY - p.y) * ease;

                // Add slight drift when scattered
                if (phase < 0.3) {
                    p.x += p.vx * 0.5;
                    p.y += p.vy * 0.5;
                    // Bounce
                    if (p.x < 0 || p.x > w()) p.vx *= -1;
                    if (p.y < 0 || p.y > h()) p.vy *= -1;
                }

                const alpha = 0.3 + ease * 0.7;
                const size = p.size * (1 - ease * 0.3);

                ctx.beginPath();
                ctx.arc(drawX, drawY, size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${rgb}, ${alpha})`;
                ctx.fill();

                // Connected lines when close
                if (ease > 0.5) {
                    particles.forEach((other) => {
                        if (other === p) return;
                        const ox = other.x + (other.targetX - other.x) * ease;
                        const oy = other.y + (other.targetY - other.y) * ease;
                        const dx = drawX - ox;
                        const dy = drawY - oy;
                        const dist = Math.sqrt(dx * dx + dy * dy);
                        if (dist < 40) {
                            ctx.beginPath();
                            ctx.moveTo(drawX, drawY);
                            ctx.lineTo(ox, oy);
                            ctx.strokeStyle = `rgba(${rgb}, ${(1 - dist / 40) * 0.2})`;
                            ctx.lineWidth = 0.5;
                            ctx.stroke();
                        }
                    });
                }
            });

            if (!prefersReducedMotion) {
                rafRef.current = requestAnimationFrame(animate);
            }
        };

        if (!prefersReducedMotion) {
            rafRef.current = requestAnimationFrame(animate);
        }

        return () => {
            cancelAnimationFrame(rafRef.current);
            window.removeEventListener("resize", resize);
        };
    }, [color, particleCount, duration, prefersReducedMotion]);

    return (
        <div className={`relative ${className}`} role="status" aria-label="Loading">
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
        </div>
    );
};

export default ParticleCoalesceLoader;
