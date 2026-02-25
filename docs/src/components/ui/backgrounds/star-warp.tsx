"use client";

/**
 * @component StarWarp
 * @description Warp speed animation with lines radiating outward from a center point,
 * speed-based elongation effect.
 * Based on radial movement + velocity-based stroke width.
 *
 * @example
 * ```tsx
 * import { StarWarp } from '@/components/backgrounds/star-warp';
 *
 * <StarWarp
 *   starCount={200}
 *   speed={1}
 *   starColor="#e2e8f0"
 *   className="absolute inset-0 bg-black -z-10"
 * />
 * ```
 */

import React, { useRef, useEffect, useCallback } from "react";
import { hexToRgbString } from "@/lib/utils";
import { useReducedMotion } from "framer-motion";

export interface StarWarpProps {
    /** Number of stars. Default: 200 */
    starCount?: number;
    /** Speed multiplier. Default: 1 */
    speed?: number;
    /** Star color. Default: "#e2e8f0" */
    starColor?: string;
    /** Center X ratio (0–1). Default: 0.5 */
    centerX?: number;
    /** Center Y ratio (0–1). Default: 0.5 */
    centerY?: number;
    /** Maximum trail length. Default: 40 */
    maxTrail?: number;
    /** Additional class names */
    className?: string;
}

interface Star {
    x: number;
    y: number;
    z: number;
    prevX: number;
    prevY: number;
}

export const StarWarp: React.FC<StarWarpProps> = ({
    starCount = 200,
    speed = 1,
    starColor = "#e2e8f0",
    centerX = 0.5,
    centerY = 0.5,
    maxTrail = 40,
    className = "",
}) => {
    const prefersReducedMotion = useReducedMotion();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const starsRef = useRef<Star[]>([]);
    const rafRef = useRef<number>(0);



    const createStar = useCallback((): Star => {
        const angle = Math.random() * Math.PI * 2;
        const dist = Math.random() * 0.5;
        return {
            x: Math.cos(angle) * dist,
            y: Math.sin(angle) * dist,
            z: Math.random() * 4 + 0.5,
            prevX: 0,
            prevY: 0,
        };
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const rgb = hexToRgbString(starColor, "226, 232, 240");

        const resize = () => {
            const parent = canvas.parentElement;
            if (!parent) return;
            const rect = parent.getBoundingClientRect();
            canvas.width = rect.width * window.devicePixelRatio;
            canvas.height = rect.height * window.devicePixelRatio;
            ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
        };

        resize();
        window.addEventListener("resize", resize);

        // Initialize stars
        starsRef.current = Array.from({ length: starCount }, () => createStar());

        const animate = () => {
            const parent = canvas.parentElement;
            if (!parent) return;
            const rect = parent.getBoundingClientRect();
            const w = rect.width;
            const h = rect.height;
            const cx = w * centerX;
            const cy = h * centerY;

            ctx.fillStyle = "rgba(0, 0, 0, 0.15)";
            ctx.fillRect(0, 0, w, h);

            starsRef.current.forEach((star) => {
                // Save previous screen position
                const prevScreenX = cx + star.x * (w / star.z);
                const prevScreenY = cy + star.y * (h / star.z);

                // Move star closer (decrease z)
                star.z -= 0.02 * speed;

                if (star.z <= 0.01) {
                    Object.assign(star, createStar());
                    return;
                }

                // Calculate screen position
                const screenX = cx + star.x * (w / star.z);
                const screenY = cy + star.y * (h / star.z);

                // Check bounds
                if (screenX < -50 || screenX > w + 50 || screenY < -50 || screenY > h + 50) {
                    Object.assign(star, createStar());
                    return;
                }

                // Calculate velocity for trail length
                const vx = screenX - prevScreenX;
                const vy = screenY - prevScreenY;
                const velocity = Math.sqrt(vx * vx + vy * vy);
                const trailLen = Math.min(maxTrail, velocity * 2);

                // Brightness based on depth
                const brightness = Math.min(1, (4 - star.z) / 3);
                const width = Math.max(0.5, (1 / star.z) * 1.5);

                // Draw trail
                const trailEndX = screenX - (vx / (velocity || 1)) * trailLen;
                const trailEndY = screenY - (vy / (velocity || 1)) * trailLen;

                const gradient = ctx.createLinearGradient(trailEndX, trailEndY, screenX, screenY);
                gradient.addColorStop(0, `rgba(${rgb}, 0)`);
                gradient.addColorStop(1, `rgba(${rgb}, ${brightness})`);

                ctx.beginPath();
                ctx.moveTo(trailEndX, trailEndY);
                ctx.lineTo(screenX, screenY);
                ctx.strokeStyle = gradient;
                ctx.lineWidth = width;
                ctx.stroke();

                // Head dot
                ctx.beginPath();
                ctx.arc(screenX, screenY, width * 0.6, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${rgb}, ${brightness})`;
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
        };
    }, [starCount, speed, starColor, centerX, centerY, maxTrail, createStar]);

    return (
        <div className={`relative ${className}`} role="presentation" aria-hidden="true">
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
        </div>
    );
};

export default StarWarp;
