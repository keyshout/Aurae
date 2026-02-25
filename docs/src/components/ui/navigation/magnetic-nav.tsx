"use client";

/**
 * @component MagneticNav
 * @description Nav links magnetically attracted to pointer. Active link has
 * a liquid underline that morphs position with spring physics.
 * Principle: magnetic attraction + spring underline morph.
 *
 * @example
 * ```tsx
 * import { MagneticNav } from '@/components/navigation/magnetic-nav';
 *
 * <MagneticNav
 *   links={[
 *     { label: "Home", href: "/" },
 *     { label: "Components", href: "/components" },
 *     { label: "Docs", href: "/docs" },
 *   ]}
 * />
 * ```
 */

import React, { useState, useRef, useCallback } from "react";
import { motion, useReducedMotion } from "framer-motion";

interface NavLink {
    label: string;
    href: string;
}

export interface MagneticNavProps {
    /** Navigation links */
    links: NavLink[];
    /** Active link index */
    activeIndex?: number;
    /** Magnetic strength (0-1). Default: 0.2 */
    magnetStrength?: number;
    /** Underline color. Default: "#8b5cf6" */
    underlineColor?: string;
    /** Additional class names */
    className?: string;
}

export const MagneticNav: React.FC<MagneticNavProps> = ({
    links,
    activeIndex = 0,
    magnetStrength = 0.2,
    underlineColor = "#8b5cf6",
    className = "",
}) => {
    const prefersReducedMotion = useReducedMotion();
    const [active, setActive] = useState(activeIndex);
    const [offsets, setOffsets] = useState<Record<number, { x: number; y: number }>>({});
    const navRef = useRef<HTMLElement>(null);
    const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);

    const handlePointerMove = useCallback((e: React.PointerEvent, i: number) => {
        if (prefersReducedMotion) return;
        const el = linkRefs.current[i];
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = (e.clientX - cx) * magnetStrength;
        const dy = (e.clientY - cy) * magnetStrength;
        setOffsets((prev) => ({ ...prev, [i]: { x: dx, y: dy } }));
    }, [magnetStrength, prefersReducedMotion]);

    const handlePointerLeave = useCallback((i: number) => {
        setOffsets((prev) => ({ ...prev, [i]: { x: 0, y: 0 } }));
    }, []);

    // Calculate underline position from active link
    const getUnderlineStyle = () => {
        const el = linkRefs.current[active];
        const nav = navRef.current;
        if (!el || !nav) return { left: 0, width: 0 };
        const navRect = nav.getBoundingClientRect();
        const elRect = el.getBoundingClientRect();
        return {
            left: elRect.left - navRect.left,
            width: elRect.width,
        };
    };

    const underline = getUnderlineStyle();

    return (
        <nav ref={navRef} className={`relative flex items-center gap-1 ${className}`} role="navigation">
            {links.map((link, i) => (
                <motion.a
                    key={link.href}
                    ref={(el) => { linkRefs.current[i] = el; }}
                    href={link.href}
                    className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-colors ${i === active ? "text-white" : "text-gray-400 hover:text-gray-200"
                        }`}
                    onPointerMove={(e) => handlePointerMove(e, i)}
                    onPointerLeave={() => handlePointerLeave(i)}
                    onClick={(e) => { e.preventDefault(); setActive(i); }}
                    animate={{
                        x: offsets[i]?.x ?? 0,
                        y: offsets[i]?.y ?? 0,
                    }}
                    transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 15,
                    }}
                >
                    {link.label}
                </motion.a>
            ))}

            {/* Liquid underline */}
            <motion.div
                className="absolute bottom-0 h-0.5 rounded-full"
                style={{ backgroundColor: underlineColor }}
                animate={{
                    left: underline.left,
                    width: underline.width,
                }}
                transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 30,
                }}
                aria-hidden="true"
            />
        </nav>
    );
};

export default MagneticNav;
