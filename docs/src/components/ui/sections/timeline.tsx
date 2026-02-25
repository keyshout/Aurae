"use client";

/**
 * @component Timeline
 * @description Vertical timeline drawn on scroll. Each node activates in sequence
 * with staggered reveal and connected stroke animation.
 * Principle: scroll-driven stroke draw + stagger reveal.
 *
 * @example
 * ```tsx
 * import { Timeline } from '@/components/sections/timeline';
 *
 * <Timeline items={[
 *   { title: "Launch", description: "v1.0 released", date: "Jan 2024" },
 *   { title: "Growth", description: "10k users", date: "Mar 2024" },
 * ]} />
 * ```
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
        <section className={`py-20 px-6 ${className}`}>
            <div className="max-w-2xl mx-auto relative">
                {/* Vertical line */}
                <motion.div
                    className="absolute left-6 top-0 bottom-0 w-0.5"
                    style={{ backgroundColor: `${lineColor}30` }}
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
