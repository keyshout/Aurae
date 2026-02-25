import dynamic from 'next/dynamic';

export const Registry: Record<string, { component: any, name: string, category: string, slug: string, code: string }> = {
  "backgrounds/bioluminescent-web": {
    component: dynamic(() => import("@/components/ui/backgrounds/bioluminescent-web").then(mod => mod.BioluminescentWeb || mod.default)),
    name: "Bioluminescent Web",
    category: "backgrounds",
    slug: "bioluminescent-web",
    code: `"use client";

/**
 * @component BioluminescentWeb
 * @description On a pitch-black background, organic luminescent veins slowly
 * glow where the pointer has been, like jellyfish tentacles.
 * Based on mouse trail + SVG path glow + damping fade.
 *
 * @example
 * \`\`\`tsx
 * import { BioluminescentWeb } from '@/components/backgrounds/bioluminescent-web';
 *
 * <BioluminescentWeb
 *   glowColor="#06b6d4"
 *   trailLength={40}
 *   className="absolute inset-0"
 * />
 * \`\`\`
 */

import React, { useRef, useEffect } from "react";
import { hexToRgb } from "../../lib/utils";
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
            ctx.fillStyle = \`rgba(0, 0, 0, \${fadeSpeed * 3})\`;
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
                        ctx.strokeStyle = \`rgba(\${rgb.r}, \${rgb.g}, \${rgb.b}, \${alpha})\`;
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
                                ctx.strokeStyle = \`rgba(\${rgb.r}, \${rgb.g}, \${rgb.b}, \${branch.opacity * alpha})\`;
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
            className={\`relative bg-black \${className}\`}
            role="presentation"
            aria-hidden="true"
        >
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
        </div>
    );
};

export default BioluminescentWeb;
`
  },
  "backgrounds/caustic-light": {
    component: dynamic(() => import("@/components/ui/backgrounds/caustic-light").then(mod => mod.CausticLight || mod.default)),
    name: "Caustic Light",
    category: "backgrounds",
    slug: "caustic-light",
    code: `"use client";

/**
 * @component CausticLight
 * @description Underwater light refraction patterns — organic, shimmering pools of light
 * using layered gradients and blur fields.
 * Principle: multi-layer radial/repeating gradients with drift animation.
 *
 * @example
 * \`\`\`tsx
 * import { CausticLight } from '@/components/backgrounds/caustic-light';
 *
 * <CausticLight color="#06b6d4" intensity={0.6} className="w-full h-64" />
 * \`\`\`
 */

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { toPositiveNumber } from "../../lib/utils";

export interface CausticLightProps {
    /** Light color. Default: "#06b6d4" */
    color?: string;
    /** Light intensity (0-1). Default: 0.5 */
    intensity?: number;
    /** Animation speed. Default: 1 */
    speed?: number;
    /** Additional class names */
    className?: string;
}

export const CausticLight: React.FC<CausticLightProps> = ({
    color = "#06b6d4",
    intensity = 0.5,
    speed = 1,
    className = "",
}) => {
    const prefersReducedMotion = useReducedMotion();
    const safeSpeed = toPositiveNumber(speed, 1, 0.01);
    const safeIntensity = Math.max(0, Math.min(1, intensity));

    return (
        <div className={\`relative overflow-hidden \${className}\`} role="presentation" aria-hidden="true">
            <div
                className="absolute inset-0"
                style={{
                    background: \`radial-gradient(circle at 50% 50%, \${color}\${Math.round(safeIntensity * 255).toString(16).padStart(2, "0")} 0%, transparent 70%)\`,
                }}
            />

            <motion.div
                className="absolute -inset-[12%]"
                style={{
                    opacity: safeIntensity * 0.8,
                    background: \`
                        repeating-radial-gradient(
                            circle at 30% 40%,
                            \${color}55 0 10px,
                            transparent 12px 28px
                        ),
                        repeating-radial-gradient(
                            circle at 70% 60%,
                            \${color}44 0 8px,
                            transparent 10px 24px
                        )
                    \`,
                    filter: "blur(10px)",
                    mixBlendMode: "screen",
                }}
                animate={
                    prefersReducedMotion
                        ? undefined
                        : {
                            backgroundPosition: ["0% 0%, 0% 0%", "20% -10%, -15% 20%", "0% 0%, 0% 0%"],
                            x: ["-4%", "2%", "-4%"],
                            y: ["-2%", "3%", "-2%"],
                        }
                }
                transition={
                    prefersReducedMotion
                        ? undefined
                        : {
                            duration: 18 / safeSpeed,
                            repeat: Infinity,
                            ease: "linear",
                        }
                }
            />

            <motion.div
                className="absolute -inset-[8%]"
                style={{
                    opacity: safeIntensity * 0.55,
                    background: \`
                        radial-gradient(circle at 40% 35%, \${color}66 0%, transparent 55%),
                        radial-gradient(circle at 65% 65%, \${color}50 0%, transparent 60%)
                    \`,
                    filter: "blur(18px)",
                    mixBlendMode: "screen",
                }}
                animate={
                    prefersReducedMotion
                        ? undefined
                        : {
                            x: ["-2%", "5%", "-2%"],
                            y: ["0%", "-4%", "0%"],
                            scale: [1, 1.08, 1],
                        }
                }
                transition={
                    prefersReducedMotion
                        ? undefined
                        : {
                            duration: 22 / safeSpeed,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }
                }
            />
        </div>
    );
};

export default CausticLight;
`
  },
  "backgrounds/circuit-fog": {
    component: dynamic(() => import("@/components/ui/backgrounds/circuit-fog").then(mod => mod.CircuitFog || mod.default)),
    name: "Circuit Fog",
    category: "backgrounds",
    slug: "circuit-fog",
    code: `"use client";

/**
 * @component CircuitFog
 * @description Circuit traces with energy dots flowing along them, atmospheric
 * fog blobs appearing and fading in certain areas.
 * Canvas-based line rendering + CSS fog blobs.
 *
 * @example
 * \`\`\`tsx
 * import { CircuitFog } from '@/components/backgrounds/circuit-fog';
 *
 * <CircuitFog
 *   traceColor="#10b981"
 *   fogColor="#10b98140"
 *   traceCount={12}
 *   className="absolute inset-0 -z-10"
 * />
 * \`\`\`
 */

import React, { useMemo, useRef, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { toPositiveInt, toPositiveNumber } from "../../lib/utils";

export interface CircuitFogProps {
    /** Trace/line color. Default: "#10b981" */
    traceColor?: string;
    /** Fog blob color. Default: "#10b98140" */
    fogColor?: string;
    /** Number of circuit traces. Default: 12 */
    traceCount?: number;
    /** Number of fog blobs. Default: 6 */
    fogCount?: number;
    /** Speed multiplier. Default: 1 */
    speed?: number;
    /** Additional class names */
    className?: string;
}

interface Point {
    x: number;
    y: number;
}

interface TracePath {
    points: Point[];
    cumulative: number[];
    totalLength: number;
    duration: number;
    delay: number;
}

interface FogBlob {
    cx: string;
    cy: string;
    r: number;
    duration: number;
    delay: number;
}

function generateTracePoints(
    index: number,
    total: number,
    width: number,
    height: number
): Point[] {
    const isHorizontal = index % 2 === 0;
    const points: Point[] = [];
    const stepCount = 3 + Math.floor(Math.random() * 4);

    if (isHorizontal) {
        const y = (height / (total / 2 + 1)) * (Math.floor(index / 2) + 1);
        let x = 0;
        points.push({ x: 0, y });
        for (let s = 0; s < stepCount; s++) {
            x += width / stepCount;
            const jog = (Math.random() - 0.5) * 40;
            points.push({ x, y: y + jog });
            if (Math.random() > 0.5) {
                const forkY = y + jog + (Math.random() > 0.5 ? 30 : -30);
                points.push({ x, y: forkY });
                points.push({ x: x + 20, y: forkY });
            }
        }
    } else {
        const x = (width / (total / 2 + 1)) * (Math.floor(index / 2) + 1);
        let y = 0;
        points.push({ x, y: 0 });
        for (let s = 0; s < stepCount; s++) {
            y += height / stepCount;
            const jog = (Math.random() - 0.5) * 40;
            points.push({ x: x + jog, y });
        }
    }

    return points;
}

function computeCumulative(points: Point[]) {
    const cumulative = [0];
    let totalLength = 0;

    for (let i = 1; i < points.length; i++) {
        const dx = points[i].x - points[i - 1].x;
        const dy = points[i].y - points[i - 1].y;
        totalLength += Math.sqrt(dx * dx + dy * dy);
        cumulative.push(totalLength);
    }

    return { cumulative, totalLength };
}

function pointAtDistance(trace: TracePath, distance: number): Point {
    if (trace.points.length === 0) return { x: 0, y: 0 };
    if (trace.points.length === 1) return trace.points[0];
    if (distance <= 0) return trace.points[0];
    if (distance >= trace.totalLength) return trace.points[trace.points.length - 1];

    for (let i = 1; i < trace.cumulative.length; i++) {
        const prev = trace.cumulative[i - 1];
        const next = trace.cumulative[i];
        if (distance <= next) {
            const segmentDistance = next - prev || 1;
            const localT = (distance - prev) / segmentDistance;
            const p0 = trace.points[i - 1];
            const p1 = trace.points[i];
            return {
                x: p0.x + (p1.x - p0.x) * localT,
                y: p0.y + (p1.y - p0.y) * localT,
            };
        }
    }

    return trace.points[trace.points.length - 1];
}

export const CircuitFog: React.FC<CircuitFogProps> = ({
    traceColor = "#10b981",
    fogColor = "#10b98140",
    traceCount = 12,
    fogCount = 6,
    speed = 1,
    className = "",
}) => {
    const prefersReducedMotion = useReducedMotion();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const viewW = 800;
    const viewH = 600;
    const safeSpeed = toPositiveNumber(speed, 1, 0.01);
    const safeTraceCount = toPositiveInt(traceCount, 12, 1);
    const safeFogCount = toPositiveInt(fogCount, 6, 1);

    const traces: TracePath[] = useMemo(
        () =>
            Array.from({ length: safeTraceCount }, (_, i) => {
                const points = generateTracePoints(i, safeTraceCount, viewW, viewH);
                const { cumulative, totalLength } = computeCumulative(points);
                return {
                    points,
                    cumulative,
                    totalLength: Math.max(1, totalLength),
                    duration: (4 + Math.random() * 4) / safeSpeed,
                    delay: Math.random() * 3,
                };
            }),
        [safeTraceCount, safeSpeed]
    );

    const fogs: FogBlob[] = useMemo(
        () =>
            Array.from({ length: safeFogCount }, () => ({
                cx: \`\${10 + Math.random() * 80}%\`,
                cy: \`\${10 + Math.random() * 80}%\`,
                r: 40 + Math.random() * 60,
                duration: (6 + Math.random() * 6) / safeSpeed,
                delay: Math.random() * 4,
            })),
        [safeFogCount, safeSpeed]
    );

    const nodes = useMemo(
        () =>
            Array.from({ length: Math.min(6, safeTraceCount) }, () => ({
                x: 100 + Math.random() * (viewW - 200),
                y: 100 + Math.random() * (viewH - 200),
                duration: 2 + Math.random() * 2,
                delay: Math.random() * 3,
            })),
        [safeTraceCount]
    );

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let frame = 0;
        let resizeObserver: ResizeObserver | null = null;
        let drawWidth = 0;
        let drawHeight = 0;

        const resize = () => {
            const rect = canvas.getBoundingClientRect();
            drawWidth = Math.max(1, rect.width);
            drawHeight = Math.max(1, rect.height);
            const dpr = window.devicePixelRatio || 1;
            canvas.width = Math.max(1, Math.floor(drawWidth * dpr));
            canvas.height = Math.max(1, Math.floor(drawHeight * dpr));
            canvas.style.width = \`\${drawWidth}px\`;
            canvas.style.height = \`\${drawHeight}px\`;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        };

        resize();
        resizeObserver = new ResizeObserver(resize);
        resizeObserver.observe(canvas);

        const drawTrace = (trace: TracePath) => {
            if (trace.points.length < 2) return;
            ctx.beginPath();
            ctx.moveTo((trace.points[0].x / viewW) * drawWidth, (trace.points[0].y / viewH) * drawHeight);
            for (let i = 1; i < trace.points.length; i++) {
                ctx.lineTo((trace.points[i].x / viewW) * drawWidth, (trace.points[i].y / viewH) * drawHeight);
            }
            ctx.strokeStyle = traceColor;
            ctx.lineWidth = 1;
            ctx.globalAlpha = 0.15;
            ctx.stroke();
            ctx.globalAlpha = 1;
        };

        const drawNode = (elapsedSec: number, node: { x: number; y: number; duration: number; delay: number }) => {
            const t = ((elapsedSec + node.delay) % node.duration) / node.duration;
            const pulse = 0.2 + Math.sin(t * Math.PI * 2) * 0.35 + 0.35;
            const radius = 2 + pulse * 2;
            const x = (node.x / viewW) * drawWidth;
            const y = (node.y / viewH) * drawHeight;
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fillStyle = traceColor;
            ctx.globalAlpha = Math.max(0.2, Math.min(0.9, pulse));
            ctx.shadowColor = traceColor;
            ctx.shadowBlur = 6;
            ctx.fill();
            ctx.shadowBlur = 0;
            ctx.globalAlpha = 1;
        };

        const draw = (ts: number) => {
            const elapsedSec = ts / 1000;
            ctx.clearRect(0, 0, drawWidth, drawHeight);

            traces.forEach(drawTrace);

            if (!prefersReducedMotion) {
                traces.forEach((trace) => {
                    const progress = ((elapsedSec + trace.delay) % trace.duration) / trace.duration;
                    const point = pointAtDistance(trace, progress * trace.totalLength);
                    const x = (point.x / viewW) * drawWidth;
                    const y = (point.y / viewH) * drawHeight;

                    ctx.beginPath();
                    ctx.arc(x, y, 2.4, 0, Math.PI * 2);
                    ctx.fillStyle = traceColor;
                    ctx.globalAlpha = 0.85;
                    ctx.shadowColor = traceColor;
                    ctx.shadowBlur = 6;
                    ctx.fill();
                    ctx.shadowBlur = 0;
                    ctx.globalAlpha = 1;
                });
            }

            nodes.forEach((node) => drawNode(elapsedSec, node));

            frame = requestAnimationFrame(draw);
        };

        frame = requestAnimationFrame(draw);

        return () => {
            cancelAnimationFrame(frame);
            if (resizeObserver) resizeObserver.disconnect();
        };
    }, [traces, traceColor, nodes, prefersReducedMotion]);

    return (
        <div className={\`relative overflow-hidden \${className}\`} role="presentation" aria-hidden="true">
            <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full"
            />

            {fogs.map((fog, i) => (
                <motion.div
                    key={\`fog-\${i}\`}
                    className="absolute rounded-full pointer-events-none"
                    style={{
                        left: fog.cx,
                        top: fog.cy,
                        width: fog.r * 2,
                        height: fog.r * 2,
                        marginLeft: -fog.r,
                        marginTop: -fog.r,
                        background: fogColor,
                        filter: "blur(20px)",
                    }}
                    animate={
                        prefersReducedMotion
                            ? { opacity: 0.2, scale: 1 }
                            : {
                                opacity: [0, 0.4, 0.2, 0.5, 0],
                                scale: [0.8, 1.1, 0.9, 1.2, 0.8],
                            }
                    }
                    transition={
                        prefersReducedMotion
                            ? undefined
                            : {
                                duration: fog.duration,
                                delay: fog.delay,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }
                    }
                />
            ))}
        </div>
    );
};

export default CircuitFog;
`
  },
  "backgrounds/data-sand": {
    component: dynamic(() => import("@/components/ui/backgrounds/data-sand").then(mod => mod.DataSand || mod.default)),
    name: "Data Sand",
    category: "backgrounds",
    slug: "data-sand",
    code: `"use client";

/**
 * @component DataSand
 * @description Sand-grain data points that are pushed by the pointer
 * and flow back to defined flow lines over time.
 * Based on particle physics simulation + flow field.
 *
 * @example
 * \`\`\`tsx
 * import { DataSand } from '@/components/backgrounds/data-sand';
 *
 * <DataSand
 *   particleCount={500}
 *   sandColor="#d97706"
 *   className="absolute inset-0 -z-10"
 * />
 * \`\`\`
 */

import React, { useRef, useEffect, useCallback } from "react";
import { hexToRgbString } from "../../lib/utils";
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
                ctx.fillStyle = \`rgba(\${rgb}, \${alpha})\`;
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
        <div className={\`relative \${className}\`} role="presentation" aria-hidden="true">
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
        </div>
    );
};

export default DataSand;
`
  },
  "backgrounds/erosion-field": {
    component: dynamic(() => import("@/components/ui/backgrounds/erosion-field").then(mod => mod.ErosionField || mod.default)),
    name: "Erosion Field",
    category: "backgrounds",
    slug: "erosion-field",
    code: `"use client";

/**
 * @component ErosionField
 * @description Surface erodes over time: pixel blocks fade and regenerate,
 * simulating geological erosion with Perlin-like noise patterns.
 * Principle: canvas pixel manipulation + simplex noise for erosion patterns.
 *
 * @example
 * \`\`\`tsx
 * import { ErosionField } from '@/components/backgrounds/erosion-field';
 *
 * <ErosionField color="#8b5cf6" erosionSpeed={0.5} className="w-full h-64" />
 * \`\`\`
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
                        ctx.fillStyle = \`rgba(\${rgb}, \${alpha * 0.4})\`;
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
        <div className={\`relative \${className}\`} role="presentation" aria-hidden="true">
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
        </div>
    );
};

export default ErosionField;
`
  },
  "backgrounds/frost-crystal": {
    component: dynamic(() => import("@/components/ui/backgrounds/frost-crystal").then(mod => mod.FrostCrystal || mod.default)),
    name: "Frost Crystal",
    category: "backgrounds",
    slug: "frost-crystal",
    code: `"use client";

/**
 * @component FrostCrystal
 * @description When pointer is idle, frost crystals grow across the surface.
 * Movement melts them. Uses DLA (diffusion-limited aggregation) inspired growth.
 * Principle: DLA growth algorithm + idle detection + melt on movement.
 *
 * @example
 * \`\`\`tsx
 * import { FrostCrystal } from '@/components/backgrounds/frost-crystal';
 *
 * <FrostCrystal color="#93c5fd" className="w-full h-64" />
 * \`\`\`
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
                ctx.strokeStyle = \`rgba(\${rgb}, \${c.alpha})\`;
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
                        ctx.strokeStyle = \`rgba(\${rgb}, \${c.alpha * 0.5})\`;
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
        <div className={\`relative \${className}\`} role="presentation" aria-hidden="true">
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
        </div>
    );
};

export default FrostCrystal;
`
  },
  "backgrounds/gravity-lens": {
    component: dynamic(() => import("@/components/ui/backgrounds/gravity-lens").then(mod => mod.GravityLens || mod.default)),
    name: "Gravity Lens",
    category: "backgrounds",
    slug: "gravity-lens",
    code: `"use client";

/**
 * @component GravityLens
 * @description Space-time curvature around the pointer — background grid warps
 * with gravitational lensing effect based on distance.
 * Principle: radial deformation + distance-based displacement.
 *
 * @example
 * \`\`\`tsx
 * import { GravityLens } from '@/components/backgrounds/gravity-lens';
 *
 * <GravityLens gridColor="#334155" lensStrength={30} className="w-full h-96" />
 * \`\`\`
 */

import React, { useRef, useEffect, useCallback } from "react";
import { useReducedMotion } from "framer-motion";
import { hexToRgbString } from "../../lib/utils";

export interface GravityLensProps {
    /** Grid line color. Default: "#334155" */
    gridColor?: string;
    /** Lens strength (displacement px). Default: 25 */
    lensStrength?: number;
    /** Grid spacing in px. Default: 30 */
    gridSpacing?: number;
    /** Lens radius in px. Default: 150 */
    lensRadius?: number;
    /** Additional class names */
    className?: string;
}

export const GravityLens: React.FC<GravityLensProps> = ({
    gridColor = "#334155",
    lensStrength = 25,
    gridSpacing = 30,
    lensRadius = 150,
    className = "",
}) => {
    const prefersReducedMotion = useReducedMotion();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const pointerRef = useRef({ x: -9999, y: -9999 });
    const rafRef = useRef<number>(0);

    const draw = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const dpr = window.devicePixelRatio;
        const w = canvas.width / dpr;
        const h = canvas.height / dpr;
        const pointer = pointerRef.current;
        const rgb = hexToRgbString(gridColor, "51, 65, 85");

        ctx.clearRect(0, 0, w, h);

        // Draw warped grid
        for (let gx = 0; gx < w + gridSpacing; gx += gridSpacing) {
            ctx.beginPath();
            for (let gy = 0; gy <= h; gy += 2) {
                const dx = gx - pointer.x;
                const dy = gy - pointer.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                let warpedX = gx;
                if (dist < lensRadius && dist > 0) {
                    const force = (1 - dist / lensRadius) * lensStrength;
                    warpedX += (dx / dist) * force;
                }

                if (gy === 0) ctx.moveTo(warpedX, gy);
                else ctx.lineTo(warpedX, gy);
            }
            ctx.strokeStyle = \`rgba(\${rgb}, 0.3)\`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
        }

        for (let gy = 0; gy < h + gridSpacing; gy += gridSpacing) {
            ctx.beginPath();
            for (let gx = 0; gx <= w; gx += 2) {
                const dx = gx - pointer.x;
                const dy = gy - pointer.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                let warpedY = gy;
                if (dist < lensRadius && dist > 0) {
                    const force = (1 - dist / lensRadius) * lensStrength;
                    warpedY += (dy / dist) * force;
                }

                if (gx === 0) ctx.moveTo(gx, warpedY);
                else ctx.lineTo(gx, warpedY);
            }
            ctx.strokeStyle = \`rgba(\${rgb}, 0.3)\`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
        }

        if (!prefersReducedMotion) {
            rafRef.current = requestAnimationFrame(draw);
        }
    }, [gridColor, lensStrength, gridSpacing, lensRadius, prefersReducedMotion]);

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

        const handleMove = (e: PointerEvent) => {
            const rect = canvas.getBoundingClientRect();
            pointerRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
        };
        const handleLeave = () => {
            pointerRef.current = { x: -9999, y: -9999 };
        };

        canvas.addEventListener("pointermove", handleMove);
        canvas.addEventListener("pointerleave", handleLeave);

        if (!prefersReducedMotion) {
            rafRef.current = requestAnimationFrame(draw);
        } else {
            draw();
        }

        return () => {
            cancelAnimationFrame(rafRef.current);
            window.removeEventListener("resize", resize);
            canvas.removeEventListener("pointermove", handleMove);
            canvas.removeEventListener("pointerleave", handleLeave);
        };
    }, [draw, prefersReducedMotion]);

    return (
        <div className={\`relative \${className}\`} role="presentation" aria-hidden="true">
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
        </div>
    );
};

export default GravityLens;
`
  },
  "backgrounds/liquid-grid-memory": {
    component: dynamic(() => import("@/components/ui/backgrounds/liquid-grid-memory").then(mod => mod.LiquidGridMemory || mod.default)),
    name: "Liquid Grid Memory",
    category: "backgrounds",
    slug: "liquid-grid-memory",
    code: `"use client";

/**
 * @component LiquidGridMemory
 * @description A grid background where touched areas deform like liquid.
 * Deformation traces persist briefly as "memory" before damping back.
 * Based on pointer displacement + damping reset.
 *
 * @example
 * \`\`\`tsx
 * import { LiquidGridMemory } from '@/components/backgrounds/liquid-grid-memory';
 *
 * <LiquidGridMemory
 *   columns={20}
 *   rows={15}
 *   dotColor="#8b5cf6"
 *   className="absolute inset-0 -z-10"
 * />
 * \`\`\`
 */

import React, { useRef, useEffect } from "react";
import { hexToRgbString } from "../../lib/utils";
import { useReducedMotion } from "framer-motion";

export interface LiquidGridMemoryProps {
    /** Grid columns. Default: 20 */
    columns?: number;
    /** Grid rows. Default: 15 */
    rows?: number;
    /** Dot color. Default: "#8b5cf6" */
    dotColor?: string;
    /** Influence radius in pixels. Default: 100 */
    influenceRadius?: number;
    /** Max displacement in pixels. Default: 15 */
    maxDisplacement?: number;
    /** Return speed (0–1, lower = slower). Default: 0.04 */
    returnSpeed?: number;
    /** Dot base size. Default: 2 */
    dotSize?: number;
    /** Additional class names */
    className?: string;
}

interface GridPoint {
    baseX: number;
    baseY: number;
    dx: number;
    dy: number;
    vx: number;
    vy: number;
}

export const LiquidGridMemory: React.FC<LiquidGridMemoryProps> = ({
    columns = 20,
    rows = 15,
    dotColor = "#8b5cf6",
    influenceRadius = 100,
    maxDisplacement = 15,
    returnSpeed = 0.04,
    dotSize = 2,
    className = "",
}) => {
    const prefersReducedMotion = useReducedMotion();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const pointsRef = useRef<GridPoint[]>([]);
    const pointerRef = useRef({ x: -9999, y: -9999 });
    const rafRef = useRef<number>(0);



    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const rgb = hexToRgbString(dotColor, "139, 92, 246");

        const resize = () => {
            const parent = canvas.parentElement;
            if (!parent) return;
            const rect = parent.getBoundingClientRect();
            canvas.width = rect.width * window.devicePixelRatio;
            canvas.height = rect.height * window.devicePixelRatio;
            ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);

            // Rebuild grid
            const cellW = rect.width / (columns + 1);
            const cellH = rect.height / (rows + 1);
            pointsRef.current = [];
            for (let r = 0; r < rows; r++) {
                for (let c = 0; c < columns; c++) {
                    pointsRef.current.push({
                        baseX: (c + 1) * cellW,
                        baseY: (r + 1) * cellH,
                        dx: 0,
                        dy: 0,
                        vx: 0,
                        vy: 0,
                    });
                }
            }
        };

        resize();
        window.addEventListener("resize", resize);

        const handleMove = (e: PointerEvent) => {
            const rect = canvas.getBoundingClientRect();
            pointerRef.current = {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
            };
        };

        canvas.addEventListener("pointermove", handleMove);

        const animate = () => {
            const parent = canvas.parentElement;
            if (!parent) return;
            const rect = parent.getBoundingClientRect();

            ctx.clearRect(0, 0, rect.width, rect.height);

            const pointer = pointerRef.current;

            pointsRef.current.forEach((p) => {
                const px = p.baseX + p.dx;
                const py = p.baseY + p.dy;
                const dx = px - pointer.x;
                const dy = py - pointer.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < influenceRadius) {
                    const force = ((influenceRadius - dist) / influenceRadius) * maxDisplacement;
                    const angle = Math.atan2(dy, dx);
                    p.vx += Math.cos(angle) * force * 0.1;
                    p.vy += Math.sin(angle) * force * 0.1;
                }

                // Spring back to origin
                p.vx += -p.dx * returnSpeed;
                p.vy += -p.dy * returnSpeed;
                p.vx *= 0.9;
                p.vy *= 0.9;
                p.dx += p.vx;
                p.dy += p.vy;

                // Clamp displacement
                const absDist = Math.sqrt(p.dx * p.dx + p.dy * p.dy);
                if (absDist > maxDisplacement * 2) {
                    p.dx *= (maxDisplacement * 2) / absDist;
                    p.dy *= (maxDisplacement * 2) / absDist;
                }

                // Draw
                const intensity = Math.min(1, absDist / maxDisplacement);
                const size = dotSize + intensity * 2;
                const alpha = 0.2 + intensity * 0.6;

                ctx.beginPath();
                ctx.arc(p.baseX + p.dx, p.baseY + p.dy, size, 0, Math.PI * 2);
                ctx.fillStyle = \`rgba(\${rgb}, \${alpha})\`;
                ctx.fill();

                if (intensity > 0.3) {
                    ctx.beginPath();
                    ctx.arc(p.baseX + p.dx, p.baseY + p.dy, size + 3, 0, Math.PI * 2);
                    ctx.fillStyle = \`rgba(\${rgb}, \${intensity * 0.15})\`;
                    ctx.fill();
                }
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
        };
    }, [columns, rows, dotColor, influenceRadius, maxDisplacement, returnSpeed, dotSize]);

    return (
        <div className={\`relative \${className}\`} role="presentation" aria-hidden="true">
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
        </div>
    );
};

export default LiquidGridMemory;
`
  },
  "backgrounds/magnetic-field-lines": {
    component: dynamic(() => import("@/components/ui/backgrounds/magnetic-field-lines").then(mod => mod.MagneticFieldLines || mod.default)),
    name: "Magnetic Field Lines",
    category: "backgrounds",
    slug: "magnetic-field-lines",
    code: `"use client";

/**
 * @component MagneticFieldLines
 * @description Pointer acts as a magnetic dipole, field lines are calculated
 * and rendered in real-time around the cursor position.
 * Canvas-based field rendering.
 *
 * @example
 * \`\`\`tsx
 * import { MagneticFieldLines } from '@/components/backgrounds/magnetic-field-lines';
 *
 * <MagneticFieldLines lineColor="#06b6d4" lineCount={20} className="w-full h-96" />
 * \`\`\`
 */

import React, { useRef, useState, useCallback, useEffect } from "react";
import { useReducedMotion } from "framer-motion";
import { toPositiveInt, toPositiveNumber } from "../../lib/utils";

export interface MagneticFieldLinesProps {
    /** Line color. Default: "#06b6d4" */
    lineColor?: string;
    /** Number of field lines. Default: 16 */
    lineCount?: number;
    /** Line opacity. Default: 0.4 */
    lineOpacity?: number;
    /** Additional class names */
    className?: string;
}

interface Point {
    x: number;
    y: number;
}

function generateFieldLines(pointer: Point, lineCount: number): Point[][] {
    const lines: Point[][] = [];
    const cx = pointer.x;
    const cy = pointer.y;

    for (let i = 0; i < lineCount; i++) {
        const startAngle = (i / lineCount) * Math.PI * 2;
        const points: Point[] = [];
        let x = cx + Math.cos(startAngle) * 3;
        let y = cy + Math.sin(startAngle) * 3;

        for (let step = 0; step < 40; step++) {
            points.push({ x, y });
            const dx = x - cx;
            const dy = y - cy;
            const r = Math.sqrt(dx * dx + dy * dy);
            if (r < 1 || r > 80) break;

            const theta = Math.atan2(dy, dx);
            const br = (2 * Math.cos(theta)) / (r * r);
            const bt = Math.sin(theta) / (r * r);
            const magnitude = Math.sqrt(br * br + bt * bt);
            if (magnitude < 0.0001) break;

            x += ((br * Math.cos(theta) - bt * Math.sin(theta)) / magnitude) * 2;
            y += ((br * Math.sin(theta) + bt * Math.cos(theta)) / magnitude) * 2;
        }

        if (points.length > 2) lines.push(points);
    }

    return lines;
}

export const MagneticFieldLines: React.FC<MagneticFieldLinesProps> = ({
    lineColor = "#06b6d4",
    lineCount = 16,
    lineOpacity = 0.4,
    className = "",
}) => {
    const prefersReducedMotion = useReducedMotion();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [pointer, setPointer] = useState({ x: 50, y: 50 });
    const [isActive, setIsActive] = useState(false);
    const safeLineCount = toPositiveInt(lineCount, 16, 1);
    const safeLineOpacity = Math.max(0, Math.min(1, toPositiveNumber(lineOpacity, 0.4, 0)));

    const handlePointerMove = useCallback((e: React.PointerEvent) => {
        if (prefersReducedMotion) return;
        const rect = e.currentTarget.getBoundingClientRect();
        setPointer({
            x: ((e.clientX - rect.left) / rect.width) * 100,
            y: ((e.clientY - rect.top) / rect.height) * 100,
        });
        setIsActive(true);
    }, [prefersReducedMotion]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let frame = 0;
        let resizeObserver: ResizeObserver | null = null;
        let drawWidth = 0;
        let drawHeight = 0;

        const resize = () => {
            const rect = canvas.getBoundingClientRect();
            drawWidth = Math.max(1, rect.width);
            drawHeight = Math.max(1, rect.height);
            const dpr = window.devicePixelRatio || 1;
            canvas.width = Math.max(1, Math.floor(drawWidth * dpr));
            canvas.height = Math.max(1, Math.floor(drawHeight * dpr));
            canvas.style.width = \`\${drawWidth}px\`;
            canvas.style.height = \`\${drawHeight}px\`;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        };

        resize();
        resizeObserver = new ResizeObserver(resize);
        resizeObserver.observe(canvas);

        const draw = () => {
            ctx.clearRect(0, 0, drawWidth, drawHeight);
            if (!isActive || prefersReducedMotion) return;

            const normalizedPointer = {
                x: (pointer.x / 100) * 100,
                y: (pointer.y / 100) * 100,
            };

            const lines = generateFieldLines(normalizedPointer, safeLineCount);
            lines.forEach((line) => {
                if (line.length < 2) return;
                ctx.beginPath();
                ctx.moveTo((line[0].x / 100) * drawWidth, (line[0].y / 100) * drawHeight);
                for (let i = 1; i < line.length; i++) {
                    ctx.lineTo((line[i].x / 100) * drawWidth, (line[i].y / 100) * drawHeight);
                }
                ctx.strokeStyle = lineColor;
                ctx.lineWidth = 1;
                ctx.globalAlpha = safeLineOpacity;
                ctx.stroke();
                ctx.globalAlpha = 1;
            });

            const cx = (pointer.x / 100) * drawWidth;
            const cy = (pointer.y / 100) * drawHeight;
            ctx.beginPath();
            ctx.arc(cx, cy, 4, 0, Math.PI * 2);
            ctx.fillStyle = lineColor;
            ctx.globalAlpha = 0.3;
            ctx.shadowColor = lineColor;
            ctx.shadowBlur = 10;
            ctx.fill();
            ctx.shadowBlur = 0;
            ctx.globalAlpha = 1;
        };

        const loop = () => {
            draw();
            frame = requestAnimationFrame(loop);
        };
        frame = requestAnimationFrame(loop);

        return () => {
            cancelAnimationFrame(frame);
            if (resizeObserver) resizeObserver.disconnect();
        };
    }, [pointer.x, pointer.y, isActive, safeLineCount, safeLineOpacity, lineColor, prefersReducedMotion]);

    return (
        <div
            className={\`relative \${className}\`}
            onPointerMove={handlePointerMove}
            onPointerLeave={() => setIsActive(false)}
            role="presentation"
            aria-hidden="true"
        >
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
        </div>
    );
};

export default MagneticFieldLines;
`
  },
  "backgrounds/mycelium-network": {
    component: dynamic(() => import("@/components/ui/backgrounds/mycelium-network").then(mod => mod.MyceliumNetwork || mod.default)),
    name: "Mycelium Network",
    category: "backgrounds",
    slug: "mycelium-network",
    code: `"use client";

/**
 * @component MyceliumNetwork
 * @description Thin fungal mycelium branches grow, die and regrow randomly
 * across the surface. L-system inspired growth algorithm.
 * Principle: recursive branching growth + canvas rendering + lifecycle decay.
 *
 * @example
 * \`\`\`tsx
 * import { MyceliumNetwork } from '@/components/backgrounds/mycelium-network';
 *
 * <MyceliumNetwork color="#10b981" growthSpeed={1} className="w-full h-64" />
 * \`\`\`
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
                ctx.strokeStyle = \`rgba(\${rgb}, \${alpha * 0.6})\`;
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
        <div className={\`relative \${className}\`} role="presentation" aria-hidden="true">
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
        </div>
    );
};

export default MyceliumNetwork;
`
  },
  "backgrounds/navier-stokes-fluid": {
    component: dynamic(() => import("@/components/ui/backgrounds/navier-stokes-fluid").then(mod => mod.NavierStokesFluid || mod.default)),
    name: "Navier Stokes Fluid",
    category: "backgrounds",
    slug: "navier-stokes-fluid",
    code: `"use client";

/**
 * @component NavierStokesFluid
 * @description Real-time simplified fluid dynamics simulation.
 * Pointer creates fluid currents, color diffuses through the field.
 * Principle: simplified Navier-Stokes velocity + density advection.
 *
 * @example
 * \`\`\`tsx
 * import { NavierStokesFluid } from '@/components/backgrounds/navier-stokes-fluid';
 *
 * <NavierStokesFluid color="#8b5cf6" viscosity={0.5} className="w-full h-96" />
 * \`\`\`
 */

import React, { useRef, useEffect } from "react";
import { useReducedMotion } from "framer-motion";
import { hexToRgb } from "../../lib/utils";

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
                        ctx.fillStyle = \`rgba(\${rgb.r}, \${rgb.g}, \${rgb.b}, \${d})\`;
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
        <div className={\`relative \${className}\`} role="presentation" aria-hidden="true">
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
        </div>
    );
};

export default NavierStokesFluid;
`
  },
  "backgrounds/quantum-foam": {
    component: dynamic(() => import("@/components/ui/backgrounds/quantum-foam").then(mod => mod.QuantumFoam || mod.default)),
    name: "Quantum Foam",
    category: "backgrounds",
    slug: "quantum-foam",
    code: `"use client";

/**
 * @component QuantumFoam
 * @description Space-time foam: organic bubbles randomly exist, grow, and annihilate each other.
 * Based on random scale/opacity cycles + radial gradients.
 *
 * @example
 * \`\`\`tsx
 * import { QuantumFoam } from '@/components/backgrounds/quantum-foam';
 *
 * <QuantumFoam
 *   bubbleCount={30}
 *   colors={['#818cf8', '#c084fc', '#f472b6']}
 *   className="absolute inset-0 -z-10"
 * />
 * \`\`\`
 */

import React, { useMemo, useEffect, useRef } from "react";
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

        if (!prefersReducedMotion) {
            rafRef.current = requestAnimationFrame(animate);
        }
        return () => {
            cancelAnimationFrame(rafRef.current);
            window.removeEventListener("resize", resize);
        };
    }, [bubbleCount, createBubble]);

    return (
        <div className={\`relative \${className}\`} role="presentation" aria-hidden="true">
            <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full"
                style={{ opacity: 0.7 }}
            />
        </div>
    );
};

export default QuantumFoam;
`
  },
  "backgrounds/silk-aurora": {
    component: dynamic(() => import("@/components/ui/backgrounds/silk-aurora").then(mod => mod.SilkAurora || mod.default)),
    name: "Silk Aurora",
    category: "backgrounds",
    slug: "silk-aurora",
    code: `"use client";

/**
 * @component SilkAurora
 * @description Silky, organic, slowly moving color waves. Not static blur but
 * flowing and breathing fabric-like gradients.
 * Based on multi-layer color animation + blur blending.
 *
 * @example
 * \`\`\`tsx
 * import { SilkAurora } from '@/components/backgrounds/silk-aurora';
 *
 * <SilkAurora
 *   colors={['#7c3aed', '#2dd4bf', '#f43f5e']}
 *   speed={0.8}
 *   className="absolute inset-0 -z-10"
 * />
 * \`\`\`
 */

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { toPositiveNumber } from "../../lib/utils";

export interface SilkAuroraProps {
    /** Array of gradient colors (2–5 recommended). Default: purple/teal/rose */
    colors?: string[];
    /** Animation speed multiplier. Default: 1 */
    speed?: number;
    /** Blur intensity in pixels. Default: 80 */
    blur?: number;
    /** Overall opacity. Default: 0.6 */
    opacity?: number;
    /** Additional class names */
    className?: string;
}

export const SilkAurora: React.FC<SilkAuroraProps> = ({
    colors = ["#7c3aed", "#2dd4bf", "#f43f5e", "#facc15"],
    speed = 1,
    blur = 80,
    opacity = 0.6,
    className = "",
}) => {
    const prefersReducedMotion = useReducedMotion();
    const safeSpeed = toPositiveNumber(speed, 1, 0.01);
    const safeColors = colors.length >= 2 ? colors : ["#7c3aed", "#2dd4bf"];

    return (
        <div
            className={\`overflow-hidden \${className}\`}
            role="presentation"
            aria-hidden="true"
            style={{ opacity }}
        >
            {/* Aurora layers */}
            <div
                className="absolute inset-0"
                style={{
                    filter: \`blur(\${blur}px)\`,
                }}
            >
                {safeColors.map((color, i) => {
                    const angle = (360 / safeColors.length) * i;
                    const duration = (18 + i * 4) / safeSpeed;
                    const size = 60 + i * 10;

                    return (
                        <motion.div
                            key={i}
                            className="absolute rounded-full"
                            style={{
                                width: \`\${size}%\`,
                                height: \`\${size}%\`,
                                background: \`radial-gradient(ellipse at center, \${color}90 0%, \${color}20 50%, transparent 70%)\`,
                                top: \`\${20 + Math.sin(angle * (Math.PI / 180)) * 30}%\`,
                                left: \`\${20 + Math.cos(angle * (Math.PI / 180)) * 30}%\`,
                            }}
                            animate={{
                                x: prefersReducedMotion ? 0 : [0, 50 * Math.cos(angle), -30 * Math.sin(angle), 0],
                                y: prefersReducedMotion ? 0 : [0, -40 * Math.sin(angle), 50 * Math.cos(angle), 0],
                                scale: prefersReducedMotion ? 1 : [1, 1.2, 0.9, 1],
                                rotate: prefersReducedMotion ? 0 : [0, 120, 240, 360],
                            }}
                            transition={{
                                duration,
                                repeat: prefersReducedMotion ? 0 : Infinity,
                                ease: "easeInOut",
                            }}
                        />
                    );
                })}
            </div>

            {/* Breathing overlay */}
            <motion.div
                className="absolute inset-0"
                style={{
                    background:
                        "radial-gradient(ellipse at 40% 50%, transparent 30%, rgba(0,0,0,0.3) 100%)",
                }}
                animate={{
                    opacity: prefersReducedMotion ? 0.3 : [0.3, 0.5, 0.3],
                }}
                transition={{
                    duration: 8 / safeSpeed,
                    repeat: prefersReducedMotion ? 0 : Infinity,
                    ease: "easeInOut",
                }}
            />
        </div>
    );
};

export default SilkAurora;
`
  },
  "backgrounds/star-warp": {
    component: dynamic(() => import("@/components/ui/backgrounds/star-warp").then(mod => mod.StarWarp || mod.default)),
    name: "Star Warp",
    category: "backgrounds",
    slug: "star-warp",
    code: `"use client";

/**
 * @component StarWarp
 * @description Warp speed animation with lines radiating outward from a center point,
 * speed-based elongation effect.
 * Based on radial movement + velocity-based stroke width.
 *
 * @example
 * \`\`\`tsx
 * import { StarWarp } from '@/components/backgrounds/star-warp';
 *
 * <StarWarp
 *   starCount={200}
 *   speed={1}
 *   starColor="#e2e8f0"
 *   className="absolute inset-0 bg-black -z-10"
 * />
 * \`\`\`
 */

import React, { useRef, useEffect, useCallback } from "react";
import { hexToRgbString } from "../../lib/utils";
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
                gradient.addColorStop(0, \`rgba(\${rgb}, 0)\`);
                gradient.addColorStop(1, \`rgba(\${rgb}, \${brightness})\`);

                ctx.beginPath();
                ctx.moveTo(trailEndX, trailEndY);
                ctx.lineTo(screenX, screenY);
                ctx.strokeStyle = gradient;
                ctx.lineWidth = width;
                ctx.stroke();

                // Head dot
                ctx.beginPath();
                ctx.arc(screenX, screenY, width * 0.6, 0, Math.PI * 2);
                ctx.fillStyle = \`rgba(\${rgb}, \${brightness})\`;
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
        <div className={\`relative \${className}\`} role="presentation" aria-hidden="true">
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
        </div>
    );
};

export default StarWarp;
`
  },
  "backgrounds/topographical-pulse": {
    component: dynamic(() => import("@/components/ui/backgrounds/topographical-pulse").then(mod => mod.TopographicalPulse || mod.default)),
    name: "Topographical Pulse",
    category: "backgrounds",
    slug: "topographical-pulse",
    code: `"use client";

/**
 * @component TopographicalPulse
 * @description Contour map lines deform locally based on pointer position.
 * Clicking emits a ring-shaped wave that propagates outward.
 * Canvas-based contour rendering.
 *
 * @example
 * \`\`\`tsx
 * import { TopographicalPulse } from '@/components/backgrounds/topographical-pulse';
 *
 * <TopographicalPulse
 *   lineCount={15}
 *   lineColor="#22d3ee"
 *   className="absolute inset-0 -z-10"
 * />
 * \`\`\`
 */

import React, { useRef, useEffect } from "react";
import { useReducedMotion } from "framer-motion";
import { toPositiveInt, toPositiveNumber } from "../../lib/utils";

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
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const pointerRef = useRef({ x: -9999, y: -9999 });
    const pulsesRef = useRef<Pulse[]>([]);

    const safeLineCount = toPositiveInt(lineCount, 15, 1);
    const safeLineOpacity = Math.max(0, Math.min(1, toPositiveNumber(lineOpacity, 0.3, 0)));
    const safeDeformRadius = toPositiveNumber(deformRadius, 120, 1);
    const safeDeformStrength = toPositiveNumber(deformStrength, 30, 0);
    const safePulseSpeed = toPositiveNumber(pulseSpeed, 3, 0.01);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let frame = 0;
        let resizeObserver: ResizeObserver | null = null;
        let drawWidth = 0;
        let drawHeight = 0;

        const resize = () => {
            const rect = canvas.getBoundingClientRect();
            drawWidth = Math.max(1, rect.width);
            drawHeight = Math.max(1, rect.height);
            const dpr = window.devicePixelRatio || 1;
            canvas.width = Math.max(1, Math.floor(drawWidth * dpr));
            canvas.height = Math.max(1, Math.floor(drawHeight * dpr));
            canvas.style.width = \`\${drawWidth}px\`;
            canvas.style.height = \`\${drawHeight}px\`;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        };

        resize();
        resizeObserver = new ResizeObserver(resize);
        resizeObserver.observe(canvas);

        const handleMove = (e: PointerEvent) => {
            const rect = canvas.getBoundingClientRect();
            pointerRef.current = {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
            };
        };

        const handleClick = (e: MouseEvent) => {
            if (prefersReducedMotion) return;
            const rect = canvas.getBoundingClientRect();
            pulsesRef.current.push({
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
                radius: 0,
                opacity: 1,
            });
        };

        canvas.addEventListener("pointermove", handleMove);
        canvas.addEventListener("click", handleClick);

        const drawContourLine = (lineIndex: number) => {
            const baseY = (drawHeight / (safeLineCount + 1)) * (lineIndex + 1);
            const segments = 40;

            ctx.beginPath();
            for (let j = 0; j <= segments; j++) {
                const x = (drawWidth / segments) * j;
                let y = baseY;
                y += Math.sin(x * 0.01 + lineIndex * 0.5) * 8;
                y += Math.cos(x * 0.02 - lineIndex * 0.3) * 5;

                const pointer = pointerRef.current;
                const dx = x - pointer.x;
                const dy = y - pointer.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < safeDeformRadius) {
                    const force = (1 - dist / safeDeformRadius) * safeDeformStrength;
                    y += force * Math.sign(dy || 1);
                }

                pulsesRef.current.forEach((pulse) => {
                    const pdx = x - pulse.x;
                    const pdy = y - pulse.y;
                    const pdist = Math.sqrt(pdx * pdx + pdy * pdy);
                    const ringDist = Math.abs(pdist - pulse.radius);
                    if (ringDist < 30) {
                        const waveForce = (1 - ringDist / 30) * 15 * pulse.opacity;
                        y += waveForce * Math.sin(pdist * 0.1);
                    }
                });

                if (j === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }

            ctx.strokeStyle = lineColor;
            ctx.lineWidth = 1;
            ctx.globalAlpha = safeLineOpacity;
            ctx.stroke();
            ctx.globalAlpha = 1;
        };

        const drawPulseRings = () => {
            pulsesRef.current.forEach((pulse) => {
                ctx.beginPath();
                ctx.arc(pulse.x, pulse.y, pulse.radius, 0, Math.PI * 2);
                ctx.strokeStyle = lineColor;
                ctx.lineWidth = 2;
                ctx.globalAlpha = pulse.opacity * 0.5;
                ctx.stroke();
                ctx.globalAlpha = 1;
            });
        };

        const draw = () => {
            ctx.clearRect(0, 0, drawWidth, drawHeight);

            pulsesRef.current = pulsesRef.current.filter((pulse) => {
                pulse.radius += safePulseSpeed;
                pulse.opacity *= 0.985;
                return pulse.opacity > 0.01;
            });

            for (let i = 0; i < safeLineCount; i++) drawContourLine(i);
            if (!prefersReducedMotion) drawPulseRings();

            frame = requestAnimationFrame(draw);
        };

        frame = requestAnimationFrame(draw);

        return () => {
            cancelAnimationFrame(frame);
            if (resizeObserver) resizeObserver.disconnect();
            canvas.removeEventListener("pointermove", handleMove);
            canvas.removeEventListener("click", handleClick);
        };
    }, [
        safeLineCount,
        safeLineOpacity,
        safeDeformRadius,
        safeDeformStrength,
        safePulseSpeed,
        lineColor,
        prefersReducedMotion,
    ]);

    return (
        <canvas
            ref={canvasRef}
            className={\`w-full h-full \${className}\`}
            role="presentation"
            aria-hidden="true"
        />
    );
};

export default TopographicalPulse;
`
  },
  "buttons/elastic-border-button": {
    component: dynamic(() => import("@/components/ui/buttons/elastic-border-button").then(mod => mod.ElasticBorderButton || mod.default)),
    name: "Elastic Border Button",
    category: "buttons",
    slug: "elastic-border-button",
    code: `"use client";

/**
 * @component ElasticBorderButton
 * @description Border has gel-like consistency; near the pointer it bulges outward,
 * on click an elastic wave travels around the border.
 * Based on reactive border glow deformation + wave animation.
 *
 * @example
 * \`\`\`tsx
 * import { ElasticBorderButton } from '@/components/buttons/elastic-border-button';
 *
 * <ElasticBorderButton
 *   borderColor="#06b6d4"
 *   onClick={() => console.log('elastic!')}
 * >
 *   Stretch
 * </ElasticBorderButton>
 * \`\`\`
 */

import React, { useRef, useState, useCallback, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { toPositiveNumber } from "../../lib/utils";

export interface ElasticBorderButtonProps {
    /** Button content */
    children: React.ReactNode;
    /** Border color. Default: "#06b6d4" */
    borderColor?: string;
    /** Bulge amount in px. Default: 6 */
    bulgeAmount?: number;
    /** Click handler */
    onClick?: (e: React.MouseEvent) => void;
    /** Disabled state */
    disabled?: boolean;
    /** Additional class names */
    className?: string;
}

export const ElasticBorderButton: React.FC<ElasticBorderButtonProps> = ({
    children,
    borderColor = "#06b6d4",
    bulgeAmount = 6,
    onClick,
    disabled = false,
    className = "",
}) => {
    const prefersReducedMotion = useReducedMotion();
    const btnRef = useRef<HTMLButtonElement>(null);
    const [pointer, setPointer] = useState({ x: 50, y: 50 });
    const [isHovered, setIsHovered] = useState(false);
    const [isWaving, setIsWaving] = useState(false);
    const [waveNonce, setWaveNonce] = useState(0);
    const safeBulge = toPositiveNumber(bulgeAmount, 6, 0);

    const handlePointerMove = useCallback((e: React.PointerEvent) => {
        const el = btnRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        setPointer({
            x: ((e.clientX - rect.left) / rect.width) * 100,
            y: ((e.clientY - rect.top) / rect.height) * 100,
        });
    }, []);

    const handleClick = useCallback(
        (e: React.MouseEvent) => {
            if (disabled) return;
            setIsWaving(true);
            setWaveNonce((prev) => prev + 1);
            onClick?.(e);
        },
        [onClick, disabled]
    );

    useEffect(() => {
        if (!isWaving) return;
        const t = setTimeout(() => setIsWaving(false), 550);
        return () => clearTimeout(t);
    }, [isWaving]);

    const w = 160;
    const h = 48;
    const baseRadius = 12;
    const pointerForce = isHovered ? Math.sin((pointer.x + pointer.y) * 0.06) * safeBulge * 0.35 : 0;

    return (
        <motion.button
            ref={btnRef}
            className={\`relative inline-flex items-center justify-center \${className}\`}
            style={{ width: w, height: h }}
            onPointerMove={handlePointerMove}
            onPointerEnter={() => setIsHovered(true)}
            onPointerLeave={() => setIsHovered(false)}
            onClick={handleClick}
            disabled={disabled}
            whileTap={{ scale: 0.97 }}
            aria-disabled={disabled}
        >
            <motion.div
                className="absolute inset-0 pointer-events-none border-2"
                style={{
                    borderColor,
                    borderRadius: baseRadius + pointerForce,
                    background: isHovered
                        ? \`radial-gradient(circle at \${pointer.x}% \${pointer.y}%, \${borderColor}33 0%, transparent 45%)\`
                        : "transparent",
                    boxShadow: \`0 0 \${4 + safeBulge}px \${borderColor}44\`,
                }}
                animate={prefersReducedMotion ? undefined : {
                    borderRadius: [
                        baseRadius + pointerForce,
                        baseRadius + pointerForce + safeBulge * 0.1,
                        baseRadius + pointerForce,
                    ],
                }}
                transition={prefersReducedMotion ? undefined : {
                    duration: 0.45,
                    repeat: Infinity,
                    repeatType: "mirror",
                }}
                aria-hidden="true"
            />

            {isWaving && !prefersReducedMotion && (
                <motion.div
                    key={waveNonce}
                    className="absolute inset-0 pointer-events-none border-2"
                    style={{
                        borderColor,
                        borderRadius: baseRadius,
                        opacity: 0.7,
                    }}
                    initial={{ scale: 1, opacity: 0.8 }}
                    animate={{ scale: 1.08, opacity: 0 }}
                    transition={{ duration: 0.55, ease: "easeOut" }}
                    aria-hidden="true"
                />
            )}

            <span className="relative z-10 font-semibold text-white px-6 py-3">{children}</span>
        </motion.button>
    );
};

export default ElasticBorderButton;
`
  },
  "buttons/glitch-confirm-button": {
    component: dynamic(() => import("@/components/ui/buttons/glitch-confirm-button").then(mod => mod.GlitchConfirmButton || mod.default)),
    name: "Glitch Confirm Button",
    category: "buttons",
    slug: "glitch-confirm-button",
    code: `"use client";

/**
 * @component GlitchConfirmButton
 * @description Click triggers a brief glitch effect (horizontal shift + chromatic split),
 * then transitions to a confirmed state.
 * Principle: translateX noise + RGB channel separation + state transition.
 *
 * @example
 * \`\`\`tsx
 * import { GlitchConfirmButton } from '@/components/buttons/glitch-confirm-button';
 *
 * <GlitchConfirmButton
 *   label="Submit"
 *   confirmedLabel="✓ Done"
 *   onClick={() => console.log('confirmed!')}
 * />
 * \`\`\`
 */

import React, { useState, useRef, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";

export interface GlitchConfirmButtonProps {
    /** Default label */
    label?: string;
    /** Label after confirmation */
    confirmedLabel?: string;
    /** Click handler */
    onClick?: () => void;
    /** Glitch duration in ms. Default: 400 */
    glitchDuration?: number;
    /** Auto-reset after ms (0 = no reset). Default: 2000 */
    autoResetMs?: number;
    /** Additional class names */
    className?: string;
}

export const GlitchConfirmButton: React.FC<GlitchConfirmButtonProps> = ({
    label = "Confirm",
    confirmedLabel = "✓ Confirmed",
    onClick,
    glitchDuration = 400,
    autoResetMs = 2000,
    className = "",
}) => {
    const prefersReducedMotion = useReducedMotion();
    const [phase, setPhase] = useState<"idle" | "glitching" | "confirmed">("idle");
    const timerRefs = useRef<ReturnType<typeof setTimeout>[]>([]);

    const handleClick = () => {
        if (phase !== "idle") return;

        if (prefersReducedMotion) {
            setPhase("confirmed");
            onClick?.();
            if (autoResetMs > 0) {
                const t = setTimeout(() => setPhase("idle"), autoResetMs);
                timerRefs.current.push(t);
            }
            return;
        }

        setPhase("glitching");
        const t1 = setTimeout(() => {
            setPhase("confirmed");
            onClick?.();
        }, glitchDuration);
        timerRefs.current.push(t1);

        if (autoResetMs > 0) {
            const t2 = setTimeout(() => setPhase("idle"), glitchDuration + autoResetMs);
            timerRefs.current.push(t2);
        }
    };

    useEffect(() => {
        return () => timerRefs.current.forEach(clearTimeout);
    }, []);

    return (
        <motion.button
            className={\`relative overflow-hidden px-6 py-3 rounded-xl font-semibold cursor-pointer select-none \${className}\`}
            style={{
                background: phase === "confirmed"
                    ? "linear-gradient(135deg, #10b981, #059669)"
                    : "linear-gradient(135deg, #6366f1, #4f46e5)",
                color: "#fff",
            }}
            onClick={handleClick}
            animate={
                phase === "glitching"
                    ? {
                        x: [0, -4, 6, -2, 4, 0],
                        skewX: [0, -2, 3, -1, 0],
                    }
                    : { x: 0, skewX: 0 }
            }
            transition={{ duration: glitchDuration / 1000 }}
            whileTap={phase === "idle" && !prefersReducedMotion ? { scale: 0.97 } : {}}
        >
            {/* Chromatic split layers during glitch */}
            {phase === "glitching" && !prefersReducedMotion && (
                <>
                    <motion.span
                        className="absolute inset-0 flex items-center justify-center pointer-events-none mix-blend-screen"
                        style={{ color: "rgba(255, 0, 0, 0.5)" }}
                        animate={{ x: [-3, 3, -2, 1, 0] }}
                        transition={{ duration: glitchDuration / 1000 }}
                        aria-hidden="true"
                    >
                        {label}
                    </motion.span>
                    <motion.span
                        className="absolute inset-0 flex items-center justify-center pointer-events-none mix-blend-screen"
                        style={{ color: "rgba(0, 255, 255, 0.5)" }}
                        animate={{ x: [3, -3, 2, -1, 0] }}
                        transition={{ duration: glitchDuration / 1000 }}
                        aria-hidden="true"
                    >
                        {label}
                    </motion.span>
                </>
            )}

            {/* Main label */}
            <motion.span
                className="relative z-10"
                animate={{
                    opacity: phase === "glitching" ? [1, 0.5, 1, 0.7, 1] : 1,
                }}
                transition={{ duration: glitchDuration / 1000 }}
            >
                {phase === "confirmed" ? confirmedLabel : label}
            </motion.span>
        </motion.button>
    );
};

export default GlitchConfirmButton;
`
  },
  "buttons/graviton-button": {
    component: dynamic(() => import("@/components/ui/buttons/graviton-button").then(mod => mod.GravitonButton || mod.default)),
    name: "Graviton Button",
    category: "buttons",
    slug: "graviton-button",
    code: `﻿"use client";

/**
 * @component GravitonButton
 * @description On hover, decorative particles orbit the button. On click, they gather
 * at center and burst outward.
 * Based on orbital particle movement + click-triggered scatter.
 *
 * @example
 * \`\`\`tsx
 * import { GravitonButton } from '@/components/buttons/graviton-button';
 *
 * <GravitonButton
 *   particleCount={8}
 *   particleColor="#f59e0b"
 *   onClick={() => console.log('clicked')}
 * >
 *   Launch
 * </GravitonButton>
 * \`\`\`
 */

import React, { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface GravitonButtonProps {
    /** Button content */
    children: React.ReactNode;
    /** Number of orbiting particles. Default: 8 */
    particleCount?: number;
    /** Particle color. Default: "#f59e0b" */
    particleColor?: string;
    /** Orbit radius in px. Default: 50 */
    orbitRadius?: number;
    /** Click handler */
    onClick?: (e: React.MouseEvent) => void;
    /** Disabled state */
    disabled?: boolean;
    /** Additional class names */
    className?: string;
}

export const GravitonButton: React.FC<GravitonButtonProps> = ({
    children,
    particleCount = 8,
    particleColor = "#f59e0b",
    orbitRadius = 50,
    onClick,
    disabled = false,
    className = "",
}) => {
    const [isHovered, setIsHovered] = useState(false);
    const [bursts, setBursts] = useState<number[]>([]);

    const particles = useMemo(
        () =>
            Array.from({ length: particleCount }, (_, i) => ({
                angle: (360 / particleCount) * i,
                size: 3 + Math.random() * 3,
                speed: 3 + Math.random() * 2,
            })),
        [particleCount]
    );

    const handleClick = useCallback(
        (e: React.MouseEvent) => {
            if (disabled) return;
            setBursts((prev) => [...prev, Date.now()]);
            setTimeout(() => setBursts((prev) => prev.slice(1)), 800);
            onClick?.(e);
        },
        [onClick, disabled]
    );

    return (
        <div className="relative inline-flex items-center justify-center">
            {/* Orbiting particles */}
            {isHovered &&
                particles.map((p, i) => (
                    <motion.div
                        key={i}
                        className="absolute pointer-events-none"
                        style={{
                            width: p.size,
                            height: p.size,
                            borderRadius: "50%",
                            background: particleColor,
                            boxShadow: \`0 0 \${p.size * 2}px \${particleColor}\`,
                        }}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{
                            opacity: 0.8,
                            scale: 1,
                            rotate: [p.angle, p.angle + 360],
                            x: Math.cos((p.angle * Math.PI) / 180) * orbitRadius,
                            y: Math.sin((p.angle * Math.PI) / 180) * orbitRadius,
                        }}
                        exit={{ opacity: 0, scale: 0 }}
                        transition={{
                            rotate: { duration: p.speed, repeat: Infinity, ease: "linear" },
                            opacity: { duration: 0.3 },
                            scale: { duration: 0.3 },
                        }}
                        aria-hidden="true"
                    />
                ))}

            {/* Burst particles */}
            <AnimatePresence>
                {bursts.map((id) =>
                    Array.from({ length: particleCount }, (_, i) => (
                        <motion.div
                            key={\`burst-\${id}-\${i}\`}
                            className="absolute pointer-events-none"
                            style={{
                                width: 4,
                                height: 4,
                                borderRadius: "50%",
                                background: particleColor,
                                boxShadow: \`0 0 8px \${particleColor}\`,
                            }}
                            initial={{ scale: 0, x: 0, y: 0 }}
                            animate={{
                                scale: [1, 0],
                                x: Math.cos(((360 / particleCount) * i * Math.PI) / 180) * orbitRadius * 2,
                                y: Math.sin(((360 / particleCount) * i * Math.PI) / 180) * orbitRadius * 2,
                                opacity: [1, 0],
                            }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            aria-hidden="true"
                        />
                    ))
                )}
            </AnimatePresence>

            {/* Button */}
            <motion.button
                className={\`relative z-10 px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-gray-800 to-gray-900 border border-white/10 \${className}\`}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={handleClick}
                disabled={disabled}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                aria-disabled={disabled}
            >
                {children}
            </motion.button>
        </div>
    );
};

export default GravitonButton;

`
  },
  "buttons/liquid-fill-button": {
    component: dynamic(() => import("@/components/ui/buttons/liquid-fill-button").then(mod => mod.LiquidFillButton || mod.default)),
    name: "Liquid Fill Button",
    category: "buttons",
    slug: "liquid-fill-button",
    code: `"use client";

/**
 * @component LiquidFillButton
 * @description Click fills the button from bottom with liquid animation,
 * changing color when full, then drains on reset.
 * Principle: clip-path fill + wave surface on the fill edge.
 *
 * @example
 * \`\`\`tsx
 * import { LiquidFillButton } from '@/components/buttons/liquid-fill-button';
 *
 * <LiquidFillButton
 *   fillColor="#10b981"
 *   onClick={() => console.log('filled!')}
 * >
 *   Confirm
 * </LiquidFillButton>
 * \`\`\`
 */

import React, { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

export interface LiquidFillButtonProps {
    children: React.ReactNode;
    /** Liquid fill color. Default: "#10b981" */
    fillColor?: string;
    /** Fill duration in seconds. Default: 0.8 */
    fillDuration?: number;
    /** Button click handler */
    onClick?: () => void;
    /** Additional class names */
    className?: string;
}

export const LiquidFillButton: React.FC<LiquidFillButtonProps> = ({
    children,
    fillColor = "#10b981",
    fillDuration = 0.8,
    onClick,
    className = "",
}) => {
    const prefersReducedMotion = useReducedMotion();
    const [isFilled, setIsFilled] = useState(false);

    const handleClick = () => {
        setIsFilled(!isFilled);
        onClick?.();
    };

    return (
        <motion.button
            className={\`relative overflow-hidden px-6 py-3 rounded-xl font-semibold text-white border border-gray-600 cursor-pointer \${className}\`}
            style={{ background: "transparent" }}
            onClick={handleClick}
            whileTap={prefersReducedMotion ? {} : { scale: 0.97 }}
        >
            {/* Liquid fill */}
            <motion.div
                className="absolute inset-0 pointer-events-none"
                style={{ backgroundColor: fillColor, transformOrigin: "bottom" }}
                initial={{ scaleY: 0 }}
                animate={{ scaleY: isFilled ? 1 : 0 }}
                transition={{
                    duration: prefersReducedMotion ? 0 : fillDuration,
                    ease: [0.22, 1, 0.36, 1],
                }}
                aria-hidden="true"
            />

            {/* Wave surface on fill edge */}
            {!prefersReducedMotion && (
                <motion.div
                    className="absolute left-0 right-0 h-2 pointer-events-none"
                    style={{
                        background: \`linear-gradient(to bottom, \${fillColor}, transparent)\`,
                    }}
                    animate={{
                        bottom: isFilled ? "100%" : "0%",
                        opacity: isFilled ? [0.6, 0] : [0, 0.6],
                    }}
                    transition={{
                        duration: fillDuration,
                        ease: "easeOut",
                    }}
                    aria-hidden="true"
                />
            )}

            {/* Label */}
            <span className="relative z-10">{children}</span>
        </motion.button>
    );
};

export default LiquidFillButton;
`
  },
  "buttons/magnetic-snap-button": {
    component: dynamic(() => import("@/components/ui/buttons/magnetic-snap-button").then(mod => mod.MagneticSnapButton || mod.default)),
    name: "Magnetic Snap Button",
    category: "buttons",
    slug: "magnetic-snap-button",
    code: `"use client";

/**
 * @component MagneticSnapButton
 * @description Button is attracted toward the pointer when nearby,
 * snapping back to position on click or pointer exit.
 * Principle: magnetic attraction force + spring return.
 *
 * @example
 * \`\`\`tsx
 * import { MagneticSnapButton } from '@/components/buttons/magnetic-snap-button';
 *
 * <MagneticSnapButton magnetStrength={0.3} onClick={() => console.log('snap!')}>
 *   Attract
 * </MagneticSnapButton>
 * \`\`\`
 */

import React, { useRef, useState, useCallback } from "react";
import { motion, useReducedMotion } from "framer-motion";

export interface MagneticSnapButtonProps {
    children: React.ReactNode;
    /** Magnetic pull strength (0-1). Default: 0.3 */
    magnetStrength?: number;
    /** Magnetic radius in px. Default: 100 */
    magnetRadius?: number;
    /** Button click handler */
    onClick?: () => void;
    /** Additional class names */
    className?: string;
}

export const MagneticSnapButton: React.FC<MagneticSnapButtonProps> = ({
    children,
    magnetStrength = 0.3,
    magnetRadius = 100,
    onClick,
    className = "",
}) => {
    const prefersReducedMotion = useReducedMotion();
    const btnRef = useRef<HTMLButtonElement>(null);
    const [offset, setOffset] = useState({ x: 0, y: 0 });

    const handlePointerMove = useCallback((e: React.PointerEvent) => {
        if (prefersReducedMotion) return;
        const btn = btnRef.current;
        if (!btn) return;
        const rect = btn.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = e.clientX - cx;
        const dy = e.clientY - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < magnetRadius) {
            const force = (1 - dist / magnetRadius) * magnetStrength;
            setOffset({ x: dx * force, y: dy * force });
        }
    }, [magnetStrength, magnetRadius, prefersReducedMotion]);

    const handlePointerLeave = useCallback(() => {
        setOffset({ x: 0, y: 0 });
    }, []);

    const handleClick = useCallback(() => {
        setOffset({ x: 0, y: 0 });
        onClick?.();
    }, [onClick]);

    return (
        <motion.button
            ref={btnRef}
            className={\`relative px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 transition-colors cursor-pointer \${className}\`}
            onPointerMove={handlePointerMove}
            onPointerLeave={handlePointerLeave}
            onClick={handleClick}
            animate={{
                x: offset.x,
                y: offset.y,
            }}
            transition={{
                type: "spring",
                stiffness: 300,
                damping: 15,
                mass: 0.5,
            }}
        >
            {children}
        </motion.button>
    );
};

export default MagneticSnapButton;
`
  },
  "buttons/morph-label-button": {
    component: dynamic(() => import("@/components/ui/buttons/morph-label-button").then(mod => mod.MorphLabelButton || mod.default)),
    name: "Morph Label Button",
    category: "buttons",
    slug: "morph-label-button",
    code: `﻿"use client";

/**
 * @component MorphLabelButton
 * @description On hover, the text doesn't change characters but morphs its shape
 * through interpolation, giving a sense of intent shift.
 * Based on SVG text morph + opacity transition.
 *
 * @example
 * \`\`\`tsx
 * import { MorphLabelButton } from '@/components/buttons/morph-label-button';
 *
 * <MorphLabelButton
 *   label="Submit"
 *   hoverLabel="Send →"
 *   onClick={() => console.log('morphed')}
 * />
 * \`\`\`
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface MorphLabelButtonProps {
    /** Default label */
    label: string;
    /** Label shown on hover */
    hoverLabel: string;
    /** Morph duration in seconds. Default: 0.3 */
    morphSpeed?: number;
    /** Click handler */
    onClick?: (e: React.MouseEvent) => void;
    /** Disabled state */
    disabled?: boolean;
    /** Additional class names */
    className?: string;
}

export const MorphLabelButton: React.FC<MorphLabelButtonProps> = ({
    label,
    hoverLabel,
    morphSpeed = 0.3,
    onClick,
    disabled = false,
    className = "",
}) => {
    const [isHovered, setIsHovered] = useState(false);
    const currentLabel = isHovered ? hoverLabel : label;
    const maxLen = Math.max(label.length, hoverLabel.length);

    return (
        <motion.button
            className={\`relative px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-gray-800 to-gray-900 border border-white/10 overflow-hidden \${className}\`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={onClick}
            disabled={disabled}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            aria-label={label}
            aria-disabled={disabled}
        >
            <span className="relative z-10 inline-flex">
                <AnimatePresence mode="popLayout">
                    {currentLabel.padEnd(maxLen).split("").map((char, i) => (
                        <motion.span
                            key={\`\${isHovered ? "h" : "d"}-\${i}\`}
                            className="inline-block"
                            initial={{
                                opacity: 0,
                                y: isHovered ? 8 : -8,
                                filter: "blur(4px)",
                                scale: 0.8,
                            }}
                            animate={{
                                opacity: char === " " && i >= currentLabel.trimEnd().length ? 0 : 1,
                                y: 0,
                                filter: "blur(0px)",
                                scale: 1,
                            }}
                            exit={{
                                opacity: 0,
                                y: isHovered ? -8 : 8,
                                filter: "blur(4px)",
                                scale: 0.8,
                            }}
                            transition={{
                                duration: morphSpeed,
                                delay: i * 0.02,
                                type: "spring",
                                stiffness: 300,
                                damping: 20,
                            }}
                        >
                            {char === " " ? "\u00A0" : char}
                        </motion.span>
                    ))}
                </AnimatePresence>
            </span>

            {/* Subtle background shift */}
            <motion.div
                className="absolute inset-0 z-0"
                animate={{
                    background: isHovered
                        ? "linear-gradient(135deg, rgba(139,92,246,0.1) 0%, transparent 100%)"
                        : "transparent",
                }}
                transition={{ duration: morphSpeed }}
                aria-hidden="true"
            />
        </motion.button>
    );
};

export default MorphLabelButton;

`
  },
  "buttons/pressure-ink-button": {
    component: dynamic(() => import("@/components/ui/buttons/pressure-ink-button").then(mod => mod.PressureInkButton || mod.default)),
    name: "Pressure Ink Button",
    category: "buttons",
    slug: "pressure-ink-button",
    code: `﻿"use client";

/**
 * @component PressureInkButton
 * @description At the click point, an ink blot forms and spreads across the button surface,
 * then retracts.
 * Based on click coordinate-based radial spread.
 *
 * @example
 * \`\`\`tsx
 * import { PressureInkButton } from '@/components/buttons/pressure-ink-button';
 *
 * <PressureInkButton inkColor="#ec4899" onClick={() => console.log('inked')}>
 *   Press Here
 * </PressureInkButton>
 * \`\`\`
 */

import React, { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface PressureInkButtonProps {
    /** Button content */
    children: React.ReactNode;
    /** Ink color. Default: "#ec4899" */
    inkColor?: string;
    /** Spread speed seconds. Default: 0.5 */
    spreadSpeed?: number;
    /** Click handler */
    onClick?: (e: React.MouseEvent) => void;
    /** Disabled state */
    disabled?: boolean;
    /** Additional class names */
    className?: string;
}

interface InkBlot {
    id: number;
    x: number;
    y: number;
}

export const PressureInkButton: React.FC<PressureInkButtonProps> = ({
    children,
    inkColor = "#ec4899",
    spreadSpeed = 0.5,
    onClick,
    disabled = false,
    className = "",
}) => {
    const btnRef = useRef<HTMLButtonElement>(null);
    const [blots, setBlots] = useState<InkBlot[]>([]);
    const idRef = useRef(0);
    const blotTimerRefs = useRef<ReturnType<typeof setTimeout>[]>([]);

    // Cleanup blot timers on unmount
    useEffect(() => {
        return () => { blotTimerRefs.current.forEach(clearTimeout); };
    }, []);

    const handleClick = useCallback(
        (e: React.MouseEvent<HTMLButtonElement>) => {
            if (disabled) return;
            const rect = btnRef.current?.getBoundingClientRect();
            if (!rect) return;

            const blot: InkBlot = {
                id: idRef.current++,
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
            };

            setBlots((prev) => [...prev, blot]);
            const timerId = setTimeout(() => {
                setBlots((prev) => prev.filter((b) => b.id !== blot.id));
            }, spreadSpeed * 2000);
            blotTimerRefs.current.push(timerId);

            onClick?.(e);
        },
        [onClick, disabled, spreadSpeed]
    );

    return (
        <motion.button
            ref={btnRef}
            className={\`relative px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-gray-800 to-gray-900 border border-white/10 overflow-hidden \${className}\`}
            onClick={handleClick}
            disabled={disabled}
            whileTap={{ scale: 0.97 }}
            aria-disabled={disabled}
        >
            {/* Ink blots */}
            <AnimatePresence>
                {blots.map((blot) => (
                    <motion.div
                        key={blot.id}
                        className="absolute pointer-events-none z-0 rounded-full"
                        style={{
                            left: blot.x,
                            top: blot.y,
                            background: \`radial-gradient(circle, \${inkColor} 0%, \${inkColor}80 40%, transparent 70%)\`,
                            transformOrigin: "center",
                        }}
                        initial={{ width: 0, height: 0, x: 0, y: 0, opacity: 0.9 }}
                        animate={{
                            width: 400,
                            height: 400,
                            x: -200,
                            y: -200,
                            opacity: [0.9, 0.7, 0],
                        }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: spreadSpeed * 2, ease: "easeOut" }}
                        aria-hidden="true"
                    />
                ))}
            </AnimatePresence>

            <span className="relative z-10">{children}</span>
        </motion.button>
    );
};

export default PressureInkButton;

`
  },
  "buttons/split-intent-button": {
    component: dynamic(() => import("@/components/ui/buttons/split-intent-button").then(mod => mod.SplitIntentButton || mod.default)),
    name: "Split Intent Button",
    category: "buttons",
    slug: "split-intent-button",
    code: `﻿"use client";

/**
 * @component SplitIntentButton
 * @description Detects pointer entry angle and animates an overlay
 * flowing from that direction to fill the button.
 * Based on entry angle detection + directional clip-path animation.
 *
 * @example
 * \`\`\`tsx
 * import { SplitIntentButton } from '@/components/buttons/split-intent-button';
 *
 * <SplitIntentButton
 *   fillColor="#8b5cf6"
 *   onClick={() => console.log('clicked')}
 * >
 *   Approach
 * </SplitIntentButton>
 * \`\`\`
 */

import React, { useState, useCallback, useRef } from "react";
import { motion } from "framer-motion";

export interface SplitIntentButtonProps {
    /** Button content */
    children: React.ReactNode;
    /** Fill overlay color. Default: "#8b5cf6" */
    fillColor?: string;
    /** Fill speed in seconds. Default: 0.3 */
    fillSpeed?: number;
    /** Click handler */
    onClick?: (e: React.MouseEvent) => void;
    /** Disabled state */
    disabled?: boolean;
    /** Additional class names */
    className?: string;
}

type Direction = "top" | "right" | "bottom" | "left";

const CLIP_START: Record<Direction, string> = {
    top: "inset(0% 0% 100% 0%)",
    right: "inset(0% 0% 0% 100%)",
    bottom: "inset(100% 0% 0% 0%)",
    left: "inset(0% 100% 0% 0%)",
};

const CLIP_FULL = "inset(0% 0% 0% 0%)";

export const SplitIntentButton: React.FC<SplitIntentButtonProps> = ({
    children,
    fillColor = "#8b5cf6",
    fillSpeed = 0.3,
    onClick,
    disabled = false,
    className = "",
}) => {
    const btnRef = useRef<HTMLButtonElement>(null);
    const [direction, setDirection] = useState<Direction>("left");
    const [isHovered, setIsHovered] = useState(false);

    const getDirection = useCallback((e: React.PointerEvent): Direction => {
        const el = btnRef.current;
        if (!el) return "left";
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        const angle = Math.atan2(y, x) * (180 / Math.PI);

        if (angle >= -45 && angle < 45) return "right";
        if (angle >= 45 && angle < 135) return "bottom";
        if (angle >= -135 && angle < -45) return "top";
        return "left";
    }, []);

    const handleEnter = useCallback(
        (e: React.PointerEvent) => {
            setDirection(getDirection(e));
            setIsHovered(true);
        },
        [getDirection]
    );

    const handleLeave = useCallback(
        (e: React.PointerEvent) => {
            setDirection(getDirection(e));
            setIsHovered(false);
        },
        [getDirection]
    );

    return (
        <motion.button
            ref={btnRef}
            className={\`relative px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-gray-800 to-gray-900 border border-white/10 overflow-hidden \${className}\`}
            onPointerEnter={handleEnter}
            onPointerLeave={handleLeave}
            onClick={onClick}
            disabled={disabled}
            whileTap={{ scale: 0.97 }}
            aria-disabled={disabled}
        >
            {/* Directional fill overlay */}
            <motion.div
                className="absolute inset-0 pointer-events-none z-0"
                style={{ background: fillColor }}
                animate={{
                    clipPath: isHovered ? CLIP_FULL : CLIP_START[direction],
                }}
                transition={{ duration: fillSpeed, ease: "easeInOut" }}
                aria-hidden="true"
            />

            <span className="relative z-10">{children}</span>
        </motion.button>
    );
};

export default SplitIntentButton;

`
  },
  "buttons/tension-string-button": {
    component: dynamic(() => import("@/components/ui/buttons/tension-string-button").then(mod => mod.TensionStringButton || mod.default)),
    name: "Tension String Button",
    category: "buttons",
    slug: "tension-string-button",
    code: `﻿"use client";

/**
 * @component TensionStringButton
 * @description The button surface stretches like an invisible string is being pulled;
 * on click it snaps back with a satisfying spring bounce.
 * Based on scaleX tension + spring bounce return.
 *
 * @example
 * \`\`\`tsx
 * import { TensionStringButton } from '@/components/buttons/tension-string-button';
 *
 * <TensionStringButton onClick={() => console.log('snap!')}>
 *   Pull Me
 * </TensionStringButton>
 * \`\`\`
 */

import React, { useState, useCallback } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";

export interface TensionStringButtonProps {
    /** Button content */
    children: React.ReactNode;
    /** Max stretch factor. Default: 1.15 */
    maxStretch?: number;
    /** Spring stiffness. Default: 500 */
    stiffness?: number;
    /** Spring damping. Default: 15 */
    damping?: number;
    /** Click handler */
    onClick?: (e: React.MouseEvent) => void;
    /** Disabled state */
    disabled?: boolean;
    /** Additional class names */
    className?: string;
}

export const TensionStringButton: React.FC<TensionStringButtonProps> = ({
    children,
    maxStretch = 1.15,
    stiffness = 500,
    damping = 15,
    onClick,
    disabled = false,
    className = "",
}) => {
    const [isPressed, setIsPressed] = useState(false);
    const x = useMotionValue(0);
    const scaleX = useTransform(x, [-50, 0, 50], [1 / maxStretch, 1, maxStretch]);
    const scaleY = useTransform(x, [-50, 0, 50], [maxStretch, 1, 1 / maxStretch]);

    const handleClick = useCallback(
        (e: React.MouseEvent) => {
            if (disabled) return;
            onClick?.(e);
        },
        [onClick, disabled]
    );

    return (
        <motion.button
            className={\`relative px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-gray-800 to-gray-900 border border-white/10 overflow-hidden \${className}\`}
            style={{ scaleX, scaleY }}
            whileHover={{ x: 0 }}
            onPointerDown={() => setIsPressed(true)}
            onPointerUp={() => setIsPressed(false)}
            animate={{
                scaleX: isPressed ? maxStretch : 1,
                scaleY: isPressed ? 1 / maxStretch : 1,
            }}
            transition={{
                type: "spring",
                stiffness,
                damping,
            }}
            onClick={handleClick}
            disabled={disabled}
            aria-disabled={disabled}
        >
            {/* Tension indicator lines */}
            <motion.div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background: isPressed
                        ? "linear-gradient(90deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 50%, rgba(255,255,255,0.05) 100%)"
                        : "none",
                }}
                aria-hidden="true"
            />

            <span className="relative z-10">{children}</span>
        </motion.button>
    );
};

export default TensionStringButton;

`
  },
  "cards/blueprint-expand-card": {
    component: dynamic(() => import("@/components/ui/cards/blueprint-expand-card").then(mod => mod.BlueprintExpandCard || mod.default)),
    name: "Blueprint Expand Card",
    category: "cards",
    slug: "blueprint-expand-card",
    code: `"use client";

/**
 * @component BlueprintExpandCard
 * @description On hover, card adds technical blueprint-style dimension lines,
 * annotations, and measurement indicators that fade in/out.
 * Principle: staged line draw animation + annotation fade.
 *
 * @example
 * \`\`\`tsx
 * import { BlueprintExpandCard } from '@/components/cards/blueprint-expand-card';
 *
 * <BlueprintExpandCard annotationColor="#06b6d4" className="w-80 p-6">
 *   <h3>Dimensions</h3>
 * </BlueprintExpandCard>
 * \`\`\`
 */

import React, { useState, useRef, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";

export interface BlueprintExpandCardProps {
    children: React.ReactNode;
    /** Annotation color. Default: "#06b6d4" */
    annotationColor?: string;
    /** Border radius. Default: 16 */
    borderRadius?: number;
    /** Additional class names */
    className?: string;
}

export const BlueprintExpandCard: React.FC<BlueprintExpandCardProps> = ({
    children,
    annotationColor = "#06b6d4",
    borderRadius = 16,
    className = "",
}) => {
    const prefersReducedMotion = useReducedMotion();
    const [isHovered, setIsHovered] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);
    const [dims, setDims] = useState({ w: 300, h: 200 });

    useEffect(() => {
        if (cardRef.current) {
            const rect = cardRef.current.getBoundingClientRect();
            setDims({ w: rect.width + 48, h: rect.height + 48 });
        }
    }, []);

    const show = isHovered && !prefersReducedMotion;

    return (
        <div
            ref={cardRef}
            className={\`relative \${className}\`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            role="article"
        >
            <div
                className="relative bg-gradient-to-br from-gray-800 to-gray-900 overflow-hidden"
                style={{ borderRadius }}
            >
                {children}
            </div>

            <div
                className="absolute -inset-6 pointer-events-none"
                aria-hidden="true"
            >
                <motion.div
                    className="absolute left-6 right-6 top-3 h-px origin-left"
                    style={{
                        backgroundImage: \`repeating-linear-gradient(90deg, \${annotationColor} 0 4px, transparent 4px 8px)\`,
                    }}
                    initial={{ scaleX: 0, opacity: 0 }}
                    animate={{ scaleX: show ? 1 : 0, opacity: show ? 0.6 : 0 }}
                    transition={{ duration: 0.4 }}
                />
                <motion.div
                    className="absolute top-2 w-px h-2"
                    style={{ left: 24, background: annotationColor }}
                    animate={{ opacity: show ? 0.6 : 0 }}
                    transition={{ duration: 0.3 }}
                />
                <motion.div
                    className="absolute top-2 w-px h-2"
                    style={{ left: dims.w - 24, background: annotationColor }}
                    animate={{ opacity: show ? 0.6 : 0 }}
                    transition={{ duration: 0.3 }}
                />

                <motion.div
                    className="absolute top-6 bottom-6 right-3 w-px origin-top"
                    style={{
                        backgroundImage: \`repeating-linear-gradient(180deg, \${annotationColor} 0 4px, transparent 4px 8px)\`,
                    }}
                    initial={{ scaleY: 0, opacity: 0 }}
                    animate={{ scaleY: show ? 1 : 0, opacity: show ? 0.6 : 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                />

                <motion.div
                    className="absolute"
                    style={{
                        left: 24,
                        top: 24,
                        width: 4,
                        height: 4,
                        borderTop: \`1px solid \${annotationColor}\`,
                        borderLeft: \`1px solid \${annotationColor}\`,
                    }}
                    animate={{ opacity: show ? 0.4 : 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                />
                <motion.div
                    className="absolute"
                    style={{
                        left: dims.w - 28,
                        top: 24,
                        width: 4,
                        height: 4,
                        borderTop: \`1px solid \${annotationColor}\`,
                        borderRight: \`1px solid \${annotationColor}\`,
                    }}
                    animate={{ opacity: show ? 0.4 : 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                />
            </div>

            {/* Dimension labels */}
            <motion.div
                className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-mono pointer-events-none"
                style={{ color: annotationColor }}
                animate={{ opacity: show ? 0.7 : 0, y: show ? 0 : 4 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                aria-hidden="true"
            >
                W: 320px
            </motion.div>
            <motion.div
                className="absolute top-1/2 -right-6 -translate-y-1/2 text-[10px] font-mono pointer-events-none"
                style={{ color: annotationColor, writingMode: "vertical-rl" }}
                animate={{ opacity: show ? 0.7 : 0, x: show ? 0 : -4 }}
                transition={{ duration: 0.3, delay: 0.3 }}
                aria-hidden="true"
            >
                H: 200px
            </motion.div>
        </div>
    );
};

export default BlueprintExpandCard;
`
  },
  "cards/depth-slice-card": {
    component: dynamic(() => import("@/components/ui/cards/depth-slice-card").then(mod => mod.DepthSliceCard || mod.default)),
    name: "Depth Slice Card",
    category: "cards",
    slug: "depth-slice-card",
    code: `﻿"use client";

/**
 * @component DepthSliceCard
 * @description On hover the card splits into horizontal slices, each moving at different speeds,
 * then merging back into a flat card.
 * Based on clip-path slicing + staggered translateY.
 *
 * @example
 * \`\`\`tsx
 * import { DepthSliceCard } from '@/components/cards/depth-slice-card';
 *
 * <DepthSliceCard sliceCount={5} className="w-80 h-48">
 *   <div className="p-6">
 *     <h3>Sliced View</h3>
 *     <p>Hover to separate</p>
 *   </div>
 * </DepthSliceCard>
 * \`\`\`
 */

import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";

export interface DepthSliceCardProps {
    /** Card children */
    children: React.ReactNode;
    /** Number of slices. Default: 5 */
    sliceCount?: number;
    /** Max displacement per slice in px. Default: 12 */
    maxDisplacement?: number;
    /** Animation stagger delay in seconds. Default: 0.04 */
    stagger?: number;
    /** Additional class names */
    className?: string;
}

export const DepthSliceCard: React.FC<DepthSliceCardProps> = ({
    children,
    sliceCount = 5,
    maxDisplacement = 12,
    stagger = 0.04,
    className = "",
}) => {
    const [isHovered, setIsHovered] = useState(false);

    const slices = useMemo(
        () =>
            Array.from({ length: sliceCount }, (_, i) => {
                const from = (i / sliceCount) * 100;
                const to = ((i + 1) / sliceCount) * 100;
                const mid = Math.abs(i - (sliceCount - 1) / 2);
                const direction = i < sliceCount / 2 ? -1 : 1;
                return {
                    clipPath: \`inset(\${from}% 0% \${100 - to}% 0%)\`,
                    displacement: direction * mid * (maxDisplacement / (sliceCount / 2)),
                    index: i,
                };
            }),
        [sliceCount, maxDisplacement]
    );

    return (
        <div
            className={\`relative \${className}\`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            role="article"
        >
            {slices.map((slice) => (
                <motion.div
                    key={slice.index}
                    className="absolute inset-0 rounded-2xl overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 dark:from-gray-800 dark:to-gray-950"
                    style={{ clipPath: slice.clipPath }}
                    animate={{
                        y: isHovered ? slice.displacement : 0,
                        x: isHovered ? slice.displacement * 0.2 : 0,
                    }}
                    transition={{
                        type: "spring",
                        stiffness: 200,
                        damping: 20,
                        delay: slice.index * stagger,
                    }}
                >
                    <div className="h-full">{children}</div>

                    {/* Slice edge highlight */}
                    {isHovered && (
                        <motion.div
                            className="absolute left-0 right-0 h-px pointer-events-none"
                            style={{
                                top: \`\${(slice.index / sliceCount) * 100}%\`,
                                background:
                                    "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)",
                            }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            aria-hidden="true"
                        />
                    )}
                </motion.div>
            ))}

            {/* Shadow overlay for depth perception */}
            <motion.div
                className="absolute inset-0 rounded-2xl pointer-events-none"
                animate={{
                    boxShadow: isHovered
                        ? "0 25px 50px rgba(0,0,0,0.4)"
                        : "0 4px 12px rgba(0,0,0,0.2)",
                }}
                transition={{ duration: 0.3 }}
                aria-hidden="true"
            />
        </div>
    );
};

export default DepthSliceCard;

`
  },
  "cards/diffraction-card": {
    component: dynamic(() => import("@/components/ui/cards/diffraction-card").then(mod => mod.DiffractionCard || mod.default)),
    name: "Diffraction Card",
    category: "cards",
    slug: "diffraction-card",
    code: `"use client";

/**
 * @component DiffractionCard
 * @description Rainbow diffraction patterns shift with viewing angle,
 * more geometric than hologram — based on interference pattern calculation.
 * Principle: angular-dependent interference colors via conic gradient rotation.
 *
 * @example
 * \`\`\`tsx
 * import { DiffractionCard } from '@/components/cards/diffraction-card';
 *
 * <DiffractionCard className="w-80 p-6">
 *   <h3>Diffraction</h3>
 * </DiffractionCard>
 * \`\`\`
 */

import React, { useState, useCallback } from "react";
import { motion, useReducedMotion } from "framer-motion";

export interface DiffractionCardProps {
    children: React.ReactNode;
    /** Diffraction intensity (0-1). Default: 0.3 */
    intensity?: number;
    /** Border radius. Default: 16 */
    borderRadius?: number;
    /** Additional class names */
    className?: string;
}

export const DiffractionCard: React.FC<DiffractionCardProps> = ({
    children,
    intensity = 0.3,
    borderRadius = 16,
    className = "",
}) => {
    const prefersReducedMotion = useReducedMotion();
    const [angle, setAngle] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    const handleMove = useCallback((e: React.PointerEvent) => {
        if (prefersReducedMotion) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        setAngle(Math.atan2(y - 0.5, x - 0.5) * (180 / Math.PI));
    }, [prefersReducedMotion]);

    const diffractionGradient = \`conic-gradient(from \${angle}deg at 50% 50%,
        rgba(255,0,0,\${intensity}) 0deg,
        rgba(255,127,0,\${intensity}) 51deg,
        rgba(255,255,0,\${intensity}) 102deg,
        rgba(0,255,0,\${intensity}) 153deg,
        rgba(0,0,255,\${intensity}) 204deg,
        rgba(75,0,130,\${intensity}) 255deg,
        rgba(148,0,211,\${intensity}) 306deg,
        rgba(255,0,0,\${intensity}) 360deg
    )\`;

    return (
        <motion.div
            className={\`relative overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 \${className}\`}
            style={{ borderRadius }}
            onPointerMove={handleMove}
            onPointerEnter={() => setIsHovered(true)}
            onPointerLeave={() => setIsHovered(false)}
            role="article"
        >
            {/* Diffraction overlay */}
            <motion.div
                className="absolute inset-0 pointer-events-none z-10 mix-blend-screen"
                style={{
                    borderRadius,
                    background: diffractionGradient,
                }}
                animate={{ opacity: isHovered && !prefersReducedMotion ? 1 : 0 }}
                transition={{ duration: 0.3 }}
                aria-hidden="true"
            />

            {/* Interference lines */}
            <motion.div
                className="absolute inset-0 pointer-events-none z-10"
                style={{
                    borderRadius,
                    background: \`repeating-linear-gradient(
                        \${angle + 90}deg,
                        transparent,
                        transparent 2px,
                        rgba(255,255,255,0.03) 2px,
                        rgba(255,255,255,0.03) 4px
                    )\`,
                }}
                animate={{ opacity: isHovered && !prefersReducedMotion ? 1 : 0 }}
                transition={{ duration: 0.3 }}
                aria-hidden="true"
            />

            <div className="relative z-20">{children}</div>
        </motion.div>
    );
};

export default DiffractionCard;
`
  },
  "cards/hologram-card": {
    component: dynamic(() => import("@/components/ui/cards/hologram-card").then(mod => mod.HologramCard || mod.default)),
    name: "Hologram Card",
    category: "cards",
    slug: "hologram-card",
    code: `﻿"use client";

/**
 * @component HologramCard
 * @description Holographic foil simulation that shifts colors based on viewing angle.
 * Mouse movement changes the light refraction pattern.
 * Based on mouse angle → hue-rotate + conic gradient overlay.
 *
 * @example
 * \`\`\`tsx
 * import { HologramCard } from '@/components/cards/hologram-card';
 *
 * <HologramCard className="w-80">
 *   <h3>Holographic</h3>
 *   <p>Tilt to see the rainbow</p>
 * </HologramCard>
 * \`\`\`
 */

import React, { useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";

export interface HologramCardProps {
    /** Card children */
    children: React.ReactNode;
    /** Hologram intensity (0–1). Default: 0.6 */
    intensity?: number;
    /** Rainbow spectrum saturation. Default: 80 */
    saturation?: number;
    /** Additional class names */
    className?: string;
}

export const HologramCard: React.FC<HologramCardProps> = ({
    children,
    intensity = 0.6,
    saturation = 80,
    className = "",
}) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const [pointer, setPointer] = useState({ x: 50, y: 50 });
    const [isHovered, setIsHovered] = useState(false);

    const handlePointerMove = useCallback((e: React.PointerEvent) => {
        const el = cardRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        setPointer({
            x: ((e.clientX - rect.left) / rect.width) * 100,
            y: ((e.clientY - rect.top) / rect.height) * 100,
        });
    }, []);

    const hueAngle = ((pointer.x + pointer.y) / 200) * 360;
    const tiltX = -(pointer.y - 50) * 0.15;
    const tiltY = (pointer.x - 50) * 0.15;

    return (
        <motion.div
            ref={cardRef}
            className={\`relative overflow-hidden rounded-2xl \${className}\`}
            style={{ perspective: 800 }}
            onPointerMove={handlePointerMove}
            onPointerEnter={() => setIsHovered(true)}
            onPointerLeave={() => setIsHovered(false)}
            animate={{
                rotateX: isHovered ? tiltX : 0,
                rotateY: isHovered ? tiltY : 0,
            }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            role="article"
        >
            {/* Base content */}
            <div className="relative z-10 p-6 bg-gradient-to-br from-gray-800 to-gray-900 dark:from-gray-800 dark:to-gray-950 h-full">
                {children}
            </div>

            {/* Holographic rainbow overlay */}
            <motion.div
                className="absolute inset-0 pointer-events-none z-20"
                style={{
                    background: \`conic-gradient(
            from \${hueAngle}deg at \${pointer.x}% \${pointer.y}%,
            hsl(0, \${saturation}%, 60%),
            hsl(60, \${saturation}%, 60%),
            hsl(120, \${saturation}%, 60%),
            hsl(180, \${saturation}%, 60%),
            hsl(240, \${saturation}%, 60%),
            hsl(300, \${saturation}%, 60%),
            hsl(360, \${saturation}%, 60%)
          )\`,
                    mixBlendMode: "overlay",
                }}
                animate={{ opacity: isHovered ? intensity : 0 }}
                transition={{ duration: 0.3 }}
                aria-hidden="true"
            />

            {/* Specular light stripe */}
            <motion.div
                className="absolute inset-0 pointer-events-none z-20"
                style={{
                    background: \`linear-gradient(
            \${90 + (pointer.x - 50) * 2}deg,
            transparent 30%,
            rgba(255,255,255,0.15) 45%,
            rgba(255,255,255,0.25) 50%,
            rgba(255,255,255,0.15) 55%,
            transparent 70%
          )\`,
                }}
                animate={{
                    opacity: isHovered ? 1 : 0,
                    x: isHovered ? (pointer.x - 50) * 0.5 : 0,
                }}
                transition={{ duration: 0.1 }}
                aria-hidden="true"
            />

            {/* Micro-pattern overlay (dot grid) */}
            <div
                className="absolute inset-0 pointer-events-none z-20"
                style={{
                    backgroundImage:
                        "radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)",
                    backgroundSize: "4px 4px",
                    opacity: isHovered ? 0.8 : 0.3,
                }}
                aria-hidden="true"
            />
        </motion.div>
    );
};

export default HologramCard;

`
  },
  "cards/lens-focus-card": {
    component: dynamic(() => import("@/components/ui/cards/lens-focus-card").then(mod => mod.LensFocusCard || mod.default)),
    name: "Lens Focus Card",
    category: "cards",
    slug: "lens-focus-card",
    code: `﻿"use client";

/**
 * @component LensFocusCard
 * @description Only the region under the pointer is "in focus",
 * the rest remains in cinematic blur.
 * Based on circular mask + pointer tracking + CSS blur.
 *
 * @example
 * \`\`\`tsx
 * import { LensFocusCard } from '@/components/cards/lens-focus-card';
 *
 * <LensFocusCard
 *   focusRadius={80}
 *   blurAmount={8}
 *   className="w-96 h-56"
 * >
 *   <div className="p-6">
 *     <h3>Focused Vision</h3>
 *     <p>Only what you look at is clear</p>
 *   </div>
 * </LensFocusCard>
 * \`\`\`
 */

import React, { useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";

export interface LensFocusCardProps {
    /** Card children */
    children: React.ReactNode;
    /** Focus circle radius in pixels. Default: 80 */
    focusRadius?: number;
    /** Blur amount in pixels. Default: 8 */
    blurAmount?: number;
    /** Focus transition softness in pixels. Default: 20 */
    edgeSoftness?: number;
    /** Additional class names */
    className?: string;
}

export const LensFocusCard: React.FC<LensFocusCardProps> = ({
    children,
    focusRadius = 80,
    blurAmount = 8,
    edgeSoftness = 20,
    className = "",
}) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const [pointer, setPointer] = useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = useState(false);

    const handlePointerMove = useCallback((e: React.PointerEvent) => {
        const el = cardRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        setPointer({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        });
    }, []);

    return (
        <div
            ref={cardRef}
            className={\`relative overflow-hidden rounded-2xl \${className}\`}
            onPointerMove={handlePointerMove}
            onPointerEnter={() => setIsHovered(true)}
            onPointerLeave={() => setIsHovered(false)}
            role="article"
        >
            {/* Blurred layer (always visible, underneath) */}
            <div
                className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 dark:from-gray-800 dark:to-gray-950"
                style={{
                    filter: isHovered ? \`blur(\${blurAmount}px)\` : "none",
                    transition: "filter 0.3s",
                }}
            >
                {children}
            </div>

            {/* Focused (sharp) layer with circular mask */}
            <motion.div
                className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 dark:from-gray-800 dark:to-gray-950"
                style={{
                    clipPath: isHovered
                        ? \`circle(\${focusRadius}px at \${pointer.x}px \${pointer.y}px)\`
                        : "circle(100% at 50% 50%)",
                    transition: isHovered ? "clip-path 0.05s" : "clip-path 0.4s",
                }}
            >
                {children}

                {/* Focus ring */}
                {isHovered && (
                    <div
                        className="absolute pointer-events-none"
                        style={{
                            left: pointer.x - focusRadius,
                            top: pointer.y - focusRadius,
                            width: focusRadius * 2,
                            height: focusRadius * 2,
                            borderRadius: "50%",
                            border: "1px solid rgba(255,255,255,0.15)",
                            boxShadow: \`0 0 \${edgeSoftness}px rgba(255,255,255,0.05)\`,
                        }}
                        aria-hidden="true"
                    />
                )}
            </motion.div>

            {/* Vignette overlay */}
            {isHovered && (
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        background: \`radial-gradient(circle at \${pointer.x}px \${pointer.y}px, transparent \${focusRadius - edgeSoftness}px, rgba(0,0,0,0.2) \${focusRadius + edgeSoftness}px)\`,
                    }}
                    aria-hidden="true"
                />
            )}
        </div>
    );
};

export default LensFocusCard;

`
  },
  "cards/liquid-border-card": {
    component: dynamic(() => import("@/components/ui/cards/liquid-border-card").then(mod => mod.LiquidBorderCard || mod.default)),
    name: "Liquid Border Card",
    category: "cards",
    slug: "liquid-border-card",
    code: `"use client";

/**
 * @component LiquidBorderCard
 * @description Card with an organically flowing, animated color border that moves
 * like liquid along the edges.
 * Based on animated conic border + blur + color transition.
 *
 * @example
 * \`\`\`tsx
 * import { LiquidBorderCard } from '@/components/cards/liquid-border-card';
 *
 * <LiquidBorderCard
 *   colors={['#f43f5e', '#8b5cf6', '#06b6d4']}
 *   className="w-80"
 * >
 *   <h3>Liquid Edges</h3>
 * </LiquidBorderCard>
 * \`\`\`
 */

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { toPositiveNumber } from "../../lib/utils";

export interface LiquidBorderCardProps {
    /** Card children */
    children: React.ReactNode;
    /** Border gradient colors. Default: rose/violet/cyan */
    colors?: string[];
    /** Border thickness. Default: 2 */
    borderWidth?: number;
    /** Animation speed multiplier. Default: 1 */
    speed?: number;
    /** Glow blur radius. Default: 12 */
    glowBlur?: number;
    /** Border radius. Default: 16 */
    borderRadius?: number;
    /** Additional class names */
    className?: string;
}

export const LiquidBorderCard: React.FC<LiquidBorderCardProps> = ({
    children,
    colors = ["#f43f5e", "#8b5cf6", "#06b6d4"],
    borderWidth = 2,
    speed = 1,
    glowBlur = 12,
    borderRadius = 16,
    className = "",
}) => {
    const prefersReducedMotion = useReducedMotion();
    const safeColors = colors.length >= 2 ? colors : ["#f43f5e", "#8b5cf6"];
    const safeBorderWidth = toPositiveNumber(borderWidth, 2, 0.1);
    const safeSpeed = toPositiveNumber(speed, 1, 0.01);
    const safeGlowBlur = toPositiveNumber(glowBlur, 12, 0.1);
    const safeBorderRadius = toPositiveNumber(borderRadius, 16, 0);
    const dur = 6 / safeSpeed;

    return (
        <div
            className={\`relative \${className}\`}
            style={{ borderRadius: safeBorderRadius }}
            role="article"
        >
            {/* Conic gradient border using CSS */}
            <motion.div
                className="absolute inset-0 pointer-events-none"
                style={{
                    borderRadius: safeBorderRadius,
                    padding: safeBorderWidth,
                    background: \`conic-gradient(from 0deg, \${safeColors.join(", ")}, \${safeColors[0]})\`,
                    WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                    WebkitMaskComposite: "xor",
                    maskComposite: "exclude",
                }}
                animate={prefersReducedMotion ? undefined : { rotate: 360 }}
                transition={
                    prefersReducedMotion ? undefined : { duration: dur, repeat: Infinity, ease: "linear" }
                }
                aria-hidden="true"
            />

            {/* Glow layer */}
            <motion.div
                className="absolute inset-0 pointer-events-none"
                style={{
                    borderRadius: safeBorderRadius,
                    padding: safeBorderWidth,
                    background: \`conic-gradient(from 180deg, \${safeColors.join(", ")}, \${safeColors[0]})\`,
                    WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                    WebkitMaskComposite: "xor",
                    maskComposite: "exclude",
                    filter: \`blur(\${safeGlowBlur}px)\`,
                    opacity: 0.5,
                }}
                animate={prefersReducedMotion ? undefined : { rotate: 360 }}
                transition={
                    prefersReducedMotion ? undefined : { duration: dur, repeat: Infinity, ease: "linear" }
                }
                aria-hidden="true"
            />

            {/* Content area */}
            <div
                className="relative z-10 bg-gray-900 dark:bg-gray-950 h-full p-6"
                style={{
                    borderRadius: Math.max(0, safeBorderRadius - safeBorderWidth),
                    margin: safeBorderWidth,
                }}
            >
                {children}
            </div>
        </div>
    );
};

export default LiquidBorderCard;
`
  },
  "cards/magnetic-card": {
    component: dynamic(() => import("@/components/ui/cards/magnetic-card").then(mod => mod.MagneticCard || mod.default)),
    name: "Magnetic Card",
    category: "cards",
    slug: "magnetic-card",
    code: `﻿"use client";

/**
 * @component MagneticCard
 * @description Card that magnetically tilts toward the pointer with 3D perspective,
 * realistic rotateX/Y based on mouse position.
 * Based on mouse position → 3D CSS transform.
 *
 * @example
 * \`\`\`tsx
 * import { MagneticCard } from '@/components/cards/magnetic-card';
 *
 * <MagneticCard
 *   tiltIntensity={15}
 *   glareOpacity={0.15}
 *   className="w-80"
 * >
 *   <h3>Card Content</h3>
 *   <p>Some description here</p>
 * </MagneticCard>
 * \`\`\`
 */

import React, { useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";

export interface MagneticCardProps {
    /** Card children */
    children: React.ReactNode;
    /** Maximum tilt angle in degrees. Default: 15 */
    tiltIntensity?: number;
    /** Glare overlay opacity. Default: 0.15 */
    glareOpacity?: number;
    /** Scale on hover. Default: 1.02 */
    hoverScale?: number;
    /** Border radius in pixels. Default: 16 */
    borderRadius?: number;
    /** Shadow color. Default: "rgba(0,0,0,0.3)" */
    shadowColor?: string;
    /** Additional class names */
    className?: string;
}

export const MagneticCard: React.FC<MagneticCardProps> = ({
    children,
    tiltIntensity = 15,
    glareOpacity = 0.15,
    hoverScale = 1.02,
    borderRadius = 16,
    shadowColor = "rgba(0,0,0,0.3)",
    className = "",
}) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });
    const [glarePos, setGlarePos] = useState({ x: 50, y: 50 });
    const [isHovered, setIsHovered] = useState(false);

    const handlePointerMove = useCallback(
        (e: React.PointerEvent) => {
            const el = cardRef.current;
            if (!el) return;

            const rect = el.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;
            const y = (e.clientY - rect.top) / rect.height;

            const rotateY = (x - 0.5) * tiltIntensity * 2;
            const rotateX = -(y - 0.5) * tiltIntensity * 2;

            setTilt({ rotateX, rotateY });
            setGlarePos({ x: x * 100, y: y * 100 });
        },
        [tiltIntensity]
    );

    const handlePointerLeave = useCallback(() => {
        setTilt({ rotateX: 0, rotateY: 0 });
        setIsHovered(false);
    }, []);

    return (
        <motion.div
            ref={cardRef}
            className={\`relative overflow-hidden \${className}\`}
            style={{
                perspective: 1000,
                borderRadius,
            }}
            onPointerMove={handlePointerMove}
            onPointerEnter={() => setIsHovered(true)}
            onPointerLeave={handlePointerLeave}
            animate={{
                rotateX: tilt.rotateX,
                rotateY: tilt.rotateY,
                scale: isHovered ? hoverScale : 1,
                boxShadow: isHovered
                    ? \`0 20px 40px \${shadowColor}, 0 0 0 1px rgba(255,255,255,0.05)\`
                    : \`0 4px 12px \${shadowColor}\`,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            role="article"
        >
            {/* Content */}
            <div className="relative z-10 p-6 bg-gradient-to-br from-gray-800/90 to-gray-900/90 dark:from-gray-800/90 dark:to-gray-950/90 backdrop-blur-sm h-full">
                {children}
            </div>

            {/* Glare overlay */}
            <motion.div
                className="absolute inset-0 pointer-events-none z-20"
                style={{
                    background: \`radial-gradient(circle at \${glarePos.x}% \${glarePos.y}%, rgba(255,255,255,\${glareOpacity}), transparent 60%)\`,
                    borderRadius,
                }}
                animate={{ opacity: isHovered ? 1 : 0 }}
                transition={{ duration: 0.2 }}
                aria-hidden="true"
            />

            {/* Subtle border highlight */}
            <motion.div
                className="absolute inset-0 pointer-events-none z-20"
                style={{
                    borderRadius,
                    border: "1px solid transparent",
                    backgroundClip: "padding-box",
                    background: \`linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%, rgba(255,255,255,0.05) 100%)\`,
                    mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                    WebkitMaskComposite: "xor",
                    maskComposite: "exclude",
                    padding: 1,
                }}
                animate={{ opacity: isHovered ? 1 : 0.3 }}
                aria-hidden="true"
            />
        </motion.div>
    );
};

export default MagneticCard;

`
  },
  "cards/memory-foam-card": {
    component: dynamic(() => import("@/components/ui/cards/memory-foam-card").then(mod => mod.MemoryFoamCard || mod.default)),
    name: "Memory Foam Card",
    category: "cards",
    slug: "memory-foam-card",
    code: `"use client";

/**
 * @component MemoryFoamCard
 * @description Press creates a visible depression that slowly springs back,
 * simulating visco-elastic memory foam material.
 * Principle: spring physics + overdamped oscillation on pointer pressure.
 *
 * @example
 * \`\`\`tsx
 * import { MemoryFoamCard } from '@/components/cards/memory-foam-card';
 *
 * <MemoryFoamCard depthPx={8} className="w-80 p-6">
 *   <h3>Press Me</h3>
 * </MemoryFoamCard>
 * \`\`\`
 */

import React, { useState, useCallback } from "react";
import { motion, useReducedMotion } from "framer-motion";

export interface MemoryFoamCardProps {
    children: React.ReactNode;
    /** Depression depth in px. Default: 6 */
    depthPx?: number;
    /** Recovery duration in seconds. Default: 1.2 */
    recoveryDuration?: number;
    /** Border radius. Default: 16 */
    borderRadius?: number;
    /** Additional class names */
    className?: string;
}

export const MemoryFoamCard: React.FC<MemoryFoamCardProps> = ({
    children,
    depthPx = 6,
    recoveryDuration = 1.2,
    borderRadius = 16,
    className = "",
}) => {
    const prefersReducedMotion = useReducedMotion();
    const [isPressed, setIsPressed] = useState(false);
    const [pressPoint, setPressPoint] = useState({ x: 50, y: 50 });

    const handlePress = useCallback((e: React.PointerEvent) => {
        if (prefersReducedMotion) return;
        const rect = e.currentTarget.getBoundingClientRect();
        setPressPoint({
            x: ((e.clientX - rect.left) / rect.width) * 100,
            y: ((e.clientY - rect.top) / rect.height) * 100,
        });
        setIsPressed(true);
    }, [prefersReducedMotion]);

    return (
        <motion.div
            className={\`relative overflow-hidden cursor-pointer bg-gradient-to-br from-gray-800 to-gray-900 \${className}\`}
            style={{ borderRadius }}
            onPointerDown={handlePress}
            onPointerUp={() => setIsPressed(false)}
            onPointerLeave={() => setIsPressed(false)}
            animate={
                isPressed && !prefersReducedMotion
                    ? { scale: 0.98 }
                    : { scale: 1 }
            }
            transition={{
                type: "spring",
                stiffness: 150,
                damping: 15,
                mass: 1,
                duration: isPressed ? 0.1 : recoveryDuration,
            }}
            role="article"
        >
            {/* Depth shadow at press point */}
            <motion.div
                className="absolute pointer-events-none"
                style={{
                    left: \`\${pressPoint.x}%\`,
                    top: \`\${pressPoint.y}%\`,
                    transform: "translate(-50%, -50%)",
                    width: "150%",
                    height: "150%",
                    borderRadius: "50%",
                    background: \`radial-gradient(circle, rgba(0,0,0,0.15) 0%, transparent 50%)\`,
                }}
                animate={{
                    opacity: isPressed && !prefersReducedMotion ? 1 : 0,
                    scale: isPressed ? 1 : 0.5,
                }}
                transition={{
                    opacity: { duration: isPressed ? 0.1 : recoveryDuration },
                    scale: {
                        type: "spring",
                        stiffness: 100,
                        damping: 12,
                    },
                }}
                aria-hidden="true"
            />

            {/* Content depression effect */}
            <motion.div
                animate={{
                    y: isPressed && !prefersReducedMotion ? depthPx * 0.3 : 0,
                    scale: isPressed && !prefersReducedMotion ? 0.995 : 1,
                }}
                transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 20,
                    duration: isPressed ? 0.05 : recoveryDuration,
                }}
            >
                {children}
            </motion.div>
        </motion.div>
    );
};

export default MemoryFoamCard;
`
  },
  "cards/orbit-metadata-card": {
    component: dynamic(() => import("@/components/ui/cards/orbit-metadata-card").then(mod => mod.OrbitMetadataCard || mod.default)),
    name: "Orbit Metadata Card",
    category: "cards",
    slug: "orbit-metadata-card",
    code: `﻿"use client";

/**
 * @component OrbitMetadataCard
 * @description On hover, metadata chips orbit around the card in circular paths.
 * On exit, chips settle back to card corners.
 * Based on circular path animation + hover trigger.
 *
 * @example
 * \`\`\`tsx
 * import { OrbitMetadataCard } from '@/components/cards/orbit-metadata-card';
 *
 * <OrbitMetadataCard
 *   metadata={[
 *     { label: 'React', icon: '⚛' },
 *     { label: 'TypeScript', icon: '📘' },
 *     { label: 'MIT', icon: '📄' },
 *     { label: 'v2.0', icon: '🏷' },
 *   ]}
 *   className="w-80"
 * >
 *   <h3>Component Package</h3>
 * </OrbitMetadataCard>
 * \`\`\`
 */

import React, { useState } from "react";
import { motion } from "framer-motion";

export interface MetadataItem {
    /** Label text */
    label: string;
    /** Optional icon or emoji */
    icon?: string;
    /** Optional custom color */
    color?: string;
}

export interface OrbitMetadataCardProps {
    /** Card children */
    children: React.ReactNode;
    /** Metadata chips to orbit */
    metadata: MetadataItem[];
    /** Orbit radius in pixels. Default: 160 */
    orbitRadius?: number;
    /** Orbit duration in seconds. Default: 8 */
    orbitDuration?: number;
    /** Additional class names */
    className?: string;
}

const CORNER_POSITIONS = [
    { x: -8, y: -8 },
    { x: 8, y: -8 },
    { x: 8, y: 8 },
    { x: -8, y: 8 },
];

export const OrbitMetadataCard: React.FC<OrbitMetadataCardProps> = ({
    children,
    metadata,
    orbitRadius = 160,
    orbitDuration = 8,
    className = "",
}) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            className={\`relative \${className}\`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            role="article"
        >
            {/* Orbit ring visual */}
            <motion.div
                className="absolute pointer-events-none z-0"
                style={{
                    width: orbitRadius * 2,
                    height: orbitRadius * 2,
                    left: "50%",
                    top: "50%",
                    transform: "translate(-50%, -50%)",
                    borderRadius: "50%",
                    border: "1px dashed rgba(255,255,255,0.08)",
                }}
                animate={{ opacity: isHovered ? 0.6 : 0, scale: isHovered ? 1 : 0.8 }}
                transition={{ duration: 0.4 }}
                aria-hidden="true"
            />

            {/* Orbiting chips */}
            {metadata.map((item, i) => {
                const angleOffset = (i / metadata.length) * 360;
                const corner = CORNER_POSITIONS[i % CORNER_POSITIONS.length];

                return (
                    <motion.div
                        key={i}
                        className="absolute z-30 pointer-events-none"
                        style={{
                            left: "50%",
                            top: "50%",
                        }}
                        animate={
                            isHovered
                                ? {
                                    rotate: [angleOffset, angleOffset + 360],
                                    x: "-50%",
                                    y: "-50%",
                                }
                                : {
                                    rotate: 0,
                                    x: corner.x,
                                    y: corner.y,
                                }
                        }
                        transition={
                            isHovered
                                ? {
                                    rotate: {
                                        duration: orbitDuration,
                                        repeat: Infinity,
                                        ease: "linear",
                                    },
                                    x: { duration: 0.4 },
                                    y: { duration: 0.4 },
                                }
                                : {
                                    type: "spring",
                                    stiffness: 150,
                                    damping: 15,
                                }
                        }
                    >
                        <motion.div
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap shadow-lg"
                            style={{
                                transform: isHovered ? \`translateX(\${orbitRadius}px)\` : "none",
                                background: item.color || "rgba(139, 92, 246, 0.2)",
                                color: "rgba(255,255,255,0.9)",
                                border: "1px solid rgba(255,255,255,0.1)",
                                backdropFilter: "blur(8px)",
                            }}
                            animate={{
                                rotate: isHovered ? [-angleOffset, -angleOffset - 360] : 0,
                                scale: isHovered ? 1 : 0.85,
                            }}
                            transition={
                                isHovered
                                    ? {
                                        rotate: {
                                            duration: orbitDuration,
                                            repeat: Infinity,
                                            ease: "linear",
                                        },
                                    }
                                    : { type: "spring", stiffness: 150, damping: 15 }
                            }
                        >
                            {item.icon && <span>{item.icon}</span>}
                            <span>{item.label}</span>
                        </motion.div>
                    </motion.div>
                );
            })}

            {/* Main card */}
            <motion.div
                className="relative z-10 rounded-2xl p-6 bg-gradient-to-br from-gray-800 to-gray-900 dark:from-gray-800 dark:to-gray-950 border border-white/5"
                animate={{
                    scale: isHovered ? 1.02 : 1,
                    boxShadow: isHovered
                        ? "0 20px 40px rgba(0,0,0,0.4)"
                        : "0 4px 12px rgba(0,0,0,0.2)",
                }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
            >
                {children}
            </motion.div>
        </div>
    );
};

export default OrbitMetadataCard;

`
  },
  "cards/peel-card": {
    component: dynamic(() => import("@/components/ui/cards/peel-card").then(mod => mod.PeelCard || mod.default)),
    name: "Peel Card",
    category: "cards",
    slug: "peel-card",
    code: `"use client";

/**
 * @component PeelCard
 * @description Card peels from a corner to reveal alternate content underneath.
 * Uses CSS 3D perspective to simulate paper peeling.
 * Principle: CSS perspective + rotateY peel animation + shadow mapping.
 *
 * @example
 * \`\`\`tsx
 * import { PeelCard } from '@/components/cards/peel-card';
 *
 * <PeelCard
 *   front={<div className="p-6"><h3>Front</h3></div>}
 *   back={<div className="p-6"><h3>Hidden!</h3></div>}
 *   className="w-80 h-48"
 * />
 * \`\`\`
 */

import React, { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

export interface PeelCardProps {
    /** Front face content */
    front: React.ReactNode;
    /** Back face content revealed on peel */
    back: React.ReactNode;
    /** Peel corner. Default: "top-right" */
    corner?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
    /** Border radius. Default: 16 */
    borderRadius?: number;
    /** Additional class names */
    className?: string;
}

export const PeelCard: React.FC<PeelCardProps> = ({
    front,
    back,
    corner = "top-right",
    borderRadius = 16,
    className = "",
}) => {
    const prefersReducedMotion = useReducedMotion();
    const [isPeeled, setIsPeeled] = useState(false);

    const originMap = {
        "top-right": "top right",
        "top-left": "top left",
        "bottom-right": "bottom right",
        "bottom-left": "bottom left",
    };

    return (
        <div
            className={\`relative \${className}\`}
            style={{ perspective: 800, borderRadius }}
            onMouseEnter={() => setIsPeeled(true)}
            onMouseLeave={() => setIsPeeled(false)}
            role="article"
        >
            {/* Back face */}
            <div
                className="absolute inset-0 overflow-hidden bg-gradient-to-br from-gray-700 to-gray-800"
                style={{ borderRadius }}
            >
                {back}
            </div>

            {/* Front face (peels away) */}
            <motion.div
                className="relative overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900"
                style={{
                    borderRadius,
                    transformOrigin: originMap[corner],
                    transformStyle: "preserve-3d",
                    backfaceVisibility: "hidden",
                }}
                animate={{
                    rotateY: isPeeled && !prefersReducedMotion
                        ? (corner.includes("right") ? -45 : 45)
                        : 0,
                    rotateX: isPeeled && !prefersReducedMotion
                        ? (corner.includes("top") ? 10 : -10)
                        : 0,
                }}
                transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 25,
                    duration: prefersReducedMotion ? 0 : undefined,
                }}
            >
                {front}

                {/* Peel shadow */}
                <motion.div
                    className="absolute inset-0 pointer-events-none"
                    animate={{
                        background: isPeeled && !prefersReducedMotion
                            ? "linear-gradient(135deg, transparent 60%, rgba(0,0,0,0.3) 100%)"
                            : "transparent",
                    }}
                    transition={{ duration: 0.3 }}
                    style={{ borderRadius }}
                    aria-hidden="true"
                />
            </motion.div>
        </div>
    );
};

export default PeelCard;
`
  },
  "cards/pressure-card": {
    component: dynamic(() => import("@/components/ui/cards/pressure-card").then(mod => mod.PressureCard || mod.default)),
    name: "Pressure Card",
    category: "cards",
    slug: "pressure-card",
    code: `﻿"use client";

/**
 * @component PressureCard
 * @description Pointer position creates a local depression on the card surface,
 * shadow and highlight dynamically shift.
 * Based on radial gradient + local scale deformation.
 *
 * @example
 * \`\`\`tsx
 * import { PressureCard } from '@/components/cards/pressure-card';
 *
 * <PressureCard className="w-80">
 *   <h3>Press Me</h3>
 *   <p>Feel the pressure</p>
 * </PressureCard>
 * \`\`\`
 */

import React, { useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";

export interface PressureCardProps {
    /** Card children */
    children: React.ReactNode;
    /** Pressure depth effect intensity. Default: 0.06 */
    depthIntensity?: number;
    /** Highlight color. Default: "rgba(255,255,255,0.12)" */
    highlightColor?: string;
    /** Shadow intensity. Default: 0.3 */
    shadowIntensity?: number;
    /** Additional class names */
    className?: string;
}

export const PressureCard: React.FC<PressureCardProps> = ({
    children,
    depthIntensity = 0.06,
    highlightColor = "rgba(255,255,255,0.12)",
    shadowIntensity = 0.3,
    className = "",
}) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const [pointer, setPointer] = useState({ x: 50, y: 50 });
    const [isHovered, setIsHovered] = useState(false);
    const [isPressed, setIsPressed] = useState(false);

    const handlePointerMove = useCallback((e: React.PointerEvent) => {
        const el = cardRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        setPointer({
            x: ((e.clientX - rect.left) / rect.width) * 100,
            y: ((e.clientY - rect.top) / rect.height) * 100,
        });
    }, []);

    const pressMultiplier = isPressed ? 2 : 1;

    return (
        <motion.div
            ref={cardRef}
            className={\`relative overflow-hidden rounded-2xl \${className}\`}
            style={{ perspective: 600 }}
            onPointerMove={handlePointerMove}
            onPointerEnter={() => setIsHovered(true)}
            onPointerLeave={() => { setIsHovered(false); setIsPressed(false); }}
            onPointerDown={() => setIsPressed(true)}
            onPointerUp={() => setIsPressed(false)}
            animate={{
                boxShadow: isHovered
                    ? \`\${(pointer.x - 50) * -0.3}px \${(pointer.y - 50) * -0.3}px \${20 + shadowIntensity * 20}px rgba(0,0,0,\${shadowIntensity})\`
                    : \`0 4px 12px rgba(0,0,0,\${shadowIntensity * 0.5})\`,
            }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            role="article"
        >
            {/* Background with depression gradient */}
            <div className="relative z-10 p-6 bg-gradient-to-br from-gray-800 to-gray-900 dark:from-gray-800 dark:to-gray-950 h-full">
                {children}
            </div>

            {/* Pressure depression visual */}
            <motion.div
                className="absolute inset-0 pointer-events-none z-20"
                style={{
                    background: isHovered
                        ? \`radial-gradient(circle at \${pointer.x}% \${pointer.y}%, rgba(0,0,0,\${depthIntensity * pressMultiplier}) 0%, transparent 40%)\`
                        : "none",
                }}
                animate={{ opacity: isHovered ? 1 : 0 }}
                aria-hidden="true"
            />

            {/* Highlight ring around depression */}
            <motion.div
                className="absolute inset-0 pointer-events-none z-20"
                style={{
                    background: isHovered
                        ? \`radial-gradient(circle at \${pointer.x}% \${pointer.y}%, transparent 15%, \${highlightColor} 25%, transparent 40%)\`
                        : "none",
                }}
                animate={{ opacity: isHovered ? 1 : 0 }}
                aria-hidden="true"
            />

            {/* Surface light reflection */}
            <motion.div
                className="absolute inset-0 pointer-events-none z-20"
                style={{
                    background: \`linear-gradient(\${135 + (pointer.x - 50) * 0.5}deg, rgba(255,255,255,0.04) 0%, transparent 50%)\`,
                }}
                animate={{ opacity: isHovered ? 1 : 0.3 }}
                aria-hidden="true"
            />
        </motion.div>
    );
};

export default PressureCard;

`
  },
  "cards/radar-scan-card": {
    component: dynamic(() => import("@/components/ui/cards/radar-scan-card").then(mod => mod.RadarScanCard || mod.default)),
    name: "Radar Scan Card",
    category: "cards",
    slug: "radar-scan-card",
    code: `"use client";

/**
 * @component RadarScanCard
 * @description A rotating radar sweep line scans across the card on hover,
 * highlighting elements as it passes over them.
 * Principle: conic gradient rotation + element highlight on intersect.
 *
 * @example
 * \`\`\`tsx
 * import { RadarScanCard } from '@/components/cards/radar-scan-card';
 *
 * <RadarScanCard scanColor="#22d3ee" className="w-80 p-6">
 *   <h3>Scanning...</h3>
 * </RadarScanCard>
 * \`\`\`
 */

import React, { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

export interface RadarScanCardProps {
    children: React.ReactNode;
    /** Scan line color. Default: "#22d3ee" */
    scanColor?: string;
    /** Rotation speed in seconds per full revolution. Default: 3 */
    rotationSpeed?: number;
    /** Border radius. Default: 16 */
    borderRadius?: number;
    /** Additional class names */
    className?: string;
}

export const RadarScanCard: React.FC<RadarScanCardProps> = ({
    children,
    scanColor = "#22d3ee",
    rotationSpeed = 3,
    borderRadius = 16,
    className = "",
}) => {
    const prefersReducedMotion = useReducedMotion();
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.div
            className={\`relative overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 \${className}\`}
            style={{ borderRadius }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            role="article"
        >
            {/* Radar sweep */}
            {isHovered && !prefersReducedMotion && (
                <motion.div
                    className="absolute inset-0 pointer-events-none z-10"
                    style={{
                        borderRadius,
                        background: \`conic-gradient(from 0deg at 50% 50%,
                            \${scanColor}20 0deg,
                            \${scanColor}60 5deg,
                            transparent 30deg,
                            transparent 360deg
                        )\`,
                    }}
                    animate={{ rotate: 360 }}
                    transition={{
                        duration: rotationSpeed,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                    aria-hidden="true"
                />
            )}

            {/* Radar center ping */}
            {isHovered && !prefersReducedMotion && (
                <motion.div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none z-10"
                    style={{ width: 4, height: 4, backgroundColor: scanColor }}
                    animate={{
                        boxShadow: [
                            \`0 0 0 0 \${scanColor}40\`,
                            \`0 0 0 20px \${scanColor}00\`,
                        ],
                    }}
                    transition={{
                        duration: 1.5,
                        repeat: Infinity,
                    }}
                    aria-hidden="true"
                />
            )}

            {/* Concentric radar rings */}
            <motion.div
                className="absolute inset-0 pointer-events-none"
                style={{
                    borderRadius,
                    background: \`
                        radial-gradient(circle at 50% 50%, transparent 15%, \${scanColor}08 15.5%, transparent 16%),
                        radial-gradient(circle at 50% 50%, transparent 30%, \${scanColor}06 30.5%, transparent 31%),
                        radial-gradient(circle at 50% 50%, transparent 45%, \${scanColor}04 45.5%, transparent 46%)
                    \`,
                }}
                animate={{ opacity: isHovered ? 1 : 0 }}
                transition={{ duration: 0.3 }}
                aria-hidden="true"
            />

            <div className="relative z-20">{children}</div>
        </motion.div>
    );
};

export default RadarScanCard;
`
  },
  "cards/seismic-card": {
    component: dynamic(() => import("@/components/ui/cards/seismic-card").then(mod => mod.SeismicCard || mod.default)),
    name: "Seismic Card",
    category: "cards",
    slug: "seismic-card",
    code: `"use client";

/**
 * @component SeismicCard
 * @description On hover, a seismic wave propagates across the card surface,
 * content trembles and settles. Based on sinusoidal wave attenuation.
 * Principle: sinusoidal wave propagation + distance-based amplitude decay.
 *
 * @example
 * \`\`\`tsx
 * import { SeismicCard } from '@/components/cards/seismic-card';
 *
 * <SeismicCard waveIntensity={4} className="w-80 p-6">
 *   <h3>Earthquake</h3>
 * </SeismicCard>
 * \`\`\`
 */

import React, { useState, useRef, useCallback, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";

export interface SeismicCardProps {
    children: React.ReactNode;
    /** Wave intensity in px. Default: 3 */
    waveIntensity?: number;
    /** Wave duration in seconds. Default: 0.8 */
    waveDuration?: number;
    /** Card border radius. Default: 16 */
    borderRadius?: number;
    /** Additional class names */
    className?: string;
}

export const SeismicCard: React.FC<SeismicCardProps> = ({
    children,
    waveIntensity = 3,
    waveDuration = 0.8,
    borderRadius = 16,
    className = "",
}) => {
    const prefersReducedMotion = useReducedMotion();
    const [isShaking, setIsShaking] = useState(false);
    const timerRef = useRef<ReturnType<typeof setTimeout>>();

    const triggerQuake = useCallback(() => {
        if (prefersReducedMotion || isShaking) return;
        setIsShaking(true);
        clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => setIsShaking(false), waveDuration * 1000);
    }, [prefersReducedMotion, isShaking, waveDuration]);

    useEffect(() => {
        return () => clearTimeout(timerRef.current);
    }, []);

    return (
        <motion.div
            className={\`relative overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 \${className}\`}
            style={{ borderRadius }}
            onMouseEnter={triggerQuake}
            animate={
                isShaking && !prefersReducedMotion
                    ? {
                        x: [0, -waveIntensity, waveIntensity, -waveIntensity * 0.5, waveIntensity * 0.5, 0],
                        y: [0, waveIntensity * 0.3, -waveIntensity * 0.3, waveIntensity * 0.15, 0],
                    }
                    : { x: 0, y: 0 }
            }
            transition={{
                duration: waveDuration,
                ease: "easeOut",
            }}
            role="article"
        >
            {/* Seismic wave ring */}
            {isShaking && !prefersReducedMotion && (
                <motion.div
                    className="absolute inset-0 pointer-events-none"
                    initial={{ boxShadow: "inset 0 0 0 0 rgba(239,68,68,0.3)" }}
                    animate={{ boxShadow: "inset 0 0 30px 5px rgba(239,68,68,0)" }}
                    transition={{ duration: waveDuration }}
                    style={{ borderRadius }}
                    aria-hidden="true"
                />
            )}

            {/* Content */}
            <motion.div
                animate={
                    isShaking && !prefersReducedMotion
                        ? { scale: [1, 0.99, 1.01, 0.995, 1] }
                        : { scale: 1 }
                }
                transition={{ duration: waveDuration }}
            >
                {children}
            </motion.div>
        </motion.div>
    );
};

export default SeismicCard;
`
  },
  "cards/signal-strength-card": {
    component: dynamic(() => import("@/components/ui/cards/signal-strength-card").then(mod => mod.SignalStrengthCard || mod.default)),
    name: "Signal Strength Card",
    category: "cards",
    slug: "signal-strength-card",
    code: `"use client";

/**
 * @component SignalStrengthCard
 * @description Border segments light up like signal bars based on pointer proximity.
 * Edges near the pointer glow at full strength, far ones are dim.
 * Based on distance-based opacity + border segment animation.
 *
 * @example
 * \`\`\`tsx
 * import { SignalStrengthCard } from '@/components/cards/signal-strength-card';
 *
 * <SignalStrengthCard
 *   segmentsPerSide={10}
 *   signalColor="#22d3ee"
 *   className="w-80"
 * >
 *   <h3>Signal Detected</h3>
 * </SignalStrengthCard>
 * \`\`\`
 */

import React, { useRef, useState, useCallback, useMemo, useLayoutEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { toPositiveInt, toPositiveNumber } from "../../lib/utils";

export interface SignalStrengthCardProps {
    /** Card children */
    children: React.ReactNode;
    /** Segments per side. Default: 10 */
    segmentsPerSide?: number;
    /** Signal color. Default: "#22d3ee" */
    signalColor?: string;
    /** Influence radius in pixels. Default: 200 */
    influenceRadius?: number;
    /** Border radius. Default: 16 */
    borderRadius?: number;
    /** Additional class names */
    className?: string;
}

interface Segment {
    side: "top" | "right" | "bottom" | "left";
    x1: number;
    y1: number;
    x2: number;
    y2: number;
}

export const SignalStrengthCard: React.FC<SignalStrengthCardProps> = ({
    children,
    segmentsPerSide = 10,
    signalColor = "#22d3ee",
    influenceRadius = 200,
    borderRadius = 16,
    className = "",
}) => {
    const prefersReducedMotion = useReducedMotion();
    const safeSegmentsPerSide = toPositiveInt(segmentsPerSide, 10, 1);
    const safeInfluenceRadius = toPositiveNumber(influenceRadius, 200, 1);
    const cardRef = useRef<HTMLDivElement>(null);
    const [pointer, setPointer] = useState({ x: -9999, y: -9999 });
    const [isHovered, setIsHovered] = useState(false);
    const [dims, setDims] = useState({ w: 300, h: 200 });

    // Measure dimensions via useLayoutEffect instead of during render
    useLayoutEffect(() => {
        const el = cardRef.current;
        if (!el) return;
        const ro = new ResizeObserver(([entry]) => {
            setDims({ w: entry.contentRect.width, h: entry.contentRect.height });
        });
        ro.observe(el);
        return () => ro.disconnect();
    }, []);

    const handlePointerMove = useCallback((e: React.PointerEvent) => {
        const el = cardRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        setPointer({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        });
    }, []);

    // Generate segment positions (percentages)
    const segments: Segment[] = useMemo(() => {
        const segs: Segment[] = [];
        const n = safeSegmentsPerSide;
        for (let i = 0; i < n; i++) {
            const f1 = (i / n) * 100;
            const f2 = ((i + 1) / n) * 100;
            segs.push({ side: "top", x1: f1, y1: 0, x2: f2, y2: 0 });
            segs.push({ side: "right", x1: 100, y1: f1, x2: 100, y2: f2 });
            segs.push({ side: "bottom", x1: f2, y1: 100, x2: f1, y2: 100 });
            segs.push({ side: "left", x1: 0, y1: f2, x2: 0, y2: f1 });
        }
        return segs;
    }, [safeSegmentsPerSide]);

    return (
        <div
            ref={cardRef}
            className={\`relative \${className}\`}
            onPointerMove={handlePointerMove}
            onPointerEnter={() => setIsHovered(true)}
            onPointerLeave={() => setIsHovered(false)}
            role="article"
        >
            {/* Signal border segments */}
            <div className="absolute inset-0 pointer-events-none z-20" aria-hidden="true">
                {segments.map((seg, i) => {
                    // Use measured dimensions
                    const midX = ((seg.x1 + seg.x2) / 200) * dims.w;
                    const midY = ((seg.y1 + seg.y2) / 200) * dims.h;
                    const dx = pointer.x - midX;
                    const dy = pointer.y - midY;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    const intensity = isHovered && !prefersReducedMotion
                        ? Math.max(0.05, 1 - dist / safeInfluenceRadius)
                        : 0.05;
                    const isHorizontal = seg.y1 === seg.y2;
                    const left = \`\${Math.min(seg.x1, seg.x2)}%\`;
                    const top = \`\${Math.min(seg.y1, seg.y2)}%\`;
                    const width = \`\${Math.max(0.4, Math.abs(seg.x2 - seg.x1))}%\`;
                    const height = \`\${Math.max(0.4, Math.abs(seg.y2 - seg.y1))}%\`;

                    return (
                        <motion.div
                            key={i}
                            className="absolute rounded-full"
                            style={{
                                left,
                                top,
                                width: isHorizontal ? width : "2px",
                                height: isHorizontal ? "2px" : height,
                                background: signalColor,
                                transform: isHorizontal ? "translateY(-1px)" : "translateX(-1px)",
                            }}
                            animate={{
                                opacity: intensity,
                                boxShadow: intensity > 0.3 ? \`0 0 \${intensity * 6}px \${signalColor}\` : "none",
                            }}
                            transition={{ duration: 0.1 }}
                        />
                    );
                })}
            </div>

            {/* Card content */}
            <div
                className="relative z-10 p-6 bg-gradient-to-br from-gray-800 to-gray-900 dark:from-gray-800 dark:to-gray-950"
                style={{ borderRadius }}
            >
                {children}
            </div>
        </div>
    );
};

export default SignalStrengthCard;
`
  },
  "cards/thermal-map-card": {
    component: dynamic(() => import("@/components/ui/cards/thermal-map-card").then(mod => mod.ThermalMapCard || mod.default)),
    name: "Thermal Map Card",
    category: "cards",
    slug: "thermal-map-card",
    code: `"use client";

/**
 * @component ThermalMapCard
 * @description Hover point acts as heat source; surface changes color like
 * thermochromic paint based on pointer proximity.
 * Principle: radial distance-based hue shift from cool to hot colors.
 *
 * @example
 * \`\`\`tsx
 * import { ThermalMapCard } from '@/components/cards/thermal-map-card';
 *
 * <ThermalMapCard hotColor="#ef4444" coldColor="#3b82f6" className="w-80 p-6">
 *   <h3>Heat Map</h3>
 * </ThermalMapCard>
 * \`\`\`
 */

import React, { useState, useCallback, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";

export interface ThermalMapCardProps {
    children: React.ReactNode;
    /** Hot color (near pointer). Default: "#ef4444" */
    hotColor?: string;
    /** Cold color (far from pointer). Default: "#1e3a5f" */
    coldColor?: string;
    /** Heat radius in px. Default: 150 */
    heatRadius?: number;
    /** Border radius. Default: 16 */
    borderRadius?: number;
    /** Additional class names */
    className?: string;
}

export const ThermalMapCard: React.FC<ThermalMapCardProps> = ({
    children,
    hotColor = "#ef4444",
    coldColor = "#1e3a5f",
    heatRadius = 150,
    borderRadius = 16,
    className = "",
}) => {
    const prefersReducedMotion = useReducedMotion();
    const cardRef = useRef<HTMLDivElement>(null);
    const [pointer, setPointer] = useState({ x: 50, y: 50 });
    const [isHovered, setIsHovered] = useState(false);

    const handleMove = useCallback((e: React.PointerEvent) => {
        if (prefersReducedMotion) return;
        const rect = e.currentTarget.getBoundingClientRect();
        setPointer({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        });
    }, [prefersReducedMotion]);

    const gradient = isHovered && !prefersReducedMotion
        ? \`radial-gradient(circle \${heatRadius}px at \${pointer.x}px \${pointer.y}px, \${hotColor}, \${coldColor})\`
        : \`linear-gradient(135deg, \${coldColor}, \${coldColor})\`;

    return (
        <motion.div
            ref={cardRef}
            className={\`relative overflow-hidden \${className}\`}
            style={{ borderRadius, background: gradient }}
            onPointerMove={handleMove}
            onPointerEnter={() => setIsHovered(true)}
            onPointerLeave={() => setIsHovered(false)}
            animate={{
                boxShadow: isHovered && !prefersReducedMotion
                    ? \`0 0 30px \${hotColor}40\`
                    : "none",
            }}
            transition={{ duration: 0.3 }}
            role="article"
        >
            <div className="relative z-10">{children}</div>
        </motion.div>
    );
};

export default ThermalMapCard;
`
  },
  "cards/torn-edge-card": {
    component: dynamic(() => import("@/components/ui/cards/torn-edge-card").then(mod => mod.TornEdgeCard || mod.default)),
    name: "Torn Edge Card",
    category: "cards",
    slug: "torn-edge-card",
    code: `"use client";

/**
 * @component TornEdgeCard
 * @description Card bottom edge has a torn paper appearance.
 * On hover, the torn edge ripples with subtle wave animation.
 * Principle: polygon clip-path noise deformation + hover wave animation.
 *
 * @example
 * \`\`\`tsx
 * import { TornEdgeCard } from '@/components/cards/torn-edge-card';
 *
 * <TornEdgeCard tearColor="#1f2937" className="w-80 p-6">
 *   <h3>Torn Paper</h3>
 * </TornEdgeCard>
 * \`\`\`
 */

import React, { useState, useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";

export interface TornEdgeCardProps {
    children: React.ReactNode;
    /** Tear depth in px. Default: 12 */
    tearDepth?: number;
    /** Background color matching parent. Default: "transparent" */
    tearColor?: string;
    /** Border radius for top corners. Default: 16 */
    borderRadius?: number;
    /** Additional class names */
    className?: string;
}

export const TornEdgeCard: React.FC<TornEdgeCardProps> = ({
    children,
    tearDepth = 12,
    tearColor = "transparent",
    borderRadius = 16,
    className = "",
}) => {
    const prefersReducedMotion = useReducedMotion();
    const [isHovered, setIsHovered] = useState(false);

    const tearClipPath = useMemo(() => {
        const segments = 40;
        const maxDepthPercent = Math.min(20, Math.max(2, tearDepth));
        const baseY = 100 - maxDepthPercent;
        const points: string[] = [\`0% 0%\`, \`100% 0%\`, \`100% \${baseY}%\`];

        for (let i = segments; i >= 0; i--) {
            const x = (i / segments) * 100;
            const noise = Math.sin(i * 12.9898 + 78.233) * 43758.5453;
            const offset = (noise - Math.floor(noise)) * maxDepthPercent;
            points.push(\`\${x.toFixed(1)}% \${(baseY + offset).toFixed(1)}%\`);
        }

        return \`polygon(\${points.join(", ")})\`;
    }, [tearDepth]);

    return (
        <div
            className={\`relative \${className}\`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            role="article"
        >
            <motion.div
                className="relative bg-gradient-to-br from-gray-800 to-gray-900"
                style={{
                    borderRadius: \`\${borderRadius}px \${borderRadius}px 0 0\`,
                    clipPath: tearClipPath,
                    paddingBottom: tearDepth,
                }}
                animate={
                    isHovered && !prefersReducedMotion
                        ? { y: [0, -1, 0, 1, 0] }
                        : { y: 0 }
                }
                transition={{
                    duration: 0.6,
                    repeat: isHovered ? Infinity : 0,
                    ease: "easeInOut",
                }}
            >
                {children}
            </motion.div>

            {/* Shadow beneath torn edge */}
            <div
                className="absolute bottom-0 left-0 right-0 h-2 pointer-events-none"
                style={{
                    background: \`linear-gradient(to bottom, rgba(0,0,0,0.1), \${tearColor})\`,
                }}
                aria-hidden="true"
            />
        </div>
    );
};

export default TornEdgeCard;
`
  },
  "cards/x-ray-card": {
    component: dynamic(() => import("@/components/ui/cards/x-ray-card").then(mod => mod.XRayCard || mod.default)),
    name: "X Ray Card",
    category: "cards",
    slug: "x-ray-card",
    code: `﻿"use client";

/**
 * @component XRayCard
 * @description On hover, the card surface becomes transparent, revealing content layers
 * at different z-depths that parallax move.
 * Based on clip-path mask + two-layer parallax transition.
 *
 * @example
 * \`\`\`tsx
 * import { XRayCard } from '@/components/cards/x-ray-card';
 *
 * <XRayCard
 *   frontContent={<div className="p-6"><h3>Surface</h3></div>}
 *   backContent={<div className="p-6 text-green-400 font-mono"><p>Hidden Data Layer</p></div>}
 *   className="w-80 h-48"
 * />
 * \`\`\`
 */

import React, { useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";

export interface XRayCardProps {
    /** Front (visible) content */
    frontContent: React.ReactNode;
    /** Back (hidden) content revealed on hover */
    backContent: React.ReactNode;
    /** Reveal radius in pixels. Default: 120 */
    revealRadius?: number;
    /** Parallax intensity. Default: 10 */
    parallaxIntensity?: number;
    /** Additional class names */
    className?: string;
}

export const XRayCard: React.FC<XRayCardProps> = ({
    frontContent,
    backContent,
    revealRadius = 120,
    parallaxIntensity = 10,
    className = "",
}) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const [pointer, setPointer] = useState({ x: 50, y: 50, px: 0, py: 0 });
    const [isHovered, setIsHovered] = useState(false);

    const handlePointerMove = useCallback(
        (e: React.PointerEvent) => {
            const el = cardRef.current;
            if (!el) return;
            const rect = el.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            setPointer({
                x,
                y,
                px: (x - 50) * (parallaxIntensity / 50),
                py: (y - 50) * (parallaxIntensity / 50),
            });
        },
        [parallaxIntensity]
    );

    return (
        <motion.div
            ref={cardRef}
            className={\`relative overflow-hidden rounded-2xl cursor-pointer \${className}\`}
            onPointerMove={handlePointerMove}
            onPointerEnter={() => setIsHovered(true)}
            onPointerLeave={() => setIsHovered(false)}
            role="article"
        >
            {/* Back layer (X-Ray content) — always present, parallax shifted */}
            <motion.div
                className="absolute inset-0 bg-gray-950 z-0"
                animate={{
                    x: isHovered ? -pointer.px * 1.5 : 0,
                    y: isHovered ? -pointer.py * 1.5 : 0,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
                <div className="absolute inset-0 p-2" style={{ opacity: isHovered ? 1 : 0.3 }}>
                    {backContent}
                </div>
                {/* Scan-line effect */}
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        backgroundImage:
                            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,100,0.03) 2px, rgba(0,255,100,0.03) 4px)",
                    }}
                    aria-hidden="true"
                />
            </motion.div>

            {/* Front layer with circular clip mask */}
            <motion.div
                className="relative z-10 bg-gradient-to-br from-gray-800 to-gray-900 h-full"
                style={{
                    clipPath: isHovered
                        ? \`polygon(
                0% 0%, 100% 0%, 100% 100%, 0% 100%,
                0% 0%,
                \${pointer.x - revealRadius / 3}% \${pointer.y - revealRadius / 3}%,
                \${pointer.x - revealRadius / 3}% \${pointer.y + revealRadius / 3}%,
                \${pointer.x + revealRadius / 3}% \${pointer.y + revealRadius / 3}%,
                \${pointer.x + revealRadius / 3}% \${pointer.y - revealRadius / 3}%,
                \${pointer.x - revealRadius / 3}% \${pointer.y - revealRadius / 3}%
              )\`
                        : undefined,
                }}
                animate={{
                    x: isHovered ? pointer.px : 0,
                    y: isHovered ? pointer.py : 0,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
                {frontContent}
            </motion.div>

            {/* Reveal ring glow */}
            {isHovered && (
                <div
                    className="absolute pointer-events-none z-20"
                    style={{
                        left: \`\${pointer.x}%\`,
                        top: \`\${pointer.y}%\`,
                        width: revealRadius * 2,
                        height: revealRadius * 2,
                        transform: "translate(-50%, -50%)",
                        borderRadius: "50%",
                        border: "1px solid rgba(0, 255, 100, 0.2)",
                        boxShadow: "0 0 20px rgba(0, 255, 100, 0.1), inset 0 0 20px rgba(0, 255, 100, 0.05)",
                    }}
                    aria-hidden="true"
                />
            )}
        </motion.div>
    );
};

export default XRayCard;

`
  },
  "chat/message-bubble": {
    component: dynamic(() => import("@/components/ui/chat/message-bubble").then(mod => mod.MessageBubble || mod.default)),
    name: "Message Bubble",
    category: "chat",
    slug: "message-bubble",
    code: `"use client";

/**
 * @component MessageBubble
 * @description Chat message bubble with distinct physics for user vs AI messages.
 * User messages bounce in; AI messages fade-slide in.
 * Principle: spring bounce (user) vs. fade slide (AI) entrance physics.
 *
 * @example
 * \`\`\`tsx
 * import { MessageBubble } from '@/components/chat/message-bubble';
 *
 * <MessageBubble role="user" text="Hello!" />
 * <MessageBubble role="assistant" text="Hi! How can I help?" />
 * \`\`\`
 */

import React from "react";
import { motion, useReducedMotion } from "framer-motion";

export interface MessageBubbleProps {
    /** Message sender role */
    role: "user" | "assistant";
    /** Message text */
    text: string;
    /** Avatar emoji or letter. Default: role-based */
    avatar?: string;
    /** Timestamp string */
    timestamp?: string;
    /** Additional class names */
    className?: string;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
    role,
    text,
    avatar,
    timestamp,
    className = "",
}) => {
    const prefersReducedMotion = useReducedMotion();
    const isUser = role === "user";
    const defaultAvatar = isUser ? "👤" : "✦";

    const userVariants = {
        hidden: { opacity: 0, x: 40, scale: 0.9 },
        visible: { opacity: 1, x: 0, scale: 1 },
    };

    const aiVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0 },
    };

    return (
        <motion.div
            className={\`flex gap-3 max-w-lg \${isUser ? "ml-auto flex-row-reverse" : ""} \${className}\`}
            variants={prefersReducedMotion ? {} : (isUser ? userVariants : aiVariants)}
            initial="hidden"
            animate="visible"
            transition={
                isUser
                    ? { type: "spring", stiffness: 400, damping: 20 }
                    : { duration: 0.4, ease: "easeOut" }
            }
        >
            {/* Avatar */}
            <div
                className={\`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm \${isUser ? "bg-violet-600" : "bg-gray-700"
                    }\`}
            >
                {avatar || defaultAvatar}
            </div>

            {/* Bubble */}
            <div
                className={\`px-4 py-2.5 rounded-2xl text-sm leading-relaxed \${isUser
                        ? "bg-violet-600 text-white rounded-br-md"
                        : "bg-gray-800 text-gray-200 rounded-bl-md border border-gray-700/50"
                    }\`}
            >
                {text}
                {timestamp && (
                    <div className={\`text-[10px] mt-1 \${isUser ? "text-violet-300" : "text-gray-500"}\`}>
                        {timestamp}
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default MessageBubble;
`
  },
  "chat/reaction-picker": {
    component: dynamic(() => import("@/components/ui/chat/reaction-picker").then(mod => mod.ReactionPicker || mod.default)),
    name: "Reaction Picker",
    category: "chat",
    slug: "reaction-picker",
    code: `"use client";

/**
 * @component ReactionPicker
 * @description Emoji reactions fan out on hover with spring physics.
 * Selection snaps emoji to the message with a satisfying pop.
 * Principle: spring fan-out + snap-to-target + scale pop.
 *
 * @example
 * \`\`\`tsx
 * import { ReactionPicker } from '@/components/chat/reaction-picker';
 *
 * <ReactionPicker
 *   reactions={["👍", "❤️", "😂", "🎉", "🤔"]}
 *   onSelect={(emoji) => console.log(emoji)}
 * />
 * \`\`\`
 */

import React, { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

export interface ReactionPickerProps {
    /** Emoji reactions to display. Default: common set */
    reactions?: string[];
    /** Callback when reaction is selected */
    onSelect?: (emoji: string) => void;
    /** Selected reaction (controlled) */
    selected?: string | null;
    /** Additional class names */
    className?: string;
}

export const ReactionPicker: React.FC<ReactionPickerProps> = ({
    reactions = ["👍", "❤️", "😂", "🎉", "🤔", "👀"],
    onSelect,
    selected: controlledSelected,
    className = "",
}) => {
    const prefersReducedMotion = useReducedMotion();
    const [isOpen, setIsOpen] = useState(false);
    const [internalSelected, setInternalSelected] = useState<string | null>(null);
    const selected = controlledSelected ?? internalSelected;

    const handleSelect = (emoji: string) => {
        setInternalSelected(emoji === internalSelected ? null : emoji);
        onSelect?.(emoji);
        setIsOpen(false);
    };

    return (
        <div className={\`relative inline-flex items-center \${className}\`}>
            {/* Selected reaction badge */}
            <AnimatePresence>
                {selected && (
                    <motion.span
                        className="text-lg mr-1"
                        initial={prefersReducedMotion ? {} : { scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={prefersReducedMotion ? {} : { scale: 0 }}
                        transition={{ type: "spring", stiffness: 500, damping: 15 }}
                    >
                        {selected}
                    </motion.span>
                )}
            </AnimatePresence>

            {/* Trigger button */}
            <button
                className="w-7 h-7 rounded-full bg-gray-700/50 hover:bg-gray-600/50 flex items-center justify-center text-sm cursor-pointer transition-colors"
                onMouseEnter={() => setIsOpen(true)}
                onMouseLeave={() => setIsOpen(false)}
                aria-label="Add reaction"
            >
                😊
            </button>

            {/* Fan-out picker */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 flex gap-0.5 bg-gray-800/95 rounded-full px-2 py-1.5 border border-gray-700/50 shadow-xl"
                        initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 10, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 10, scale: 0.8 }}
                        transition={{ type: "spring", stiffness: 400, damping: 22 }}
                        onMouseEnter={() => setIsOpen(true)}
                        onMouseLeave={() => setIsOpen(false)}
                    >
                        {reactions.map((emoji, i) => (
                            <motion.button
                                key={emoji}
                                className="w-8 h-8 rounded-full hover:bg-gray-600/50 flex items-center justify-center text-lg cursor-pointer transition-colors"
                                initial={prefersReducedMotion ? {} : { scale: 0, y: 10 }}
                                animate={{ scale: 1, y: 0 }}
                                transition={{
                                    type: "spring",
                                    stiffness: 500,
                                    damping: 15,
                                    delay: prefersReducedMotion ? 0 : i * 0.03,
                                }}
                                whileHover={prefersReducedMotion ? {} : { scale: 1.3, y: -4 }}
                                whileTap={prefersReducedMotion ? {} : { scale: 0.9 }}
                                onClick={() => handleSelect(emoji)}
                                aria-label={\`React with \${emoji}\`}
                            >
                                {emoji}
                            </motion.button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ReactionPicker;
`
  },
  "chat/stream-text": {
    component: dynamic(() => import("@/components/ui/chat/stream-text").then(mod => mod.StreamText || mod.default)),
    name: "Stream Text",
    category: "chat",
    slug: "stream-text",
    code: `"use client";

/**
 * @component StreamText
 * @description Token-by-token text stream with blur-to-clear reveal per word,
 * simulating real-time AI response generation.
 * Principle: per-token opacity + translateY + blur animation.
 *
 * @example
 * \`\`\`tsx
 * import { StreamText } from '@/components/chat/stream-text';
 *
 * <StreamText
 *   text="This is a streaming response from an AI assistant."
 *   speed={80}
 * />
 * \`\`\`
 */

import React, { useState, useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";

export interface StreamTextProps {
    /** Full text to stream */
    text: string;
    /** Speed per token in ms. Default: 60 */
    speed?: number;
    /** Blur amount for incoming tokens. Default: 3 */
    blurAmount?: number;
    /** onComplete callback */
    onComplete?: () => void;
    /** Additional class names */
    className?: string;
}

export const StreamText: React.FC<StreamTextProps> = ({
    text,
    speed = 60,
    blurAmount = 3,
    onComplete,
    className = "",
}) => {
    const prefersReducedMotion = useReducedMotion();
    const words = text.split(" ");
    const [visibleCount, setVisibleCount] = useState(0);
    const timerRef = useRef<ReturnType<typeof setTimeout>>();

    useEffect(() => {
        if (prefersReducedMotion) {
            setVisibleCount(words.length);
            onComplete?.();
            return;
        }

        setVisibleCount(0);
        let i = 0;
        const tick = () => {
            i++;
            setVisibleCount(i);
            if (i < words.length) {
                timerRef.current = setTimeout(tick, speed + Math.random() * speed * 0.5);
            } else {
                onComplete?.();
            }
        };
        timerRef.current = setTimeout(tick, speed);
        return () => clearTimeout(timerRef.current);
    }, [text, speed, prefersReducedMotion]);

    return (
        <p className={\`leading-relaxed \${className}\`}>
            {words.map((word, i) => {
                const isVisible = i < visibleCount;

                return (
                    <motion.span
                        key={\`\${word}-\${i}\`}
                        className="inline-block mr-[0.3em]"
                        initial={prefersReducedMotion ? {} : { opacity: 0, y: 4, filter: \`blur(\${blurAmount}px)\` }}
                        animate={
                            isVisible
                                ? { opacity: 1, y: 0, filter: "blur(0px)" }
                                : { opacity: 0, y: 4, filter: \`blur(\${blurAmount}px)\` }
                        }
                        transition={{
                            duration: prefersReducedMotion ? 0 : 0.2,
                            ease: "easeOut",
                        }}
                    >
                        {word}
                    </motion.span>
                );
            })}
            {visibleCount < words.length && !prefersReducedMotion && (
                <motion.span
                    className="inline-block w-2 h-4 bg-current ml-0.5 align-middle"
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.4, repeat: Infinity }}
                    aria-hidden="true"
                />
            )}
        </p>
    );
};

export default StreamText;
`
  },
  "chat/thinking-indicator": {
    component: dynamic(() => import("@/components/ui/chat/thinking-indicator").then(mod => mod.ThinkingIndicator || mod.default)),
    name: "Thinking Indicator",
    category: "chat",
    slug: "thinking-indicator",
    code: `"use client";

/**
 * @component ThinkingIndicator
 * @description AI "thinking" animation: neural network graph nodes pulse
 * with propagation delay, not cliché 3 bouncing dots.
 * Principle: graph node pulsing + propagation delay via adjacency.
 *
 * @example
 * \`\`\`tsx
 * import { ThinkingIndicator } from '@/components/chat/thinking-indicator';
 *
 * <ThinkingIndicator color="#8b5cf6" />
 * \`\`\`
 */

import React, { useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { toPositiveInt, toPositiveNumber } from "../../lib/utils";

export interface ThinkingIndicatorProps {
    /** Node color. Default: "#8b5cf6" */
    color?: string;
    /** Number of nodes. Default: 7 */
    nodeCount?: number;
    /** Pulse speed in seconds. Default: 1.5 */
    pulseSpeed?: number;
    /** Additional class names */
    className?: string;
}

export const ThinkingIndicator: React.FC<ThinkingIndicatorProps> = ({
    color = "#8b5cf6",
    nodeCount = 7,
    pulseSpeed = 1.5,
    className = "",
}) => {
    const prefersReducedMotion = useReducedMotion();
    const safeNodeCount = toPositiveInt(nodeCount, 7, 2);
    const safePulseSpeed = toPositiveNumber(pulseSpeed, 1.5, 0.01);
    const width = 80;
    const height = 32;

    // Generate node positions in a small network layout
    const nodes = useMemo(() => {
        const positions: { x: number; y: number }[] = [];
        const center = { x: width / 2, y: height / 2 };

        for (let i = 0; i < safeNodeCount; i++) {
            const angle = (i / safeNodeCount) * Math.PI * 2 + Math.PI / 6;
            const radius = i % 2 === 0 ? 12 : 8;
            positions.push({
                x: center.x + Math.cos(angle) * radius,
                y: center.y + Math.sin(angle) * radius,
            });
        }
        return positions;
    }, [safeNodeCount]);

    // Generate connections between nearby nodes
    const edges = useMemo(() => {
        const connections: { from: number; to: number }[] = [];
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const dx = nodes[i].x - nodes[j].x;
                const dy = nodes[i].y - nodes[j].y;
                if (Math.sqrt(dx * dx + dy * dy) < 18) {
                    connections.push({ from: i, to: j });
                }
            }
        }
        return connections;
    }, [nodes]);

    return (
        <div className={\`inline-flex items-center gap-2 \${className}\`} role="status" aria-label="AI is thinking">
            <div className="relative overflow-visible" style={{ width, height }} aria-hidden="true">
                {edges.map((e, i) => {
                    const x1 = nodes[e.from].x;
                    const y1 = nodes[e.from].y;
                    const x2 = nodes[e.to].x;
                    const y2 = nodes[e.to].y;
                    const dx = x2 - x1;
                    const dy = y2 - y1;
                    const length = Math.sqrt(dx * dx + dy * dy);
                    const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
                    return (
                        <motion.div
                            key={\`e-\${i}\`}
                            className="absolute h-px origin-left"
                            style={{
                                left: x1,
                                top: y1,
                                width: length,
                                background: color,
                                transform: \`translateY(-0.5px) rotate(\${angle}deg)\`,
                            }}
                            animate={prefersReducedMotion ? { opacity: 0.2 } : { opacity: [0.1, 0.4, 0.1] }}
                            transition={{
                                duration: safePulseSpeed,
                                delay: i * 0.1,
                                repeat: Infinity,
                            }}
                        />
                    );
                })}

                {nodes.map((n, i) => (
                    <motion.div
                        key={\`n-\${i}\`}
                        className="absolute rounded-full"
                        style={{
                            left: n.x - 2,
                            top: n.y - 2,
                            width: 4,
                            height: 4,
                            background: color,
                        }}
                        animate={prefersReducedMotion ? { opacity: 0.5 } : {
                            opacity: [0.3, 1, 0.3],
                            scale: [0.75, 1.25, 0.75],
                        }}
                        transition={{
                            duration: safePulseSpeed,
                            delay: i * (safePulseSpeed / safeNodeCount),
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    />
                ))}
            </div>
            <span className="text-xs text-gray-500 font-mono">thinking</span>
        </div>
    );
};

export default ThinkingIndicator;
`
  },
  "decorative/breathing-glow-halo": {
    component: dynamic(() => import("@/components/ui/decorative/breathing-glow-halo").then(mod => mod.BreathingGlowHalo || mod.default)),
    name: "Breathing Glow Halo",
    category: "decorative",
    slug: "breathing-glow-halo",
    code: `﻿"use client";

/**
 * @component BreathingGlowHalo
 * @description Outer and inner halos alternate opacity and scale at different rhythms,
 * creating a premium ambient light effect.
 * Based on dual-layer box-shadow + async animation loops.
 *
 * @example
 * \`\`\`tsx
 * import { BreathingGlowHalo } from '@/components/decorative/breathing-glow-halo';
 *
 * <BreathingGlowHalo color="#8b5cf6" size={200}>
 *   <img src="/logo.svg" alt="Logo" className="w-20 h-20" />
 * </BreathingGlowHalo>
 * \`\`\`
 */

import React from "react";
import { motion } from "framer-motion";

export interface BreathingGlowHaloProps {
    /** Content to wrap with the halo */
    children: React.ReactNode;
    /** Glow color. Default: "#8b5cf6" */
    color?: string;
    /** Halo diameter in pixels. Default: 200 */
    size?: number;
    /** Outer halo breath duration in seconds. Default: 4 */
    outerDuration?: number;
    /** Inner halo breath duration in seconds. Default: 2.5 */
    innerDuration?: number;
    /** Max outer glow opacity. Default: 0.3 */
    outerOpacity?: number;
    /** Max inner glow opacity. Default: 0.5 */
    innerOpacity?: number;
    /** Additional class names */
    className?: string;
}

export const BreathingGlowHalo: React.FC<BreathingGlowHaloProps> = ({
    children,
    color = "#8b5cf6",
    size = 200,
    outerDuration = 4,
    innerDuration = 2.5,
    outerOpacity = 0.3,
    innerOpacity = 0.5,
    className = "",
}) => {
    return (
        <div
            className={\`relative inline-flex items-center justify-center \${className}\`}
            style={{ width: size, height: size }}
        >
            {/* Outer halo */}
            <motion.div
                className="absolute inset-0 rounded-full pointer-events-none"
                style={{
                    background: \`radial-gradient(circle, \${color}00 40%, \${color}30 60%, \${color}00 80%)\`,
                }}
                animate={{
                    opacity: [outerOpacity * 0.3, outerOpacity, outerOpacity * 0.3],
                    scale: [0.9, 1.1, 0.9],
                }}
                transition={{
                    duration: outerDuration,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                aria-hidden="true"
            />

            {/* Inner halo */}
            <motion.div
                className="absolute rounded-full pointer-events-none"
                style={{
                    width: size * 0.65,
                    height: size * 0.65,
                    background: \`radial-gradient(circle, \${color}40 0%, \${color}15 50%, \${color}00 70%)\`,
                }}
                animate={{
                    opacity: [innerOpacity * 0.5, innerOpacity, innerOpacity * 0.5],
                    scale: [1.05, 0.95, 1.05],
                }}
                transition={{
                    duration: innerDuration,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                aria-hidden="true"
            />

            {/* Soft shadow ring */}
            <motion.div
                className="absolute rounded-full pointer-events-none"
                style={{
                    width: size * 0.8,
                    height: size * 0.8,
                    boxShadow: \`0 0 \${size * 0.15}px \${color}20, 0 0 \${size * 0.3}px \${color}10\`,
                }}
                animate={{
                    opacity: [0.5, 0.8, 0.5],
                }}
                transition={{
                    duration: (outerDuration + innerDuration) / 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                aria-hidden="true"
            />

            {/* Content */}
            <div className="relative z-10">{children}</div>
        </div>
    );
};

export default BreathingGlowHalo;

`
  },
  "decorative/living-divider": {
    component: dynamic(() => import("@/components/ui/decorative/living-divider").then(mod => mod.LivingDivider || mod.default)),
    name: "Living Divider",
    category: "decorative",
    slug: "living-divider",
    code: `"use client";

/**
 * @component LivingDivider
 * @description A divider line where segments thicken/thin with scroll or hover,
 * emitting a brief pulse at section transitions.
 * Based on segment-based stroke-width animation.
 *
 * @example
 * \`\`\`tsx
 * import { LivingDivider } from '@/components/decorative/living-divider';
 *
 * <LivingDivider
 *   segmentCount={20}
 *   color="#8b5cf6"
 *   className="w-full my-8"
 * />
 * \`\`\`
 */

import React, { useRef, useState, useCallback } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { toPositiveInt, toPositiveNumber } from "../../lib/utils";

export interface LivingDividerProps {
    /** Number of segments. Default: 20 */
    segmentCount?: number;
    /** Line color. Default: "#8b5cf6" */
    color?: string;
    /** Base thickness. Default: 1 */
    baseWidth?: number;
    /** Max thickness on hover. Default: 4 */
    maxWidth?: number;
    /** Trigger: hover or inView. Default: "hover" */
    triggerOn?: "hover" | "inView";
    /** Orientation. Default: "horizontal" */
    orientation?: "horizontal" | "vertical";
    /** Additional class names */
    className?: string;
}

export const LivingDivider: React.FC<LivingDividerProps> = ({
    segmentCount = 20,
    color = "#8b5cf6",
    baseWidth = 1,
    maxWidth = 4,
    triggerOn = "hover",
    orientation = "horizontal",
    className = "",
}) => {
    const prefersReducedMotion = useReducedMotion();
    const safeSegmentCount = toPositiveInt(segmentCount, 20, 1);
    const safeBaseWidth = toPositiveNumber(baseWidth, 1, 0.5);
    const safeMaxWidth = Math.max(safeBaseWidth, toPositiveNumber(maxWidth, 4, safeBaseWidth));
    const containerRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(containerRef, { amount: 0.5 });
    const [pointer, setPointer] = useState({ x: -1, y: -1 });
    const [isHovered, setIsHovered] = useState(false);

    const isActive = triggerOn === "hover" ? isHovered : isInView;

    const handlePointerMove = useCallback((e: React.PointerEvent) => {
        const rect = containerRef.current?.getBoundingClientRect();
        if (!rect) return;
        setPointer({
            x: ((e.clientX - rect.left) / rect.width) * 100,
            y: ((e.clientY - rect.top) / rect.height) * 100,
        });
    }, []);

    const isHorizontal = orientation === "horizontal";

    return (
        <div
            ref={containerRef}
            className={\`relative \${className}\`}
            style={{ height: isHorizontal ? safeMaxWidth * 2 : "100%", width: isHorizontal ? "100%" : safeMaxWidth * 2 }}
            onPointerMove={handlePointerMove}
            onPointerEnter={() => setIsHovered(true)}
            onPointerLeave={() => setIsHovered(false)}
            role="separator"
        >
            <div className="absolute inset-0" aria-hidden="true">
                {Array.from({ length: safeSegmentCount }, (_, i) => {
                    const frac = (i + 0.5) / safeSegmentCount;
                    const pointerFrac = isHorizontal ? pointer.x / 100 : pointer.y / 100;
                    const dist = Math.abs(frac - pointerFrac);
                    const intensity = prefersReducedMotion ? 0 : (isActive ? Math.max(0, 1 - dist * 4) : 0);
                    const strokeWidth = safeBaseWidth + intensity * (safeMaxWidth - safeBaseWidth);

                    if (isHorizontal) {
                        const x1 = (i / safeSegmentCount) * 100;
                        const width = 100 / safeSegmentCount;
                        return (
                            <motion.div
                                key={i}
                                className="absolute rounded-full"
                                style={{
                                    left: \`\${x1}%\`,
                                    top: "50%",
                                    width: \`\${width}%\`,
                                    transform: "translateY(-50%)",
                                    background: color,
                                    ...(intensity > 0.5 ? { filter: \`drop-shadow(0 0 3px \${color})\` } : {}),
                                }}
                                animate={{
                                    height: strokeWidth,
                                    opacity: 0.3 + intensity * 0.7,
                                }}
                                transition={{ duration: 0.15 }}
                            />
                        );
                    } else {
                        const y1 = (i / safeSegmentCount) * 100;
                        const height = 100 / safeSegmentCount;
                        return (
                            <motion.div
                                key={i}
                                className="absolute rounded-full"
                                style={{
                                    top: \`\${y1}%\`,
                                    left: "50%",
                                    height: \`\${height}%\`,
                                    transform: "translateX(-50%)",
                                    background: color,
                                    ...(intensity > 0.5 ? { filter: \`drop-shadow(0 0 3px \${color})\` } : {}),
                                }}
                                animate={{
                                    width: strokeWidth,
                                    opacity: 0.3 + intensity * 0.7,
                                }}
                                transition={{ duration: 0.15 }}
                            />
                        );
                    }
                })}
            </div>
        </div>
    );
};

export default LivingDivider;
`
  },
  "decorative/phase-chip": {
    component: dynamic(() => import("@/components/ui/decorative/phase-chip").then(mod => mod.PhaseChip || mod.default)),
    name: "Phase Chip",
    category: "decorative",
    slug: "phase-chip",
    code: `﻿"use client";

/**
 * @component PhaseChip
 * @description "Beta / New / AI" chips that transition from matte to glossy surface
 * on hover, like a phase-changing material.
 * Based on CSS backdrop-filter + brightness transition.
 *
 * @example
 * \`\`\`tsx
 * import { PhaseChip } from '@/components/decorative/phase-chip';
 *
 * <PhaseChip label="Beta" variant="info" />
 * <PhaseChip label="New" variant="success" />
 * <PhaseChip label="AI" variant="premium" icon="✨" />
 * \`\`\`
 */

import React, { useState } from "react";
import { motion } from "framer-motion";

export interface PhaseChipProps {
    /** Chip label */
    label: string;
    /** Visual variant */
    variant?: "info" | "success" | "warning" | "premium" | "neutral";
    /** Optional icon/emoji */
    icon?: string;
    /** Size */
    size?: "sm" | "md" | "lg";
    /** Additional class names */
    className?: string;
}

const VARIANT_COLORS: Record<string, { bg: string; text: string; glow: string }> = {
    info: { bg: "rgba(59, 130, 246, 0.15)", text: "#60a5fa", glow: "#3b82f6" },
    success: { bg: "rgba(16, 185, 129, 0.15)", text: "#34d399", glow: "#10b981" },
    warning: { bg: "rgba(245, 158, 11, 0.15)", text: "#fbbf24", glow: "#f59e0b" },
    premium: { bg: "rgba(139, 92, 246, 0.15)", text: "#a78bfa", glow: "#8b5cf6" },
    neutral: { bg: "rgba(255, 255, 255, 0.08)", text: "#94a3b8", glow: "#64748b" },
};

const SIZE_MAP: Record<string, string> = {
    sm: "text-[10px] px-2 py-0.5",
    md: "text-xs px-3 py-1",
    lg: "text-sm px-4 py-1.5",
};

export const PhaseChip: React.FC<PhaseChipProps> = ({
    label,
    variant = "info",
    icon,
    size = "md",
    className = "",
}) => {
    const [isHovered, setIsHovered] = useState(false);
    const colors = VARIANT_COLORS[variant] || VARIANT_COLORS.info;
    const sizeClass = SIZE_MAP[size] || SIZE_MAP.md;

    return (
        <motion.span
            className={\`relative inline-flex items-center gap-1 rounded-full font-medium cursor-default select-none \${sizeClass} \${className}\`}
            style={{
                background: colors.bg,
                color: colors.text,
                border: \`1px solid \${colors.text}20\`,
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            animate={{
                background: isHovered
                    ? \`linear-gradient(135deg, \${colors.bg}, rgba(255,255,255,0.12))\`
                    : colors.bg,
                boxShadow: isHovered
                    ? \`0 0 12px \${colors.glow}30, inset 0 1px 0 rgba(255,255,255,0.15)\`
                    : "none",
                filter: isHovered ? "brightness(1.3)" : "brightness(1)",
                borderColor: isHovered ? \`\${colors.text}50\` : \`\${colors.text}20\`,
            }}
            transition={{ duration: 0.25 }}
            role="status"
        >
            {/* Glossy overlay on hover */}
            <motion.span
                className="absolute inset-0 rounded-full pointer-events-none"
                style={{
                    background: "linear-gradient(180deg, rgba(255,255,255,0.15) 0%, transparent 60%)",
                }}
                animate={{ opacity: isHovered ? 1 : 0 }}
                transition={{ duration: 0.2 }}
                aria-hidden="true"
            />

            {icon && <span>{icon}</span>}
            <span className="relative z-10">{label}</span>
        </motion.span>
    );
};

export default PhaseChip;

`
  },
  "decorative/prismatic-underline": {
    component: dynamic(() => import("@/components/ui/decorative/prismatic-underline").then(mod => mod.PrismaticUnderline || mod.default)),
    name: "Prismatic Underline",
    category: "decorative",
    slug: "prismatic-underline",
    code: `﻿"use client";

/**
 * @component PrismaticUnderline
 * @description On link hover, the underline expands with a multi-layered diffraction effect
 * and hue shift. On exit, collapses to a thin line.
 * Based on multi-layer pseudo-element + hue shift animation.
 *
 * @example
 * \`\`\`tsx
 * import { PrismaticUnderline } from '@/components/decorative/prismatic-underline';
 *
 * <PrismaticUnderline href="#" colors={['#f43f5e', '#8b5cf6', '#06b6d4']}>
 *   Learn More
 * </PrismaticUnderline>
 * \`\`\`
 */

import React, { useState } from "react";
import { motion } from "framer-motion";

export interface PrismaticUnderlineProps {
    /** Link content */
    children: React.ReactNode;
    /** Link href. Default: "#" */
    href?: string;
    /** Prismatic colors. Default: rose/violet/cyan */
    colors?: string[];
    /** Underline max height in px. Default: 4 */
    maxHeight?: number;
    /** Animation duration in seconds. Default: 0.3 */
    duration?: number;
    /** Additional class names */
    className?: string;
}

export const PrismaticUnderline: React.FC<PrismaticUnderlineProps> = ({
    children,
    href = "#",
    colors = ["#f43f5e", "#8b5cf6", "#06b6d4"],
    maxHeight = 4,
    duration = 0.3,
    className = "",
}) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <a
            href={href}
            className={\`relative inline-block text-white no-underline \${className}\`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <span className="relative z-10">{children}</span>

            {/* Prismatic underline layers */}
            <span className="absolute left-0 right-0 bottom-0 overflow-hidden" style={{ height: maxHeight * 2 }}>
                {colors.map((color, i) => {
                    const offset = (i - (colors.length - 1) / 2) * 1.5;
                    return (
                        <motion.span
                            key={i}
                            className="absolute left-0 right-0 bottom-0"
                            style={{
                                background: color,
                                mixBlendMode: "screen",
                                bottom: offset,
                            }}
                            animate={{
                                height: isHovered ? maxHeight : 1,
                                opacity: isHovered ? 0.7 : i === Math.floor(colors.length / 2) ? 0.4 : 0,
                                scaleX: isHovered ? 1 : 0.3,
                            }}
                            transition={{
                                duration,
                                delay: i * 0.03,
                                ease: "easeOut",
                            }}
                            aria-hidden="true"
                        />
                    );
                })}

                {/* Shimmer sweep */}
                {isHovered && (
                    <motion.span
                        className="absolute bottom-0 h-full"
                        style={{
                            width: "30%",
                            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
                        }}
                        initial={{ left: "-30%" }}
                        animate={{ left: "130%" }}
                        transition={{ duration: duration * 2, ease: "easeInOut" }}
                        aria-hidden="true"
                    />
                )}
            </span>
        </a>
    );
};

export default PrismaticUnderline;

`
  },
  "decorative/thread-connector": {
    component: dynamic(() => import("@/components/ui/decorative/thread-connector").then(mod => mod.ThreadConnector || mod.default)),
    name: "Thread Connector",
    category: "decorative",
    slug: "thread-connector",
    code: `"use client";

/**
 * @component ThreadConnector
 * @description A thin connecting line between sections or cards with a signal
 * dot traveling along it; glows when active.
 * Based on stroke-dashoffset signal animation.
 *
 * @example
 * \`\`\`tsx
 * import { ThreadConnector } from '@/components/decorative/thread-connector';
 *
 * <ThreadConnector
 *   from={{ x: 100, y: 50 }}
 *   to={{ x: 400, y: 200 }}
 *   color="#10b981"
 *   active={true}
 * />
 * \`\`\`
 */

import React from "react";
import { useReducedMotion } from "framer-motion";
import { toPositiveNumber } from "../../lib/utils";

export interface ThreadConnectorProps {
    /** Start point */
    from: { x: number; y: number };
    /** End point */
    to: { x: number; y: number };
    /** Line color. Default: "#10b981" */
    color?: string;
    /** Whether the connection is active. Default: true */
    active?: boolean;
    /** Signal dot speed in seconds. Default: 2 */
    signalSpeed?: number;
    /** Line style. Default: "solid" */
    lineStyle?: "solid" | "dashed" | "dotted";
    /** Additional class names */
    className?: string;
}

export const ThreadConnector: React.FC<ThreadConnectorProps> = ({
    from,
    to,
    color = "#10b981",
    active = true,
    signalSpeed = 2,
    lineStyle = "solid",
    className = "",
}) => {
    const prefersReducedMotion = useReducedMotion();
    const canvasRef = React.useRef<HTMLCanvasElement>(null);
    const safeSignalSpeed = toPositiveNumber(signalSpeed, 2, 0.01);
    const minX = Math.min(from.x, to.x) - 10;
    const minY = Math.min(from.y, to.y) - 10;
    const width = Math.abs(to.x - from.x) + 20;
    const height = Math.abs(to.y - from.y) + 20;

    // Bezier control points for organic curve
    const midX = (from.x + to.x) / 2;
    const cp1x = midX;
    const cp1y = from.y;
    const cp2x = midX;
    const cp2y = to.y;

    const localStart = { x: from.x - minX, y: from.y - minY };
    const localEnd = { x: to.x - minX, y: to.y - minY };
    const localCp1 = { x: cp1x - minX, y: cp1y - minY };
    const localCp2 = { x: cp2x - minX, y: cp2y - minY };

    React.useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const dpr = window.devicePixelRatio || 1;
        canvas.width = Math.max(1, Math.floor(width * dpr));
        canvas.height = Math.max(1, Math.floor(height * dpr));
        canvas.style.width = \`\${width}px\`;
        canvas.style.height = \`\${height}px\`;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        const dashPattern = lineStyle === "dashed" ? [8, 4] : lineStyle === "dotted" ? [2, 4] : [];

        const pointOnCurve = (t: number) => {
            const mt = 1 - t;
            const x =
                mt * mt * mt * localStart.x +
                3 * mt * mt * t * localCp1.x +
                3 * mt * t * t * localCp2.x +
                t * t * t * localEnd.x;
            const y =
                mt * mt * mt * localStart.y +
                3 * mt * mt * t * localCp1.y +
                3 * mt * t * t * localCp2.y +
                t * t * t * localEnd.y;
            return { x, y };
        };

        const draw = (progress: number) => {
            ctx.clearRect(0, 0, width, height);

            ctx.beginPath();
            ctx.moveTo(localStart.x, localStart.y);
            ctx.bezierCurveTo(localCp1.x, localCp1.y, localCp2.x, localCp2.y, localEnd.x, localEnd.y);
            ctx.lineWidth = 1;
            ctx.strokeStyle = color;
            ctx.globalAlpha = active ? 0.3 : 0.1;
            ctx.setLineDash(dashPattern);
            ctx.stroke();
            ctx.setLineDash([]);
            ctx.globalAlpha = 1;

            const endpointOpacity = active ? 0.8 : 0.3;
            ctx.fillStyle = color;
            ctx.globalAlpha = endpointOpacity;
            ctx.beginPath();
            ctx.arc(localStart.x, localStart.y, 3, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(localEnd.x, localEnd.y, 3, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1;

            if (active) {
                const p = pointOnCurve(progress);
                ctx.shadowColor = color;
                ctx.shadowBlur = 8;
                ctx.fillStyle = color;
                ctx.beginPath();
                ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
                ctx.fill();
                ctx.shadowBlur = 0;
            }
        };

        if (!active || prefersReducedMotion) {
            draw(0);
            return;
        }

        let frame = 0;
        const startTs = performance.now();
        const durationMs = safeSignalSpeed * 1000;
        const loop = (ts: number) => {
            const elapsed = ts - startTs;
            const progress = (elapsed % durationMs) / durationMs;
            draw(progress);
            frame = requestAnimationFrame(loop);
        };
        frame = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(frame);
    }, [
        width,
        height,
        lineStyle,
        color,
        active,
        localStart.x,
        localStart.y,
        localEnd.x,
        localEnd.y,
        localCp1.x,
        localCp1.y,
        localCp2.x,
        localCp2.y,
        safeSignalSpeed,
        prefersReducedMotion,
    ]);

    return (
        <canvas
            ref={canvasRef}
            className={\`absolute pointer-events-none \${className}\`}
            style={{ left: minX, top: minY, width, height, overflow: "visible" }}
            role="presentation"
            aria-hidden="true"
        />
    );
};

export default ThreadConnector;
`
  },
  "loaders/blueprint-loader": {
    component: dynamic(() => import("@/components/ui/loaders/blueprint-loader").then(mod => mod.BlueprintLoader || mod.default)),
    name: "Blueprint Loader",
    category: "loaders",
    slug: "blueprint-loader",
    code: `"use client";

/**
 * @component BlueprintLoader
 * @description Before content loads, an engineering wireframe sketch is drawn.
 * When data arrives, real UI settles on top.
 * Based on sequential line draw animation.
 *
 * @example
 * \`\`\`tsx
 * import { BlueprintLoader } from '@/components/loaders/blueprint-loader';
 *
 * <BlueprintLoader
 *   isLoading={true}
 *   lineColor="#3b82f6"
 *   width={300}
 *   height={200}
 * />
 * \`\`\`
 */

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { toPositiveNumber } from "../../lib/utils";

export interface BlueprintLoaderProps {
    /** Whether the loader is active. Default: true */
    isLoading?: boolean;
    /** Line color. Default: "#3b82f6" */
    lineColor?: string;
    /** Width in pixels. Default: 300 */
    width?: number;
    /** Height in pixels. Default: 200 */
    height?: number;
    /** Animation speed multiplier. Default: 1 */
    speed?: number;
    /** Additional class names */
    className?: string;
}

export const BlueprintLoader: React.FC<BlueprintLoaderProps> = ({
    isLoading = true,
    lineColor = "#3b82f6",
    width = 300,
    height = 200,
    speed = 1,
    className = "",
}) => {
    const prefersReducedMotion = useReducedMotion();
    if (!isLoading) return null;

    const safeWidth = toPositiveNumber(width, 300, 1);
    const safeHeight = toPositiveNumber(height, 200, 1);
    const safeSpeed = toPositiveNumber(speed, 1, 0.01);
    const dur = 1.5 / safeSpeed;
    const stroke = 1.5;

    const lines = [
        { x: 20, y: 20, w: safeWidth - 40, h: stroke },
        { x: 20, y: 50, w: safeWidth - 40, h: stroke },
        { x: 20, y: 20, w: stroke, h: 30 },
        { x: safeWidth - 20, y: 20, w: stroke, h: 30 },
        { x: 20, y: 65, w: safeWidth * 0.6 - 20, h: stroke },
        { x: 20, y: 90, w: safeWidth * 0.6 - 20, h: stroke },
        { x: 20, y: 65, w: stroke, h: 25 },
        { x: safeWidth * 0.6, y: 65, w: stroke, h: 25 },
        { x: safeWidth * 0.65, y: 65, w: safeWidth - 20 - safeWidth * 0.65, h: stroke },
        { x: safeWidth * 0.65, y: 90, w: safeWidth - 20 - safeWidth * 0.65, h: stroke },
        { x: safeWidth * 0.65, y: 65, w: stroke, h: 25 },
        { x: safeWidth - 20, y: 65, w: stroke, h: 25 },
        { x: 20, y: 105, w: safeWidth * 0.7 - 20, h: stroke },
        { x: 20, y: 120, w: safeWidth * 0.5 - 20, h: stroke },
        { x: 20, y: 135, w: safeWidth * 0.8 - 20, h: stroke },
        { x: 20, y: safeHeight - 40, w: safeWidth - 40, h: stroke },
        { x: 20, y: safeHeight - 20, w: safeWidth - 40, h: stroke },
        { x: 20, y: safeHeight - 40, w: stroke, h: 20 },
        { x: safeWidth - 20, y: safeHeight - 40, w: stroke, h: 20 },
        { x: 10, y: 10, w: stroke, h: 5 },
        { x: 10, y: 10, w: 5, h: stroke },
        { x: safeWidth - 10, y: 10, w: stroke, h: 5 },
        { x: safeWidth - 15, y: 10, w: 5, h: stroke },
    ];

    return (
        <div
            className={\`relative \${className}\`}
            style={{ width: safeWidth, height: safeHeight }}
            role="progressbar"
            aria-label="Loading content"
        >
            {/* Grid background */}
            <div
                className="absolute inset-0 opacity-10"
                style={{
                    backgroundImage: \`
            linear-gradient(\${lineColor}30 1px, transparent 1px),
            linear-gradient(90deg, \${lineColor}30 1px, transparent 1px)
          \`,
                    backgroundSize: "20px 20px",
                }}
                aria-hidden="true"
            />

            <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
                {lines.map((line, i) => {
                    const isHorizontal = line.w >= line.h;
                    return (
                        <motion.div
                            key={i}
                            className="absolute rounded-full"
                            style={{
                                left: line.x,
                                top: line.y,
                                width: Math.max(stroke, line.w),
                                height: Math.max(stroke, line.h),
                                background: lineColor,
                                transformOrigin: isHorizontal ? "left center" : "center top",
                            }}
                            initial={isHorizontal ? { scaleX: 0, opacity: 0 } : { scaleY: 0, opacity: 0 }}
                            animate={isHorizontal ? { scaleX: 1, opacity: 0.6 } : { scaleY: 1, opacity: 0.6 }}
                            transition={{
                                duration: dur,
                                delay: i * 0.08 / safeSpeed,
                                ease: "easeInOut",
                            }}
                        />
                    );
                })}

                <motion.div
                    className="absolute left-0 right-0 h-0.5"
                    style={{
                        background: \`linear-gradient(90deg, transparent, \${lineColor}, transparent)\`,
                        boxShadow: \`0 0 4px \${lineColor}\`,
                    }}
                    animate={prefersReducedMotion ? undefined : { top: [0, safeHeight, 0] }}
                    transition={
                        prefersReducedMotion
                            ? undefined
                            : {
                                duration: 3 / safeSpeed,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }
                    }
                />
            </div>
        </div>
    );
};

export default BlueprintLoader;
`
  },
  "loaders/clay-morph-skeleton": {
    component: dynamic(() => import("@/components/ui/loaders/clay-morph-skeleton").then(mod => mod.ClayMorphSkeleton || mod.default)),
    name: "Clay Morph Skeleton",
    category: "loaders",
    slug: "clay-morph-skeleton",
    code: `﻿"use client";

/**
 * @component ClayMorphSkeleton
 * @description Skeleton with soft clay-like forms that gently morph,
 * transforming into sharp components when content loads.
 * Based on border-radius morph + subtle scale variation.
 *
 * @example
 * \`\`\`tsx
 * import { ClayMorphSkeleton } from '@/components/loaders/clay-morph-skeleton';
 *
 * <ClayMorphSkeleton
 *   layout="card"
 *   isLoading={true}
 *   className="w-80"
 * />
 * \`\`\`
 */

import React from "react";
import { motion } from "framer-motion";
import { toPositiveNumber } from "../../lib/utils";

export interface ClayMorphSkeletonProps {
    /** Preset layout: card, text, avatar, list. Default: "card" */
    layout?: "card" | "text" | "avatar" | "list";
    /** Whether loading. Default: true */
    isLoading?: boolean;
    /** Base color. Default: "rgba(255,255,255,0.06)" */
    baseColor?: string;
    /** Highlight color. Default: "rgba(255,255,255,0.1)" */
    highlightColor?: string;
    /** Animation speed. Default: 1 */
    speed?: number;
    /** Additional class names */
    className?: string;
}

interface ClayBlock {
    width: string;
    height: string;
    borderRadius: string[];
    marginBottom?: number;
}

const LAYOUTS: Record<string, ClayBlock[]> = {
    card: [
        { width: "100%", height: "120px", borderRadius: ["24px 32px 20px 28px", "28px 24px 32px 20px", "20px 28px 24px 32px"] },
        { width: "70%", height: "18px", borderRadius: ["12px 16px 10px 14px", "14px 12px 16px 10px"], marginBottom: 8 },
        { width: "100%", height: "14px", borderRadius: ["10px 14px 8px 12px", "12px 10px 14px 8px"], marginBottom: 6 },
        { width: "85%", height: "14px", borderRadius: ["10px 14px 8px 12px", "12px 10px 14px 8px"] },
    ],
    text: [
        { width: "90%", height: "16px", borderRadius: ["10px 14px 8px 12px", "12px 10px 14px 8px"], marginBottom: 8 },
        { width: "100%", height: "16px", borderRadius: ["12px 10px 14px 8px", "8px 12px 10px 14px"], marginBottom: 8 },
        { width: "65%", height: "16px", borderRadius: ["10px 14px 8px 12px", "14px 8px 12px 10px"] },
    ],
    avatar: [
        { width: "56px", height: "56px", borderRadius: ["50% 48% 52% 50%", "48% 52% 50% 48%", "52% 50% 48% 52%"] },
    ],
    list: [
        { width: "100%", height: "40px", borderRadius: ["16px 20px 14px 18px", "18px 16px 20px 14px"], marginBottom: 8 },
        { width: "100%", height: "40px", borderRadius: ["14px 18px 16px 20px", "20px 14px 18px 16px"], marginBottom: 8 },
        { width: "100%", height: "40px", borderRadius: ["18px 14px 20px 16px", "16px 20px 14px 18px"] },
    ],
};

export const ClayMorphSkeleton: React.FC<ClayMorphSkeletonProps> = ({
    layout = "card",
    isLoading = true,
    baseColor = "rgba(255,255,255,0.06)",
    highlightColor = "rgba(255,255,255,0.1)",
    speed = 1,
    className = "",
}) => {
    if (!isLoading) return null;

    const blocks = LAYOUTS[layout] || LAYOUTS.card;
    const safeSpeed = toPositiveNumber(speed, 1, 0.01);
    const dur = 3 / safeSpeed;

    return (
        <div className={\`space-y-0 \${className}\`} role="progressbar" aria-label="Loading content">
            {blocks.map((block, i) => (
                <motion.div
                    key={i}
                    style={{
                        width: block.width,
                        height: block.height,
                        background: \`linear-gradient(110deg, \${baseColor} 30%, \${highlightColor} 50%, \${baseColor} 70%)\`,
                        backgroundSize: "200% 100%",
                        marginBottom: block.marginBottom || 0,
                    }}
                    animate={{
                        borderRadius: block.borderRadius,
                        backgroundPosition: ["200% 0%", "-200% 0%"],
                        scale: [1, 1.005, 0.998, 1],
                    }}
                    transition={{
                        borderRadius: { duration: dur, repeat: Infinity, ease: "easeInOut" },
                        backgroundPosition: { duration: dur * 0.8, repeat: Infinity, ease: "linear" },
                        scale: { duration: dur * 1.2, repeat: Infinity, ease: "easeInOut" },
                        delay: i * 0.15,
                    }}
                    aria-hidden="true"
                />
            ))}
        </div>
    );
};

export default ClayMorphSkeleton;

`
  },
  "loaders/dna-loader": {
    component: dynamic(() => import("@/components/ui/loaders/dna-loader").then(mod => mod.DnaLoader || mod.default)),
    name: "Dna Loader",
    category: "loaders",
    slug: "dna-loader",
    code: `"use client";

/**
 * @component DNALoader
 * @description Two helixes intertwine and rotate, color transitions express helix depth.
 * Based on sine wave + 3D perspective simulation.
 *
 * @example
 * \`\`\`tsx
 * import { DNALoader } from '@/components/loaders/dna-loader';
 *
 * <DNALoader
 *   size={60}
 *   colors={['#8b5cf6', '#06b6d4']}
 *   speed={1}
 * />
 * \`\`\`
 */

import React, { useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { toPositiveInt, toPositiveNumber } from "../../lib/utils";

export interface DNALoaderProps {
    /** Loader size (height). Default: 60 */
    size?: number;
    /** Helix colors [strand1, strand2]. Default: violet/cyan */
    colors?: [string, string];
    /** Animation speed multiplier. Default: 1 */
    speed?: number;
    /** Number of nodes per strand. Default: 10 */
    nodeCount?: number;
    /** Additional class names */
    className?: string;
}

export const DNALoader: React.FC<DNALoaderProps> = ({
    size = 60,
    colors = ["#8b5cf6", "#06b6d4"],
    speed = 1,
    nodeCount = 10,
    className = "",
}) => {
    const prefersReducedMotion = useReducedMotion();
    const safeSize = toPositiveNumber(size, 60, 1);
    const safeSpeed = toPositiveNumber(speed, 1, 0.01);
    const safeNodeCount = toPositiveInt(nodeCount, 10, 2);
    const strandColors = colors.length >= 2 ? colors : ["#8b5cf6", "#06b6d4"];
    const width = safeSize * 1.5;
    const height = safeSize;
    const dur = 2 / safeSpeed;
    const amplitude = height * 0.35;

    const nodes = useMemo(
        () =>
            Array.from({ length: safeNodeCount }, (_, i) => {
                const t = i / (safeNodeCount - 1);
                return { t, x: t * width };
            }),
        [safeNodeCount, width]
    );

    return (
        <div
            className={\`relative inline-flex items-center justify-center \${className}\`}
            style={{ width, height }}
            role="progressbar"
            aria-label="Loading"
        >
            <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
                {nodes.map((node, i) => {
                    const phaseOffset = (i / safeNodeCount) * Math.PI * 2;
                    const y1a = height / 2 + Math.sin(phaseOffset) * amplitude;
                    const y1b = height / 2 + Math.sin(phaseOffset + Math.PI) * amplitude;
                    const y1c = height / 2 + Math.sin(phaseOffset + Math.PI * 2) * amplitude;
                    const y2a = height / 2 + Math.sin(phaseOffset + Math.PI) * amplitude;
                    const y2b = height / 2 + Math.sin(phaseOffset + Math.PI * 2) * amplitude;
                    const y2c = height / 2 + Math.sin(phaseOffset + Math.PI * 3) * amplitude;
                    return (
                        <motion.div
                            key={\`rung-\${i}\`}
                            className="absolute"
                            style={{
                                left: node.x,
                                width: 1,
                                background: "rgba(255,255,255,0.12)",
                                transform: "translateX(-0.5px)",
                            }}
                            animate={prefersReducedMotion ? undefined : {
                                top: [Math.min(y1a, y2a), Math.min(y1b, y2b), Math.min(y1c, y2c)],
                                height: [Math.abs(y1a - y2a), Math.abs(y1b - y2b), Math.abs(y1c - y2c)],
                            }}
                            transition={prefersReducedMotion ? undefined : { duration: dur, repeat: Infinity, ease: "linear" }}
                        />
                    );
                })}

                {nodes.map((node, i) => {
                    const phaseOffset = (i / safeNodeCount) * Math.PI * 2;
                    const yA = Math.sin(phaseOffset) * amplitude;
                    const yB = Math.sin(phaseOffset + Math.PI) * amplitude;
                    return (
                        <motion.div
                            key={\`s1-\${i}\`}
                            className="absolute rounded-full"
                            style={{
                                left: node.x - 3,
                                top: height / 2 - 3,
                                width: 6,
                                height: 6,
                                background: strandColors[0],
                                boxShadow: \`0 0 3px \${strandColors[0]}\`,
                            }}
                            animate={prefersReducedMotion ? { y: yA, opacity: 0.7 } : {
                                y: [yA, yB, yA],
                                opacity: [Math.sin(phaseOffset) > 0 ? 1 : 0.4, Math.sin(phaseOffset + Math.PI) > 0 ? 1 : 0.4, Math.sin(phaseOffset) > 0 ? 1 : 0.4],
                                scale: [Math.sin(phaseOffset) > 0 ? 1.2 : 0.8, Math.sin(phaseOffset + Math.PI) > 0 ? 1.2 : 0.8, Math.sin(phaseOffset) > 0 ? 1.2 : 0.8],
                            }}
                            transition={prefersReducedMotion ? undefined : { duration: dur, repeat: Infinity, ease: "linear" }}
                        />
                    );
                })}

                {nodes.map((node, i) => {
                    const phaseOffset = (i / safeNodeCount) * Math.PI * 2 + Math.PI;
                    const yA = Math.sin(phaseOffset) * amplitude;
                    const yB = Math.sin(phaseOffset + Math.PI) * amplitude;
                    return (
                        <motion.div
                            key={\`s2-\${i}\`}
                            className="absolute rounded-full"
                            style={{
                                left: node.x - 3,
                                top: height / 2 - 3,
                                width: 6,
                                height: 6,
                                background: strandColors[1],
                                boxShadow: \`0 0 3px \${strandColors[1]}\`,
                            }}
                            animate={prefersReducedMotion ? { y: yA, opacity: 0.7 } : {
                                y: [yA, yB, yA],
                                opacity: [Math.sin(phaseOffset) > 0 ? 1 : 0.4, Math.sin(phaseOffset + Math.PI) > 0 ? 1 : 0.4, Math.sin(phaseOffset) > 0 ? 1 : 0.4],
                                scale: [Math.sin(phaseOffset) > 0 ? 1.2 : 0.8, Math.sin(phaseOffset + Math.PI) > 0 ? 1.2 : 0.8, Math.sin(phaseOffset) > 0 ? 1.2 : 0.8],
                            }}
                            transition={prefersReducedMotion ? undefined : { duration: dur, repeat: Infinity, ease: "linear" }}
                        />
                    );
                })}
            </div>
        </div>
    );
};

export default DNALoader;
`
  },
  "loaders/fluid-fill-loader": {
    component: dynamic(() => import("@/components/ui/loaders/fluid-fill-loader").then(mod => mod.FluidFillLoader || mod.default)),
    name: "Fluid Fill Loader",
    category: "loaders",
    slug: "fluid-fill-loader",
    code: `"use client";

/**
 * @component FluidFillLoader
 * @description An empty container gradually fills with liquid. The liquid surface
 * has wave-like ripples using gradient layers.
 * Principle: layered fill + animated radial wave pattern.
 *
 * @example
 * \`\`\`tsx
 * import { FluidFillLoader } from '@/components/loaders/fluid-fill-loader';
 *
 * <FluidFillLoader progress={0.65} color="#8b5cf6" className="w-20 h-20" />
 * \`\`\`
 */

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { toPositiveNumber } from "../../lib/utils";

export interface FluidFillLoaderProps {
    /** Fill progress (0-1). Default: auto-animating */
    progress?: number;
    /** Fluid color. Default: "#8b5cf6" */
    color?: string;
    /** Wave amplitude. Default: 4 */
    waveAmplitude?: number;
    /** Wave speed in seconds. Default: 2 */
    waveSpeed?: number;
    /** Additional class names */
    className?: string;
}

export const FluidFillLoader: React.FC<FluidFillLoaderProps> = ({
    progress,
    color = "#8b5cf6",
    waveAmplitude = 4,
    waveSpeed = 2,
    className = "",
}) => {
    const prefersReducedMotion = useReducedMotion();
    const isAutoProgress = progress === undefined;
    const safeAmplitude = toPositiveNumber(waveAmplitude, 4, 0.1);
    const safeWaveSpeed = toPositiveNumber(waveSpeed, 2, 0.01);

    // Auto progress animates 0→100→0 loop
    const fillPercent = progress !== undefined ? Math.min(1, Math.max(0, progress)) * 100 : 50;

    return (
        <div
            className={\`relative inline-flex items-center justify-center overflow-hidden rounded-xl bg-gray-800/50 border border-gray-700/30 \${className}\`}
            role="status"
            aria-label={\`Loading \${Math.round(fillPercent)}%\`}
        >
            <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
                <motion.div
                    className="absolute inset-x-0 bottom-0"
                    style={{
                        background: \`linear-gradient(180deg, \${color}40 0%, \${color}80 100%)\`,
                    }}
                    animate={
                        isAutoProgress
                            ? { height: ["10%", "90%", "10%"] }
                            : { height: \`\${fillPercent}%\` }
                    }
                    transition={
                        isAutoProgress
                            ? { duration: 4, repeat: Infinity, ease: "easeInOut" }
                            : { duration: 0.5, ease: "easeOut" }
                    }
                />

                {!prefersReducedMotion && (
                    <motion.div
                        className="absolute inset-x-0 rounded-[999px]"
                        style={{
                            height: Math.max(10, safeAmplitude * 4),
                            top: \`calc(\${100 - fillPercent}% - \${safeAmplitude * 2}px)\`,
                            background: \`repeating-radial-gradient(circle at 0% 50%, \${color}80 0 6px, transparent 7px 14px)\`,
                            filter: \`blur(\${safeAmplitude * 0.15}px)\`,
                        }}
                        animate={isAutoProgress ? { top: ["80%", "20%", "80%"], backgroundPositionX: ["0px", "56px"] } : { y: [-safeAmplitude, safeAmplitude, -safeAmplitude], backgroundPositionX: ["0px", "56px"] }}
                        transition={{
                            duration: isAutoProgress ? 4 : safeWaveSpeed,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    />
                )}
            </div>

            {/* Percentage text */}
            <span
                className="relative z-10 text-xs font-mono font-bold"
                style={{ color }}
            >
                {Math.round(fillPercent)}%
            </span>
        </div>
    );
};

export default FluidFillLoader;
`
  },
  "loaders/ghost-layout-loader": {
    component: dynamic(() => import("@/components/ui/loaders/ghost-layout-loader").then(mod => mod.GhostLayoutLoader || mod.default)),
    name: "Ghost Layout Loader",
    category: "loaders",
    slug: "ghost-layout-loader",
    code: `﻿"use client";

/**
 * @component GhostLayoutLoader
 * @description A ghost of the real layout appears with microscopic subpixel drift.
 * When content arrives, it snaps into exact alignment.
 * Based on subpixel drift + snap animation.
 *
 * @example
 * \`\`\`tsx
 * import { GhostLayoutLoader } from '@/components/loaders/ghost-layout-loader';
 *
 * <GhostLayoutLoader isLoading={true} className="w-80 h-48" />
 * \`\`\`
 */

import React from "react";
import { motion } from "framer-motion";
import { toPositiveNumber } from "../../lib/utils";

export interface GhostLayoutLoaderProps {
    /** Active state. Default: true */
    isLoading?: boolean;
    /** Ghost color. Default: "rgba(255,255,255,0.04)" */
    ghostColor?: string;
    /** Drift amount in px. Default: 1.5 */
    driftAmount?: number;
    /** Speed multiplier. Default: 1 */
    speed?: number;
    /** Additional class names */
    className?: string;
}

export const GhostLayoutLoader: React.FC<GhostLayoutLoaderProps> = ({
    isLoading = true,
    ghostColor = "rgba(255,255,255,0.04)",
    driftAmount = 1.5,
    speed = 1,
    className = "",
}) => {
    if (!isLoading) return null;

    const safeSpeed = toPositiveNumber(speed, 1, 0.01);
    const dur = 4 / safeSpeed;

    const blocks = [
        { w: "100%", h: "36px", y: 0 },
        { w: "45%", h: "80px", y: 48 },
        { w: "50%", h: "80px", y: 48, x: "52%" },
        { w: "70%", h: "12px", y: 142 },
        { w: "100%", h: "12px", y: 162 },
        { w: "40%", h: "12px", y: 182 },
    ];

    return (
        <div className={\`relative \${className}\`} role="progressbar" aria-label="Loading layout">
            {blocks.map((block, i) => (
                <motion.div
                    key={i}
                    className="absolute rounded"
                    style={{
                        width: block.w,
                        height: block.h,
                        top: block.y,
                        left: block.x || 0,
                        background: ghostColor,
                        border: \`1px solid rgba(255,255,255,0.03)\`,
                    }}
                    animate={{
                        x: [0, driftAmount, -driftAmount * 0.7, driftAmount * 0.3, 0],
                        y: [0, -driftAmount * 0.5, driftAmount * 0.8, -driftAmount * 0.3, 0],
                        opacity: [0.5, 0.7, 0.4, 0.6, 0.5],
                    }}
                    transition={{
                        duration: dur,
                        delay: i * 0.2,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                    aria-hidden="true"
                />
            ))}

            {/* Shimmer sweep */}
            <motion.div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background: "linear-gradient(90deg, transparent 20%, rgba(255,255,255,0.02) 50%, transparent 80%)",
                    backgroundSize: "200% 100%",
                }}
                animate={{ backgroundPosition: ["200% 0%", "-200% 0%"] }}
                transition={{ duration: dur * 0.8, repeat: Infinity, ease: "linear" }}
                aria-hidden="true"
            />
        </div>
    );
};

export default GhostLayoutLoader;

`
  },
  "loaders/particle-coalesce-loader": {
    component: dynamic(() => import("@/components/ui/loaders/particle-coalesce-loader").then(mod => mod.ParticleCoalesceLoader || mod.default)),
    name: "Particle Coalesce Loader",
    category: "loaders",
    slug: "particle-coalesce-loader",
    code: `"use client";

/**
 * @component ParticleCoalesceLoader
 * @description Scattered particles slowly coalesce into a target shape,
 * then the content becomes clear. Uses particle target interpolation.
 * Principle: particle-to-target interpolation + gaussian blur to clear.
 *
 * @example
 * \`\`\`tsx
 * import { ParticleCoalesceLoader } from '@/components/loaders/particle-coalesce-loader';
 *
 * <ParticleCoalesceLoader
 *   particleCount={30}
 *   color="#8b5cf6"
 *   className="w-full h-32"
 * />
 * \`\`\`
 */

import React, { useRef, useEffect } from "react";
import { useReducedMotion } from "framer-motion";
import { hexToRgbString } from "../../lib/utils";

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
                ctx.fillStyle = \`rgba(\${rgb}, \${alpha})\`;
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
                            ctx.strokeStyle = \`rgba(\${rgb}, \${(1 - dist / 40) * 0.2})\`;
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
        <div className={\`relative \${className}\`} role="status" aria-label="Loading">
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
        </div>
    );
};

export default ParticleCoalesceLoader;
`
  },
  "loaders/pulse-relay-loader": {
    component: dynamic(() => import("@/components/ui/loaders/pulse-relay-loader").then(mod => mod.PulseRelayLoader || mod.default)),
    name: "Pulse Relay Loader",
    category: "loaders",
    slug: "pulse-relay-loader",
    code: `﻿"use client";

/**
 * @component PulseRelayLoader
 * @description Loading signal relays between component sections:
 * header → body → footer in sequence.
 * Based on sequential position-based light pulse.
 *
 * @example
 * \`\`\`tsx
 * import { PulseRelayLoader } from '@/components/loaders/pulse-relay-loader';
 *
 * <PulseRelayLoader
 *   sections={['header', 'body', 'footer']}
 *   color="#f43f5e"
 *   className="w-80"
 * />
 * \`\`\`
 */

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

export interface PulseRelayLoaderProps {
    /** Section names. Default: ['header', 'body', 'footer'] */
    sections?: string[];
    /** Pulse color. Default: "#f43f5e" */
    color?: string;
    /** Pulse interval in ms. Default: 800 */
    interval?: number;
    /** Additional class names */
    className?: string;
}

const SECTION_HEIGHTS: Record<string, string> = {
    header: "40px",
    body: "100px",
    footer: "36px",
    sidebar: "80px",
    nav: "32px",
};

export const PulseRelayLoader: React.FC<PulseRelayLoaderProps> = ({
    sections = ["header", "body", "footer"],
    color = "#f43f5e",
    interval = 800,
    className = "",
}) => {
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % sections.length);
        }, interval);
        return () => clearInterval(timer);
    }, [sections.length, interval]);

    return (
        <div className={\`flex flex-col gap-2 \${className}\`} role="progressbar" aria-label="Loading">
            {sections.map((section, i) => {
                const isActive = i === activeIndex;
                const height = SECTION_HEIGHTS[section] || "60px";

                return (
                    <motion.div
                        key={i}
                        className="relative rounded-lg overflow-hidden"
                        style={{
                            height,
                            background: "rgba(255,255,255,0.04)",
                            border: "1px solid rgba(255,255,255,0.06)",
                        }}
                        animate={{
                            borderColor: isActive ? \`\${color}40\` : "rgba(255,255,255,0.06)",
                        }}
                        transition={{ duration: 0.2 }}
                        aria-hidden="true"
                    >
                        {/* Section label */}
                        <span
                            className="absolute top-1 left-2 text-[10px] font-mono"
                            style={{ color: \`\${color}60\` }}
                        >
                            {section}
                        </span>

                        {/* Pulse sweep */}
                        <motion.div
                            className="absolute inset-0"
                            style={{
                                background: \`linear-gradient(90deg, transparent, \${color}15, transparent)\`,
                            }}
                            animate={{
                                x: isActive ? ["calc(-100%)", "calc(100%)"] : "calc(-100%)",
                                opacity: isActive ? 1 : 0,
                            }}
                            transition={{
                                x: { duration: 0.6, ease: "easeInOut" },
                                opacity: { duration: 0.15 },
                            }}
                        />

                        {/* Connection dot relay line */}
                        {i < sections.length - 1 && (
                            <motion.div
                                className="absolute -bottom-2 left-1/2 w-0.5 h-2"
                                style={{ background: isActive ? color : "rgba(255,255,255,0.1)" }}
                                animate={{ opacity: isActive ? [0, 1, 0] : 0.2 }}
                                transition={{ duration: 0.3 }}
                            />
                        )}
                    </motion.div>
                );
            })}
        </div>
    );
};

export default PulseRelayLoader;

`
  },
  "loaders/signal-acquisition-loader": {
    component: dynamic(() => import("@/components/ui/loaders/signal-acquisition-loader").then(mod => mod.SignalAcquisitionLoader || mod.default)),
    name: "Signal Acquisition Loader",
    category: "loaders",
    slug: "signal-acquisition-loader",
    code: `﻿"use client";

/**
 * @component SignalAcquisitionLoader
 * @description Scanner lines roam over target areas, segments stabilize when "lock" is found.
 * Based on sweep animation + segment stabilization.
 *
 * @example
 * \`\`\`tsx
 * import { SignalAcquisitionLoader } from '@/components/loaders/signal-acquisition-loader';
 *
 * <SignalAcquisitionLoader size={80} color="#22d3ee" />
 * \`\`\`
 */

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { toPositiveInt, toPositiveNumber } from "../../lib/utils";

export interface SignalAcquisitionLoaderProps {
    /** Loader size. Default: 80 */
    size?: number;
    /** Signal color. Default: "#22d3ee" */
    color?: string;
    /** Speed multiplier. Default: 1 */
    speed?: number;
    /** Number of segments. Default: 4 */
    segments?: number;
    /** Additional class names */
    className?: string;
}

export const SignalAcquisitionLoader: React.FC<SignalAcquisitionLoaderProps> = ({
    size = 80,
    color = "#22d3ee",
    speed = 1,
    segments = 4,
    className = "",
}) => {
    const [lockedSegments, setLockedSegments] = useState<number[]>([]);
    const timerRefs = useRef<ReturnType<typeof setTimeout>[]>([]);
    const safeSize = toPositiveNumber(size, 80, 1);
    const safeSpeed = toPositiveNumber(speed, 1, 0.01);
    const safeSegments = toPositiveInt(segments, 4, 1);
    const dur = 3 / safeSpeed;

    useEffect(() => {
        // Clear any previous timers
        timerRefs.current.forEach(clearTimeout);
        timerRefs.current = [];

        const addTimer = (cb: () => void, delay: number) => {
            const id = setTimeout(cb, delay);
            timerRefs.current.push(id);
        };

        // Initial lock sequence
        for (let i = 0; i < safeSegments; i++) {
            addTimer(() => {
                setLockedSegments((prev) => [...prev, i]);
            }, dur * 250 * (i + 1));
        }

        // Reset after all segments lock
        addTimer(() => {
            setLockedSegments([]);
        }, dur * 250 * (safeSegments + 1));

        // Repeating cycle
        const interval = setInterval(() => {
            setLockedSegments([]);
            for (let i = 0; i < safeSegments; i++) {
                addTimer(() => {
                    setLockedSegments((prev) => [...prev, i]);
                }, dur * 250 * (i + 1));
            }
        }, dur * 250 * (safeSegments + 2));

        return () => {
            timerRefs.current.forEach(clearTimeout);
            timerRefs.current = [];
            clearInterval(interval);
        };
    }, [dur, safeSegments]);

    const segmentSize = safeSize / safeSegments;

    return (
        <div
            className={\`relative \${className}\`}
            style={{ width: safeSize, height: safeSize }}
            role="progressbar"
            aria-label="Acquiring signal"
        >
            {/* Target segments */}
            {Array.from({ length: safeSegments }, (_, i) => {
                const isLocked = lockedSegments.includes(i);
                const row = Math.floor(i / 2);
                const col = i % 2;

                return (
                    <motion.div
                        key={i}
                        className="absolute border"
                        style={{
                            width: segmentSize - 4,
                            height: segmentSize - 4,
                            left: col * segmentSize + 2,
                            top: row * segmentSize + 2,
                            borderColor: isLocked ? color : \`\${color}30\`,
                            borderWidth: isLocked ? 2 : 1,
                        }}
                        animate={{
                            opacity: isLocked ? 1 : [0.3, 0.6, 0.3],
                            boxShadow: isLocked ? \`0 0 8px \${color}60\` : "none",
                        }}
                        transition={{ duration: isLocked ? 0.2 : 1.5, repeat: isLocked ? 0 : Infinity }}
                        aria-hidden="true"
                    >
                        {/* Lock indicator */}
                        {isLocked && (
                            <motion.div
                                className="absolute inset-1 flex items-center justify-center"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                <div
                                    className="w-1.5 h-1.5 rounded-full"
                                    style={{ background: color, boxShadow: \`0 0 6px \${color}\` }}
                                />
                            </motion.div>
                        )}
                    </motion.div>
                );
            })}

            {/* Sweep scanner line */}
            <motion.div
                className="absolute left-0 right-0 h-0.5"
                style={{ background: \`linear-gradient(90deg, transparent, \${color}, transparent)\` }}
                animate={{ top: [0, safeSize, 0] }}
                transition={{ duration: dur * 0.5, repeat: Infinity, ease: "linear" }}
                aria-hidden="true"
            />

            {/* Crosshair */}
            <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
                <div
                    className="absolute left-1/2 top-0 bottom-0 w-px"
                    style={{ background: \`\${color}15\` }}
                />
                <div
                    className="absolute top-1/2 left-0 right-0 h-px"
                    style={{ background: \`\${color}15\` }}
                />
            </div>
        </div>
    );
};

export default SignalAcquisitionLoader;

`
  },
  "loaders/sonar-skeleton": {
    component: dynamic(() => import("@/components/ui/loaders/sonar-skeleton").then(mod => mod.SonarSkeleton || mod.default)),
    name: "Sonar Skeleton",
    category: "loaders",
    slug: "sonar-skeleton",
    code: `"use client";

/**
 * @component SonarSkeleton
 * @description Ping waves radiate outward, illuminating skeleton placeholder areas
 * in sequence. Content fades in when loaded.
 * Principle: radial wave propagation + position-based trigger timing.
 *
 * @example
 * \`\`\`tsx
 * import { SonarSkeleton } from '@/components/loaders/sonar-skeleton';
 *
 * <SonarSkeleton
 *   rows={3}
 *   pingColor="#22d3ee"
 *   className="w-80"
 * />
 * \`\`\`
 */

import React from "react";
import { motion, useReducedMotion } from "framer-motion";

export interface SonarSkeletonProps {
    /** Number of skeleton rows. Default: 3 */
    rows?: number;
    /** Ping wave color. Default: "#22d3ee" */
    pingColor?: string;
    /** Ping interval in seconds. Default: 2 */
    pingInterval?: number;
    /** Additional class names */
    className?: string;
}

export const SonarSkeleton: React.FC<SonarSkeletonProps> = ({
    rows = 3,
    pingColor = "#22d3ee",
    pingInterval = 2,
    className = "",
}) => {
    const prefersReducedMotion = useReducedMotion();

    const rowConfigs = Array.from({ length: rows }, (_, i) => ({
        widthPercent: i === 0 ? 60 : i === rows - 1 ? 40 : 80 + Math.floor(Math.sin(i) * 15),
        height: i === 0 ? 20 : 14,
    }));

    return (
        <div className={\`relative space-y-3 \${className}\`} role="status" aria-label="Loading content">
            {/* Sonar ping origin */}
            {!prefersReducedMotion && (
                <motion.div
                    className="absolute -top-2 -left-2 w-4 h-4 rounded-full pointer-events-none z-10"
                    style={{ backgroundColor: pingColor }}
                    animate={{
                        boxShadow: [
                            \`0 0 0 0px \${pingColor}40\`,
                            \`0 0 0 80px \${pingColor}00\`,
                        ],
                        opacity: [1, 0],
                    }}
                    transition={{
                        duration: pingInterval,
                        repeat: Infinity,
                        ease: "easeOut",
                    }}
                    aria-hidden="true"
                />
            )}

            {/* Skeleton rows */}
            {rowConfigs.map((config, i) => (
                <motion.div
                    key={i}
                    className="rounded-md"
                    style={{
                        width: \`\${config.widthPercent}%\`,
                        height: config.height,
                        background: \`linear-gradient(90deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.06) 50%, rgba(255,255,255,0.03) 100%)\`,
                    }}
                    animate={
                        prefersReducedMotion
                            ? { opacity: 0.5 }
                            : {
                                opacity: [0.3, 0.6, 0.3],
                                boxShadow: [
                                    \`0 0 0 rgba(\${pingColor}, 0)\`,
                                    \`0 0 8px \${pingColor}30\`,
                                    \`0 0 0 rgba(\${pingColor}, 0)\`,
                                ],
                            }
                    }
                    transition={{
                        duration: pingInterval,
                        delay: i * 0.15,
                        repeat: Infinity,
                    }}
                />
            ))}
        </div>
    );
};

export default SonarSkeleton;
`
  },
  "loaders/thread-weave-loader": {
    component: dynamic(() => import("@/components/ui/loaders/thread-weave-loader").then(mod => mod.ThreadWeaveLoader || mod.default)),
    name: "Thread Weave Loader",
    category: "loaders",
    slug: "thread-weave-loader",
    code: `"use client";

/**
 * @component ThreadWeaveLoader
 * @description Thin lines from diagonal directions weave each other, filling the loading area.
 * Based on diagonal line layers + opacity accumulation.
 *
 * @example
 * \`\`\`tsx
 * import { ThreadWeaveLoader } from '@/components/loaders/thread-weave-loader';
 *
 * <ThreadWeaveLoader width={200} height={150} threadColor="#f59e0b" />
 * \`\`\`
 */

import React from "react";
import { motion } from "framer-motion";
import { toPositiveInt, toPositiveNumber } from "../../lib/utils";

export interface ThreadWeaveLoaderProps {
    /** Width. Default: 200 */
    width?: number;
    /** Height. Default: 150 */
    height?: number;
    /** Thread color. Default: "#f59e0b" */
    threadColor?: string;
    /** Thread count per direction. Default: 8 */
    threadCount?: number;
    /** Speed multiplier. Default: 1 */
    speed?: number;
    /** Additional class names */
    className?: string;
}

export const ThreadWeaveLoader: React.FC<ThreadWeaveLoaderProps> = ({
    width = 200,
    height = 150,
    threadColor = "#f59e0b",
    threadCount = 8,
    speed = 1,
    className = "",
}) => {
    const safeWidth = toPositiveNumber(width, 200, 1);
    const safeHeight = toPositiveNumber(height, 150, 1);
    const safeSpeed = toPositiveNumber(speed, 1, 0.01);
    const safeThreadCount = toPositiveInt(threadCount, 8, 1);
    const dur = 2 / safeSpeed;

    const toLineStyle = (x1: number, y1: number, x2: number, y2: number) => {
        const dx = x2 - x1;
        const dy = y2 - y1;
        const length = Math.sqrt(dx * dx + dy * dy);
        const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
        return {
            left: x1,
            top: y1,
            width: length,
            transform: \`translateY(-0.5px) rotate(\${angle}deg)\`,
        };
    };

    return (
        <div
            className={\`relative overflow-hidden \${className}\`}
            style={{ width: safeWidth, height: safeHeight }}
            role="progressbar"
            aria-label="Loading"
        >
            <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
                {Array.from({ length: safeThreadCount }, (_, i) => {
                    const offset = ((i + 1) / (safeThreadCount + 1)) * (safeWidth + safeHeight);
                    const x1 = Math.max(0, offset - safeHeight);
                    const y1 = Math.max(0, safeHeight - offset);
                    const x2 = Math.min(safeWidth, offset);
                    const y2 = Math.min(safeHeight, offset);
                    const lineStyle = toLineStyle(x1, y1, x2, y2);
                    return (
                        <motion.div
                            key={\`fwd-\${i}\`}
                            className="absolute h-px origin-left"
                            style={{
                                ...lineStyle,
                                background: threadColor,
                            }}
                            initial={{ scaleX: 0, opacity: 0 }}
                            animate={{
                                scaleX: [0, 1],
                                opacity: [0, 0.5, 0.3],
                            }}
                            transition={{
                                duration: dur,
                                delay: i * 0.12 / safeSpeed,
                                repeat: Infinity,
                                repeatDelay: 0.5,
                            }}
                        />
                    );
                })}

                {Array.from({ length: safeThreadCount }, (_, i) => {
                    const offset = ((i + 1) / (safeThreadCount + 1)) * (safeWidth + safeHeight);
                    const x1 = safeWidth - Math.max(0, offset - safeHeight);
                    const y1 = Math.max(0, safeHeight - offset);
                    const x2 = safeWidth - Math.min(safeWidth, offset);
                    const y2 = Math.min(safeHeight, offset);
                    const lineStyle = toLineStyle(x1, y1, x2, y2);
                    return (
                        <motion.div
                            key={\`bwd-\${i}\`}
                            className="absolute h-px origin-left"
                            style={{
                                ...lineStyle,
                                background: threadColor,
                            }}
                            initial={{ scaleX: 0, opacity: 0 }}
                            animate={{
                                scaleX: [0, 1],
                                opacity: [0, 0.4, 0.25],
                            }}
                            transition={{
                                duration: dur,
                                delay: (safeThreadCount + i) * 0.1 / safeSpeed,
                                repeat: Infinity,
                                repeatDelay: 0.5,
                            }}
                        />
                    );
                })}

                {Array.from({ length: 4 }, (_, i) => (
                    <motion.div
                        key={\`glow-\${i}\`}
                        className="absolute rounded-full"
                        style={{
                            left: safeWidth * (0.25 + (i % 2) * 0.5) - 2,
                            top: safeHeight * (0.25 + Math.floor(i / 2) * 0.5) - 2,
                            width: 4,
                            height: 4,
                            background: threadColor,
                            boxShadow: \`0 0 4px \${threadColor}\`,
                        }}
                        animate={{
                            opacity: [0, 0.8, 0],
                            scale: [0.5, 1.5, 0.5],
                        }}
                        transition={{
                            duration: 1.5 / safeSpeed,
                            delay: i * 0.3,
                            repeat: Infinity,
                        }}
                    />
                ))}
            </div>
        </div>
    );
};

export default ThreadWeaveLoader;
`
  },
  "loaders/typewriter-blueprint-loader": {
    component: dynamic(() => import("@/components/ui/loaders/typewriter-blueprint-loader").then(mod => mod.TypewriterBlueprintLoader || mod.default)),
    name: "Typewriter Blueprint Loader",
    category: "loaders",
    slug: "typewriter-blueprint-loader",
    code: `"use client";

/**
 * @component TypewriterBlueprintLoader
 * @description Terminal-style commands type out with a progress indicator,
 * simulating a build/fetch process.
 * Principle: character-based typing animation + progress bar fill.
 *
 * @example
 * \`\`\`tsx
 * import { TypewriterBlueprintLoader } from '@/components/loaders/typewriter-blueprint-loader';
 *
 * <TypewriterBlueprintLoader
 *   commands={["> fetching data...", "> compiling assets...", "> optimizing..."]}
 *   className="w-96"
 * />
 * \`\`\`
 */

import React, { useState, useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";

export interface TypewriterBlueprintLoaderProps {
    /** Terminal commands to display. Default: ["> loading modules...", "> compiling..."] */
    commands?: string[];
    /** Typing speed in ms per character. Default: 40 */
    typeSpeed?: number;
    /** Pause between commands in ms. Default: 600 */
    pauseBetween?: number;
    /** Text color. Default: "#22d3ee" */
    color?: string;
    /** Additional class names */
    className?: string;
}

export const TypewriterBlueprintLoader: React.FC<TypewriterBlueprintLoaderProps> = ({
    commands = ["> loading modules...", "> compiling assets...", "> optimizing bundle..."],
    typeSpeed = 40,
    pauseBetween = 600,
    color = "#22d3ee",
    className = "",
}) => {
    const prefersReducedMotion = useReducedMotion();
    const [lines, setLines] = useState<string[]>([]);
    const [currentLine, setCurrentLine] = useState("");
    const [cmdIdx, setCmdIdx] = useState(0);
    const [charIdx, setCharIdx] = useState(0);
    const timerRef = useRef<ReturnType<typeof setTimeout>>();

    const progress = commands.length > 0 ? ((cmdIdx + charIdx / (commands[cmdIdx]?.length || 1)) / commands.length) * 100 : 0;

    useEffect(() => {
        if (prefersReducedMotion) {
            setLines(commands);
            setCurrentLine("");
            setCmdIdx(commands.length);
            return;
        }

        if (cmdIdx >= commands.length) return;

        const cmd = commands[cmdIdx];

        if (charIdx < cmd.length) {
            timerRef.current = setTimeout(() => {
                setCurrentLine(cmd.slice(0, charIdx + 1));
                setCharIdx(charIdx + 1);
            }, typeSpeed);
        } else {
            timerRef.current = setTimeout(() => {
                setLines((prev) => [...prev, cmd]);
                setCurrentLine("");
                setCharIdx(0);
                setCmdIdx(cmdIdx + 1);
            }, pauseBetween);
        }

        return () => clearTimeout(timerRef.current);
    }, [cmdIdx, charIdx, commands, typeSpeed, pauseBetween, prefersReducedMotion]);

    return (
        <div
            className={\`font-mono text-sm p-4 bg-gray-900/80 rounded-lg border border-gray-700/50 \${className}\`}
            role="status"
            aria-label="Loading"
        >
            {/* Terminal output */}
            <div className="space-y-1 mb-3 min-h-[60px]" style={{ color }}>
                {lines.map((line, i) => (
                    <div key={i} className="opacity-50">{line}</div>
                ))}
                {currentLine && (
                    <div>
                        {currentLine}
                        <motion.span
                            animate={{ opacity: [1, 0] }}
                            transition={{ duration: 0.5, repeat: Infinity }}
                        >
                            █
                        </motion.span>
                    </div>
                )}
            </div>

            {/* Progress bar */}
            <div className="h-1.5 bg-gray-700/50 rounded-full overflow-hidden">
                <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: color }}
                    animate={{ width: \`\${Math.min(100, progress)}%\` }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                />
            </div>

            <div className="text-[10px] mt-1 text-gray-500">
                {Math.floor(progress)}%
            </div>
        </div>
    );
};

export default TypewriterBlueprintLoader;
`
  },
  "navigation/breadcrumb-morph": {
    component: dynamic(() => import("@/components/ui/navigation/breadcrumb-morph").then(mod => mod.BreadcrumbMorph || mod.default)),
    name: "Breadcrumb Morph",
    category: "navigation",
    slug: "breadcrumb-morph",
    code: `"use client";

/**
 * @component BreadcrumbMorph
 * @description Breadcrumb items morph between states with layout animation.
 * New segments slide in, removed segments collapse out.
 * Principle: Framer Motion layout animation + AnimatePresence.
 *
 * @example
 * \`\`\`tsx
 * import { BreadcrumbMorph } from '@/components/navigation/breadcrumb-morph';
 *
 * <BreadcrumbMorph
 *   items={[
 *     { label: "Home", href: "/" },
 *     { label: "Components", href: "/components" },
 *     { label: "Cards", href: "/components/cards" },
 *   ]}
 * />
 * \`\`\`
 */

import React from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

interface BreadcrumbItem {
    label: string;
    href?: string;
}

export interface BreadcrumbMorphProps {
    /** Breadcrumb items (ordered) */
    items: BreadcrumbItem[];
    /** Separator character. Default: "/" */
    separator?: string;
    /** Additional class names */
    className?: string;
}

export const BreadcrumbMorph: React.FC<BreadcrumbMorphProps> = ({
    items,
    separator = "/",
    className = "",
}) => {
    const prefersReducedMotion = useReducedMotion();

    return (
        <nav className={\`flex items-center gap-1 text-sm \${className}\`} aria-label="Breadcrumb">
            <AnimatePresence mode="popLayout">
                {items.map((item, i) => (
                    <React.Fragment key={item.label}>
                        {i > 0 && (
                            <motion.span
                                className="text-gray-600 mx-1"
                                layout
                                aria-hidden="true"
                            >
                                {separator}
                            </motion.span>
                        )}
                        <motion.a
                            href={item.href || "#"}
                            className={\`font-medium transition-colors \${i === items.length - 1
                                    ? "text-white cursor-default"
                                    : "text-gray-400 hover:text-gray-200"
                                }\`}
                            layout
                            initial={prefersReducedMotion ? {} : { opacity: 0, x: -10, scale: 0.9 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={prefersReducedMotion ? {} : { opacity: 0, x: 10, scale: 0.9 }}
                            transition={{
                                type: "spring",
                                stiffness: 400,
                                damping: 25,
                            }}
                            aria-current={i === items.length - 1 ? "page" : undefined}
                        >
                            {item.label}
                        </motion.a>
                    </React.Fragment>
                ))}
            </AnimatePresence>
        </nav>
    );
};

export default BreadcrumbMorph;
`
  },
  "navigation/command-palette": {
    component: dynamic(() => import("@/components/ui/navigation/command-palette").then(mod => mod.CommandPalette || mod.default)),
    name: "Command Palette",
    category: "navigation",
    slug: "command-palette",
    code: `"use client";

/**
 * @component CommandPalette
 * @description ⌘K command palette with fuzzy-matching search, spring confirm animation,
 * and keyboard navigation.
 * Principle: fuzzy string scoring + AnimatePresence + keyboard nav.
 *
 * @example
 * \`\`\`tsx
 * import { CommandPalette } from '@/components/navigation/command-palette';
 *
 * <CommandPalette
 *   commands={[
 *     { id: "home", label: "Go to Home", icon: "🏠", action: () => {} },
 *     { id: "settings", label: "Open Settings", icon: "⚙️", action: () => {} },
 *   ]}
 * />
 * \`\`\`
 */

import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

interface Command {
    id: string;
    label: string;
    icon?: string;
    description?: string;
    action: () => void;
}

export interface CommandPaletteProps {
    /** Available commands */
    commands: Command[];
    /** Controlled open state */
    isOpen?: boolean;
    /** Callback when open state changes */
    onOpenChange?: (open: boolean) => void;
    /** Placeholder text. Default: "Type a command..." */
    placeholder?: string;
    /** Additional class names */
    className?: string;
}

// Simple fuzzy match scoring
function fuzzyScore(query: string, target: string): number {
    const q = query.toLowerCase();
    const t = target.toLowerCase();
    if (!q) return 1;
    if (t.includes(q)) return 2;
    let qi = 0;
    let score = 0;
    for (let ti = 0; ti < t.length && qi < q.length; ti++) {
        if (t[ti] === q[qi]) {
            score++;
            qi++;
        }
    }
    return qi === q.length ? score / q.length : 0;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
    commands,
    isOpen: controlledOpen,
    onOpenChange,
    placeholder = "Type a command...",
    className = "",
}) => {
    const prefersReducedMotion = useReducedMotion();
    const [internalOpen, setInternalOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [selectedIdx, setSelectedIdx] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const isOpen = controlledOpen ?? internalOpen;

    const setOpen = useCallback((open: boolean) => {
        setInternalOpen(open);
        onOpenChange?.(open);
        if (open) {
            setQuery("");
            setSelectedIdx(0);
        }
    }, [onOpenChange]);

    // ⌘K / Ctrl+K shortcut
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault();
                setOpen(!isOpen);
            }
            if (e.key === "Escape" && isOpen) {
                setOpen(false);
            }
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [isOpen, setOpen]);

    // Focus input when opened
    useEffect(() => {
        if (isOpen) inputRef.current?.focus();
    }, [isOpen]);

    // Filter and sort commands
    const filtered = useMemo(() => {
        return commands
            .map((cmd) => ({ cmd, score: fuzzyScore(query, cmd.label) }))
            .filter((x) => x.score > 0)
            .sort((a, b) => b.score - a.score)
            .map((x) => x.cmd);
    }, [commands, query]);

    // Keyboard navigation
    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === "ArrowDown") {
            e.preventDefault();
            setSelectedIdx((i) => Math.min(i + 1, filtered.length - 1));
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setSelectedIdx((i) => Math.max(i - 1, 0));
        } else if (e.key === "Enter" && filtered[selectedIdx]) {
            filtered[selectedIdx].action();
            setOpen(false);
        }
    }, [filtered, selectedIdx, setOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        className="fixed inset-0 bg-black/50 z-50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setOpen(false)}
                        aria-hidden="true"
                    />

                    {/* Palette */}
                    <motion.div
                        className={\`fixed top-[20%] left-1/2 w-full max-w-lg z-50 \${className}\`}
                        initial={prefersReducedMotion ? { opacity: 0, x: "-50%" } : { opacity: 0, y: -20, scale: 0.95, x: "-50%" }}
                        animate={{ opacity: 1, y: 0, scale: 1, x: "-50%" }}
                        exit={prefersReducedMotion ? { opacity: 0, x: "-50%" } : { opacity: 0, y: -20, scale: 0.95, x: "-50%" }}
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        role="dialog"
                        aria-label="Command palette"
                    >
                        <div className="bg-gray-900 rounded-xl border border-gray-700/50 shadow-2xl overflow-hidden">
                            {/* Search input */}
                            <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-700/50">
                                <span className="text-gray-500 text-sm">⌘</span>
                                <input
                                    ref={inputRef}
                                    className="flex-1 bg-transparent text-white text-sm outline-none placeholder-gray-500"
                                    placeholder={placeholder}
                                    value={query}
                                    onChange={(e) => { setQuery(e.target.value); setSelectedIdx(0); }}
                                    onKeyDown={handleKeyDown}
                                />
                                <kbd className="text-[10px] text-gray-600 bg-gray-800 px-1.5 py-0.5 rounded">ESC</kbd>
                            </div>

                            {/* Results */}
                            <div className="max-h-64 overflow-y-auto py-2">
                                {filtered.length === 0 ? (
                                    <div className="px-4 py-6 text-center text-sm text-gray-500">
                                        No results found
                                    </div>
                                ) : (
                                    filtered.map((cmd, i) => (
                                        <motion.button
                                            key={cmd.id}
                                            className={\`w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm cursor-pointer transition-colors \${i === selectedIdx
                                                    ? "bg-violet-500/10 text-white"
                                                    : "text-gray-400 hover:text-gray-200 hover:bg-gray-800/50"
                                                }\`}
                                            onClick={() => { cmd.action(); setOpen(false); }}
                                            onMouseEnter={() => setSelectedIdx(i)}
                                            initial={prefersReducedMotion ? {} : { opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: prefersReducedMotion ? 0 : i * 0.02 }}
                                        >
                                            {cmd.icon && <span className="text-lg">{cmd.icon}</span>}
                                            <div className="flex-1">
                                                <div className="font-medium">{cmd.label}</div>
                                                {cmd.description && (
                                                    <div className="text-xs text-gray-500">{cmd.description}</div>
                                                )}
                                            </div>
                                            {i === selectedIdx && (
                                                <kbd className="text-[10px] text-gray-600 bg-gray-800 px-1.5 py-0.5 rounded">↵</kbd>
                                            )}
                                        </motion.button>
                                    ))
                                )}
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default CommandPalette;
`
  },
  "navigation/magnetic-nav": {
    component: dynamic(() => import("@/components/ui/navigation/magnetic-nav").then(mod => mod.MagneticNav || mod.default)),
    name: "Magnetic Nav",
    category: "navigation",
    slug: "magnetic-nav",
    code: `"use client";

/**
 * @component MagneticNav
 * @description Nav links magnetically attracted to pointer. Active link has
 * a liquid underline that morphs position with spring physics.
 * Principle: magnetic attraction + spring underline morph.
 *
 * @example
 * \`\`\`tsx
 * import { MagneticNav } from '@/components/navigation/magnetic-nav';
 *
 * <MagneticNav
 *   links={[
 *     { label: "Home", href: "/" },
 *     { label: "Components", href: "/components" },
 *     { label: "Docs", href: "/docs" },
 *   ]}
 * />
 * \`\`\`
 */

import React, { useState, useRef, useCallback } from "react";
import { motion, useReducedMotion } from "framer-motion";

interface NavLink {
    label: string;
    href: string;
}

export interface MagneticNavProps {
    /** Navigation links */
    links: NavLink[];
    /** Active link index */
    activeIndex?: number;
    /** Magnetic strength (0-1). Default: 0.2 */
    magnetStrength?: number;
    /** Underline color. Default: "#8b5cf6" */
    underlineColor?: string;
    /** Additional class names */
    className?: string;
}

export const MagneticNav: React.FC<MagneticNavProps> = ({
    links,
    activeIndex = 0,
    magnetStrength = 0.2,
    underlineColor = "#8b5cf6",
    className = "",
}) => {
    const prefersReducedMotion = useReducedMotion();
    const [active, setActive] = useState(activeIndex);
    const [offsets, setOffsets] = useState<Record<number, { x: number; y: number }>>({});
    const navRef = useRef<HTMLElement>(null);
    const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);

    const handlePointerMove = useCallback((e: React.PointerEvent, i: number) => {
        if (prefersReducedMotion) return;
        const el = linkRefs.current[i];
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = (e.clientX - cx) * magnetStrength;
        const dy = (e.clientY - cy) * magnetStrength;
        setOffsets((prev) => ({ ...prev, [i]: { x: dx, y: dy } }));
    }, [magnetStrength, prefersReducedMotion]);

    const handlePointerLeave = useCallback((i: number) => {
        setOffsets((prev) => ({ ...prev, [i]: { x: 0, y: 0 } }));
    }, []);

    // Calculate underline position from active link
    const getUnderlineStyle = () => {
        const el = linkRefs.current[active];
        const nav = navRef.current;
        if (!el || !nav) return { left: 0, width: 0 };
        const navRect = nav.getBoundingClientRect();
        const elRect = el.getBoundingClientRect();
        return {
            left: elRect.left - navRect.left,
            width: elRect.width,
        };
    };

    const underline = getUnderlineStyle();

    return (
        <nav ref={navRef} className={\`relative flex items-center gap-1 \${className}\`} role="navigation">
            {links.map((link, i) => (
                <motion.a
                    key={link.href}
                    ref={(el) => { linkRefs.current[i] = el; }}
                    href={link.href}
                    className={\`relative px-4 py-2 text-sm font-medium rounded-lg transition-colors \${i === active ? "text-white" : "text-gray-400 hover:text-gray-200"
                        }\`}
                    onPointerMove={(e) => handlePointerMove(e, i)}
                    onPointerLeave={() => handlePointerLeave(i)}
                    onClick={(e) => { e.preventDefault(); setActive(i); }}
                    animate={{
                        x: offsets[i]?.x ?? 0,
                        y: offsets[i]?.y ?? 0,
                    }}
                    transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 15,
                    }}
                >
                    {link.label}
                </motion.a>
            ))}

            {/* Liquid underline */}
            <motion.div
                className="absolute bottom-0 h-0.5 rounded-full"
                style={{ backgroundColor: underlineColor }}
                animate={{
                    left: underline.left,
                    width: underline.width,
                }}
                transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 30,
                }}
                aria-hidden="true"
            />
        </nav>
    );
};

export default MagneticNav;
`
  },
  "sections/bento-grid": {
    component: dynamic(() => import("@/components/ui/sections/bento-grid").then(mod => mod.BentoGrid || mod.default)),
    name: "Bento Grid",
    category: "sections",
    slug: "bento-grid",
    code: `"use client";

/**
 * @component BentoGrid
 * @description Grid of varied-size cards. Hover causes gentle float,
 * click expands with layout animation.
 * Principle: spring float + Framer Motion layout animation.
 *
 * @example
 * \`\`\`tsx
 * import { BentoGrid } from '@/components/sections/bento-grid';
 *
 * <BentoGrid items={[
 *   { title: "Fast", description: "Blazing speed", span: 2 },
 *   { title: "Secure", description: "Enterprise ready" },
 * ]} />
 * \`\`\`
 */

import React, { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

interface BentoItem {
    title: string;
    description?: string;
    /** Column span (1 or 2). Default: 1 */
    span?: number;
    /** Row span (1 or 2). Default: 1 */
    rowSpan?: number;
    /** Icon emoji */
    icon?: string;
}

export interface BentoGridProps {
    /** Grid items */
    items: BentoItem[];
    /** Grid columns. Default: 3 */
    columns?: number;
    /** Additional class names */
    className?: string;
}

export const BentoGrid: React.FC<BentoGridProps> = ({
    items,
    columns = 3,
    className = "",
}) => {
    const prefersReducedMotion = useReducedMotion();
    const [expanded, setExpanded] = useState<number | null>(null);

    return (
        <section className={\`py-20 px-6 \${className}\`}>
            <div
                className="max-w-5xl mx-auto grid gap-4"
                style={{ gridTemplateColumns: \`repeat(\${columns}, 1fr)\` }}
            >
                {items.map((item, i) => (
                    <motion.div
                        key={i}
                        className="relative p-6 rounded-2xl border border-gray-700/30 bg-gray-800/50 cursor-pointer overflow-hidden"
                        style={{
                            gridColumn: \`span \${item.span || 1}\`,
                            gridRow: \`span \${item.rowSpan || 1}\`,
                        }}
                        whileHover={prefersReducedMotion ? {} : { y: -4, boxShadow: "0 10px 40px rgba(139,92,246,0.1)" }}
                        onClick={() => setExpanded(expanded === i ? null : i)}
                        layout
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    >
                        {item.icon && (
                            <motion.span
                                className="text-3xl mb-3 block"
                                layout
                            >
                                {item.icon}
                            </motion.span>
                        )}
                        <motion.h3 className="text-lg font-bold text-white mb-1" layout>
                            {item.title}
                        </motion.h3>
                        {item.description && (
                            <motion.p className="text-sm text-gray-400" layout>
                                {item.description}
                            </motion.p>
                        )}

                        <AnimatePresence>
                            {expanded === i && (
                                <motion.div
                                    className="mt-4 pt-4 border-t border-gray-700/30"
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <p className="text-sm text-gray-500">
                                        Expanded content for {item.title}. Customize with your own content.
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};

export default BentoGrid;
`
  },
  "sections/comparison-matrix": {
    component: dynamic(() => import("@/components/ui/sections/comparison-matrix").then(mod => mod.ComparisonMatrix || mod.default)),
    name: "Comparison Matrix",
    category: "sections",
    slug: "comparison-matrix",
    code: `"use client";

/**
 * @component ComparisonMatrix
 * @description Feature comparison table with staggered row reveal and spring icon morphs.
 * Principle: staggered row AnimatePresence + icon morph transitions.
 *
 * @example
 * \`\`\`tsx
 * import { ComparisonMatrix } from '@/components/sections/comparison-matrix';
 *
 * <ComparisonMatrix
 *   plans={["Free", "Pro", "Enterprise"]}
 *   features={[
 *     { name: "Projects", values: ["3", "Unlimited", "Unlimited"] },
 *     { name: "API Access", values: [false, true, true] },
 *   ]}
 * />
 * \`\`\`
 */

import React from "react";
import { motion, useReducedMotion } from "framer-motion";

interface FeatureRow {
    name: string;
    values: (string | boolean)[];
}

export interface ComparisonMatrixProps {
    /** Plan names for column headers */
    plans: string[];
    /** Feature rows */
    features: FeatureRow[];
    /** Additional class names */
    className?: string;
}

export const ComparisonMatrix: React.FC<ComparisonMatrixProps> = ({
    plans,
    features,
    className = "",
}) => {
    const prefersReducedMotion = useReducedMotion();

    return (
        <section className={\`py-20 px-6 \${className}\`}>
            <div className="max-w-4xl mx-auto overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-gray-700/50">
                            <th className="pb-4 pr-8 text-sm font-medium text-gray-500">Features</th>
                            {plans.map((plan) => (
                                <th key={plan} className="pb-4 px-4 text-sm font-bold text-white text-center">
                                    {plan}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {features.map((feature, i) => (
                            <motion.tr
                                key={feature.name}
                                className="border-b border-gray-800/50"
                                initial={prefersReducedMotion ? {} : { opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{
                                    delay: prefersReducedMotion ? 0 : i * 0.06,
                                    duration: 0.4,
                                }}
                            >
                                <td className="py-3 pr-8 text-sm text-gray-300">{feature.name}</td>
                                {feature.values.map((val, j) => (
                                    <td key={j} className="py-3 px-4 text-center">
                                        {typeof val === "boolean" ? (
                                            <motion.span
                                                className={\`inline-flex text-lg \${val ? "text-emerald-400" : "text-gray-600"}\`}
                                                initial={prefersReducedMotion ? {} : { scale: 0, rotate: -90 }}
                                                animate={{ scale: 1, rotate: 0 }}
                                                transition={{
                                                    type: "spring",
                                                    stiffness: 400,
                                                    damping: 15,
                                                    delay: prefersReducedMotion ? 0 : i * 0.06 + j * 0.03 + 0.2,
                                                }}
                                            >
                                                {val ? "✓" : "✗"}
                                            </motion.span>
                                        ) : (
                                            <motion.span
                                                className="text-sm text-gray-300"
                                                initial={prefersReducedMotion ? {} : { opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{
                                                    delay: prefersReducedMotion ? 0 : i * 0.06 + 0.2,
                                                }}
                                            >
                                                {val}
                                            </motion.span>
                                        )}
                                    </td>
                                ))}
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
};

export default ComparisonMatrix;
`
  },
  "sections/feature-spotlight": {
    component: dynamic(() => import("@/components/ui/sections/feature-spotlight").then(mod => mod.FeatureSpotlight || mod.default)),
    name: "Feature Spotlight",
    category: "sections",
    slug: "feature-spotlight",
    code: `"use client";

/**
 * @component FeatureSpotlight
 * @description Active feature item enlarges, others blur and shrink.
 * Keyboard navigable with arrow keys.
 * Principle: scale hierarchy + blur falloff + keyboard nav.
 *
 * @example
 * \`\`\`tsx
 * import { FeatureSpotlight } from '@/components/sections/feature-spotlight';
 *
 * <FeatureSpotlight features={[
 *   { title: "Speed", description: "Built for performance", icon: "⚡" },
 *   { title: "Design", description: "Beautiful defaults", icon: "🎨" },
 * ]} />
 * \`\`\`
 */

import React, { useState, useCallback, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";

interface Feature {
    title: string;
    description: string;
    icon?: string;
}

export interface FeatureSpotlightProps {
    /** Feature list */
    features: Feature[];
    /** Additional class names */
    className?: string;
}

export const FeatureSpotlight: React.FC<FeatureSpotlightProps> = ({
    features,
    className = "",
}) => {
    const prefersReducedMotion = useReducedMotion();
    const [active, setActive] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === "ArrowDown" || e.key === "ArrowRight") {
            e.preventDefault();
            setActive((prev) => (prev + 1) % features.length);
        } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
            e.preventDefault();
            setActive((prev) => (prev - 1 + features.length) % features.length);
        }
    }, [features.length]);

    return (
        <section className={\`py-20 px-6 \${className}\`}>
            <div
                ref={containerRef}
                className="max-w-2xl mx-auto space-y-3"
                onKeyDown={handleKeyDown}
                role="listbox"
                tabIndex={0}
                aria-label="Feature list"
            >
                {features.map((feature, i) => {
                    const isActive = i === active;
                    return (
                        <motion.div
                            key={i}
                            className={\`p-5 rounded-xl cursor-pointer border transition-colors \${isActive
                                    ? "border-violet-500/30 bg-violet-500/5"
                                    : "border-transparent bg-gray-800/30"
                                }\`}
                            animate={{
                                scale: isActive ? 1.02 : 0.98,
                                opacity: isActive ? 1 : 0.5,
                                filter: isActive || prefersReducedMotion
                                    ? "blur(0px)"
                                    : "blur(1px)",
                            }}
                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                            onClick={() => setActive(i)}
                            role="option"
                            aria-selected={isActive}
                        >
                            <div className="flex items-start gap-4">
                                {feature.icon && (
                                    <motion.span
                                        className="text-2xl"
                                        animate={{ scale: isActive ? 1.1 : 0.9 }}
                                    >
                                        {feature.icon}
                                    </motion.span>
                                )}
                                <div>
                                    <h3 className="text-lg font-bold text-white">{feature.title}</h3>
                                    <motion.p
                                        className="text-sm text-gray-400 mt-1"
                                        animate={{
                                            height: isActive ? "auto" : 0,
                                            opacity: isActive ? 1 : 0,
                                        }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        {feature.description}
                                    </motion.p>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </section>
    );
};

export default FeatureSpotlight;
`
  },
  "sections/gravity-well-hero": {
    component: dynamic(() => import("@/components/ui/sections/gravity-well-hero").then(mod => mod.GravityWellHero || mod.default)),
    name: "Gravity Well Hero",
    category: "sections",
    slug: "gravity-well-hero",
    code: `"use client";

/**
 * @component GravityWellHero
 * @description Floating feature icons orbit and gravitate toward the central headline.
 * Pointer movement perturbs their orbits.
 * Principle: gravitational attraction force field + orbit decay + pointer perturbation.
 *
 * @example
 * \`\`\`tsx
 * import { GravityWellHero } from '@/components/sections/gravity-well-hero';
 *
 * <GravityWellHero
 *   title="Everything pulls together."
 *   items={["⚡", "🎨", "🔧", "🚀", "💎", "🌊"]}
 * />
 * \`\`\`
 */

import React, { useRef, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";

export interface GravityWellHeroProps {
    /** Headline text */
    title: string;
    /** Subtitle */
    subtitle?: string;
    /** Floating items (emoji or short strings). Default: 6 emoji */
    items?: string[];
    /** CTA label */
    ctaLabel?: string;
    /** CTA href */
    ctaHref?: string;
    /** Item color. Default: "#8b5cf6" */
    itemColor?: string;
    /** Additional class names */
    className?: string;
}

interface Orbiter {
    x: number; y: number;
    vx: number; vy: number;
    angle: number;
    radius: number;
    speed: number;
}

export const GravityWellHero: React.FC<GravityWellHeroProps> = ({
    title,
    subtitle,
    items = ["⚡", "🎨", "🔧", "🚀", "💎", "🌊"],
    ctaLabel = "Get Started",
    ctaHref,
    itemColor = "#8b5cf6",
    className = "",
}) => {
    const prefersReducedMotion = useReducedMotion();
    const containerRef = useRef<HTMLDivElement>(null);
    const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
    const rafRef = useRef<number>(0);
    const pointerRef = useRef({ x: 0, y: 0 });

    useEffect(() => {
        if (prefersReducedMotion) return;

        const container = containerRef.current;
        if (!container) return;

        const rect = container.getBoundingClientRect();
        const cx = rect.width / 2;
        const cy = rect.height / 2;

        const orbiters: Orbiter[] = items.map((_, i) => {
            const angle = (i / items.length) * Math.PI * 2;
            const radius = 120 + Math.random() * 100;
            return {
                x: cx + Math.cos(angle) * radius,
                y: cy + Math.sin(angle) * radius,
                vx: 0, vy: 0,
                angle,
                radius,
                speed: 0.003 + Math.random() * 0.005,
            };
        });

        const handlePointerMove = (e: PointerEvent) => {
            const r = container.getBoundingClientRect();
            pointerRef.current = { x: e.clientX - r.left, y: e.clientY - r.top };
        };
        container.addEventListener("pointermove", handlePointerMove);

        const animate = () => {
            const r = container.getBoundingClientRect();
            const centerX = r.width / 2;
            const centerY = r.height / 2;

            orbiters.forEach((orb, i) => {
                // Orbital motion
                orb.angle += orb.speed;
                const targetX = centerX + Math.cos(orb.angle) * orb.radius;
                const targetY = centerY + Math.sin(orb.angle) * orb.radius;

                // Pointer perturbation
                const pdx = pointerRef.current.x - orb.x;
                const pdy = pointerRef.current.y - orb.y;
                const pDist = Math.sqrt(pdx * pdx + pdy * pdy);
                let perturbX = 0, perturbY = 0;
                if (pDist < 150 && pDist > 0) {
                    const force = (1 - pDist / 150) * 15;
                    perturbX = -(pdx / pDist) * force;
                    perturbY = -(pdy / pDist) * force;
                }

                // Spring toward orbital position
                orb.x += (targetX + perturbX - orb.x) * 0.05;
                orb.y += (targetY + perturbY - orb.y) * 0.05;

                const el = itemRefs.current[i];
                if (el) {
                    el.style.transform = \`translate(\${orb.x - 20}px, \${orb.y - 20}px)\`;

                    // Distance from center affects opacity
                    const dx = orb.x - centerX;
                    const dy = orb.y - centerY;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    const scale = 0.7 + (dist / 300) * 0.5;
                    el.style.transform += \` scale(\${Math.min(1.2, scale)})\`;
                }
            });

            rafRef.current = requestAnimationFrame(animate);
        };

        rafRef.current = requestAnimationFrame(animate);

        return () => {
            cancelAnimationFrame(rafRef.current);
            container.removeEventListener("pointermove", handlePointerMove);
        };
    }, [items, prefersReducedMotion]);

    return (
        <section className={\`relative min-h-[70vh] flex items-center justify-center overflow-hidden \${className}\`}>
            <div ref={containerRef} className="absolute inset-0">
                {items.map((item, i) => (
                    <div
                        key={i}
                        ref={(el) => { itemRefs.current[i] = el; }}
                        className="absolute w-10 h-10 flex items-center justify-center text-2xl will-change-transform pointer-events-none"
                        style={{
                            filter: \`drop-shadow(0 0 8px \${itemColor}60)\`,
                        }}
                        aria-hidden="true"
                    >
                        {item}
                    </div>
                ))}
            </div>

            <div className="relative z-10 text-center px-6">
                <motion.h1
                    className="text-5xl md:text-7xl font-black text-white mb-4"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                >
                    {title}
                </motion.h1>
                {subtitle && (
                    <motion.p
                        className="text-lg md:text-xl text-gray-400 mb-8 max-w-2xl mx-auto"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        {subtitle}
                    </motion.p>
                )}
                {ctaLabel && (
                    <motion.a
                        href={ctaHref || "#"}
                        className="inline-flex px-8 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 transition-colors"
                        whileHover={prefersReducedMotion ? {} : { scale: 1.05 }}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                    >
                        {ctaLabel}
                    </motion.a>
                )}
            </div>
        </section>
    );
};

export default GravityWellHero;
`
  },
  "sections/holographic-pricing-card": {
    component: dynamic(() => import("@/components/ui/sections/holographic-pricing-card").then(mod => mod.HolographicPricingCard || mod.default)),
    name: "Holographic Pricing Card",
    category: "sections",
    slug: "holographic-pricing-card",
    code: `"use client";

/**
 * @component HolographicPricingCard
 * @description Selected plan gets holographic card effect (scan lines, chromatic shift),
 * unselected plans fade and scale down.
 * Principle: HologramCard-style overlay + scale hierarchy + selection state.
 *
 * @example
 * \`\`\`tsx
 * import { HolographicPricingCard } from '@/components/sections/holographic-pricing-card';
 *
 * <HolographicPricingCard
 *   plans={[
 *     { name: "Free", price: 0, features: ["3 projects"] },
 *     { name: "Pro", price: 19, features: ["Unlimited"], highlighted: true },
 *   ]}
 * />
 * \`\`\`
 */

import React, { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

interface HoloPlan {
    name: string;
    price: number;
    period?: string;
    features: string[];
    highlighted?: boolean;
}

export interface HolographicPricingCardProps {
    /** Plans to display */
    plans: HoloPlan[];
    /** Currency symbol. Default: "\$" */
    currency?: string;
    /** Additional class names */
    className?: string;
}

export const HolographicPricingCard: React.FC<HolographicPricingCardProps> = ({
    plans,
    currency = "\$",
    className = "",
}) => {
    const prefersReducedMotion = useReducedMotion();
    const [selected, setSelected] = useState(
        plans.findIndex((p) => p.highlighted) >= 0 ? plans.findIndex((p) => p.highlighted) : 0
    );

    return (
        <section className={\`py-20 px-6 \${className}\`}>
            <div className="flex flex-wrap justify-center gap-6 max-w-5xl mx-auto items-center">
                {plans.map((plan, i) => {
                    const isSelected = i === selected;
                    return (
                        <motion.div
                            key={plan.name}
                            className={\`relative p-6 rounded-2xl border cursor-pointer overflow-hidden \${isSelected
                                    ? "border-cyan-400/50 w-80"
                                    : "border-gray-700/30 w-72 opacity-60"
                                }\`}
                            style={{
                                background: isSelected
                                    ? "linear-gradient(135deg, rgba(6,182,212,0.1), rgba(139,92,246,0.1))"
                                    : "rgba(31,41,55,0.5)",
                            }}
                            animate={{
                                scale: isSelected && !prefersReducedMotion ? 1.05 : 0.95,
                                opacity: isSelected ? 1 : 0.6,
                            }}
                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                            onClick={() => setSelected(i)}
                            role="button"
                            aria-pressed={isSelected}
                        >
                            {/* Holographic scan lines */}
                            {isSelected && !prefersReducedMotion && (
                                <motion.div
                                    className="absolute inset-0 pointer-events-none z-10"
                                    style={{
                                        background: \`repeating-linear-gradient(
                                            0deg,
                                            transparent,
                                            transparent 2px,
                                            rgba(6,182,212,0.03) 2px,
                                            rgba(6,182,212,0.03) 4px
                                        )\`,
                                    }}
                                    animate={{
                                        backgroundPosition: ["0 0", "0 100px"],
                                    }}
                                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                    aria-hidden="true"
                                />
                            )}

                            {/* Chromatic stripe */}
                            {isSelected && !prefersReducedMotion && (
                                <motion.div
                                    className="absolute left-0 right-0 h-px pointer-events-none z-10"
                                    style={{
                                        background: "linear-gradient(90deg, transparent, rgba(6,182,212,0.6), rgba(139,92,246,0.6), transparent)",
                                    }}
                                    animate={{ top: ["0%", "100%", "0%"] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                    aria-hidden="true"
                                />
                            )}

                            <h3 className="text-lg font-bold text-white mb-2 relative z-20">{plan.name}</h3>
                            <div className="flex items-baseline gap-1 mb-4 relative z-20">
                                <span className="text-4xl font-black text-white">{currency}{plan.price}</span>
                                <span className="text-gray-500 text-sm">/{plan.period || "mo"}</span>
                            </div>

                            <ul className="space-y-2 relative z-20">
                                {plan.features.map((f) => (
                                    <li key={f} className="flex items-center gap-2 text-sm text-gray-300">
                                        <span className={isSelected ? "text-cyan-400" : "text-gray-500"}>✓</span>
                                        {f}
                                    </li>
                                ))}
                            </ul>

                            <button
                                className={\`w-full mt-6 py-2.5 rounded-xl font-semibold text-sm cursor-pointer relative z-20 \${isSelected
                                        ? "bg-gradient-to-r from-cyan-600 to-violet-600 text-white"
                                        : "bg-gray-700 text-gray-400"
                                    }\`}
                            >
                                {isSelected ? "Get Started" : "Select"}
                            </button>
                        </motion.div>
                    );
                })}
            </div>
        </section>
    );
};

export default HolographicPricingCard;
`
  },
  "sections/liquid-toggle-pricing": {
    component: dynamic(() => import("@/components/ui/sections/liquid-toggle-pricing").then(mod => mod.LiquidTogglePricing || mod.default)),
    name: "Liquid Toggle Pricing",
    category: "sections",
    slug: "liquid-toggle-pricing",
    code: `"use client";

/**
 * @component LiquidTogglePricing
 * @description Monthly/Annual toggle with liquid SVG morph transition.
 * Prices animate with rolling number counter.
 * Principle: SVG morph + number counter animation + layout transition.
 *
 * @example
 * \`\`\`tsx
 * import { LiquidTogglePricing } from '@/components/sections/liquid-toggle-pricing';
 *
 * <LiquidTogglePricing
 *   plans={[
 *     { name: "Starter", monthly: 9, annual: 7, features: ["5 projects", "1GB storage"] },
 *     { name: "Pro", monthly: 29, annual: 24, features: ["Unlimited projects", "10GB storage"], popular: true },
 *   ]}
 * />
 * \`\`\`
 */

import React, { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

interface Plan {
    name: string;
    monthly: number;
    annual: number;
    features: string[];
    popular?: boolean;
}

export interface LiquidTogglePricingProps {
    /** Pricing plans */
    plans: Plan[];
    /** Currency symbol. Default: "\$" */
    currency?: string;
    /** CTA label. Default: "Get Started" */
    ctaLabel?: string;
    /** Additional class names */
    className?: string;
}

export const LiquidTogglePricing: React.FC<LiquidTogglePricingProps> = ({
    plans,
    currency = "\$",
    ctaLabel = "Get Started",
    className = "",
}) => {
    const prefersReducedMotion = useReducedMotion();
    const [isAnnual, setIsAnnual] = useState(false);

    return (
        <section className={\`py-20 px-6 \${className}\`}>
            {/* Toggle */}
            <div className="flex items-center justify-center gap-4 mb-12">
                <span className={\`text-sm font-medium \${!isAnnual ? "text-white" : "text-gray-500"}\`}>Monthly</span>
                <button
                    className="relative w-14 h-7 rounded-full bg-gray-700 cursor-pointer"
                    onClick={() => setIsAnnual(!isAnnual)}
                    aria-label={\`Switch to \${isAnnual ? "monthly" : "annual"} billing\`}
                >
                    <motion.div
                        className="absolute top-0.5 w-6 h-6 rounded-full bg-gradient-to-r from-violet-500 to-indigo-500"
                        animate={{ left: isAnnual ? "calc(100% - 25px)" : "2px" }}
                        transition={{
                            type: "spring",
                            stiffness: 400,
                            damping: 25,
                        }}
                    />
                </button>
                <span className={\`text-sm font-medium \${isAnnual ? "text-white" : "text-gray-500"}\`}>
                    Annual
                    <span className="ml-1 text-xs text-emerald-400">Save 20%</span>
                </span>
            </div>

            {/* Plans grid */}
            <div className="flex flex-wrap justify-center gap-6 max-w-5xl mx-auto">
                {plans.map((plan, i) => {
                    const price = isAnnual ? plan.annual : plan.monthly;
                    return (
                        <motion.div
                            key={plan.name}
                            className={\`relative w-72 p-6 rounded-2xl border \${plan.popular
                                    ? "border-violet-500/50 bg-gradient-to-b from-violet-500/10 to-transparent"
                                    : "border-gray-700/50 bg-gray-800/50"
                                }\`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            layout
                        >
                            {plan.popular && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-violet-500 text-xs font-bold text-white">
                                    Most Popular
                                </div>
                            )}

                            <h3 className="text-lg font-bold text-white mb-2">{plan.name}</h3>

                            <div className="flex items-baseline gap-1 mb-6">
                                <span className="text-3xl font-black text-white">
                                    {currency}
                                    <AnimatePresence mode="wait">
                                        <motion.span
                                            key={price}
                                            initial={prefersReducedMotion ? {} : { y: -20, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            exit={prefersReducedMotion ? {} : { y: 20, opacity: 0 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            {price}
                                        </motion.span>
                                    </AnimatePresence>
                                </span>
                                <span className="text-gray-500 text-sm">/mo</span>
                            </div>

                            <ul className="space-y-2 mb-6">
                                {plan.features.map((f) => (
                                    <li key={f} className="flex items-center gap-2 text-sm text-gray-300">
                                        <span className="text-emerald-400">✓</span>
                                        {f}
                                    </li>
                                ))}
                            </ul>

                            <button
                                className={\`w-full py-2.5 rounded-xl font-semibold text-sm cursor-pointer transition-colors \${plan.popular
                                        ? "bg-violet-600 text-white hover:bg-violet-500"
                                        : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                                    }\`}
                            >
                                {ctaLabel}
                            </button>
                        </motion.div>
                    );
                })}
            </div>
        </section>
    );
};

export default LiquidTogglePricing;
`
  },
  "sections/logo-carousel": {
    component: dynamic(() => import("@/components/ui/sections/logo-carousel").then(mod => mod.LogoCarousel || mod.default)),
    name: "Logo Carousel",
    category: "sections",
    slug: "logo-carousel",
    code: `"use client";

/**
 * @component LogoCarousel
 * @description Infinite-scroll logo carousel. Hover pauses and magnifies the hovered logo.
 * Principle: CSS marquee animation + hover pause + scale.
 *
 * @example
 * \`\`\`tsx
 * import { LogoCarousel } from '@/components/sections/logo-carousel';
 *
 * <LogoCarousel
 *   logos={[
 *     { name: "Vercel", imageUrl: "/logos/vercel.svg" },
 *     { name: "Next.js", imageUrl: "/logos/nextjs.svg" },
 *   ]}
 * />
 * \`\`\`
 */

import React, { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

interface Logo {
    name: string;
    /** Image URL, or use emoji/text in \`fallback\` */
    imageUrl?: string;
    /** Fallback text/emoji if no image */
    fallback?: string;
}

export interface LogoCarouselProps {
    /** Logos to display */
    logos: Logo[];
    /** Scroll speed in seconds for full cycle. Default: 20 */
    speed?: number;
    /** Additional class names */
    className?: string;
}

export const LogoCarousel: React.FC<LogoCarouselProps> = ({
    logos,
    speed = 20,
    className = "",
}) => {
    const prefersReducedMotion = useReducedMotion();
    const [isPaused, setIsPaused] = useState(false);
    const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

    // Duplicate logos for seamless loop
    const displayLogos = [...logos, ...logos];

    return (
        <section className={\`py-12 overflow-hidden \${className}\`}>
            <motion.div
                className="flex gap-12 items-center"
                animate={
                    prefersReducedMotion
                        ? {}
                        : {
                            x: [\`0%\`, \`-50%\`],
                        }
                }
                transition={{
                    x: {
                        duration: speed,
                        repeat: Infinity,
                        ease: "linear",
                        ...(isPaused ? { repeatType: "loop" as const } : {}),
                    },
                }}
                style={isPaused ? { animationPlayState: "paused" } : {}}
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => { setIsPaused(false); setHoveredIdx(null); }}
            >
                {displayLogos.map((logo, i) => (
                    <motion.div
                        key={\`\${logo.name}-\${i}\`}
                        className="flex-shrink-0 flex items-center justify-center px-6 cursor-pointer select-none"
                        animate={{
                            scale: hoveredIdx === (i % logos.length) ? 1.2 : 1,
                            opacity: hoveredIdx !== null && hoveredIdx !== (i % logos.length) ? 0.4 : 0.7,
                        }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        onMouseEnter={() => setHoveredIdx(i % logos.length)}
                    >
                        {logo.imageUrl ? (
                            <img
                                src={logo.imageUrl}
                                alt={logo.name}
                                className="h-8 w-auto object-contain grayscale hover:grayscale-0 transition-all"
                            />
                        ) : (
                            <span className="text-2xl font-bold text-gray-500">
                                {logo.fallback || logo.name}
                            </span>
                        )}
                    </motion.div>
                ))}
            </motion.div>
        </section>
    );
};

export default LogoCarousel;
`
  },
  "sections/membrane-hero": {
    component: dynamic(() => import("@/components/ui/sections/membrane-hero").then(mod => mod.MembraneHero || mod.default)),
    name: "Membrane Hero",
    category: "sections",
    slug: "membrane-hero",
    code: `"use client";

/**
 * @component MembraneHero
 * @description An elastic membrane stretches upward on scroll, revealing content
 * beneath. Uses spring physics simulation for the stretch behavior.
 * Principle: spring membrane deformation + scroll-driven reveal.
 *
 * @example
 * \`\`\`tsx
 * import { MembraneHero } from '@/components/sections/membrane-hero';
 *
 * <MembraneHero
 *   title="Stretch beyond limits."
 *   subtitle="Elastic UI for modern apps."
 *   membraneColor="#8b5cf6"
 * />
 * \`\`\`
 */

import React, { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

export interface MembraneHeroProps {
    /** Headline text */
    title: string;
    /** Subtitle */
    subtitle?: string;
    /** CTA label */
    ctaLabel?: string;
    /** CTA href */
    ctaHref?: string;
    /** Membrane color. Default: "#8b5cf6" */
    membraneColor?: string;
    /** Additional class names */
    className?: string;
}

export const MembraneHero: React.FC<MembraneHeroProps> = ({
    title,
    subtitle,
    ctaLabel = "Get Started",
    ctaHref,
    membraneColor = "#8b5cf6",
    className = "",
}) => {
    const prefersReducedMotion = useReducedMotion();
    const sectionRef = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start start", "end start"],
    });

    const membraneY = useTransform(scrollYProgress, [0, 0.5], ["0%", "-100%"]);
    const contentOpacity = useTransform(scrollYProgress, [0.2, 0.5], [0, 1]);
    const contentY = useTransform(scrollYProgress, [0.2, 0.5], [40, 0]);

    return (
        <section
            ref={sectionRef}
            className={\`relative min-h-[150vh] \${className}\`}
        >
            {/* Sticky container */}
            <div className="sticky top-0 min-h-screen flex items-center justify-center overflow-hidden">
                {/* Membrane overlay */}
                <motion.div
                    className="absolute inset-0 z-20"
                    style={{
                        y: prefersReducedMotion ? 0 : membraneY,
                        background: \`linear-gradient(180deg, \${membraneColor} 0%, \${membraneColor}dd 60%, transparent 100%)\`,
                    }}
                    aria-hidden="true"
                >
                    {/* Membrane surface texture */}
                    <motion.div
                        className="absolute -left-[10%] -right-[10%] bottom-0 h-24"
                        style={{
                            background: "rgba(0,0,0,0.9)",
                            borderTopLeftRadius: "50% 100%",
                            borderTopRightRadius: "50% 100%",
                        }}
                        animate={prefersReducedMotion ? undefined : {
                            y: [0, -8, 0],
                            scaleY: [1, 0.78, 1],
                        }}
                        transition={prefersReducedMotion ? undefined : {
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    />
                </motion.div>

                {/* Content revealed beneath */}
                <motion.div
                    className="relative z-10 text-center px-6"
                    style={{
                        opacity: prefersReducedMotion ? 1 : contentOpacity,
                        y: prefersReducedMotion ? 0 : contentY,
                    }}
                >
                    <h1 className="text-5xl md:text-7xl font-black text-white mb-4">
                        {title}
                    </h1>
                    {subtitle && (
                        <p className="text-lg md:text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
                            {subtitle}
                        </p>
                    )}
                    {ctaLabel && (
                        <a
                            href={ctaHref || "#"}
                            className="inline-flex px-8 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 transition-colors"
                        >
                            {ctaLabel}
                        </a>
                    )}
                </motion.div>
            </div>
        </section>
    );
};

export default MembraneHero;
`
  },
  "sections/particle-collapse-hero": {
    component: dynamic(() => import("@/components/ui/sections/particle-collapse-hero").then(mod => mod.ParticleCollapseHero || mod.default)),
    name: "Particle Collapse Hero",
    category: "sections",
    slug: "particle-collapse-hero",
    code: `"use client";

/**
 * @component ParticleCollapseHero
 * @description Hundreds of particles scatter from center on load, then converge
 * onto the headline text positions, forming the title from chaos.
 * Principle: particle target interpolation + stagger + easing curves.
 *
 * @example
 * \`\`\`tsx
 * import { ParticleCollapseHero } from '@/components/sections/particle-collapse-hero';
 *
 * <ParticleCollapseHero
 *   title="Build faster."
 *   subtitle="75 physics-based React components."
 *   ctaLabel="Get Started"
 *   ctaHref="/docs"
 * />
 * \`\`\`
 */

import React, { useRef, useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

export interface ParticleCollapseHeroProps {
    /** Headline text */
    title: string;
    /** Subtitle text */
    subtitle?: string;
    /** CTA button label */
    ctaLabel?: string;
    /** CTA button href */
    ctaHref?: string;
    /** CTA click handler */
    onCtaClick?: () => void;
    /** Particle count. Default: 120 */
    particleCount?: number;
    /** Particle color. Default: "#8b5cf6" */
    particleColor?: string;
    /** Additional class names */
    className?: string;
}

interface Particle {
    x: number; y: number;
    targetX: number; targetY: number;
    originX: number; originY: number;
    size: number;
    delay: number;
}

export const ParticleCollapseHero: React.FC<ParticleCollapseHeroProps> = ({
    title,
    subtitle,
    ctaLabel = "Get Started",
    ctaHref,
    onCtaClick,
    particleCount = 120,
    particleColor = "#8b5cf6",
    className = "",
}) => {
    const prefersReducedMotion = useReducedMotion();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const rafRef = useRef<number>(0);
    const [showContent, setShowContent] = useState(false);

    useEffect(() => {
        if (prefersReducedMotion) {
            setShowContent(true);
            return;
        }

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

        const cx = w() / 2;
        const cy = h() / 2;

        // Create particles with scattered origins and center-area targets
        const particles: Particle[] = Array.from({ length: particleCount }, (_, i) => {
            const angle = Math.random() * Math.PI * 2;
            const dist = 200 + Math.random() * 400;
            return {
                x: cx + Math.cos(angle) * dist,
                y: cy + Math.sin(angle) * dist,
                originX: cx + Math.cos(angle) * dist,
                originY: cy + Math.sin(angle) * dist,
                targetX: cx + (Math.random() - 0.5) * 300,
                targetY: cy + (Math.random() - 0.5) * 80,
                size: 1 + Math.random() * 3,
                delay: i * 8,
            };
        });

        const startTime = performance.now();
        const collapseMs = 2000;

        const animate = () => {
            const elapsed = performance.now() - startTime;
            ctx.clearRect(0, 0, w(), h());

            let allSettled = true;

            particles.forEach((p) => {
                const t = Math.max(0, Math.min(1, (elapsed - p.delay) / collapseMs));
                if (t < 1) allSettled = false;

                // Smooth easing
                const e = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

                const drawX = p.originX + (p.targetX - p.originX) * e;
                const drawY = p.originY + (p.targetY - p.originY) * e;
                const alpha = 0.2 + e * 0.8;

                ctx.beginPath();
                ctx.arc(drawX, drawY, p.size * (1 - e * 0.5), 0, Math.PI * 2);
                ctx.fillStyle = particleColor + Math.floor(alpha * 255).toString(16).padStart(2, "0");
                ctx.fill();
            });

            if (!allSettled) {
                rafRef.current = requestAnimationFrame(animate);
            } else {
                // Fade out particles, show content
                setTimeout(() => setShowContent(true), 200);
            }
        };

        rafRef.current = requestAnimationFrame(animate);

        return () => {
            cancelAnimationFrame(rafRef.current);
            window.removeEventListener("resize", resize);
        };
    }, [particleCount, particleColor, prefersReducedMotion]);

    return (
        <section className={\`relative min-h-[70vh] flex items-center justify-center overflow-hidden \${className}\`}>
            <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full"
                aria-hidden="true"
            />

            <motion.div
                className="relative z-10 text-center px-6"
                initial={{ opacity: 0, y: 20 }}
                animate={showContent ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >
                <h1 className="text-5xl md:text-7xl font-black text-white mb-4">
                    {title}
                </h1>
                {subtitle && (
                    <p className="text-lg md:text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
                        {subtitle}
                    </p>
                )}
                {ctaLabel && (
                    <motion.a
                        href={ctaHref || "#"}
                        onClick={onCtaClick}
                        className="inline-flex px-8 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 transition-colors"
                        whileHover={prefersReducedMotion ? {} : { scale: 1.05 }}
                        whileTap={prefersReducedMotion ? {} : { scale: 0.97 }}
                    >
                        {ctaLabel}
                    </motion.a>
                )}
            </motion.div>
        </section>
    );
};

export default ParticleCollapseHero;
`
  },
  "sections/stat-counter": {
    component: dynamic(() => import("@/components/ui/sections/stat-counter").then(mod => mod.StatCounter || mod.default)),
    name: "Stat Counter",
    category: "sections",
    slug: "stat-counter",
    code: `"use client";

/**
 * @component StatCounter
 * @description Numbers animate from 0 to target using cubic-bezier easing,
 * simulating realistic acceleration. Uses requestAnimationFrame.
 * Principle: cubic-bezier easing + rAF counter.
 *
 * @example
 * \`\`\`tsx
 * import { StatCounter } from '@/components/sections/stat-counter';
 *
 * <StatCounter
 *   stats={[
 *     { value: 75, label: "Components", suffix: "+" },
 *     { value: 99.9, label: "Uptime", suffix: "%" },
 *   ]}
 * />
 * \`\`\`
 */

import React, { useRef, useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

interface Stat {
    value: number;
    label: string;
    prefix?: string;
    suffix?: string;
    decimals?: number;
}

export interface StatCounterProps {
    /** Stats to display */
    stats: Stat[];
    /** Animation duration in ms. Default: 2000 */
    duration?: number;
    /** Additional class names */
    className?: string;
}

export const StatCounter: React.FC<StatCounterProps> = ({
    stats,
    duration = 2000,
    className = "",
}) => {
    const prefersReducedMotion = useReducedMotion();
    const [displayValues, setDisplayValues] = useState<number[]>(
        stats.map((s) => (prefersReducedMotion ? s.value : 0))
    );
    const rafRef = useRef<number>(0);
    const startTimeRef = useRef<number>(0);

    useEffect(() => {
        if (prefersReducedMotion) {
            setDisplayValues(stats.map((s) => s.value));
            return;
        }

        startTimeRef.current = performance.now();

        const animate = (now: number) => {
            const elapsed = now - startTimeRef.current;
            const progress = Math.min(1, elapsed / duration);

            // Cubic ease-out: deceleration curve
            const eased = 1 - Math.pow(1 - progress, 3);

            setDisplayValues(stats.map((s) => s.value * eased));

            if (progress < 1) {
                rafRef.current = requestAnimationFrame(animate);
            } else {
                setDisplayValues(stats.map((s) => s.value));
            }
        };

        rafRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(rafRef.current);
    }, [stats, duration, prefersReducedMotion]);

    return (
        <section className={\`py-20 px-6 \${className}\`}>
            <div className="flex flex-wrap justify-center gap-12 max-w-4xl mx-auto">
                {stats.map((stat, i) => (
                    <div key={i} className="text-center">
                        <div className="text-4xl md:text-5xl font-black text-white mb-1 font-mono tabular-nums">
                            {stat.prefix}
                            {(displayValues[i] ?? 0).toFixed(stat.decimals ?? 0)}
                            {stat.suffix}
                        </div>
                        <div className="text-sm text-gray-500 font-medium">{stat.label}</div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default StatCounter;
`
  },
  "sections/terminal-hero": {
    component: dynamic(() => import("@/components/ui/sections/terminal-hero").then(mod => mod.TerminalHero || mod.default)),
    name: "Terminal Hero",
    category: "sections",
    slug: "terminal-hero",
    code: `"use client";

/**
 * @component TerminalHero
 * @description Hero with terminal that types out value propositions as commands,
 * each line compiles with syntax highlighting and fake output.
 * Principle: typewriter + syntax highlight + progressive output.
 *
 * @example
 * \`\`\`tsx
 * import { TerminalHero } from '@/components/sections/terminal-hero';
 *
 * <TerminalHero
 *   title="Ship faster."
 *   commands={[
 *     { input: "npm install @keyshout/aurae", output: "✓ 75 components installed" },
 *     { input: "import { MagneticCard } from 'aurae'", output: "✓ Tree-shaken: 4.2kB" },
 *   ]}
 * />
 * \`\`\`
 */

import React, { useState, useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";

interface TerminalCommand {
    /** Command input text */
    input: string;
    /** Command output text */
    output: string;
}

export interface TerminalHeroProps {
    /** Headline text */
    title: string;
    /** Subtitle */
    subtitle?: string;
    /** Terminal commands sequence */
    commands?: TerminalCommand[];
    /** Typing speed in ms. Default: 35 */
    typeSpeed?: number;
    /** Prompt color. Default: "#22d3ee" */
    promptColor?: string;
    /** Additional class names */
    className?: string;
}

export const TerminalHero: React.FC<TerminalHeroProps> = ({
    title,
    subtitle,
    commands = [
        { input: "npm install @keyshout/aurae", output: "✓ 75 components ready" },
        { input: "import { MagneticCard } from 'aurae'", output: "✓ tree-shaken: 4.2kB" },
        { input: "npm run build", output: "✓ compiled in 0.8s" },
    ],
    typeSpeed = 35,
    promptColor = "#22d3ee",
    className = "",
}) => {
    const prefersReducedMotion = useReducedMotion();

    interface Line { type: "input" | "output"; text: string; }
    const [lines, setLines] = useState<Line[]>([]);
    const [currentText, setCurrentText] = useState("");
    const [cmdIndex, setCmdIndex] = useState(0);
    const [charIndex, setCharIndex] = useState(0);
    const [phase, setPhase] = useState<"typing" | "output" | "done">("typing");
    const timerRef = useRef<ReturnType<typeof setTimeout>>();

    useEffect(() => {
        if (prefersReducedMotion) {
            const allLines: Line[] = [];
            commands.forEach((cmd) => {
                allLines.push({ type: "input", text: cmd.input });
                allLines.push({ type: "output", text: cmd.output });
            });
            setLines(allLines);
            setPhase("done");
            return;
        }

        if (cmdIndex >= commands.length) {
            setPhase("done");
            return;
        }

        const cmd = commands[cmdIndex];

        if (phase === "typing") {
            if (charIndex < cmd.input.length) {
                timerRef.current = setTimeout(() => {
                    setCurrentText(cmd.input.slice(0, charIndex + 1));
                    setCharIndex(charIndex + 1);
                }, typeSpeed);
            } else {
                timerRef.current = setTimeout(() => {
                    setLines((prev) => [...prev, { type: "input", text: cmd.input }]);
                    setCurrentText("");
                    setPhase("output");
                }, 300);
            }
        } else if (phase === "output") {
            timerRef.current = setTimeout(() => {
                setLines((prev) => [...prev, { type: "output", text: cmd.output }]);
                setCharIndex(0);
                setCmdIndex(cmdIndex + 1);
                setPhase("typing");
            }, 400);
        }

        return () => clearTimeout(timerRef.current);
    }, [cmdIndex, charIndex, phase, commands, typeSpeed, prefersReducedMotion]);

    return (
        <section className={\`relative min-h-[70vh] flex items-center justify-center \${className}\`}>
            <div className="w-full max-w-4xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
                {/* Left: Text */}
                <div>
                    <motion.h1
                        className="text-5xl md:text-6xl font-black text-white mb-4"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        {title}
                    </motion.h1>
                    {subtitle && (
                        <motion.p
                            className="text-lg text-gray-400"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            {subtitle}
                        </motion.p>
                    )}
                </div>

                {/* Right: Terminal */}
                <motion.div
                    className="bg-gray-900/90 rounded-xl border border-gray-700/50 overflow-hidden shadow-2xl"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                >
                    {/* Terminal header */}
                    <div className="flex items-center gap-2 px-4 py-2.5 border-b border-gray-700/50">
                        <div className="w-3 h-3 rounded-full bg-red-500/80" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                        <div className="w-3 h-3 rounded-full bg-green-500/80" />
                        <span className="ml-2 text-[11px] text-gray-500 font-mono">terminal</span>
                    </div>

                    {/* Terminal body */}
                    <div className="p-4 font-mono text-sm space-y-1 min-h-[180px]">
                        {lines.map((line, i) => (
                            <div key={i} className={line.type === "output" ? "text-green-400/70 pl-2" : ""}>
                                {line.type === "input" && (
                                    <span style={{ color: promptColor }}>❯ </span>
                                )}
                                <span className={line.type === "input" ? "text-gray-300" : ""}>
                                    {line.text}
                                </span>
                            </div>
                        ))}
                        {phase === "typing" && cmdIndex < commands.length && (
                            <div>
                                <span style={{ color: promptColor }}>❯ </span>
                                <span className="text-gray-300">{currentText}</span>
                                <motion.span
                                    className="text-gray-300"
                                    animate={{ opacity: [1, 0] }}
                                    transition={{ duration: 0.5, repeat: Infinity }}
                                >
                                    █
                                </motion.span>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default TerminalHero;
`
  },
  "sections/timeline": {
    component: dynamic(() => import("@/components/ui/sections/timeline").then(mod => mod.Timeline || mod.default)),
    name: "Timeline",
    category: "sections",
    slug: "timeline",
    code: `"use client";

/**
 * @component Timeline
 * @description Vertical timeline drawn on scroll. Each node activates in sequence
 * with staggered reveal and connected stroke animation.
 * Principle: scroll-driven stroke draw + stagger reveal.
 *
 * @example
 * \`\`\`tsx
 * import { Timeline } from '@/components/sections/timeline';
 *
 * <Timeline items={[
 *   { title: "Launch", description: "v1.0 released", date: "Jan 2024" },
 *   { title: "Growth", description: "10k users", date: "Mar 2024" },
 * ]} />
 * \`\`\`
 */

import React from "react";
import { motion, useReducedMotion } from "framer-motion";

interface TimelineItem {
    title: string;
    description?: string;
    date?: string;
    icon?: string;
}

export interface TimelineProps {
    /** Timeline items */
    items: TimelineItem[];
    /** Line color. Default: "#8b5cf6" */
    lineColor?: string;
    /** Additional class names */
    className?: string;
}

export const Timeline: React.FC<TimelineProps> = ({
    items,
    lineColor = "#8b5cf6",
    className = "",
}) => {
    const prefersReducedMotion = useReducedMotion();

    return (
        <section className={\`py-20 px-6 \${className}\`}>
            <div className="max-w-2xl mx-auto relative">
                {/* Vertical line */}
                <motion.div
                    className="absolute left-6 top-0 bottom-0 w-0.5"
                    style={{ backgroundColor: \`\${lineColor}30\` }}
                    initial={prefersReducedMotion ? {} : { scaleY: 0, transformOrigin: "top" }}
                    animate={{ scaleY: 1 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    aria-hidden="true"
                />

                <div className="space-y-12">
                    {items.map((item, i) => (
                        <motion.div
                            key={i}
                            className="relative pl-16"
                            initial={prefersReducedMotion ? {} : { opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{
                                delay: prefersReducedMotion ? 0 : i * 0.15 + 0.3,
                                duration: 0.5,
                            }}
                        >
                            {/* Node dot */}
                            <motion.div
                                className="absolute left-4 w-5 h-5 rounded-full border-2 flex items-center justify-center text-xs"
                                style={{
                                    borderColor: lineColor,
                                    backgroundColor: "rgba(17,24,39,1)",
                                }}
                                initial={prefersReducedMotion ? {} : { scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{
                                    type: "spring",
                                    stiffness: 500,
                                    damping: 15,
                                    delay: prefersReducedMotion ? 0 : i * 0.15 + 0.5,
                                }}
                            >
                                {item.icon || "●"}
                            </motion.div>

                            {item.date && (
                                <span className="text-xs text-gray-500 font-mono">{item.date}</span>
                            )}
                            <h3 className="text-lg font-bold text-white mt-1">{item.title}</h3>
                            {item.description && (
                                <p className="text-sm text-gray-400 mt-1">{item.description}</p>
                            )}
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Timeline;
`
  },
  "sections/waveform-hero": {
    component: dynamic(() => import("@/components/ui/sections/waveform-hero").then(mod => mod.WaveformHero || mod.default)),
    name: "Waveform Hero",
    category: "sections",
    slug: "waveform-hero",
    code: `"use client";

/**
 * @component WaveformHero
 * @description Audio waveform visualization flows behind the hero headline.
 * CTA hover causes wave amplitude to spike reactively.
 * Principle: sine harmonic layers + pointer reactive amplitude.
 *
 * @example
 * \`\`\`tsx
 * import { WaveformHero } from '@/components/sections/waveform-hero';
 *
 * <WaveformHero
 *   title="Sound meets motion."
 *   subtitle="Every component dances."
 *   waveColor="#06b6d4"
 * />
 * \`\`\`
 */

import React, { useRef, useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { hexToRgbString } from "../../lib/utils";

export interface WaveformHeroProps {
    /** Headline text */
    title: string;
    /** Subtitle */
    subtitle?: string;
    /** CTA label */
    ctaLabel?: string;
    /** CTA href */
    ctaHref?: string;
    /** Wave color. Default: "#06b6d4" */
    waveColor?: string;
    /** Number of harmonic layers. Default: 4 */
    layers?: number;
    /** Additional class names */
    className?: string;
}

export const WaveformHero: React.FC<WaveformHeroProps> = ({
    title,
    subtitle,
    ctaLabel = "Get Started",
    ctaHref,
    waveColor = "#06b6d4",
    layers = 4,
    className = "",
}) => {
    const prefersReducedMotion = useReducedMotion();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const rafRef = useRef<number>(0);
    const [isHoveredCta, setIsHoveredCta] = useState(false);
    const hoverRef = useRef(false);

    useEffect(() => { hoverRef.current = isHoveredCta; }, [isHoveredCta]);

    useEffect(() => {
        if (prefersReducedMotion) return;

        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const rgb = hexToRgbString(waveColor, "6, 182, 212");

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

        let time = 0;

        const animate = () => {
            time += 0.015;
            ctx.clearRect(0, 0, w(), h());

            const baseAmp = hoverRef.current ? 60 : 30;
            const midY = h() / 2;

            for (let l = 0; l < layers; l++) {
                const freq = 0.003 + l * 0.002;
                const amp = baseAmp * (1 - l * 0.2);
                const phase = time * (1 + l * 0.3);
                const alpha = 0.15 - l * 0.03;

                ctx.beginPath();
                ctx.moveTo(0, midY);

                for (let x = 0; x <= w(); x += 2) {
                    const y = midY +
                        Math.sin(x * freq + phase) * amp +
                        Math.sin(x * freq * 2.3 + phase * 1.5) * amp * 0.4 +
                        Math.sin(x * freq * 0.5 + phase * 0.7) * amp * 0.6;
                    ctx.lineTo(x, y);
                }

                ctx.lineTo(w(), h());
                ctx.lineTo(0, h());
                ctx.closePath();
                ctx.fillStyle = \`rgba(\${rgb}, \${alpha})\`;
                ctx.fill();
            }

            rafRef.current = requestAnimationFrame(animate);
        };

        rafRef.current = requestAnimationFrame(animate);

        return () => {
            cancelAnimationFrame(rafRef.current);
            window.removeEventListener("resize", resize);
        };
    }, [waveColor, layers, prefersReducedMotion]);

    return (
        <section className={\`relative min-h-[70vh] flex items-center justify-center overflow-hidden \${className}\`}>
            <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full"
                aria-hidden="true"
            />

            <div className="relative z-10 text-center px-6">
                <motion.h1
                    className="text-5xl md:text-7xl font-black text-white mb-4"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    {title}
                </motion.h1>
                {subtitle && (
                    <motion.p
                        className="text-lg md:text-xl text-gray-400 mb-8 max-w-2xl mx-auto"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.5 }}
                    >
                        {subtitle}
                    </motion.p>
                )}
                {ctaLabel && (
                    <motion.a
                        href={ctaHref || "#"}
                        className="inline-flex px-8 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 transition-colors"
                        onMouseEnter={() => setIsHoveredCta(true)}
                        onMouseLeave={() => setIsHoveredCta(false)}
                        whileHover={prefersReducedMotion ? {} : { scale: 1.05 }}
                        whileTap={prefersReducedMotion ? {} : { scale: 0.97 }}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.8 }}
                    >
                        {ctaLabel}
                    </motion.a>
                )}
            </div>
        </section>
    );
};

export default WaveformHero;
`
  },
  "text/constellation-letters": {
    component: dynamic(() => import("@/components/ui/text/constellation-letters").then(mod => mod.ConstellationLetters || mod.default)),
    name: "Constellation Letters",
    category: "text",
    slug: "constellation-letters",
    code: `"use client";

/**
 * @component ConstellationLetters
 * @description Letters appear as scattered star dots, then connect with lines to form words.
 * Lines fade away in the final phase, leaving clear text.
 * Based on dot positioning + sequential line drawing animation.
 *
 * @example
 * \`\`\`tsx
 * import { ConstellationLetters } from '@/components/text/constellation-letters';
 *
 * <ConstellationLetters
 *   text="Starmap"
 *   dotColor="#facc15"
 *   lineColor="#facc15"
 *   className="text-5xl font-bold"
 * />
 * \`\`\`
 */

import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { toPositiveNumber } from "../../lib/utils";

export interface ConstellationLettersProps {
    /** Text to display */
    text: string;
    /** Duration of total animation in seconds. Default: 3 */
    duration?: number;
    /** Color of star dots. Default: "#facc15" */
    dotColor?: string;
    /** Color of connecting lines. Default: "#facc1580" */
    lineColor?: string;
    /** Size of star dots in pixels. Default: 4 */
    dotSize?: number;
    /** Scatter radius for initial positions. Default: 60 */
    scatterRadius?: number;
    /** Trigger: mount or inView. Default: "mount" */
    triggerOn?: "mount" | "inView";
    /** Additional class names */
    className?: string;
    /** ARIA label override */
    ariaLabel?: string;
}

export const ConstellationLetters: React.FC<ConstellationLettersProps> = ({
    text,
    duration = 3,
    dotColor = "#facc15",
    lineColor = "#facc1580",
    dotSize = 4,
    scatterRadius = 60,
    triggerOn = "mount",
    className = "",
    ariaLabel,
}) => {
    const prefersReducedMotion = useReducedMotion();
    const safeDuration = toPositiveNumber(duration, 3, 0.01);
    const safeDotSize = toPositiveNumber(dotSize, 4, 1);
    const safeScatterRadius = toPositiveNumber(scatterRadius, 60, 0);
    const containerRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(containerRef, { once: true, amount: 0.5 });
    const [phase, setPhase] = useState<"stars" | "connecting" | "text">("stars");

    const shouldAnimate = triggerOn === "mount" || isInView;

    // Generate random star positions for each letter
    const starOffsets = useMemo(
        () =>
            text.split("").map(() => ({
                x: (Math.random() - 0.5) * safeScatterRadius * 2,
                y: (Math.random() - 0.5) * safeScatterRadius * 2,
            })),
        [text, safeScatterRadius]
    );

    useEffect(() => {
        if (!shouldAnimate) return;
        if (prefersReducedMotion) {
            setPhase("text");
            return;
        }

        const t1 = setTimeout(() => setPhase("connecting"), safeDuration * 300);
        const t2 = setTimeout(() => setPhase("text"), safeDuration * 700);

        return () => {
            clearTimeout(t1);
            clearTimeout(t2);
        };
    }, [shouldAnimate, safeDuration, prefersReducedMotion]);

    return (
        <div
            ref={containerRef}
            className={\`relative inline-block \${className}\`}
            role="text"
            aria-label={ariaLabel || text}
        >
            {/* Connecting lines */}
            {phase === "connecting" && (
                <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
                    {text.split("").map((_, i) => {
                        if (i >= text.length - 1) return null;
                        const charWidth = 100 / text.length;
                        const x1 = charWidth * (i + 0.5);
                        const x2 = charWidth * (i + 1.5);
                        const widthPct = Math.max(0, x2 - x1);
                        return (
                            <motion.div
                                key={\`line-\${i}\`}
                                className="absolute top-1/2 h-px origin-left"
                                style={{
                                    left: \`\${x1}%\`,
                                    width: \`\${widthPct}%\`,
                                    background: lineColor,
                                }}
                                initial={{ scaleX: 0, opacity: 0 }}
                                animate={{ scaleX: 1, opacity: [0, 0.8, 0.8, 0] }}
                                transition={{
                                    duration: safeDuration * 0.3,
                                    delay: i * 0.05,
                                    ease: "easeInOut",
                                }}
                            />
                        );
                    })}
                </div>
            )}

            {/* Characters */}
            <span className="relative inline-flex">
                {text.split("").map((char, i) => {
                    const offset = starOffsets[i];
                    const isStarPhase = phase === "stars";
                    const isTextPhase = phase === "text";

                    return (
                        <motion.span
                            key={i}
                            className="inline-block relative"
                            animate={{
                                x: isStarPhase ? offset.x : 0,
                                y: isStarPhase ? offset.y : 0,
                                opacity: 1,
                                scale: isStarPhase ? 0.3 : 1,
                            }}
                            transition={{
                                type: "spring",
                                stiffness: 120,
                                damping: 14,
                                delay: i * 0.04,
                            }}
                            aria-hidden="true"
                        >
                            {/* Star dot overlay */}
                            {!isTextPhase && (
                                <motion.span
                                    className="absolute inset-0 flex items-center justify-center pointer-events-none"
                                    animate={{
                                        opacity: isTextPhase ? 0 : [0.6, 1, 0.6],
                                        scale: isStarPhase ? [1, 1.3, 1] : 1,
                                    }}
                                    transition={{
                                        duration: 1.5,
                                        repeat: isStarPhase ? Infinity : 0,
                                        delay: i * 0.1,
                                    }}
                                >
                                    <span
                                        className="rounded-full"
                                        style={{
                                            width: safeDotSize,
                                            height: safeDotSize,
                                            background: dotColor,
                                            boxShadow: \`0 0 \${safeDotSize * 2}px \${dotColor}\`,
                                        }}
                                    />
                                </motion.span>
                            )}

                            {/* Actual character */}
                            <motion.span
                                animate={{
                                    opacity: isTextPhase ? 1 : isStarPhase ? 0 : 0.5,
                                    filter: isTextPhase
                                        ? "blur(0px)"
                                        : \`blur(\${isStarPhase ? 8 : 2}px)\`,
                                }}
                                transition={{ duration: safeDuration * 0.2 }}
                            >
                                {char === " " ? "\u00A0" : char}
                            </motion.span>
                        </motion.span>
                    );
                })}
            </span>
        </div>
    );
};

export default ConstellationLetters;
`
  },
  "text/depth-of-field-text": {
    component: dynamic(() => import("@/components/ui/text/depth-of-field-text").then(mod => mod.DepthOfFieldText || mod.default)),
    name: "Depth Of Field Text",
    category: "text",
    slug: "depth-of-field-text",
    code: `"use client";

/**
 * @component DepthOfFieldText
 * @description Front characters are in focus, back ones have cinematic blur.
 * Scroll shifts the focal plane across the text.
 * Principle: z-index based blur scaling + scroll parallax focal plane.
 *
 * @example
 * \`\`\`tsx
 * import { DepthOfFieldText } from '@/components/text/depth-of-field-text';
 *
 * <DepthOfFieldText
 *   text="Cinematic"
 *   focalPoint={0.5}
 *   className="text-6xl font-black text-white"
 * />
 * \`\`\`
 */

import React, { useState, useCallback } from "react";
import { motion, useReducedMotion } from "framer-motion";

export interface DepthOfFieldTextProps {
    /** Text to display */
    text: string;
    /** Focal point position (0=left, 1=right). Default: 0.5 */
    focalPoint?: number;
    /** Maximum blur in px for out-of-focus characters. Default: 4 */
    maxBlur?: number;
    /** Depth of field width (0-1, portion of text in focus). Default: 0.3 */
    fieldWidth?: number;
    /** Track pointer for focal shift. Default: true */
    followPointer?: boolean;
    /** Additional class names */
    className?: string;
    /** ARIA label override */
    ariaLabel?: string;
}

export const DepthOfFieldText: React.FC<DepthOfFieldTextProps> = ({
    text,
    focalPoint = 0.5,
    maxBlur = 4,
    fieldWidth = 0.3,
    followPointer = true,
    className = "",
    ariaLabel,
}) => {
    const prefersReducedMotion = useReducedMotion();
    const [focus, setFocus] = useState(focalPoint);

    const handlePointerMove = useCallback((e: React.PointerEvent<HTMLSpanElement>) => {
        if (!followPointer || prefersReducedMotion) return;
        const rect = e.currentTarget.getBoundingClientRect();
        setFocus((e.clientX - rect.left) / rect.width);
    }, [followPointer, prefersReducedMotion]);

    const handlePointerLeave = useCallback(() => {
        setFocus(focalPoint);
    }, [focalPoint]);

    const chars = text.split("");

    return (
        <span
            className={\`inline-flex flex-wrap \${className}\`}
            role="text"
            aria-label={ariaLabel || text}
            onPointerMove={handlePointerMove}
            onPointerLeave={handlePointerLeave}
        >
            {chars.map((char, i) => {
                const charPos = chars.length > 1 ? i / (chars.length - 1) : 0.5;
                const distFromFocus = Math.abs(charPos - focus);
                const normalizedDist = Math.max(0, (distFromFocus - fieldWidth / 2) / (0.5 - fieldWidth / 2));
                const blur = prefersReducedMotion ? 0 : Math.min(maxBlur, normalizedDist * maxBlur);
                const opacity = prefersReducedMotion ? 1 : 1 - normalizedDist * 0.3;

                return (
                    <motion.span
                        key={i}
                        className="inline-block"
                        animate={{
                            filter: \`blur(\${blur}px)\`,
                            opacity,
                        }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                        aria-hidden="true"
                    >
                        {char === " " ? "\u00A0" : char}
                    </motion.span>
                );
            })}
        </span>
    );
};

export default DepthOfFieldText;
`
  },
  "text/echo-trail-headline": {
    component: dynamic(() => import("@/components/ui/text/echo-trail-headline").then(mod => mod.EchoTrailHeadline || mod.default)),
    name: "Echo Trail Headline",
    category: "text",
    slug: "echo-trail-headline",
    code: `﻿"use client";

/**
 * @component EchoTrailHeadline
 * @description On scroll or hover, the headline leaves behind low-opacity ghost copies
 * that trail behind, then merge back into the main text.
 * Based on overlapping layer animations + offset chaining.
 *
 * @example
 * \`\`\`tsx
 * import { EchoTrailHeadline } from '@/components/text/echo-trail-headline';
 *
 * <EchoTrailHeadline
 *   text="Echo Chamber"
 *   echoCount={4}
 *   echoColor="#6366f1"
 *   className="text-7xl font-black"
 * />
 * \`\`\`
 */

import React, { useState, useRef, useCallback, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export interface EchoTrailHeadlineProps {
    /** Text to display */
    text: string;
    /** Number of echo layers. Default: 4 */
    echoCount?: number;
    /** Echo color. Default: "#6366f1" */
    echoColor?: string;
    /** Maximum echo offset in pixels. Default: 12 */
    maxOffset?: number;
    /** Trigger: hover or scroll. Default: "hover" */
    triggerOn?: "hover" | "scroll";
    /** Merge duration in seconds. Default: 0.6 */
    mergeDuration?: number;
    /** Additional class names */
    className?: string;
    /** ARIA label override */
    ariaLabel?: string;
}

export const EchoTrailHeadline: React.FC<EchoTrailHeadlineProps> = ({
    text,
    echoCount = 4,
    echoColor = "#6366f1",
    maxOffset = 12,
    triggerOn = "hover",
    mergeDuration = 0.6,
    className = "",
    ariaLabel,
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isActive, setIsActive] = useState(false);
    const [isMerging, setIsMerging] = useState(false);
    const mergeTimerRef = useRef<ReturnType<typeof setTimeout>>();

    // Scroll-based activation
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"],
    });

    const scrollActivity = useTransform(scrollYProgress, [0.2, 0.5, 0.8], [0, 1, 0]);

    useEffect(() => {
        if (triggerOn !== "scroll") return;

        const unsubscribe = scrollActivity.on("change", (v) => {
            setIsActive(v > 0.3);
        });

        return unsubscribe;
    }, [triggerOn, scrollActivity]);

    const handleMouseEnter = useCallback(() => {
        if (triggerOn === "hover") {
            setIsActive(true);
            setIsMerging(false);
        }
    }, [triggerOn]);

    const handleMouseLeave = useCallback(() => {
        if (triggerOn === "hover") {
            setIsMerging(true);
            clearTimeout(mergeTimerRef.current);
            mergeTimerRef.current = setTimeout(() => {
                setIsActive(false);
                setIsMerging(false);
            }, mergeDuration * 1000);
        }
    }, [triggerOn, mergeDuration]);

    // Cleanup merge timer on unmount
    useEffect(() => {
        return () => clearTimeout(mergeTimerRef.current);
    }, []);

    const echoes = Array.from({ length: echoCount }, (_, i) => i);

    return (
        <div
            ref={containerRef}
            className={\`relative inline-block cursor-default select-none \${className}\`}
            role="heading"
            aria-label={ariaLabel || text}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {/* Echo layers */}
            {echoes.map((i) => {
                const layerIndex = i + 1;
                const echoOpacity = 0.15 - (i / echoCount) * 0.1;
                const offsetMultiplier = layerIndex / echoCount;
                const yOffset = maxOffset * offsetMultiplier;
                const xOffset = maxOffset * 0.3 * offsetMultiplier * (i % 2 === 0 ? 1 : -1);

                return (
                    <motion.span
                        key={\`echo-\${i}\`}
                        className="absolute inset-0 pointer-events-none"
                        style={{ color: echoColor }}
                        animate={{
                            y: isActive && !isMerging ? -yOffset : 0,
                            x: isActive && !isMerging ? xOffset : 0,
                            opacity: isActive && !isMerging ? echoOpacity : 0,
                            scale: isActive && !isMerging ? 1 + offsetMultiplier * 0.02 : 1,
                        }}
                        transition={{
                            type: "spring",
                            stiffness: 200 - layerIndex * 30,
                            damping: 20 + layerIndex * 3,
                            mass: 0.5 + layerIndex * 0.1,
                        }}
                        aria-hidden="true"
                    >
                        {text}
                    </motion.span>
                );
            })}

            {/* Main text */}
            <span className="relative z-10">{text}</span>
        </div>
    );
};

export default EchoTrailHeadline;

`
  },
  "text/fault-line-text": {
    component: dynamic(() => import("@/components/ui/text/fault-line-text").then(mod => mod.FaultLineText || mod.default)),
    name: "Fault Line Text",
    category: "text",
    slug: "fault-line-text",
    code: `"use client";

/**
 * @component FaultLineText
 * @description Text splits along a horizontal fault line like tectonic plates,
 * the top half shifts one direction, bottom the other, then snaps back.
 * Principle: clip-path split + translateX stagger + spring return.
 *
 * @example
 * \`\`\`tsx
 * import { FaultLineText } from '@/components/text/fault-line-text';
 *
 * <FaultLineText
 *   text="Tectonic"
 *   splitOffset={20}
 *   className="text-6xl font-black text-white"
 * />
 * \`\`\`
 */

import React, { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

export interface FaultLineTextProps {
    /** Text to display */
    text: string;
    /** Horizontal shift amount in px. Default: 20 */
    splitOffset?: number;
    /** Vertical position of fault line (0-100%). Default: 50 */
    faultPosition?: number;
    /** Animation duration in seconds. Default: 0.6 */
    duration?: number;
    /** Trigger on hover or mount. Default: "hover" */
    triggerOn?: "hover" | "mount";
    /** Additional class names */
    className?: string;
    /** ARIA label override */
    ariaLabel?: string;
}

export const FaultLineText: React.FC<FaultLineTextProps> = ({
    text,
    splitOffset = 20,
    faultPosition = 50,
    duration = 0.6,
    triggerOn = "hover",
    className = "",
    ariaLabel,
}) => {
    const prefersReducedMotion = useReducedMotion();
    const [isActive, setIsActive] = useState(triggerOn === "mount");

    const spring = {
        type: "spring" as const,
        stiffness: 300,
        damping: 20,
        duration: prefersReducedMotion ? 0 : duration,
    };

    return (
        <span
            className={\`relative inline-block cursor-default \${className}\`}
            role="text"
            aria-label={ariaLabel || text}
            onMouseEnter={triggerOn === "hover" ? () => setIsActive(true) : undefined}
            onMouseLeave={triggerOn === "hover" ? () => setIsActive(false) : undefined}
        >
            {/* Top half */}
            <motion.span
                className="block"
                style={{
                    clipPath: \`inset(0 0 \${100 - faultPosition}% 0)\`,
                }}
                animate={{
                    x: isActive && !prefersReducedMotion ? splitOffset : 0,
                }}
                transition={spring}
                aria-hidden="true"
            >
                {text}
            </motion.span>

            {/* Bottom half */}
            <motion.span
                className="block absolute inset-0"
                style={{
                    clipPath: \`inset(\${faultPosition}% 0 0 0)\`,
                }}
                animate={{
                    x: isActive && !prefersReducedMotion ? -splitOffset : 0,
                }}
                transition={spring}
                aria-hidden="true"
            >
                {text}
            </motion.span>

            {/* Fault line glow */}
            <motion.div
                className="absolute left-0 right-0 h-px pointer-events-none"
                style={{
                    top: \`\${faultPosition}%\`,
                    background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
                }}
                animate={{
                    opacity: isActive && !prefersReducedMotion ? 1 : 0,
                    scaleX: isActive ? 1 : 0.5,
                }}
                transition={{ duration: prefersReducedMotion ? 0 : 0.3 }}
                aria-hidden="true"
            />
        </span>
    );
};

export default FaultLineText;
`
  },
  "text/glitch-weave-text": {
    component: dynamic(() => import("@/components/ui/text/glitch-weave-text").then(mod => mod.GlitchWeaveText || mod.default)),
    name: "Glitch Weave Text",
    category: "text",
    slug: "glitch-weave-text",
    code: `﻿"use client";

/**
 * @component GlitchWeaveText
 * @description Text emerges by weaving vertical and horizontal digital threads,
 * overlapping like fabric before resolving into clear text.
 * Based on SVG line animation + clip-path masking.
 *
 * @example
 * \`\`\`tsx
 * import { GlitchWeaveText } from '@/components/text/glitch-weave-text';
 *
 * <GlitchWeaveText
 *   text="Woven Data"
 *   duration={2}
 *   threadColor="#a855f7"
 *   className="text-5xl font-bold"
 * />
 * \`\`\`
 */

import React, { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";

export interface GlitchWeaveTextProps {
    /** Text to display */
    text: string;
    /** Total animation duration in seconds. Default: 2 */
    duration?: number;
    /** Thread color. Default: "#a855f7" */
    threadColor?: string;
    /** Number of horizontal threads. Default: 6 */
    horizontalThreads?: number;
    /** Number of vertical threads. Default: 8 */
    verticalThreads?: number;
    /** Trigger: mount or inView. Default: "mount" */
    triggerOn?: "mount" | "inView";
    /** Additional class names */
    className?: string;
    /** ARIA label override */
    ariaLabel?: string;
}

export const GlitchWeaveText: React.FC<GlitchWeaveTextProps> = ({
    text,
    duration = 2,
    threadColor = "#a855f7",
    horizontalThreads = 6,
    verticalThreads = 8,
    triggerOn = "mount",
    className = "",
    ariaLabel,
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(containerRef, { once: true, amount: 0.5 });
    const [phase, setPhase] = useState<"weaving" | "merging" | "done">("weaving");

    const shouldAnimate = triggerOn === "mount" || isInView;

    useEffect(() => {
        if (!shouldAnimate) return;

        const mergeTimer = setTimeout(
            () => setPhase("merging"),
            duration * 600
        );
        const doneTimer = setTimeout(() => setPhase("done"), duration * 1000);

        return () => {
            clearTimeout(mergeTimer);
            clearTimeout(doneTimer);
        };
    }, [shouldAnimate, duration]);

    const hThreads = Array.from({ length: horizontalThreads }, (_, i) => i);
    const vThreads = Array.from({ length: verticalThreads }, (_, i) => i);

    return (
        <div
            ref={containerRef}
            className={\`relative inline-block \${className}\`}
            role="text"
            aria-label={ariaLabel || text}
        >
            {/* Final clear text */}
            <motion.span
                className="relative z-10"
                animate={{
                    opacity: phase === "done" ? 1 : phase === "merging" ? 0.8 : 0.1,
                    filter: phase === "done" ? "blur(0px)" : \`blur(\${phase === "merging" ? 1 : 4}px)\`,
                }}
                transition={{ duration: duration * 0.4 }}
                aria-hidden="true"
            >
                {text}
            </motion.span>

            {/* Thread overlay */}
            {phase !== "done" && (
                <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
                    {/* Horizontal threads */}
                    {hThreads.map((i) => {
                        const y = ((i + 0.5) / horizontalThreads) * 100;
                        const delay = (i / horizontalThreads) * duration * 0.3;
                        return (
                            <motion.div
                                key={\`h-\${i}\`}
                                className="absolute left-0 right-0"
                                style={{
                                    top: \`\${y}%\`,
                                    height: "2px",
                                    background: \`linear-gradient(90deg, transparent, \${threadColor}, transparent)\`,
                                }}
                                initial={{ scaleX: 0, originX: i % 2 === 0 ? 0 : 1 }}
                                animate={{
                                    scaleX: phase === "merging" ? 0 : 1,
                                    opacity: phase === "merging" ? 0 : [0, 0.9, 0.7],
                                }}
                                transition={{
                                    duration: duration * 0.4,
                                    delay,
                                    ease: "easeInOut",
                                }}
                            />
                        );
                    })}

                    {/* Vertical threads */}
                    {vThreads.map((i) => {
                        const x = ((i + 0.5) / verticalThreads) * 100;
                        const delay = (i / verticalThreads) * duration * 0.3 + 0.1;
                        return (
                            <motion.div
                                key={\`v-\${i}\`}
                                className="absolute top-0 bottom-0"
                                style={{
                                    left: \`\${x}%\`,
                                    width: "2px",
                                    background: \`linear-gradient(180deg, transparent, \${threadColor}, transparent)\`,
                                }}
                                initial={{ scaleY: 0, originY: i % 2 === 0 ? 0 : 1 }}
                                animate={{
                                    scaleY: phase === "merging" ? 0 : 1,
                                    opacity: phase === "merging" ? 0 : [0, 0.8, 0.6],
                                }}
                                transition={{
                                    duration: duration * 0.4,
                                    delay,
                                    ease: "easeInOut",
                                }}
                            />
                        );
                    })}

                    {/* Intersection glow points */}
                    {phase === "weaving" &&
                        hThreads.slice(0, 3).map((hi) =>
                            vThreads.slice(0, 4).map((vi) => {
                                const x = ((vi + 0.5) / verticalThreads) * 100;
                                const y = ((hi + 0.5) / horizontalThreads) * 100;
                                return (
                                    <motion.div
                                        key={\`g-\${hi}-\${vi}\`}
                                        className="absolute w-1 h-1 rounded-full"
                                        style={{
                                            left: \`\${x}%\`,
                                            top: \`\${y}%\`,
                                            background: threadColor,
                                            boxShadow: \`0 0 6px \${threadColor}\`,
                                        }}
                                        animate={{ opacity: [0, 1, 0], scale: [0.5, 1.5, 0.5] }}
                                        transition={{
                                            duration: duration * 0.5,
                                            delay: (hi + vi) * 0.05,
                                            repeat: 1,
                                        }}
                                    />
                                );
                            })
                        )}
                </div>
            )}
        </div>
    );
};

export default GlitchWeaveText;

`
  },
  "text/liquid-mercury-text": {
    component: dynamic(() => import("@/components/ui/text/liquid-mercury-text").then(mod => mod.LiquidMercuryText || mod.default)),
    name: "Liquid Mercury Text",
    category: "text",
    slug: "liquid-mercury-text",
    code: `"use client";

/**
 * @component LiquidMercuryText
 * @description Characters flow and merge like liquid mercury, with metaball-style
 * surface tension at connection points using layered blur/contrast.
 * Principle: stacked text layers + blur/contrast blending.
 *
 * @example
 * \`\`\`tsx
 * import { LiquidMercuryText } from '@/components/text/liquid-mercury-text';
 *
 * <LiquidMercuryText
 *   text="Mercury"
 *   className="text-6xl font-black"
 * />
 * \`\`\`
 */

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { toPositiveNumber } from "../../lib/utils";

export interface LiquidMercuryTextProps {
    /** Text to display */
    text: string;
    /** Metaball blur strength. Default: 8 */
    blurStrength?: number;
    /** Color threshold for metaball effect. Default: 18 */
    threshold?: number;
    /** Stagger delay per character in seconds. Default: 0.06 */
    stagger?: number;
    /** Text color. Default: "#e2e8f0" */
    color?: string;
    /** Additional class names */
    className?: string;
    /** ARIA label override */
    ariaLabel?: string;
}

export const LiquidMercuryText: React.FC<LiquidMercuryTextProps> = ({
    text,
    blurStrength = 8,
    threshold = 18,
    stagger = 0.06,
    color = "#e2e8f0",
    className = "",
    ariaLabel,
}) => {
    const prefersReducedMotion = useReducedMotion();
    const safeBlurStrength = toPositiveNumber(blurStrength, 8, 0);
    const safeThreshold = toPositiveNumber(threshold, 18, 1);
    const safeStagger = toPositiveNumber(stagger, 0.06, 0);
    const chars = text.split("");

    return (
        <span
            className={\`inline-block relative \${className}\`}
            role="text"
            aria-label={ariaLabel || text}
        >
            {!prefersReducedMotion && (
                <span
                    className="absolute inset-0 inline-flex pointer-events-none"
                    style={{
                        color,
                        opacity: 0.65,
                        filter: \`blur(\${safeBlurStrength}px) contrast(\${safeThreshold * 8}%)\`,
                        mixBlendMode: "screen",
                    }}
                    aria-hidden="true"
                >
                    {chars.map((char, i) => (
                        <span key={\`blur-\${i}\`} className="inline-block">
                            {char === " " ? "\u00A0" : char}
                        </span>
                    ))}
                </span>
            )}

            <span className="relative z-10 inline-flex" style={{ color }}>
                {chars.map((char, i) => (
                    <motion.span
                        key={i}
                        className="inline-block"
                        initial={prefersReducedMotion ? {} : { opacity: 0, scaleX: 0.3, scaleY: 1.8 }}
                        animate={{ opacity: 1, scaleX: 1, scaleY: 1 }}
                        transition={{
                            duration: prefersReducedMotion ? 0 : 0.6,
                            delay: prefersReducedMotion ? 0 : i * safeStagger,
                            ease: [0.22, 1, 0.36, 1],
                        }}
                        style={{
                            textShadow: prefersReducedMotion ? undefined : \`0 0 \${safeBlurStrength * 1.5}px \${color}80\`,
                        }}
                        aria-hidden="true"
                    >
                        {char === " " ? "\u00A0" : char}
                    </motion.span>
                ))}
            </span>
        </span>
    );
};

export default LiquidMercuryText;
`
  },
  "text/magnetic-ink-text": {
    component: dynamic(() => import("@/components/ui/text/magnetic-ink-text").then(mod => mod.MagneticInkText || mod.default)),
    name: "Magnetic Ink Text",
    category: "text",
    slug: "magnetic-ink-text",
    code: `﻿"use client";

/**
 * @component MagneticInkText
 * @description Characters behave like liquid ink. When pointer approaches,
 * characters deform and stretch toward/away from the pointer.
 * Based on per-character physics simulation + ink stretch transforms.
 *
 * @example
 * \`\`\`tsx
 * import { MagneticInkText } from '@/components/text/magnetic-ink-text';
 *
 * <MagneticInkText
 *   text="Fluid Ink"
 *   influenceRadius={120}
 *   className="text-5xl font-black text-white"
 * />
 * \`\`\`
 */

import React, { useRef, useEffect, useCallback } from "react";

interface CharState {
    x: number;
    y: number;
    vx: number;
    vy: number;
    scaleX: number;
    scaleY: number;
}

export interface MagneticInkTextProps {
    /** Text to display */
    text: string;
    /** Pointer influence radius in pixels. Default: 100 */
    influenceRadius?: number;
    /** Maximum character displacement in pixels. Default: 15 */
    maxStretch?: number;
    /** Spring stiffness. Default: 0.08 */
    stiffness?: number;
    /** Damping factor. Default: 0.85 */
    damping?: number;
    /** Additional class names */
    className?: string;
    /** ARIA label override */
    ariaLabel?: string;
}

export const MagneticInkText: React.FC<MagneticInkTextProps> = ({
    text,
    influenceRadius = 100,
    maxStretch = 15,
    stiffness = 0.08,
    damping = 0.85,
    className = "",
    ariaLabel,
}) => {
    const containerRef = useRef<HTMLSpanElement>(null);
    const spanRefs = useRef<(HTMLSpanElement | null)[]>([]);
    const statesRef = useRef<CharState[]>(
        text.split("").map(() => ({ x: 0, y: 0, vx: 0, vy: 0, scaleX: 1, scaleY: 1 }))
    );
    const pointerRef = useRef({ x: -9999, y: -9999 });
    const rafRef = useRef<number>(0);

    // Reset states when text changes
    useEffect(() => {
        statesRef.current = text.split("").map(() => ({
            x: 0, y: 0, vx: 0, vy: 0, scaleX: 1, scaleY: 1,
        }));
    }, [text]);

    const simulate = useCallback(() => {
        const container = containerRef.current;
        if (!container) return;

        const pointer = pointerRef.current;
        let hasMotion = false;

        statesRef.current.forEach((state, i) => {
            const span = spanRefs.current[i];
            if (!span) return;

            const rect = span.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;

            const dx = pointer.x - cx;
            const dy = pointer.y - cy;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < influenceRadius) {
                const force = (1 - dist / influenceRadius) * maxStretch;
                const angle = Math.atan2(dy, dx);
                const targetX = Math.cos(angle) * force;
                const targetY = Math.sin(angle) * force;

                state.vx += (targetX - state.x) * stiffness * 2;
                state.vy += (targetY - state.y) * stiffness * 2;

                // Ink stretch: scale perpendicular to force direction
                const stretchFactor = 1 + (force / maxStretch) * 0.3;
                state.scaleX = 1 + (stretchFactor - 1) * Math.abs(Math.cos(angle));
                state.scaleY = 1 + (stretchFactor - 1) * Math.abs(Math.sin(angle));
            } else {
                state.scaleX += (1 - state.scaleX) * 0.1;
                state.scaleY += (1 - state.scaleY) * 0.1;
            }

            // Spring back
            state.vx += -state.x * stiffness;
            state.vy += -state.y * stiffness;
            state.vx *= damping;
            state.vy *= damping;
            state.x += state.vx;
            state.y += state.vy;

            if (
                Math.abs(state.vx) > 0.01 ||
                Math.abs(state.vy) > 0.01 ||
                Math.abs(state.x) > 0.1 ||
                Math.abs(state.y) > 0.1
            ) {
                hasMotion = true;
            }

            // Direct DOM manipulation — no setState needed
            span.style.transform = \`translate(\${state.x}px, \${state.y}px) scale(\${state.scaleX}, \${state.scaleY})\`;
        });

        if (hasMotion) {
            rafRef.current = requestAnimationFrame(simulate);
        }
    }, [influenceRadius, maxStretch, stiffness, damping]);

    useEffect(() => {
        const handlePointerMove = (e: PointerEvent) => {
            pointerRef.current = { x: e.clientX, y: e.clientY };
            cancelAnimationFrame(rafRef.current);
            rafRef.current = requestAnimationFrame(simulate);
        };

        window.addEventListener("pointermove", handlePointerMove);
        return () => {
            window.removeEventListener("pointermove", handlePointerMove);
            cancelAnimationFrame(rafRef.current);
        };
    }, [simulate]);

    return (
        <span
            ref={containerRef}
            className={\`inline-flex flex-wrap \${className}\`}
            role="text"
            aria-label={ariaLabel || text}
        >
            {text.split("").map((char, i) => (
                <span
                    key={i}
                    ref={(el) => { spanRefs.current[i] = el; }}
                    className="inline-block"
                    style={{ willChange: "transform" }}
                    aria-hidden="true"
                >
                    {char === " " ? "\u00A0" : char}
                </span>
            ))}
        </span>
    );
};

export default MagneticInkText;

`
  },
  "text/neon-flicker-text": {
    component: dynamic(() => import("@/components/ui/text/neon-flicker-text").then(mod => mod.NeonFlickerText || mod.default)),
    name: "Neon Flicker Text",
    category: "text",
    slug: "neon-flicker-text",
    code: `﻿"use client";

/**
 * @component NeonFlickerText
 * @description Broken neon sign effect: characters randomly flicker, dim, and
 * simulate voltage drops with varying brightness and timing.
 * Based on random timing + brightness/opacity manipulation.
 *
 * @example
 * \`\`\`tsx
 * import { NeonFlickerText } from '@/components/text/neon-flicker-text';
 *
 * <NeonFlickerText
 *   text="OPEN 24/7"
 *   color="#ff3366"
 *   flickerIntensity={0.8}
 *   className="text-6xl font-black"
 * />
 * \`\`\`
 */

import React, { useEffect, useRef, useState, useCallback } from "react";

export interface NeonFlickerTextProps {
    /** Text to display */
    text: string;
    /** Neon glow color. Default: "#ff3366" */
    color?: string;
    /** Secondary neon color (for dual-tone). Default: same as color */
    secondaryColor?: string;
    /** Flicker intensity (0–1). Default: 0.7 */
    flickerIntensity?: number;
    /** Base brightness when not flickering (0–1). Default: 0.9 */
    baseBrightness?: number;
    /** Average flickers per second per character. Default: 0.3 */
    flickerRate?: number;
    /** Additional class names */
    className?: string;
    /** ARIA label override */
    ariaLabel?: string;
}

interface CharFlicker {
    brightness: number;
    blur: number;
    isOff: boolean;
}

export const NeonFlickerText: React.FC<NeonFlickerTextProps> = ({
    text,
    color = "#ff3366",
    secondaryColor,
    flickerIntensity = 0.7,
    baseBrightness = 0.9,
    flickerRate = 0.3,
    className = "",
    ariaLabel,
}) => {
    const resolvedSecondary = secondaryColor || color;
    const flickersRef = useRef<CharFlicker[]>(
        text.split("").map(() => ({ brightness: baseBrightness, blur: 0, isOff: false }))
    );
    const [flickers, setFlickers] = useState<CharFlicker[]>(() => [...flickersRef.current]);
    const rafRef = useRef<number>(0);
    const lastTimeRef = useRef(0);
    const nextFlickerRef = useRef<number[]>([]);

    // Store latest props in refs to avoid stale closures
    const propsRef = useRef({ text, flickerIntensity, flickerRate, baseBrightness });
    propsRef.current = { text, flickerIntensity, flickerRate, baseBrightness };

    // Initialize random flicker timings
    useEffect(() => {
        nextFlickerRef.current = text.split("").map(
            () => performance.now() + Math.random() * (2000 / flickerRate)
        );
        flickersRef.current = text.split("").map(() => ({
            brightness: baseBrightness, blur: 0, isOff: false,
        }));
    }, [text, flickerRate, baseBrightness]);

    // Stable animate function — reads from refs, never causes reattach
    const animate = useCallback((now: number) => {
        const { text: txt, flickerIntensity: fi, flickerRate: fr, baseBrightness: bb } = propsRef.current;

        if (now - lastTimeRef.current < 50) {
            rafRef.current = requestAnimationFrame(animate);
            return;
        }
        lastTimeRef.current = now;

        const prev = flickersRef.current;

        const newFlickers: CharFlicker[] = txt.split("").map((char, i) => {
            if (char === " ") return { brightness: 0, blur: 0, isOff: true };

            const nextFlicker = nextFlickerRef.current[i];

            if (now >= nextFlicker) {
                const flickerType = Math.random();
                nextFlickerRef.current[i] = now + 500 + Math.random() * (3000 / fr);

                if (flickerType < 0.15 * fi) {
                    return { brightness: 0, blur: 0, isOff: true };
                } else if (flickerType < 0.4 * fi) {
                    return {
                        brightness: 0.2 + Math.random() * 0.3,
                        blur: 2 + Math.random() * 3,
                        isOff: false,
                    };
                } else if (flickerType < 0.6 * fi) {
                    return {
                        brightness: Math.random() > 0.5 ? bb : 0.1,
                        blur: Math.random() * 4,
                        isOff: false,
                    };
                }
            }

            // Normal state — lerp back to base brightness
            const p = prev[i] || { brightness: bb, blur: 0, isOff: false };
            return {
                brightness: p.brightness + (bb - p.brightness) * 0.1,
                blur: p.blur * 0.9,
                isOff: false,
            };
        });

        flickersRef.current = newFlickers;
        setFlickers(newFlickers);
        rafRef.current = requestAnimationFrame(animate);
    }, []); // Empty deps — stable forever

    useEffect(() => {
        rafRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(rafRef.current);
    }, [animate]);

    return (
        <span
            className={\`inline-flex flex-wrap font-bold \${className}\`}
            role="text"
            aria-label={ariaLabel || text}
        >
            {text.split("").map((char, i) => {
                const f = flickers[i] || { brightness: baseBrightness, blur: 0, isOff: false };
                const glowSize = f.brightness * 20;
                const useSecondary = i % 3 === 0;
                const currentColor = useSecondary ? resolvedSecondary : color;

                return (
                    <span
                        key={i}
                        className="inline-block transition-none"
                        style={{
                            color: f.isOff ? "transparent" : currentColor,
                            opacity: f.isOff ? 0.05 : f.brightness,
                            textShadow: f.isOff
                                ? "none"
                                : [
                                    \`0 0 \${glowSize * 0.5}px \${currentColor}\`,
                                    \`0 0 \${glowSize}px \${currentColor}\`,
                                    \`0 0 \${glowSize * 2}px \${currentColor}40\`,
                                ].join(", "),
                            filter: f.blur > 0 ? \`blur(\${f.blur}px)\` : undefined,
                            willChange: "opacity, text-shadow, filter",
                        }}
                        aria-hidden="true"
                    >
                        {char === " " ? "\u00A0" : char}
                    </span>
                );
            })}
        </span>
    );
};

export default NeonFlickerText;

`
  },
  "text/origami-unfold-text": {
    component: dynamic(() => import("@/components/ui/text/origami-unfold-text").then(mod => mod.OrigamiUnfoldText || mod.default)),
    name: "Origami Unfold Text",
    category: "text",
    slug: "origami-unfold-text",
    code: `"use client";

/**
 * @component OrigamiUnfoldText
 * @description Characters unfold from a folded paper state, each with a different
 * fold axis. Uses CSS perspective + rotateX/Y for a 3D origami effect.
 * Principle: perspective rotateX/Y with staggered unfold per character.
 *
 * @example
 * \`\`\`tsx
 * import { OrigamiUnfoldText } from '@/components/text/origami-unfold-text';
 *
 * <OrigamiUnfoldText
 *   text="Unfold"
 *   foldAngle={90}
 *   className="text-6xl font-black text-white"
 * />
 * \`\`\`
 */

import React from "react";
import { motion, useReducedMotion } from "framer-motion";

export interface OrigamiUnfoldTextProps {
    /** Text to display */
    text: string;
    /** Maximum fold angle in degrees. Default: 90 */
    foldAngle?: number;
    /** Stagger delay per character in seconds. Default: 0.08 */
    stagger?: number;
    /** Unfold duration per character in seconds. Default: 0.6 */
    duration?: number;
    /** Perspective distance in px. Default: 600 */
    perspective?: number;
    /** Additional class names */
    className?: string;
    /** ARIA label override */
    ariaLabel?: string;
}

export const OrigamiUnfoldText: React.FC<OrigamiUnfoldTextProps> = ({
    text,
    foldAngle = 90,
    stagger = 0.08,
    duration = 0.6,
    perspective = 600,
    className = "",
    ariaLabel,
}) => {
    const prefersReducedMotion = useReducedMotion();

    const getFoldAxis = (i: number) => {
        const axes = [
            { rotateX: foldAngle, rotateY: 0 },       // fold from top
            { rotateX: -foldAngle, rotateY: 0 },      // fold from bottom
            { rotateX: 0, rotateY: foldAngle },        // fold from right
            { rotateX: 0, rotateY: -foldAngle },       // fold from left
            { rotateX: foldAngle / 2, rotateY: foldAngle / 2 }, // diagonal
        ];
        return axes[i % axes.length];
    };

    return (
        <span
            className={\`inline-flex flex-wrap \${className}\`}
            style={{ perspective }}
            role="text"
            aria-label={ariaLabel || text}
        >
            {text.split("").map((char, i) => {
                const fold = getFoldAxis(i);

                return (
                    <motion.span
                        key={i}
                        className="inline-block origin-center"
                        style={{ transformStyle: "preserve-3d" }}
                        initial={
                            prefersReducedMotion
                                ? { opacity: 1 }
                                : {
                                    rotateX: fold.rotateX,
                                    rotateY: fold.rotateY,
                                    opacity: 0,
                                    scale: 0.6,
                                }
                        }
                        animate={{
                            rotateX: 0,
                            rotateY: 0,
                            opacity: 1,
                            scale: 1,
                        }}
                        transition={{
                            duration: prefersReducedMotion ? 0 : duration,
                            delay: prefersReducedMotion ? 0 : i * stagger,
                            ease: [0.34, 1.56, 0.64, 1], // bounce easing
                        }}
                        aria-hidden="true"
                    >
                        {char === " " ? "\u00A0" : char}
                    </motion.span>
                );
            })}
        </span>
    );
};

export default OrigamiUnfoldText;
`
  },
  "text/pressure-wave-text": {
    component: dynamic(() => import("@/components/ui/text/pressure-wave-text").then(mod => mod.PressureWaveText || mod.default)),
    name: "Pressure Wave Text",
    category: "text",
    slug: "pressure-wave-text",
    code: `"use client";

/**
 * @component PressureWaveText
 * @description On click, characters are pushed outward by a radial pressure wave
 * like a sound shockwave, then spring back to position.
 * Principle: radial pressure wave + sinusoidal deformation + spring return.
 *
 * @example
 * \`\`\`tsx
 * import { PressureWaveText } from '@/components/text/pressure-wave-text';
 *
 * <PressureWaveText
 *   text="Shockwave"
 *   waveForce={30}
 *   className="text-5xl font-black text-white"
 * />
 * \`\`\`
 */

import React, { useState, useCallback, useRef, useEffect } from "react";
import { useReducedMotion } from "framer-motion";

export interface PressureWaveTextProps {
    /** Text to display */
    text: string;
    /** Maximum displacement in px. Default: 25 */
    waveForce?: number;
    /** Wave speed (px per frame). Default: 8 */
    waveSpeed?: number;
    /** Wave width in px. Default: 60 */
    waveWidth?: number;
    /** Additional class names */
    className?: string;
    /** ARIA label override */
    ariaLabel?: string;
}

export const PressureWaveText: React.FC<PressureWaveTextProps> = ({
    text,
    waveForce = 25,
    waveSpeed = 8,
    waveWidth = 60,
    className = "",
    ariaLabel,
}) => {
    const prefersReducedMotion = useReducedMotion();
    const containerRef = useRef<HTMLSpanElement>(null);
    const spanRefs = useRef<(HTMLSpanElement | null)[]>([]);
    const rafRef = useRef<number>(0);
    const [waveOrigin, setWaveOrigin] = useState<number | null>(null);
    const waveRadiusRef = useRef(0);

    const triggerWave = useCallback((e: React.MouseEvent) => {
        if (prefersReducedMotion) return;
        const container = containerRef.current;
        if (!container) return;
        const rect = container.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        setWaveOrigin(clickX);
        waveRadiusRef.current = 0;
    }, [prefersReducedMotion]);

    useEffect(() => {
        if (waveOrigin === null || prefersReducedMotion) return;

        const animate = () => {
            waveRadiusRef.current += waveSpeed;
            const r = waveRadiusRef.current;
            let active = false;

            spanRefs.current.forEach((span) => {
                if (!span) return;
                const rect = span.getBoundingClientRect();
                const containerRect = containerRef.current?.getBoundingClientRect();
                if (!containerRect) return;

                const charCenterX = rect.left - containerRect.left + rect.width / 2;
                const dist = Math.abs(charCenterX - waveOrigin);
                const inWave = dist > r - waveWidth && dist < r + waveWidth;

                if (inWave) {
                    const wavePos = 1 - Math.abs(dist - r) / waveWidth;
                    const displacement = Math.sin(wavePos * Math.PI) * waveForce;
                    const direction = charCenterX > waveOrigin ? 1 : -1;
                    span.style.transform = \`translateX(\${direction * displacement * 0.3}px) translateY(\${-displacement}px)\`;
                    active = true;
                } else if (dist < r - waveWidth) {
                    // Spring back
                    const current = span.style.transform;
                    if (current && current !== "none") {
                        span.style.transition = "transform 0.4s cubic-bezier(0.34,1.56,0.64,1)";
                        span.style.transform = "translateX(0) translateY(0)";
                    }
                } else {
                    active = true;
                }
            });

            if (active) {
                rafRef.current = requestAnimationFrame(animate);
            } else {
                setWaveOrigin(null);
            }
        };

        rafRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(rafRef.current);
    }, [waveOrigin, waveForce, waveSpeed, waveWidth, prefersReducedMotion]);

    return (
        <span
            ref={containerRef}
            className={\`inline-flex flex-wrap cursor-pointer select-none \${className}\`}
            role="text"
            aria-label={ariaLabel || text}
            onClick={triggerWave}
        >
            {text.split("").map((char, i) => (
                <span
                    key={i}
                    ref={(el) => { spanRefs.current[i] = el; }}
                    className="inline-block will-change-transform"
                    aria-hidden="true"
                >
                    {char === " " ? "\u00A0" : char}
                </span>
            ))}
        </span>
    );
};

export default PressureWaveText;
`
  },
  "text/refraction-text": {
    component: dynamic(() => import("@/components/ui/text/refraction-text").then(mod => mod.RefractionText || mod.default)),
    name: "Refraction Text",
    category: "text",
    slug: "refraction-text",
    code: `﻿"use client";

/**
 * @component RefractionText
 * @description On hover, a refractive layer passes through the text, creating
 * chromatic aberration / color-split at character edges.
 * Based on CSS filter + gradient overlay + chromatic aberration.
 *
 * @example
 * \`\`\`tsx
 * import { RefractionText } from '@/components/text/refraction-text';
 *
 * <RefractionText
 *   text="Prismatic"
 *   aberrationOffset={3}
 *   className="text-6xl font-black text-white"
 * />
 * \`\`\`
 */

import React, { useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";

export interface RefractionTextProps {
    /** Text to display */
    text: string;
    /** Chromatic aberration offset in pixels. Default: 3 */
    aberrationOffset?: number;
    /** Width of the refractive lens in percentage. Default: 30 */
    lensWidth?: number;
    /** Speed of lens sweep (duration in seconds). Default: 0.8 */
    sweepSpeed?: number;
    /** Left channel color. Default: "#ff0050" */
    leftColor?: string;
    /** Right channel color. Default: "#00d4ff" */
    rightColor?: string;
    /** Additional class names */
    className?: string;
    /** ARIA label override */
    ariaLabel?: string;
}

export const RefractionText: React.FC<RefractionTextProps> = ({
    text,
    aberrationOffset = 3,
    lensWidth = 30,
    sweepSpeed = 0.8,
    leftColor = "#ff0050",
    rightColor = "#00d4ff",
    className = "",
    ariaLabel,
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false);
    const [pointerX, setPointerX] = useState(0.5);

    const handlePointerMove = useCallback((e: React.PointerEvent) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        setPointerX(x);
    }, []);

    return (
        <div
            ref={containerRef}
            className={\`relative inline-block cursor-default select-none \${className}\`}
            role="text"
            aria-label={ariaLabel || text}
            onPointerEnter={() => setIsHovered(true)}
            onPointerLeave={() => setIsHovered(false)}
            onPointerMove={handlePointerMove}
        >
            {/* Red channel (left shift) */}
            <motion.span
                className="absolute inset-0 pointer-events-none"
                style={{
                    color: leftColor,
                    mixBlendMode: "screen",
                }}
                animate={{
                    x: isHovered ? -aberrationOffset : 0,
                    opacity: isHovered ? 0.7 : 0,
                }}
                transition={{ duration: 0.15 }}
                aria-hidden="true"
            >
                {text}
            </motion.span>

            {/* Blue channel (right shift) */}
            <motion.span
                className="absolute inset-0 pointer-events-none"
                style={{
                    color: rightColor,
                    mixBlendMode: "screen",
                }}
                animate={{
                    x: isHovered ? aberrationOffset : 0,
                    opacity: isHovered ? 0.7 : 0,
                }}
                transition={{ duration: 0.15 }}
                aria-hidden="true"
            >
                {text}
            </motion.span>

            {/* Refractive lens band */}
            <motion.div
                className="absolute inset-0 pointer-events-none overflow-hidden"
                aria-hidden="true"
            >
                <motion.div
                    className="absolute top-0 bottom-0"
                    style={{
                        width: \`\${lensWidth}%\`,
                        background: \`linear-gradient(90deg, 
              transparent, 
              rgba(255,255,255,0.06) 30%, 
              rgba(255,255,255,0.12) 50%, 
              rgba(255,255,255,0.06) 70%, 
              transparent)\`,
                        backdropFilter: isHovered ? "blur(0.5px) saturate(1.5)" : "none",
                    }}
                    animate={{
                        left: isHovered ? \`\${pointerX * 100 - lensWidth / 2}%\` : "-30%",
                    }}
                    transition={{ duration: 0.05 }}
                />
            </motion.div>

            {/* Sweep animation on hover entry */}
            {isHovered && (
                <motion.div
                    className="absolute inset-0 pointer-events-none overflow-hidden"
                    aria-hidden="true"
                >
                    <motion.div
                        className="absolute top-0 bottom-0"
                        style={{
                            width: "8%",
                            background: \`linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)\`,
                        }}
                        initial={{ left: "-10%" }}
                        animate={{ left: "110%" }}
                        transition={{ duration: sweepSpeed, ease: "easeInOut" }}
                    />
                </motion.div>
            )}

            {/* Main text */}
            <motion.span
                className="relative z-10"
                animate={{
                    textShadow: isHovered
                        ? \`\${-aberrationOffset * 0.5}px 0 \${leftColor}30, \${aberrationOffset * 0.5}px 0 \${rightColor}30\`
                        : "none",
                }}
                transition={{ duration: 0.2 }}
            >
                {text}
            </motion.span>
        </div>
    );
};

export default RefractionText;

`
  },
  "text/scramble-text": {
    component: dynamic(() => import("@/components/ui/text/scramble-text").then(mod => mod.ScrambleText || mod.default)),
    name: "Scramble Text",
    category: "text",
    slug: "scramble-text",
    code: `﻿"use client";

/**
 * @component ScrambleText
 * @description Characters appear scrambled with random glyphs, then resolve to
 * the correct sequence one by one. Based on random character substitution + sequential resolve.
 *
 * @example
 * \`\`\`tsx
 * import { ScrambleText } from '@/components/text/scramble-text';
 *
 * <ScrambleText
 *   text="Hello World"
 *   triggerOn="mount"
 *   speed={50}
 *   className="text-4xl font-bold text-white"
 * />
 * \`\`\`
 */

import React, { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const DEFAULT_CHARSET =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#\$%^&*";

export interface ScrambleTextProps {
    /** The final text to display */
    text: string;
    /** Trigger mode: mount, hover, click, or inView */
    triggerOn?: "mount" | "hover" | "click" | "inView";
    /** Ms between each character lock. Default: 50 */
    speed?: number;
    /** Number of scramble cycles per character before lock. Default: 6 */
    scrambleCycles?: number;
    /** Custom character set for scrambling */
    charset?: string;
    /** Additional class names */
    className?: string;
    /** ARIA label override */
    ariaLabel?: string;
    /** Callback when animation completes */
    onComplete?: () => void;
}

export const ScrambleText: React.FC<ScrambleTextProps> = ({
    text,
    triggerOn = "mount",
    speed = 50,
    scrambleCycles = 6,
    charset = DEFAULT_CHARSET,
    className = "",
    ariaLabel,
    onComplete,
}) => {
    const [displayed, setDisplayed] = useState<string[]>(() =>
        Array.from({ length: text.length }, () =>
            charset[Math.floor(Math.random() * charset.length)]
        )
    );
    const [lockedCount, setLockedCount] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const intervalRef = useRef<ReturnType<typeof setInterval>>();
    const cycleRef = useRef(0);
    const containerRef = useRef<HTMLSpanElement>(null);

    const startScramble = useCallback(() => {
        if (isAnimating) return;
        setIsAnimating(true);
        setLockedCount(0);
        cycleRef.current = 0;

        let locked = 0;
        let cycle = 0;

        intervalRef.current = setInterval(() => {
            cycle++;

            setDisplayed((prev) =>
                prev.map((ch, i) => {
                    if (i < locked) return text[i];
                    return charset[Math.floor(Math.random() * charset.length)];
                })
            );

            if (cycle % scrambleCycles === 0 && locked < text.length) {
                locked++;
                setLockedCount(locked);
            }

            if (locked >= text.length) {
                clearInterval(intervalRef.current);
                setDisplayed(text.split(""));
                setIsAnimating(false);
                onComplete?.();
            }
        }, speed);
    }, [text, speed, scrambleCycles, charset, isAnimating, onComplete]);

    // Mount trigger
    useEffect(() => {
        if (triggerOn === "mount") startScramble();
        return () => clearInterval(intervalRef.current);
    }, [triggerOn, startScramble]);

    // InView trigger
    useEffect(() => {
        if (triggerOn !== "inView" || !containerRef.current) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) startScramble();
            },
            { threshold: 0.5 }
        );

        observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, [triggerOn, startScramble]);

    const handlers =
        triggerOn === "hover"
            ? { onMouseEnter: startScramble }
            : triggerOn === "click"
                ? { onClick: startScramble }
                : {};

    return (
        <span
            ref={containerRef}
            className={\`inline-flex font-mono \${className}\`}
            role="text"
            aria-label={ariaLabel || text}
            {...handlers}
        >
            <AnimatePresence mode="popLayout">
                {displayed.map((char, i) => (
                    <motion.span
                        key={\`\${i}-\${lockedCount > i ? "locked" : "scramble"}\`}
                        initial={{ opacity: 0.4 }}
                        animate={{
                            opacity: i < lockedCount ? 1 : 0.6,
                            color: i < lockedCount ? undefined : "inherit",
                        }}
                        transition={{ duration: 0.1 }}
                        className={i < lockedCount ? "text-current" : "text-current/60"}
                        aria-hidden="true"
                    >
                        {char === " " ? "\u00A0" : char}
                    </motion.span>
                ))}
            </AnimatePresence>
        </span>
    );
};

export default ScrambleText;

`
  },
  "text/semantic-drift-text": {
    component: dynamic(() => import("@/components/ui/text/semantic-drift-text").then(mod => mod.SemanticDriftText || mod.default)),
    name: "Semantic Drift Text",
    category: "text",
    slug: "semantic-drift-text",
    code: `﻿"use client";

/**
 * @component SemanticDriftText
 * @description Words drift through similar-looking alternative glyphs before snapping
 * to their final form. Creates a "semantic search" visual metaphor.
 * Based on glyph interpolation + opacity overlay blending.
 *
 * @example
 * \`\`\`tsx
 * import { SemanticDriftText } from '@/components/text/semantic-drift-text';
 *
 * <SemanticDriftText
 *   text="Neural Network"
 *   driftDuration={1.5}
 *   className="text-5xl font-semibold text-white"
 * />
 * \`\`\`
 */

import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion, useInView } from "framer-motion";

// Similar-looking glyph substitution map
const GLYPH_MAP: Record<string, string[]> = {
    A: ["Λ", "Δ", "Å", "Â"],
    B: ["ß", "Ɓ", "β", "8"],
    C: ["Ç", "©", "¢", "("],
    D: ["Đ", "Ð", "ð", "Ɗ"],
    E: ["Ξ", "€", "Ɛ", "Ə"],
    F: ["Ƒ", "ƒ", "₣", "Ŧ"],
    G: ["Ğ", "Ǥ", "Ɠ", "6"],
    H: ["Ħ", "Ƕ", "#", "Ⱨ"],
    I: ["Ɨ", "Ï", "¡", "1"],
    J: ["Ĵ", "ĵ", "Ɉ", "ʝ"],
    K: ["Ƙ", "Ⱪ", "ĸ", "Ķ"],
    L: ["Ƚ", "Ŀ", "£", "Ĺ"],
    M: ["Ɯ", "Ϻ", "Ⱬ", "Ṁ"],
    N: ["Ñ", "Ŋ", "Ƞ", "Ɲ"],
    O: ["Ø", "Θ", "Ɵ", "0"],
    P: ["Ƥ", "Ᵽ", "Þ", "ρ"],
    Q: ["Ɋ", "Ǭ", "ϙ", "9"],
    R: ["Ʀ", "Ɍ", "Ɽ", "Ŗ"],
    S: ["§", "\$", "Ŝ", "Ș"],
    T: ["Ŧ", "Ƭ", "†", "Ⱦ"],
    U: ["Ʉ", "Ü", "Ụ", "Ʊ"],
    V: ["Ʋ", "Ṿ", "√", "Ṽ"],
    W: ["Ⱳ", "Ẅ", "Ẃ", "Ŵ"],
    X: ["Ẍ", "×", "Ẋ", "Ⱶ"],
    Y: ["Ɣ", "Ƴ", "¥", "Ÿ"],
    Z: ["Ƶ", "Ẑ", "Ⱬ", "Ż"],
};

function getAlternateGlyphs(char: string): string[] {
    const upper = char.toUpperCase();
    return GLYPH_MAP[upper] || [char];
}

export interface SemanticDriftTextProps {
    /** Text to display */
    text: string;
    /** Duration of drift animation per character in seconds. Default: 1.5 */
    driftDuration?: number;
    /** Stagger delay between characters in seconds. Default: 0.06 */
    stagger?: number;
    /** Number of glyph transitions. Default: 3 */
    driftSteps?: number;
    /** Trigger: mount or inView. Default: "mount" */
    triggerOn?: "mount" | "inView";
    /** Additional class names */
    className?: string;
    /** ARIA label override */
    ariaLabel?: string;
    /** Callback when animation completes */
    onComplete?: () => void;
}

export const SemanticDriftText: React.FC<SemanticDriftTextProps> = ({
    text,
    driftDuration = 1.5,
    stagger = 0.06,
    driftSteps = 3,
    triggerOn = "mount",
    className = "",
    ariaLabel,
    onComplete,
}) => {
    const containerRef = useRef<HTMLSpanElement>(null);
    const isInView = useInView(containerRef, { once: true, amount: 0.5 });
    const [charStates, setCharStates] = useState<
        { current: string; final: string; opacity: number; settled: boolean }[]
    >([]);
    const rafRef = useRef<number>(0);
    const startTimeRef = useRef(0);

    const shouldAnimate = triggerOn === "mount" || isInView;

    const initStates = useCallback(() => {
        return text.split("").map((ch) => ({
            current: ch === " " ? " " : getAlternateGlyphs(ch)[0] || ch,
            final: ch,
            opacity: 0,
            settled: ch === " ",
        }));
    }, [text]);

    const animate = useCallback(() => {
        const elapsed = (performance.now() - startTimeRef.current) / 1000;
        let allDone = true;

        const newStates = text.split("").map((ch, i) => {
            if (ch === " ") return { current: " ", final: ch, opacity: 1, settled: true };

            const charStart = i * stagger;
            const charElapsed = elapsed - charStart;

            if (charElapsed < 0) {
                allDone = false;
                return { current: getAlternateGlyphs(ch)[0] || ch, final: ch, opacity: 0, settled: false };
            }

            const progress = Math.min(1, charElapsed / driftDuration);
            const glyphs = getAlternateGlyphs(ch);

            if (progress >= 1) {
                return { current: ch, final: ch, opacity: 1, settled: true };
            }

            allDone = false;
            const stepIdx = Math.min(
                driftSteps - 1,
                Math.floor(progress * driftSteps)
            );

            const currentGlyph =
                stepIdx < glyphs.length ? glyphs[stepIdx] : ch;
            const opacity = 0.3 + progress * 0.7;

            return { current: progress > 0.85 ? ch : currentGlyph, final: ch, opacity, settled: false };
        });

        setCharStates(newStates);

        if (allDone) {
            onComplete?.();
        } else {
            rafRef.current = requestAnimationFrame(animate);
        }
    }, [text, stagger, driftDuration, driftSteps, onComplete]);

    useEffect(() => {
        if (!shouldAnimate) {
            setCharStates(initStates());
            return;
        }

        setCharStates(initStates());
        startTimeRef.current = performance.now();
        rafRef.current = requestAnimationFrame(animate);

        return () => cancelAnimationFrame(rafRef.current);
    }, [shouldAnimate, animate, initStates]);

    return (
        <span
            ref={containerRef}
            className={\`inline-flex flex-wrap \${className}\`}
            role="text"
            aria-label={ariaLabel || text}
        >
            {charStates.map((state, i) => (
                <motion.span
                    key={i}
                    className="inline-block"
                    animate={{
                        opacity: state.opacity,
                        y: state.settled ? 0 : (1 - state.opacity) * -4,
                    }}
                    transition={{ duration: 0.1 }}
                    aria-hidden="true"
                >
                    {state.current === " " ? "\u00A0" : state.current}
                </motion.span>
            ))}
        </span>
    );
};

export default SemanticDriftText;

`
  },
  "text/shatter-text": {
    component: dynamic(() => import("@/components/ui/text/shatter-text").then(mod => mod.ShatterText || mod.default)),
    name: "Shatter Text",
    category: "text",
    slug: "shatter-text",
    code: `﻿"use client";

/**
 * @component ShatterText
 * @description Text shatters like glass into 3D space, fragments scatter and then
 * reassemble with a subtle flash at the moment of reunion.
 * Based on SVG path fragmentation + staggered 3D transforms.
 *
 * @example
 * \`\`\`tsx
 * import { ShatterText } from '@/components/text/shatter-text';
 *
 * <ShatterText
 *   text="Break Free"
 *   triggerOn="click"
 *   shatterIntensity={1.5}
 *   className="text-6xl font-black text-white"
 * />
 * \`\`\`
 */

import React, { useState, useCallback, useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";


export interface ShatterTextProps {
    /** Text to display */
    text: string;
    /** Trigger: mount, click, hover, inView. Default: "mount" */
    triggerOn?: "mount" | "click" | "hover" | "inView";
    /** Scatter intensity multiplier. Default: 1 */
    shatterIntensity?: number;
    /** Animation duration in seconds. Default: 1.8 */
    duration?: number;
    /** Flash color on reassembly. Default: "#ffffff" */
    flashColor?: string;
    /** Additional class names */
    className?: string;
    /** ARIA label override */
    ariaLabel?: string;
    /** Callback on animation complete */
    onComplete?: () => void;
}

interface ShardState {
    char: string;
    x: number;
    y: number;
    rotateX: number;
    rotateY: number;
    rotateZ: number;
    scale: number;
    opacity: number;
}

export const ShatterText: React.FC<ShatterTextProps> = ({
    text,
    triggerOn = "mount",
    shatterIntensity = 1,
    duration = 1.8,
    flashColor = "#ffffff",
    className = "",
    ariaLabel,
    onComplete,
}) => {
    const containerRef = useRef<HTMLSpanElement>(null);
    const isInView = useInView(containerRef, { once: true, amount: 0.5 });
    const [phase, setPhase] = useState<"idle" | "shattered" | "assembling" | "done">("idle");
    const [showFlash, setShowFlash] = useState(false);
    const timerRefs = useRef<ReturnType<typeof setTimeout>[]>([]);

    const generateShards = useCallback((): ShardState[] => {
        return text.split("").map((char) => ({
            char,
            x: (Math.random() - 0.5) * 200 * shatterIntensity,
            y: (Math.random() - 0.5) * 200 * shatterIntensity,
            rotateX: (Math.random() - 0.5) * 360 * shatterIntensity,
            rotateY: (Math.random() - 0.5) * 360 * shatterIntensity,
            rotateZ: (Math.random() - 0.5) * 180 * shatterIntensity,
            scale: 0.3 + Math.random() * 0.7,
            opacity: 0.2 + Math.random() * 0.5,
        }));
    }, [text, shatterIntensity]);

    const [shards] = useState<ShardState[]>(generateShards);

    const triggerAnimation = useCallback(() => {
        // Clear previous timers
        timerRefs.current.forEach(clearTimeout);
        timerRefs.current = [];

        setPhase("shattered");
        timerRefs.current.push(setTimeout(() => setPhase("assembling"), duration * 400));
        timerRefs.current.push(setTimeout(() => {
            setShowFlash(true);
            setPhase("done");
            timerRefs.current.push(setTimeout(() => setShowFlash(false), 200));
            onComplete?.();
        }, duration * 900));
    }, [duration, onComplete]);

    useEffect(() => {
        if (triggerOn === "mount") triggerAnimation();
        return () => { timerRefs.current.forEach(clearTimeout); };
    }, [triggerOn, triggerAnimation]);

    useEffect(() => {
        if (triggerOn === "inView" && isInView) triggerAnimation();
    }, [triggerOn, isInView, triggerAnimation]);

    const handlers =
        triggerOn === "hover"
            ? { onMouseEnter: triggerAnimation }
            : triggerOn === "click"
                ? { onClick: triggerAnimation }
                : {};

    return (
        <span
            ref={containerRef}
            className={\`relative inline-flex \${className}\`}
            role="text"
            aria-label={ariaLabel || text}
            style={{ perspective: "800px" }}
            {...handlers}
        >
            {text.split("").map((char, i) => {
                const shard = shards[i];
                const isShattered = phase === "shattered";

                return (
                    <motion.span
                        key={i}
                        className="inline-block"
                        style={{ transformStyle: "preserve-3d" }}
                        animate={{
                            x: isShattered ? shard.x : 0,
                            y: isShattered ? shard.y : 0,
                            rotateX: isShattered ? shard.rotateX : 0,
                            rotateY: isShattered ? shard.rotateY : 0,
                            rotateZ: isShattered ? shard.rotateZ : 0,
                            scale: isShattered ? shard.scale : 1,
                            opacity: isShattered ? shard.opacity : 1,
                        }}
                        transition={{
                            type: "spring",
                            stiffness: 80,
                            damping: 12,
                            delay: isShattered ? i * 0.02 : (text.length - i) * 0.02,
                        }}
                        aria-hidden="true"
                    >
                        {char === " " ? "\u00A0" : char}
                    </motion.span>
                );
            })}

            {/* Reassembly flash */}
            {showFlash && (
                <motion.span
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        background: \`radial-gradient(ellipse, \${flashColor}40 0%, transparent 70%)\`,
                    }}
                    initial={{ opacity: 1 }}
                    animate={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    aria-hidden="true"
                />
            )}
        </span>
    );
};

export default ShatterText;

`
  },
  "text/signal-noise-text": {
    component: dynamic(() => import("@/components/ui/text/signal-noise-text").then(mod => mod.SignalNoiseText || mod.default)),
    name: "Signal Noise Text",
    category: "text",
    slug: "signal-noise-text",
    code: `"use client";

/**
 * @component SignalNoiseText
 * @description Text appears like a signal received through a noisy channel —
 * characters jitter in position, opacity, and scramble, then SNR improves until clean.
 * Principle: position/opacity noise amplitude decay (signal-to-noise ratio increase).
 *
 * @example
 * \`\`\`tsx
 * import { SignalNoiseText } from '@/components/text/signal-noise-text';
 *
 * <SignalNoiseText
 *   text="Receiving..."
 *   noiseDuration={2000}
 *   className="text-4xl font-mono text-green-400"
 * />
 * \`\`\`
 */

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useReducedMotion } from "framer-motion";

export interface SignalNoiseTextProps {
    /** Text to display */
    text: string;
    /** Duration of noise-to-clear transition in ms. Default: 2000 */
    noiseDuration?: number;
    /** Maximum position noise in px. Default: 6 */
    maxNoise?: number;
    /** Noise scramble characters. Default: "!@#\$%^&*░▒▓" */
    noiseChars?: string;
    /** Additional class names */
    className?: string;
    /** ARIA label override */
    ariaLabel?: string;
}

interface CharState {
    char: string;
    x: number;
    y: number;
    opacity: number;
}

export const SignalNoiseText: React.FC<SignalNoiseTextProps> = ({
    text,
    noiseDuration = 2000,
    maxNoise = 6,
    noiseChars = "!@#\$%^&*░▒▓",
    className = "",
    ariaLabel,
}) => {
    const prefersReducedMotion = useReducedMotion();
    const [chars, setChars] = useState<CharState[]>([]);
    const rafRef = useRef<number>(0);
    const startRef = useRef(0);

    const animate = useCallback(() => {
        const elapsed = performance.now() - startRef.current;
        const progress = Math.min(1, elapsed / noiseDuration);
        const snr = progress; // 0 → 1 (noise → clean)

        const newChars: CharState[] = text.split("").map((realChar) => {
            const noiseAmp = (1 - snr) * maxNoise;
            const showReal = Math.random() < snr;

            return {
                char: showReal || realChar === " "
                    ? (realChar === " " ? "\u00A0" : realChar)
                    : noiseChars[Math.floor(Math.random() * noiseChars.length)],
                x: (Math.random() - 0.5) * 2 * noiseAmp,
                y: (Math.random() - 0.5) * 2 * noiseAmp,
                opacity: 0.3 + snr * 0.7,
            };
        });

        setChars(newChars);

        if (progress < 1) {
            rafRef.current = requestAnimationFrame(animate);
        } else {
            // Final clean state
            setChars(text.split("").map((c) => ({
                char: c === " " ? "\u00A0" : c,
                x: 0, y: 0, opacity: 1,
            })));
        }
    }, [text, noiseDuration, maxNoise, noiseChars]);

    useEffect(() => {
        if (prefersReducedMotion) {
            setChars(text.split("").map((c) => ({
                char: c === " " ? "\u00A0" : c,
                x: 0, y: 0, opacity: 1,
            })));
            return;
        }

        startRef.current = performance.now();
        rafRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(rafRef.current);
    }, [text, animate, prefersReducedMotion]);

    return (
        <span
            className={\`inline-flex flex-wrap \${className}\`}
            role="text"
            aria-label={ariaLabel || text}
        >
            {chars.map((state, i) => (
                <span
                    key={i}
                    className="inline-block will-change-transform"
                    style={{
                        transform: \`translate(\${state.x}px, \${state.y}px)\`,
                        opacity: state.opacity,
                        transition: "none",
                    }}
                    aria-hidden="true"
                >
                    {state.char}
                </span>
            ))}
        </span>
    );
};

export default SignalNoiseText;
`
  },
  "text/sonar-ping-text": {
    component: dynamic(() => import("@/components/ui/text/sonar-ping-text").then(mod => mod.SonarPingText || mod.default)),
    name: "Sonar Ping Text",
    category: "text",
    slug: "sonar-ping-text",
    code: `﻿"use client";

/**
 * @component SonarPingText
 * @description Text starts invisible. A periodic wave sweeps left to right,
 * illuminating touched characters with a phosphorescent glow that fades.
 * Based on position-based triggering + wave propagation.
 *
 * @example
 * \`\`\`tsx
 * import { SonarPingText } from '@/components/text/sonar-ping-text';
 *
 * <SonarPingText
 *   text="Detect Signal"
 *   interval={3000}
 *   waveSpeed={0.02}
 *   glowColor="#22d3ee"
 *   className="text-5xl font-bold"
 * />
 * \`\`\`
 */

import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";

export interface SonarPingTextProps {
    /** Text to display */
    text: string;
    /** Interval between sonar pings in ms. Default: 3000 */
    interval?: number;
    /** Wave speed (0–1 per frame). Default: 0.02 */
    waveSpeed?: number;
    /** Width of the wave front (0–1). Default: 0.15 */
    waveWidth?: number;
    /** Glow color for illuminated characters. Default: "#22d3ee" */
    glowColor?: string;
    /** Base text color when not illuminated. Default: "rgba(255,255,255,0.08)" */
    baseColor?: string;
    /** Additional class names */
    className?: string;
    /** ARIA label override */
    ariaLabel?: string;
}

export const SonarPingText: React.FC<SonarPingTextProps> = ({
    text,
    interval = 3000,
    waveSpeed = 0.02,
    waveWidth = 0.15,
    glowColor = "#22d3ee",
    baseColor = "rgba(255,255,255,0.08)",
    className = "",
    ariaLabel,
}) => {
    const [charIntensities, setCharIntensities] = useState<number[]>(
        () => new Array(text.length).fill(0)
    );
    const wavePositionRef = useRef(-0.2);
    const rafRef = useRef<number>(0);
    const intervalRef = useRef<ReturnType<typeof setInterval>>();

    const animateWave = useCallback(() => {
        wavePositionRef.current += waveSpeed;

        if (wavePositionRef.current > 1.3) {
            cancelAnimationFrame(rafRef.current);
            return;
        }

        const pos = wavePositionRef.current;
        const intensities = Array.from({ length: text.length }, (_, i) => {
            const charPos = text.length > 1 ? i / (text.length - 1) : 0.5;
            const dist = Math.abs(charPos - pos);
            if (dist < waveWidth) {
                return 1 - dist / waveWidth;
            }
            return 0;
        });

        setCharIntensities(intensities);
        rafRef.current = requestAnimationFrame(animateWave);
    }, [text.length, waveSpeed, waveWidth]);

    const startPing = useCallback(() => {
        wavePositionRef.current = -0.2;
        cancelAnimationFrame(rafRef.current);
        rafRef.current = requestAnimationFrame(animateWave);
    }, [animateWave]);

    useEffect(() => {
        startPing();
        intervalRef.current = setInterval(startPing, interval);

        return () => {
            clearInterval(intervalRef.current);
            cancelAnimationFrame(rafRef.current);
        };
    }, [interval, startPing]);

    return (
        <span
            className={\`inline-flex flex-wrap \${className}\`}
            role="text"
            aria-label={ariaLabel || text}
        >
            {text.split("").map((char, i) => {
                const intensity = charIntensities[i] || 0;
                return (
                    <motion.span
                        key={i}
                        animate={{
                            color:
                                intensity > 0.1
                                    ? glowColor
                                    : baseColor,
                            textShadow:
                                intensity > 0.1
                                    ? \`0 0 \${8 + intensity * 20}px \${glowColor}, 0 0 \${intensity * 40}px \${glowColor}\`
                                    : "none",
                            scale: 1 + intensity * 0.08,
                        }}
                        transition={{ duration: 0.05 }}
                        aria-hidden="true"
                        style={{ display: "inline-block" }}
                    >
                        {char === " " ? "\u00A0" : char}
                    </motion.span>
                );
            })}
        </span>
    );
};

export default SonarPingText;

`
  },
  "text/thermal-scan-text": {
    component: dynamic(() => import("@/components/ui/text/thermal-scan-text").then(mod => mod.ThermalScanText || mod.default)),
    name: "Thermal Scan Text",
    category: "text",
    slug: "thermal-scan-text",
    code: `"use client";

/**
 * @component ThermalScanText
 * @description Characters emerge with thermal camera color mapping —
 * starting hot (white/yellow), cooling through red/blue to final color.
 * Principle: position-staggered temperature color gradient + decay curve.
 *
 * @example
 * \`\`\`tsx
 * import { ThermalScanText } from '@/components/text/thermal-scan-text';
 *
 * <ThermalScanText
 *   text="Scanning..."
 *   scanSpeed={0.08}
 *   className="text-5xl font-black"
 * />
 * \`\`\`
 */

import React, { useState, useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";

export interface ThermalScanTextProps {
    /** Text to display */
    text: string;
    /** Time between character scans in seconds. Default: 0.08 */
    scanSpeed?: number;
    /** Cooling duration per character in seconds. Default: 1.2 */
    coolDuration?: number;
    /** Final text color after cooling. Default: "#e2e8f0" */
    finalColor?: string;
    /** Additional class names */
    className?: string;
    /** ARIA label override */
    ariaLabel?: string;
}

const THERMAL_GRADIENT = [
    "#ffffff",  // hottest
    "#fef08a",  // yellow
    "#fb923c",  // orange
    "#ef4444",  // red
    "#7c3aed",  // violet
    "#3b82f6",  // blue
    "#06b6d4",  // cyan
];

export const ThermalScanText: React.FC<ThermalScanTextProps> = ({
    text,
    scanSpeed = 0.08,
    coolDuration = 1.2,
    finalColor = "#e2e8f0",
    className = "",
    ariaLabel,
}) => {
    const prefersReducedMotion = useReducedMotion();
    const [scanIndex, setScanIndex] = useState(-1);
    const timerRef = useRef<ReturnType<typeof setTimeout>>();

    useEffect(() => {
        if (prefersReducedMotion) {
            setScanIndex(text.length);
            return;
        }
        setScanIndex(-1);
        let i = -1;
        const tick = () => {
            i++;
            setScanIndex(i);
            if (i < text.length) {
                timerRef.current = setTimeout(tick, scanSpeed * 1000);
            }
        };
        timerRef.current = setTimeout(tick, 300);
        return () => clearTimeout(timerRef.current);
    }, [text, scanSpeed, prefersReducedMotion]);

    return (
        <span
            className={\`inline-block \${className}\`}
            role="text"
            aria-label={ariaLabel || text}
        >
            {text.split("").map((char, i) => {
                const isScanned = i <= scanIndex;
                const thermalAge = scanIndex - i; // How many ticks since scanned

                return (
                    <motion.span
                        key={i}
                        className="inline-block"
                        initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0 }}
                        animate={
                            isScanned
                                ? {
                                    opacity: 1,
                                    color: finalColor,
                                    textShadow: thermalAge < 3 && !prefersReducedMotion
                                        ? \`0 0 12px \${THERMAL_GRADIENT[Math.min(thermalAge, THERMAL_GRADIENT.length - 1)]}\`
                                        : "none",
                                }
                                : { opacity: 0.1 }
                        }
                        transition={{
                            duration: prefersReducedMotion ? 0 : coolDuration,
                            color: { duration: prefersReducedMotion ? 0 : coolDuration, ease: "easeOut" },
                            textShadow: { duration: prefersReducedMotion ? 0 : coolDuration * 0.6 },
                        }}
                        style={{
                            color: isScanned && thermalAge < THERMAL_GRADIENT.length && !prefersReducedMotion
                                ? THERMAL_GRADIENT[thermalAge]
                                : undefined,
                        }}
                        aria-hidden="true"
                    >
                        {char === " " ? "\u00A0" : char}
                    </motion.span>
                );
            })}
        </span>
    );
};

export default ThermalScanText;
`
  },
  "text/vapor-trail-text": {
    component: dynamic(() => import("@/components/ui/text/vapor-trail-text").then(mod => mod.VaporTrailText || mod.default)),
    name: "Vapor Trail Text",
    category: "text",
    slug: "vapor-trail-text",
    code: `"use client";

/**
 * @component VaporTrailText
 * @description Letters leave short-lived vapor trails as they appear,
 * simulating heat-distortion condensation behind moving characters.
 * Principle: trail opacity decay + gaussian blur dissipation.
 *
 * @example
 * \`\`\`tsx
 * import { VaporTrailText } from '@/components/text/vapor-trail-text';
 *
 * <VaporTrailText
 *   text="Vanishing"
 *   trailLength={4}
 *   className="text-5xl font-black text-white"
 * />
 * \`\`\`
 */

import React, { useState, useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";

export interface VaporTrailTextProps {
    /** Text to display */
    text: string;
    /** Trail length (number of fading copies). Default: 3 */
    trailLength?: number;
    /** Time between each character reveal in ms. Default: 60 */
    charDelay?: number;
    /** Trail fade duration in ms. Default: 800 */
    trailDuration?: number;
    /** Blur amount for trails in px. Default: 4 */
    trailBlur?: number;
    /** Additional class names */
    className?: string;
    /** ARIA label override */
    ariaLabel?: string;
}

export const VaporTrailText: React.FC<VaporTrailTextProps> = ({
    text,
    trailLength = 3,
    charDelay = 60,
    trailDuration = 800,
    trailBlur = 4,
    className = "",
    ariaLabel,
}) => {
    const prefersReducedMotion = useReducedMotion();
    const [revealedCount, setRevealedCount] = useState(0);
    const timerRef = useRef<ReturnType<typeof setTimeout>>();

    useEffect(() => {
        if (prefersReducedMotion) {
            setRevealedCount(text.length);
            return;
        }
        setRevealedCount(0);
        let i = 0;
        const tick = () => {
            i++;
            setRevealedCount(i);
            if (i < text.length) {
                timerRef.current = setTimeout(tick, charDelay);
            }
        };
        timerRef.current = setTimeout(tick, charDelay);
        return () => clearTimeout(timerRef.current);
    }, [text, charDelay, prefersReducedMotion]);

    return (
        <span
            className={\`inline-block \${className}\`}
            role="text"
            aria-label={ariaLabel || text}
        >
            {text.split("").map((char, i) => {
                const isRevealed = i < revealedCount;
                const distFromEdge = revealedCount - i;

                return (
                    <span key={i} className="relative inline-block" aria-hidden="true">
                        {/* Vapor trails */}
                        {isRevealed && distFromEdge <= trailLength && distFromEdge > 0 && !prefersReducedMotion && (
                            <motion.span
                                className="absolute inset-0 pointer-events-none"
                                initial={{ opacity: 0.6, y: -2, filter: \`blur(\${trailBlur}px)\` }}
                                animate={{ opacity: 0, y: -8, filter: \`blur(\${trailBlur * 2}px)\` }}
                                transition={{ duration: trailDuration / 1000, ease: "easeOut" }}
                                style={{ color: "inherit" }}
                            >
                                {char === " " ? "\u00A0" : char}
                            </motion.span>
                        )}

                        {/* Main character */}
                        <motion.span
                            className="relative"
                            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 6 }}
                            animate={isRevealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                        >
                            {char === " " ? "\u00A0" : char}
                        </motion.span>
                    </span>
                );
            })}
        </span>
    );
};

export default VaporTrailText;
`
  },
};

export const NavigationData = {
  "backgrounds": [
    {
      "title": "Bioluminescent Web",
      "slug": "bioluminescent-web",
      "href": "/components/backgrounds/bioluminescent-web"
    },
    {
      "title": "Caustic Light",
      "slug": "caustic-light",
      "href": "/components/backgrounds/caustic-light"
    },
    {
      "title": "Circuit Fog",
      "slug": "circuit-fog",
      "href": "/components/backgrounds/circuit-fog"
    },
    {
      "title": "Data Sand",
      "slug": "data-sand",
      "href": "/components/backgrounds/data-sand"
    },
    {
      "title": "Erosion Field",
      "slug": "erosion-field",
      "href": "/components/backgrounds/erosion-field"
    },
    {
      "title": "Frost Crystal",
      "slug": "frost-crystal",
      "href": "/components/backgrounds/frost-crystal"
    },
    {
      "title": "Gravity Lens",
      "slug": "gravity-lens",
      "href": "/components/backgrounds/gravity-lens"
    },
    {
      "title": "Liquid Grid Memory",
      "slug": "liquid-grid-memory",
      "href": "/components/backgrounds/liquid-grid-memory"
    },
    {
      "title": "Magnetic Field Lines",
      "slug": "magnetic-field-lines",
      "href": "/components/backgrounds/magnetic-field-lines"
    },
    {
      "title": "Mycelium Network",
      "slug": "mycelium-network",
      "href": "/components/backgrounds/mycelium-network"
    },
    {
      "title": "Navier Stokes Fluid",
      "slug": "navier-stokes-fluid",
      "href": "/components/backgrounds/navier-stokes-fluid"
    },
    {
      "title": "Quantum Foam",
      "slug": "quantum-foam",
      "href": "/components/backgrounds/quantum-foam"
    },
    {
      "title": "Silk Aurora",
      "slug": "silk-aurora",
      "href": "/components/backgrounds/silk-aurora"
    },
    {
      "title": "Star Warp",
      "slug": "star-warp",
      "href": "/components/backgrounds/star-warp"
    },
    {
      "title": "Topographical Pulse",
      "slug": "topographical-pulse",
      "href": "/components/backgrounds/topographical-pulse"
    }
  ],
  "buttons": [
    {
      "title": "Elastic Border Button",
      "slug": "elastic-border-button",
      "href": "/components/buttons/elastic-border-button"
    },
    {
      "title": "Glitch Confirm Button",
      "slug": "glitch-confirm-button",
      "href": "/components/buttons/glitch-confirm-button"
    },
    {
      "title": "Graviton Button",
      "slug": "graviton-button",
      "href": "/components/buttons/graviton-button"
    },
    {
      "title": "Liquid Fill Button",
      "slug": "liquid-fill-button",
      "href": "/components/buttons/liquid-fill-button"
    },
    {
      "title": "Magnetic Snap Button",
      "slug": "magnetic-snap-button",
      "href": "/components/buttons/magnetic-snap-button"
    },
    {
      "title": "Morph Label Button",
      "slug": "morph-label-button",
      "href": "/components/buttons/morph-label-button"
    },
    {
      "title": "Pressure Ink Button",
      "slug": "pressure-ink-button",
      "href": "/components/buttons/pressure-ink-button"
    },
    {
      "title": "Split Intent Button",
      "slug": "split-intent-button",
      "href": "/components/buttons/split-intent-button"
    },
    {
      "title": "Tension String Button",
      "slug": "tension-string-button",
      "href": "/components/buttons/tension-string-button"
    }
  ],
  "cards": [
    {
      "title": "Blueprint Expand Card",
      "slug": "blueprint-expand-card",
      "href": "/components/cards/blueprint-expand-card"
    },
    {
      "title": "Depth Slice Card",
      "slug": "depth-slice-card",
      "href": "/components/cards/depth-slice-card"
    },
    {
      "title": "Diffraction Card",
      "slug": "diffraction-card",
      "href": "/components/cards/diffraction-card"
    },
    {
      "title": "Hologram Card",
      "slug": "hologram-card",
      "href": "/components/cards/hologram-card"
    },
    {
      "title": "Lens Focus Card",
      "slug": "lens-focus-card",
      "href": "/components/cards/lens-focus-card"
    },
    {
      "title": "Liquid Border Card",
      "slug": "liquid-border-card",
      "href": "/components/cards/liquid-border-card"
    },
    {
      "title": "Magnetic Card",
      "slug": "magnetic-card",
      "href": "/components/cards/magnetic-card"
    },
    {
      "title": "Memory Foam Card",
      "slug": "memory-foam-card",
      "href": "/components/cards/memory-foam-card"
    },
    {
      "title": "Orbit Metadata Card",
      "slug": "orbit-metadata-card",
      "href": "/components/cards/orbit-metadata-card"
    },
    {
      "title": "Peel Card",
      "slug": "peel-card",
      "href": "/components/cards/peel-card"
    },
    {
      "title": "Pressure Card",
      "slug": "pressure-card",
      "href": "/components/cards/pressure-card"
    },
    {
      "title": "Radar Scan Card",
      "slug": "radar-scan-card",
      "href": "/components/cards/radar-scan-card"
    },
    {
      "title": "Seismic Card",
      "slug": "seismic-card",
      "href": "/components/cards/seismic-card"
    },
    {
      "title": "Signal Strength Card",
      "slug": "signal-strength-card",
      "href": "/components/cards/signal-strength-card"
    },
    {
      "title": "Thermal Map Card",
      "slug": "thermal-map-card",
      "href": "/components/cards/thermal-map-card"
    },
    {
      "title": "Torn Edge Card",
      "slug": "torn-edge-card",
      "href": "/components/cards/torn-edge-card"
    },
    {
      "title": "X Ray Card",
      "slug": "x-ray-card",
      "href": "/components/cards/x-ray-card"
    }
  ],
  "chat": [
    {
      "title": "Message Bubble",
      "slug": "message-bubble",
      "href": "/components/chat/message-bubble"
    },
    {
      "title": "Reaction Picker",
      "slug": "reaction-picker",
      "href": "/components/chat/reaction-picker"
    },
    {
      "title": "Stream Text",
      "slug": "stream-text",
      "href": "/components/chat/stream-text"
    },
    {
      "title": "Thinking Indicator",
      "slug": "thinking-indicator",
      "href": "/components/chat/thinking-indicator"
    }
  ],
  "decorative": [
    {
      "title": "Breathing Glow Halo",
      "slug": "breathing-glow-halo",
      "href": "/components/decorative/breathing-glow-halo"
    },
    {
      "title": "Living Divider",
      "slug": "living-divider",
      "href": "/components/decorative/living-divider"
    },
    {
      "title": "Phase Chip",
      "slug": "phase-chip",
      "href": "/components/decorative/phase-chip"
    },
    {
      "title": "Prismatic Underline",
      "slug": "prismatic-underline",
      "href": "/components/decorative/prismatic-underline"
    },
    {
      "title": "Thread Connector",
      "slug": "thread-connector",
      "href": "/components/decorative/thread-connector"
    }
  ],
  "loaders": [
    {
      "title": "Blueprint Loader",
      "slug": "blueprint-loader",
      "href": "/components/loaders/blueprint-loader"
    },
    {
      "title": "Clay Morph Skeleton",
      "slug": "clay-morph-skeleton",
      "href": "/components/loaders/clay-morph-skeleton"
    },
    {
      "title": "Dna Loader",
      "slug": "dna-loader",
      "href": "/components/loaders/dna-loader"
    },
    {
      "title": "Fluid Fill Loader",
      "slug": "fluid-fill-loader",
      "href": "/components/loaders/fluid-fill-loader"
    },
    {
      "title": "Ghost Layout Loader",
      "slug": "ghost-layout-loader",
      "href": "/components/loaders/ghost-layout-loader"
    },
    {
      "title": "Particle Coalesce Loader",
      "slug": "particle-coalesce-loader",
      "href": "/components/loaders/particle-coalesce-loader"
    },
    {
      "title": "Pulse Relay Loader",
      "slug": "pulse-relay-loader",
      "href": "/components/loaders/pulse-relay-loader"
    },
    {
      "title": "Signal Acquisition Loader",
      "slug": "signal-acquisition-loader",
      "href": "/components/loaders/signal-acquisition-loader"
    },
    {
      "title": "Sonar Skeleton",
      "slug": "sonar-skeleton",
      "href": "/components/loaders/sonar-skeleton"
    },
    {
      "title": "Thread Weave Loader",
      "slug": "thread-weave-loader",
      "href": "/components/loaders/thread-weave-loader"
    },
    {
      "title": "Typewriter Blueprint Loader",
      "slug": "typewriter-blueprint-loader",
      "href": "/components/loaders/typewriter-blueprint-loader"
    }
  ],
  "navigation": [
    {
      "title": "Breadcrumb Morph",
      "slug": "breadcrumb-morph",
      "href": "/components/navigation/breadcrumb-morph"
    },
    {
      "title": "Command Palette",
      "slug": "command-palette",
      "href": "/components/navigation/command-palette"
    },
    {
      "title": "Magnetic Nav",
      "slug": "magnetic-nav",
      "href": "/components/navigation/magnetic-nav"
    }
  ],
  "sections": [
    {
      "title": "Bento Grid",
      "slug": "bento-grid",
      "href": "/components/sections/bento-grid"
    },
    {
      "title": "Comparison Matrix",
      "slug": "comparison-matrix",
      "href": "/components/sections/comparison-matrix"
    },
    {
      "title": "Feature Spotlight",
      "slug": "feature-spotlight",
      "href": "/components/sections/feature-spotlight"
    },
    {
      "title": "Gravity Well Hero",
      "slug": "gravity-well-hero",
      "href": "/components/sections/gravity-well-hero"
    },
    {
      "title": "Holographic Pricing Card",
      "slug": "holographic-pricing-card",
      "href": "/components/sections/holographic-pricing-card"
    },
    {
      "title": "Liquid Toggle Pricing",
      "slug": "liquid-toggle-pricing",
      "href": "/components/sections/liquid-toggle-pricing"
    },
    {
      "title": "Logo Carousel",
      "slug": "logo-carousel",
      "href": "/components/sections/logo-carousel"
    },
    {
      "title": "Membrane Hero",
      "slug": "membrane-hero",
      "href": "/components/sections/membrane-hero"
    },
    {
      "title": "Particle Collapse Hero",
      "slug": "particle-collapse-hero",
      "href": "/components/sections/particle-collapse-hero"
    },
    {
      "title": "Stat Counter",
      "slug": "stat-counter",
      "href": "/components/sections/stat-counter"
    },
    {
      "title": "Terminal Hero",
      "slug": "terminal-hero",
      "href": "/components/sections/terminal-hero"
    },
    {
      "title": "Timeline",
      "slug": "timeline",
      "href": "/components/sections/timeline"
    },
    {
      "title": "Waveform Hero",
      "slug": "waveform-hero",
      "href": "/components/sections/waveform-hero"
    }
  ],
  "text": [
    {
      "title": "Constellation Letters",
      "slug": "constellation-letters",
      "href": "/components/text/constellation-letters"
    },
    {
      "title": "Depth Of Field Text",
      "slug": "depth-of-field-text",
      "href": "/components/text/depth-of-field-text"
    },
    {
      "title": "Echo Trail Headline",
      "slug": "echo-trail-headline",
      "href": "/components/text/echo-trail-headline"
    },
    {
      "title": "Fault Line Text",
      "slug": "fault-line-text",
      "href": "/components/text/fault-line-text"
    },
    {
      "title": "Glitch Weave Text",
      "slug": "glitch-weave-text",
      "href": "/components/text/glitch-weave-text"
    },
    {
      "title": "Liquid Mercury Text",
      "slug": "liquid-mercury-text",
      "href": "/components/text/liquid-mercury-text"
    },
    {
      "title": "Magnetic Ink Text",
      "slug": "magnetic-ink-text",
      "href": "/components/text/magnetic-ink-text"
    },
    {
      "title": "Neon Flicker Text",
      "slug": "neon-flicker-text",
      "href": "/components/text/neon-flicker-text"
    },
    {
      "title": "Origami Unfold Text",
      "slug": "origami-unfold-text",
      "href": "/components/text/origami-unfold-text"
    },
    {
      "title": "Pressure Wave Text",
      "slug": "pressure-wave-text",
      "href": "/components/text/pressure-wave-text"
    },
    {
      "title": "Refraction Text",
      "slug": "refraction-text",
      "href": "/components/text/refraction-text"
    },
    {
      "title": "Scramble Text",
      "slug": "scramble-text",
      "href": "/components/text/scramble-text"
    },
    {
      "title": "Semantic Drift Text",
      "slug": "semantic-drift-text",
      "href": "/components/text/semantic-drift-text"
    },
    {
      "title": "Shatter Text",
      "slug": "shatter-text",
      "href": "/components/text/shatter-text"
    },
    {
      "title": "Signal Noise Text",
      "slug": "signal-noise-text",
      "href": "/components/text/signal-noise-text"
    },
    {
      "title": "Sonar Ping Text",
      "slug": "sonar-ping-text",
      "href": "/components/text/sonar-ping-text"
    },
    {
      "title": "Thermal Scan Text",
      "slug": "thermal-scan-text",
      "href": "/components/text/thermal-scan-text"
    },
    {
      "title": "Vapor Trail Text",
      "slug": "vapor-trail-text",
      "href": "/components/text/vapor-trail-text"
    }
  ]
}; 
