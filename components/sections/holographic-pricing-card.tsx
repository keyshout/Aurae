"use client";

/**
 * @component HolographicPricingCard
 * @description Selected plan gets holographic card effect (scan lines, chromatic shift),
 * unselected plans fade and scale down.
 * Principle: HologramCard-style overlay + scale hierarchy + selection state.
 *
 * @example
 * ```tsx
 * import { HolographicPricingCard } from '@/components/sections/holographic-pricing-card';
 *
 * <HolographicPricingCard
 *   plans={[
 *     { name: "Free", price: 0, features: ["3 projects"] },
 *     { name: "Pro", price: 19, features: ["Unlimited"], highlighted: true },
 *   ]}
 * />
 * ```
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
    /** Currency symbol. Default: "$" */
    currency?: string;
    /** Additional class names */
    className?: string;
}

export const HolographicPricingCard: React.FC<HolographicPricingCardProps> = ({
    plans,
    currency = "$",
    className = "",
}) => {
    const prefersReducedMotion = useReducedMotion();
    const [selected, setSelected] = useState(
        plans.findIndex((p) => p.highlighted) >= 0 ? plans.findIndex((p) => p.highlighted) : 0
    );

    return (
        <section className={`py-20 px-6 ${className}`}>
            <div className="flex flex-wrap justify-center gap-6 max-w-5xl mx-auto items-center">
                {plans.map((plan, i) => {
                    const isSelected = i === selected;
                    return (
                        <motion.div
                            key={plan.name}
                            className={`relative p-6 rounded-2xl border cursor-pointer overflow-hidden ${isSelected
                                    ? "border-cyan-400/50 w-80"
                                    : "border-gray-700/30 w-72 opacity-60"
                                }`}
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
                                        background: `repeating-linear-gradient(
                                            0deg,
                                            transparent,
                                            transparent 2px,
                                            rgba(6,182,212,0.03) 2px,
                                            rgba(6,182,212,0.03) 4px
                                        )`,
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
                                className={`w-full mt-6 py-2.5 rounded-xl font-semibold text-sm cursor-pointer relative z-20 ${isSelected
                                        ? "bg-gradient-to-r from-cyan-600 to-violet-600 text-white"
                                        : "bg-gray-700 text-gray-400"
                                    }`}
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
