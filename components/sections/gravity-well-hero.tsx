"use client";

/**
 * @component GravityWellHero
 * @description Floating feature icons orbit and gravitate toward the central headline.
 * Pointer movement perturbs their orbits.
 * Principle: gravitational attraction force field + orbit decay + pointer perturbation.
 *
 * @example
 * ```tsx
 * import { GravityWellHero } from '@/components/sections/gravity-well-hero';
 *
 * <GravityWellHero
 *   title="Everything pulls together."
 *   items={["⚡", "🎨", "🔧", "🚀", "💎", "🌊"]}
 * />
 * ```
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
                    el.style.transform = `translate(${orb.x - 20}px, ${orb.y - 20}px)`;

                    // Distance from center affects opacity
                    const dx = orb.x - centerX;
                    const dy = orb.y - centerY;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    const scale = 0.7 + (dist / 300) * 0.5;
                    el.style.transform += ` scale(${Math.min(1.2, scale)})`;
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
        <section className={`relative min-h-[70vh] flex items-center justify-center overflow-hidden ${className}`}>
            <div ref={containerRef} className="absolute inset-0">
                {items.map((item, i) => (
                    <div
                        key={i}
                        ref={(el) => { itemRefs.current[i] = el; }}
                        className="absolute w-10 h-10 flex items-center justify-center text-2xl will-change-transform pointer-events-none"
                        style={{
                            filter: `drop-shadow(0 0 8px ${itemColor}60)`,
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
