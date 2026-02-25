"use client";

/**
 * @component MembraneHero
 * @description An elastic membrane stretches upward on scroll, revealing content
 * beneath. Uses spring physics simulation for the stretch behavior.
 * Principle: spring membrane deformation + scroll-driven reveal.
 *
 * @example
 * ```tsx
 * import { MembraneHero } from '@/components/sections/membrane-hero';
 *
 * <MembraneHero
 *   title="Stretch beyond limits."
 *   subtitle="Elastic UI for modern apps."
 *   membraneColor="#8b5cf6"
 * />
 * ```
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
            className={`relative min-h-[150vh] ${className}`}
        >
            {/* Sticky container */}
            <div className="sticky top-0 min-h-screen flex items-center justify-center overflow-hidden">
                {/* Membrane overlay */}
                <motion.div
                    className="absolute inset-0 z-20"
                    style={{
                        y: prefersReducedMotion ? 0 : membraneY,
                        background: `linear-gradient(180deg, ${membraneColor} 0%, ${membraneColor}dd 60%, transparent 100%)`,
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
