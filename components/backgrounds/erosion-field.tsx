"use client";

/**
 * @component ErosionField
 * @description Surface erodes over time: pixel blocks fade and regenerate,
 * simulating geological erosion with Perlin-like noise patterns.
 * Principle: canvas pixel manipulation + simplex noise for erosion patterns.
 *
 * @example
 * ```tsx
 * import { ErosionField } from '@/components/backgrounds/erosion-field';
 *
 * <ErosionField color="#8b5cf6" erosionSpeed={0.5} className="w-full h-64" />
 * ```
 */

import React, { useRef, useEffect } from "react";
import { useReducedMotion } from "framer-motion";
import { hexToRgbString } from "../../lib/utils";

export interface ErosionFieldProps {
    /** Erosion color. Default: "#8b5cf6" */
    color?: string;
    /** Erosion speed. Default: 0.5 */
    erosionSpeed?: number;
    /** Block size in px. Default: 6 */
    blockSize?: number;
    /** Additional class names */
    className?: string;
}

export const ErosionField: React.FC<ErosionFieldProps> = ({
    color = "#8b5cf6",
    erosionSpeed = 0.5,
    blockSize = 6,
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

        // Simple hash noise function
        const noise = (x: number, y: number, t: number) => {
            const n = Math.sin(x * 12.9898 + y * 78.233 + t * 43.5453) * 43758.5453;
            return n - Math.floor(n);
        };

        let time = 0;

        const animate = () => {
            time += 0.01 * erosionSpeed;
            ctx.clearRect(0, 0, w(), h());

            const cols = Math.ceil(w() / blockSize);
            const rows = Math.ceil(h() / blockSize);

            for (let row = 0; row < rows; row++) {
                for (let col = 0; col < cols; col++) {
                    const n1 = noise(col * 0.1, row * 0.1, time);
                    const n2 = noise(col * 0.05 + 100, row * 0.05 + 100, time * 0.7);
                    const combined = (n1 + n2) / 2;

                    // Erosion threshold creates organic patterns
                    if (combined > 0.35) {
                        const alpha = (combined - 0.35) / 0.65;
                        ctx.fillStyle = `rgba(${rgb}, ${alpha * 0.4})`;
                        ctx.fillRect(col * blockSize, row * blockSize, blockSize - 1, blockSize - 1);
                    }
                }
            }

            if (!prefersReducedMotion) {
                rafRef.current = requestAnimationFrame(animate);
            }
        };

        rafRef.current = requestAnimationFrame(animate);

        return () => {
            cancelAnimationFrame(rafRef.current);
            window.removeEventListener("resize", resize);
        };
    }, [color, erosionSpeed, blockSize, prefersReducedMotion]);

    return (
        <div className={`relative ${className}`} role="presentation" aria-hidden="true">
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
        </div>
    );
};

export default ErosionField;
