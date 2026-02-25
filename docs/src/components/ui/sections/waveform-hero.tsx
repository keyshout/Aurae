"use client";

/**
 * @component WaveformHero
 * @description Audio waveform visualization flows behind the hero headline.
 * CTA hover causes wave amplitude to spike reactively.
 * Principle: sine harmonic layers + pointer reactive amplitude.
 *
 * @example
 * ```tsx
 * import { WaveformHero } from '@/components/sections/waveform-hero';
 *
 * <WaveformHero
 *   title="Sound meets motion."
 *   subtitle="Every component dances."
 *   waveColor="#06b6d4"
 * />
 * ```
 */

import React, { useRef, useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { hexToRgbString } from "@/lib/utils";

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
                ctx.fillStyle = `rgba(${rgb}, ${alpha})`;
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
        <section className={`relative min-h-[70vh] flex items-center justify-center overflow-hidden ${className}`}>
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
