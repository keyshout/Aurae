"use client";

/**
 * @component TopographicalPulse
 * @description Contour map lines deform locally based on pointer position.
 * Clicking emits a ring-shaped wave that propagates outward.
 * Based on SVG path morph + mouse coordinate deformation.
 *
 * @example
 * ```tsx
 * import { TopographicalPulse } from '@/components/backgrounds/topographical-pulse';
 *
 * <TopographicalPulse
 *   lineCount={15}
 *   lineColor="#22d3ee"
 *   className="absolute inset-0 -z-10"
 * />
 * ```
 */

import React, { useRef, useEffect, useState, useCallback } from "react";
import { useReducedMotion } from "framer-motion";

export interface TopographicalPulseProps {
    /** Number of contour lines. Default: 15 */
    lineCount?: number;
    /** Line color. Default: "#22d3ee" */
    lineColor?: string;
    /** Line opacity. Default: 0.3 */
    lineOpacity?: number;
    /** Deformation radius in pixels. Default: 120 */
    deformRadius?: number;
    /** Deformation strength. Default: 30 */
    deformStrength?: number;
    /** Pulse wave speed. Default: 3 */
    pulseSpeed?: number;
    /** Additional class names */
    className?: string;
}

interface Pulse {
    x: number;
    y: number;
    radius: number;
    opacity: number;
    id: number;
}

export const TopographicalPulse: React.FC<TopographicalPulseProps> = ({
    lineCount = 15,
    lineColor = "#22d3ee",
    lineOpacity = 0.3,
    deformRadius = 120,
    deformStrength = 30,
    pulseSpeed = 3,
    className = "",
}) => {
    const prefersReducedMotion = useReducedMotion();
    const svgRef = useRef<SVGSVGElement>(null);
    const pointerRef = useRef({ x: -9999, y: -9999 });
    const pulsesRef = useRef<Pulse[]>([]);
    const pulseIdRef = useRef(0);
    const rafRef = useRef<number>(0);
    const [paths, setPaths] = useState<string[]>([]);
    const [pulses, setPulses] = useState<Pulse[]>([]);

    const generatePaths = useCallback(() => {
        const svg = svgRef.current;
        if (!svg) return;

        const rect = svg.getBoundingClientRect();
        const w = rect.width;
        const h = rect.height;
        const pointer = pointerRef.current;
        const activePulses = pulsesRef.current;

        const newPaths: string[] = [];

        for (let i = 0; i < lineCount; i++) {
            const baseY = (h / (lineCount + 1)) * (i + 1);
            const points: string[] = [];
            const segments = 40;

            for (let j = 0; j <= segments; j++) {
                const x = (w / segments) * j;
                let y = baseY;

                // Sinusoidal base variation
                y += Math.sin(x * 0.01 + i * 0.5) * 8;
                y += Math.cos(x * 0.02 - i * 0.3) * 5;

                // Pointer deformation
                const dx = x - pointer.x;
                const dy = y - pointer.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < deformRadius) {
                    const force = (1 - dist / deformRadius) * deformStrength;
                    y += force * Math.sign(dy || 1);
                }

                // Pulse wave deformation
                activePulses.forEach((pulse) => {
                    const pdx = x - pulse.x;
                    const pdy = y - pulse.y;
                    const pdist = Math.sqrt(pdx * pdx + pdy * pdy);
                    const ringDist = Math.abs(pdist - pulse.radius);
                    if (ringDist < 30) {
                        const waveForce = (1 - ringDist / 30) * 15 * pulse.opacity;
                        y += waveForce * Math.sin(pdist * 0.1);
                    }
                });

                points.push(j === 0 ? `M ${x} ${y}` : `L ${x} ${y}`);
            }

            newPaths.push(points.join(" "));
        }

        setPaths(newPaths);
    }, [lineCount, deformRadius, deformStrength]);

    useEffect(() => {
        const svg = svgRef.current;
        if (!svg) return;

        const handleMove = (e: PointerEvent) => {
            const rect = svg.getBoundingClientRect();
            pointerRef.current = {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
            };
        };

        const handleClick = (e: MouseEvent) => {
            const rect = svg.getBoundingClientRect();
            const newPulse: Pulse = {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
                radius: 0,
                opacity: 1,
                id: pulseIdRef.current++,
            };
            pulsesRef.current.push(newPulse);
        };

        svg.addEventListener("pointermove", handleMove);
        svg.addEventListener("click", handleClick);

        let active = true;
        const animate = () => {
            if (!active) return;

            // Update pulses
            pulsesRef.current = pulsesRef.current.filter((p) => {
                p.radius += pulseSpeed;
                p.opacity *= 0.985;
                return p.opacity > 0.01;
            });
            setPulses([...pulsesRef.current]);

            generatePaths();
            rafRef.current = requestAnimationFrame(animate);
        };

        rafRef.current = requestAnimationFrame(animate);

        return () => {
            active = false;
            cancelAnimationFrame(rafRef.current);
            svg.removeEventListener("pointermove", handleMove);
            svg.removeEventListener("click", handleClick);
        };
    }, [generatePaths, pulseSpeed]);

    return (
        <svg
            ref={svgRef}
            className={`w-full h-full ${className}`}
            role="presentation"
            aria-hidden="true"
        >
            {/* Contour lines */}
            {paths.map((d, i) => (
                <path
                    key={i}
                    d={d}
                    fill="none"
                    stroke={lineColor}
                    strokeWidth={1}
                    strokeOpacity={lineOpacity}
                    style={{ transition: "d 0.05s" }}
                />
            ))}

            {/* Pulse rings */}
            {pulses.map((pulse) => (
                <circle
                    key={pulse.id}
                    cx={pulse.x}
                    cy={pulse.y}
                    r={pulse.radius}
                    fill="none"
                    stroke={lineColor}
                    strokeWidth={2}
                    strokeOpacity={pulse.opacity * 0.5}
                />
            ))}
        </svg>
    );
};

export default TopographicalPulse;
