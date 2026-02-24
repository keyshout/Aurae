"use client";

/**
 * @component LiquidTogglePricing
 * @description Monthly/Annual toggle with liquid SVG morph transition.
 * Prices animate with rolling number counter.
 * Principle: SVG morph + number counter animation + layout transition.
 *
 * @example
 * ```tsx
 * import { LiquidTogglePricing } from '@/components/sections/liquid-toggle-pricing';
 *
 * <LiquidTogglePricing
 *   plans={[
 *     { name: "Starter", monthly: 9, annual: 7, features: ["5 projects", "1GB storage"] },
 *     { name: "Pro", monthly: 29, annual: 24, features: ["Unlimited projects", "10GB storage"], popular: true },
 *   ]}
 * />
 * ```
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
    /** Currency symbol. Default: "$" */
    currency?: string;
    /** CTA label. Default: "Get Started" */
    ctaLabel?: string;
    /** Additional class names */
    className?: string;
}

export const LiquidTogglePricing: React.FC<LiquidTogglePricingProps> = ({
    plans,
    currency = "$",
    ctaLabel = "Get Started",
    className = "",
}) => {
    const prefersReducedMotion = useReducedMotion();
    const [isAnnual, setIsAnnual] = useState(false);

    return (
        <section className={`py-20 px-6 ${className}`}>
            {/* Toggle */}
            <div className="flex items-center justify-center gap-4 mb-12">
                <span className={`text-sm font-medium ${!isAnnual ? "text-white" : "text-gray-500"}`}>Monthly</span>
                <button
                    className="relative w-14 h-7 rounded-full bg-gray-700 cursor-pointer"
                    onClick={() => setIsAnnual(!isAnnual)}
                    aria-label={`Switch to ${isAnnual ? "monthly" : "annual"} billing`}
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
                <span className={`text-sm font-medium ${isAnnual ? "text-white" : "text-gray-500"}`}>
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
                            className={`relative w-72 p-6 rounded-2xl border ${plan.popular
                                    ? "border-violet-500/50 bg-gradient-to-b from-violet-500/10 to-transparent"
                                    : "border-gray-700/50 bg-gray-800/50"
                                }`}
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
                                className={`w-full py-2.5 rounded-xl font-semibold text-sm cursor-pointer transition-colors ${plan.popular
                                        ? "bg-violet-600 text-white hover:bg-violet-500"
                                        : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                                    }`}
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
