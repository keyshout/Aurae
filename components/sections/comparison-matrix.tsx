"use client";

/**
 * @component ComparisonMatrix
 * @description Feature comparison table with staggered row reveal and spring icon morphs.
 * Principle: staggered row AnimatePresence + icon morph transitions.
 *
 * @example
 * ```tsx
 * import { ComparisonMatrix } from '@/components/sections/comparison-matrix';
 *
 * <ComparisonMatrix
 *   plans={["Free", "Pro", "Enterprise"]}
 *   features={[
 *     { name: "Projects", values: ["3", "Unlimited", "Unlimited"] },
 *     { name: "API Access", values: [false, true, true] },
 *   ]}
 * />
 * ```
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
        <section className={`py-20 px-6 ${className}`}>
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
                                                className={`inline-flex text-lg ${val ? "text-emerald-400" : "text-gray-600"}`}
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
