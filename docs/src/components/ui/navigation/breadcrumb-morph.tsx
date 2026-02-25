"use client";

/**
 * @component BreadcrumbMorph
 * @description Breadcrumb items morph between states with layout animation.
 * New segments slide in, removed segments collapse out.
 * Principle: Framer Motion layout animation + AnimatePresence.
 *
 * @example
 * ```tsx
 * import { BreadcrumbMorph } from '@/components/navigation/breadcrumb-morph';
 *
 * <BreadcrumbMorph
 *   items={[
 *     { label: "Home", href: "/" },
 *     { label: "Components", href: "/components" },
 *     { label: "Cards", href: "/components/cards" },
 *   ]}
 * />
 * ```
 */

import React from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

interface BreadcrumbItem {
    label: string;
    href?: string;
}

export interface BreadcrumbMorphProps {
    /** Breadcrumb items (ordered) */
    items: BreadcrumbItem[];
    /** Separator character. Default: "/" */
    separator?: string;
    /** Additional class names */
    className?: string;
}

export const BreadcrumbMorph: React.FC<BreadcrumbMorphProps> = ({
    items,
    separator = "/",
    className = "",
}) => {
    const prefersReducedMotion = useReducedMotion();

    return (
        <nav className={`flex items-center gap-1 text-sm ${className}`} aria-label="Breadcrumb">
            <AnimatePresence mode="popLayout">
                {items.map((item, i) => (
                    <React.Fragment key={item.label}>
                        {i > 0 && (
                            <motion.span
                                className="text-gray-600 mx-1"
                                layout
                                aria-hidden="true"
                            >
                                {separator}
                            </motion.span>
                        )}
                        <motion.a
                            href={item.href || "#"}
                            className={`font-medium transition-colors ${i === items.length - 1
                                    ? "text-white cursor-default"
                                    : "text-gray-400 hover:text-gray-200"
                                }`}
                            layout
                            initial={prefersReducedMotion ? {} : { opacity: 0, x: -10, scale: 0.9 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={prefersReducedMotion ? {} : { opacity: 0, x: 10, scale: 0.9 }}
                            transition={{
                                type: "spring",
                                stiffness: 400,
                                damping: 25,
                            }}
                            aria-current={i === items.length - 1 ? "page" : undefined}
                        >
                            {item.label}
                        </motion.a>
                    </React.Fragment>
                ))}
            </AnimatePresence>
        </nav>
    );
};

export default BreadcrumbMorph;
