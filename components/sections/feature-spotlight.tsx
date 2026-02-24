"use client";

/**
 * @component FeatureSpotlight
 * @description Active feature item enlarges, others blur and shrink.
 * Keyboard navigable with arrow keys.
 * Principle: scale hierarchy + blur falloff + keyboard nav.
 *
 * @example
 * ```tsx
 * import { FeatureSpotlight } from '@/components/sections/feature-spotlight';
 *
 * <FeatureSpotlight features={[
 *   { title: "Speed", description: "Built for performance", icon: "⚡" },
 *   { title: "Design", description: "Beautiful defaults", icon: "🎨" },
 * ]} />
 * ```
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
        <section className={`py-20 px-6 ${className}`}>
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
                            className={`p-5 rounded-xl cursor-pointer border transition-colors ${isActive
                                    ? "border-violet-500/30 bg-violet-500/5"
                                    : "border-transparent bg-gray-800/30"
                                }`}
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
