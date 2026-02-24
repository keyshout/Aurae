"use client";

/**
 * @component MyceliumNetwork
 * @description Thin fungal mycelium branches grow, die and regrow randomly
 * across the surface. L-system inspired growth algorithm.
 * Principle: recursive branching growth + canvas rendering + lifecycle decay.
 *
 * @example
 * ```tsx
 * import { MyceliumNetwork } from '@/components/backgrounds/mycelium-network';
 *
 * <MyceliumNetwork color="#10b981" growthSpeed={1} className="w-full h-64" />
 * ```
 */

import React, { useRef, useEffect } from "react";
import { useReducedMotion } from "framer-motion";
import { hexToRgbString } from "../../lib/utils";

interface Branch {
    x: number; y: number;
    angle: number;
    length: number;
    life: number;
    maxLife: number;
    width: number;
    speed: number;
    children: Branch[];
}

export interface MyceliumNetworkProps {
    /** Mycelium color. Default: "#10b981" */
    color?: string;
    /** Growth speed multiplier. Default: 1 */
    growthSpeed?: number;
    /** Maximum branches. Default: 80 */
    maxBranches?: number;
    /** Additional class names */
    className?: string;
}

export const MyceliumNetwork: React.FC<MyceliumNetworkProps> = ({
    color = "#10b981",
    growthSpeed = 1,
    maxBranches = 80,
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

        const rgb = hexToRgbString(color, "16, 185, 129");

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

        const branches: Branch[] = [];

        const createBranch = (): Branch => ({
            x: Math.random() * w(),
            y: Math.random() * h(),
            angle: Math.random() * Math.PI * 2,
            length: 0,
            life: 0,
            maxLife: 200 + Math.random() * 300,
            width: 0.5 + Math.random() * 1.5,
            speed: (0.3 + Math.random() * 0.7) * growthSpeed,
            children: [],
        });

        // Seed initial branches
        for (let i = 0; i < 5; i++) branches.push(createBranch());

        const animate = () => {
            ctx.fillStyle = "rgba(0, 0, 0, 0.02)";
            ctx.fillRect(0, 0, w(), h());

            branches.forEach((branch, idx) => {
                if (branch.life > branch.maxLife) {
                    // Respawn
                    branches[idx] = createBranch();
                    return;
                }

                branch.life += branch.speed;

                // Organic direction change
                branch.angle += (Math.random() - 0.5) * 0.3;

                const prevX = branch.x;
                const prevY = branch.y;
                branch.x += Math.cos(branch.angle) * branch.speed;
                branch.y += Math.sin(branch.angle) * branch.speed;

                // Fade based on lifecycle
                const lifeRatio = branch.life / branch.maxLife;
                const alpha = lifeRatio < 0.1 ? lifeRatio * 10 : lifeRatio > 0.7 ? (1 - lifeRatio) / 0.3 : 1;

                ctx.beginPath();
                ctx.moveTo(prevX, prevY);
                ctx.lineTo(branch.x, branch.y);
                ctx.strokeStyle = `rgba(${rgb}, ${alpha * 0.6})`;
                ctx.lineWidth = branch.width * (1 - lifeRatio * 0.5);
                ctx.stroke();

                // Branching probability
                if (Math.random() < 0.005 && branches.length < maxBranches) {
                    branches.push({
                        x: branch.x,
                        y: branch.y,
                        angle: branch.angle + (Math.random() - 0.5) * 1.5,
                        length: 0,
                        life: 0,
                        maxLife: branch.maxLife * 0.6,
                        width: branch.width * 0.7,
                        speed: branch.speed * 0.8,
                        children: [],
                    });
                }
            });

            if (!prefersReducedMotion) {
                rafRef.current = requestAnimationFrame(animate);
            }
        };

        rafRef.current = requestAnimationFrame(animate);

        return () => {
            cancelAnimationFrame(rafRef.current);
            window.removeEventListener("resize", resize);
        };
    }, [color, growthSpeed, maxBranches, prefersReducedMotion]);

    return (
        <div className={`relative ${className}`} role="presentation" aria-hidden="true">
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
        </div>
    );
};

export default MyceliumNetwork;
