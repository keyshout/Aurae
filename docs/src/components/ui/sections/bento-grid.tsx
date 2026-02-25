"use client";

/**
 * @component BentoGrid
 * @description Grid of varied-size cards. Hover causes gentle float,
 * click expands with layout animation.
 * Principle: spring float + Framer Motion layout animation.
 *
 * @example
 * ```tsx
 * import { BentoGrid } from '@/components/sections/bento-grid';
 *
 * <BentoGrid items={[
 *   { title: "Fast", description: "Blazing speed", span: 2 },
 *   { title: "Secure", description: "Enterprise ready" },
 * ]} />
 * ```
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
        <section className={`py-20 px-6 ${className}`}>
            <div
                className="max-w-5xl mx-auto grid gap-4"
                style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
            >
                {items.map((item, i) => (
                    <motion.div
                        key={i}
                        className="relative p-6 rounded-2xl border border-gray-700/30 bg-gray-800/50 cursor-pointer overflow-hidden"
                        style={{
                            gridColumn: `span ${item.span || 1}`,
                            gridRow: `span ${item.rowSpan || 1}`,
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
