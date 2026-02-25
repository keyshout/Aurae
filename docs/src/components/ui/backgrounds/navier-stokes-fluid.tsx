"use client";

/**
 * @component NavierStokesFluid
 * @description Real-time simplified fluid dynamics simulation.
 * Pointer creates fluid currents, color diffuses through the field.
 * Principle: simplified Navier-Stokes velocity + density advection.
 *
 * @example
 * ```tsx
 * import { NavierStokesFluid } from '@/components/backgrounds/navier-stokes-fluid';
 *
 * <NavierStokesFluid color="#8b5cf6" viscosity={0.5} className="w-full h-96" />
 * ```
 */

import React, { useRef, useEffect } from "react";
import { useReducedMotion } from "framer-motion";
import { hexToRgb } from "@/lib/utils";

export interface NavierStokesFluidProps {
    /** Fluid color. Default: "#8b5cf6" */
    color?: string;
    /** Viscosity (0-1, higher = thicker). Default: 0.3 */
    viscosity?: number;
    /** Diffusion rate. Default: 0.0001 */
    diffusion?: number;
    /** Grid resolution. Default: 64 */
    resolution?: number;
    /** Additional class names */
    className?: string;
}

export const NavierStokesFluid: React.FC<NavierStokesFluidProps> = ({
    color = "#8b5cf6",
    viscosity = 0.3,
    diffusion = 0.0001,
    resolution = 64,
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

        const N = resolution;
        const size = (N + 2) * (N + 2);
        let density = new Float32Array(size);
        let densityPrev = new Float32Array(size);
        let velX = new Float32Array(size);
        let velY = new Float32Array(size);
        let velXPrev = new Float32Array(size);
        let velYPrev = new Float32Array(size);

        const IX = (x: number, y: number) => x + (N + 2) * y;

        const diffuse = (b: number, x: Float32Array, x0: Float32Array, diff: number, dt: number) => {
            const a = dt * diff * N * N;
            for (let k = 0; k < 4; k++) {
                for (let j = 1; j <= N; j++) {
                    for (let i = 1; i <= N; i++) {
                        x[IX(i, j)] = (x0[IX(i, j)] + a * (x[IX(i - 1, j)] + x[IX(i + 1, j)] + x[IX(i, j - 1)] + x[IX(i, j + 1)])) / (1 + 4 * a);
                    }
                }
            }
        };

        const advect = (b: number, d: Float32Array, d0: Float32Array, u: Float32Array, v: Float32Array, dt: number) => {
            const dt0 = dt * N;
            for (let j = 1; j <= N; j++) {
                for (let i = 1; i <= N; i++) {
                    let x = i - dt0 * u[IX(i, j)];
                    let y = j - dt0 * v[IX(i, j)];
                    x = Math.max(0.5, Math.min(N + 0.5, x));
                    y = Math.max(0.5, Math.min(N + 0.5, y));
                    const i0 = Math.floor(x); const i1 = i0 + 1;
                    const j0 = Math.floor(y); const j1 = j0 + 1;
                    const s1 = x - i0; const s0 = 1 - s1;
                    const t1 = y - j0; const t0 = 1 - t1;
                    d[IX(i, j)] = s0 * (t0 * d0[IX(i0, j0)] + t1 * d0[IX(i0, j1)]) +
                        s1 * (t0 * d0[IX(i1, j0)] + t1 * d0[IX(i1, j1)]);
                }
            }
        };

        const project = (u: Float32Array, v: Float32Array, p: Float32Array, div: Float32Array) => {
            for (let j = 1; j <= N; j++) {
                for (let i = 1; i <= N; i++) {
                    div[IX(i, j)] = -0.5 * (u[IX(i + 1, j)] - u[IX(i - 1, j)] + v[IX(i, j + 1)] - v[IX(i, j - 1)]) / N;
                    p[IX(i, j)] = 0;
                }
            }
            for (let k = 0; k < 4; k++) {
                for (let j = 1; j <= N; j++) {
                    for (let i = 1; i <= N; i++) {
                        p[IX(i, j)] = (div[IX(i, j)] + p[IX(i - 1, j)] + p[IX(i + 1, j)] + p[IX(i, j - 1)] + p[IX(i, j + 1)]) / 4;
                    }
                }
            }
            for (let j = 1; j <= N; j++) {
                for (let i = 1; i <= N; i++) {
                    u[IX(i, j)] -= 0.5 * N * (p[IX(i + 1, j)] - p[IX(i - 1, j)]);
                    v[IX(i, j)] -= 0.5 * N * (p[IX(i, j + 1)] - p[IX(i, j - 1)]);
                }
            }
        };

        let prevMouse = { x: 0, y: 0 };
        const handleMove = (e: PointerEvent) => {
            const rect = canvas.getBoundingClientRect();
            const mx = e.clientX - rect.left;
            const my = e.clientY - rect.top;
            const gi = Math.floor((mx / w()) * N) + 1;
            const gj = Math.floor((my / h()) * N) + 1;

            if (gi > 0 && gi <= N && gj > 0 && gj <= N) {
                density[IX(gi, gj)] += 50;
                velX[IX(gi, gj)] += (mx - prevMouse.x) * 0.5;
                velY[IX(gi, gj)] += (my - prevMouse.y) * 0.5;
            }
            prevMouse = { x: mx, y: my };
        };
        canvas.addEventListener("pointermove", handleMove);

        const rgb = hexToRgb(color) ?? { r: 139, g: 92, b: 246 };
        const dt = 0.1;

        const animate = () => {
            // Velocity step
            [velX, velXPrev] = [velXPrev, velX];
            diffuse(1, velX, velXPrev, viscosity, dt);
            [velY, velYPrev] = [velYPrev, velY];
            diffuse(2, velY, velYPrev, viscosity, dt);
            project(velX, velY, velXPrev, velYPrev);
            [velX, velXPrev] = [velXPrev, velX];
            [velY, velYPrev] = [velYPrev, velY];
            advect(1, velX, velXPrev, velXPrev, velYPrev, dt);
            advect(2, velY, velYPrev, velXPrev, velYPrev, dt);
            project(velX, velY, velXPrev, velYPrev);

            // Density step
            [density, densityPrev] = [densityPrev, density];
            diffuse(0, density, densityPrev, diffusion, dt);
            [density, densityPrev] = [densityPrev, density];
            advect(0, density, densityPrev, velX, velY, dt);

            // Render
            const cw = w();
            const ch = h();
            ctx.clearRect(0, 0, cw, ch);
            const cellW = cw / N;
            const cellH = ch / N;

            for (let j = 1; j <= N; j++) {
                for (let i = 1; i <= N; i++) {
                    const d = Math.min(1, density[IX(i, j)] / 100);
                    if (d > 0.01) {
                        ctx.fillStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${d})`;
                        ctx.fillRect((i - 1) * cellW, (j - 1) * cellH, cellW + 1, cellH + 1);
                    }
                }
            }

            // Decay
            for (let i = 0; i < size; i++) density[i] *= 0.99;

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
            canvas.removeEventListener("pointermove", handleMove);
        };
    }, [color, viscosity, diffusion, resolution, prefersReducedMotion]);

    return (
        <div className={`relative ${className}`} role="presentation" aria-hidden="true">
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
        </div>
    );
};

export default NavierStokesFluid;
