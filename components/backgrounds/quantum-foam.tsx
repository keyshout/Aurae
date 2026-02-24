"use client";

/**
 * @component QuantumFoam
 * @description Space-time foam: organic bubbles randomly exist, grow, and annihilate each other.
 * Based on random scale/opacity cycles + radial gradients.
 *
 * @example
 * ```tsx
 * import { QuantumFoam } from '@/components/backgrounds/quantum-foam';
 *
 * <QuantumFoam
 *   bubbleCount={30}
 *   colors={['#818cf8', '#c084fc', '#f472b6']}
 *   className="absolute inset-0 -z-10"
 * />
 * ```
 */

import React, { useMemo, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

export interface QuantumFoamProps {
    /** Number of foam bubbles. Default: 30 */
    bubbleCount?: number;
    /** Bubble colors. Default: indigo/purple/pink */
    colors?: string[];
    /** Speed multiplier. Default: 1 */
    speed?: number;
    /** Maximum bubble radius in pixels. Default: 80 */
    maxRadius?: number;
    /** Minimum bubble radius in pixels. Default: 10 */
    minRadius?: number;
    /** Additional class names */
    className?: string;
}

interface Bubble {
    id: number;
    x: number;
    y: number;
    r: number;
    targetR: number;
    opacity: number;
    color: string;
    phase: "growing" | "stable" | "shrinking";
    speed: number;
    life: number;
    maxLife: number;
}

export const QuantumFoam: React.FC<QuantumFoamProps> = ({
    bubbleCount = 30,
    colors = ["#818cf8", "#c084fc", "#f472b6"],
    speed = 1,
    maxRadius = 80,
    minRadius = 10,
    className = "",
}) => {
    const prefersReducedMotion = useReducedMotion();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const bubblesRef = useRef<Bubble[]>([]);
    const rafRef = useRef<number>(0);
    const idCounter = useRef(0);
    const [, setTick] = useState(0);

    const createBubble = useMemo(
        () => (canvas: HTMLCanvasElement): Bubble => {
            const r = minRadius + Math.random() * (maxRadius - minRadius);
            return {
                id: idCounter.current++,
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                r: 0,
                targetR: r,
                opacity: 0,
                color: colors[Math.floor(Math.random() * colors.length)],
                phase: "growing",
                speed: (0.3 + Math.random() * 0.7) * speed,
                life: 0,
                maxLife: 200 + Math.random() * 300,
            };
        },
        [colors, maxRadius, minRadius, speed]
    );

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
                ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
            }
        };

        resize();
        window.addEventListener("resize", resize);

        // Initialize bubbles
        bubblesRef.current = Array.from({ length: bubbleCount }, () =>
            createBubble(canvas)
        );

        const animate = () => {
            const rect = canvas.parentElement?.getBoundingClientRect();
            if (!rect) return;

            const w = rect.width;
            const h = rect.height;

            ctx.clearRect(0, 0, w, h);

            bubblesRef.current.forEach((bubble) => {
                bubble.life += bubble.speed;

                switch (bubble.phase) {
                    case "growing":
                        bubble.r += (bubble.targetR - bubble.r) * 0.02 * bubble.speed;
                        bubble.opacity = Math.min(0.4, bubble.opacity + 0.005 * bubble.speed);
                        if (bubble.r > bubble.targetR * 0.95) bubble.phase = "stable";
                        break;
                    case "stable":
                        bubble.r += Math.sin(bubble.life * 0.02) * 0.5;
                        if (bubble.life > bubble.maxLife) bubble.phase = "shrinking";
                        break;
                    case "shrinking":
                        bubble.r *= 0.97;
                        bubble.opacity *= 0.96;
                        break;
                }

                // Drift
                bubble.x += Math.sin(bubble.life * 0.005 + bubble.id) * 0.3;
                bubble.y += Math.cos(bubble.life * 0.004 + bubble.id * 0.7) * 0.2;

                // Draw
                if (bubble.opacity > 0.005 && bubble.r > 1) {
                    const gradient = ctx.createRadialGradient(
                        bubble.x,
                        bubble.y,
                        0,
                        bubble.x,
                        bubble.y,
                        bubble.r
                    );
                    gradient.addColorStop(0, bubble.color + Math.round(bubble.opacity * 255).toString(16).padStart(2, "0"));
                    gradient.addColorStop(0.6, bubble.color + Math.round(bubble.opacity * 128).toString(16).padStart(2, "0"));
                    gradient.addColorStop(1, "transparent");

                    ctx.beginPath();
                    ctx.arc(bubble.x, bubble.y, bubble.r, 0, Math.PI * 2);
                    ctx.fillStyle = gradient;
                    ctx.fill();
                }
            });

            // Replace dead bubbles
            bubblesRef.current = bubblesRef.current.map((b) => {
                if (b.phase === "shrinking" && (b.opacity < 0.01 || b.r < 1)) {
                    return createBubble(canvas);
                }
                return b;
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
        };
    }, [bubbleCount, createBubble]);

    return (
        <div className={`relative ${className}`} role="presentation" aria-hidden="true">
            <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full"
                style={{ opacity: 0.7 }}
            />
        </div>
    );
};

export default QuantumFoam;
