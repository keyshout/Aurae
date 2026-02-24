"use client";

/**
 * @component ParticleCollapseHero
 * @description Hundreds of particles scatter from center on load, then converge
 * onto the headline text positions, forming the title from chaos.
 * Principle: particle target interpolation + stagger + easing curves.
 *
 * @example
 * ```tsx
 * import { ParticleCollapseHero } from '@/components/sections/particle-collapse-hero';
 *
 * <ParticleCollapseHero
 *   title="Build faster."
 *   subtitle="75 physics-based React components."
 *   ctaLabel="Get Started"
 *   ctaHref="/docs"
 * />
 * ```
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
        <section className={`relative min-h-[70vh] flex items-center justify-center overflow-hidden ${className}`}>
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
