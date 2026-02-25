"use client";

/**
 * @component PulseRelayLoader
 * @description Loading signal relays between component sections:
 * header → body → footer in sequence.
 * Based on sequential position-based light pulse.
 *
 * @example
 * ```tsx
 * import { PulseRelayLoader } from '@/components/loaders/pulse-relay-loader';
 *
 * <PulseRelayLoader
 *   sections={['header', 'body', 'footer']}
 *   color="#f43f5e"
 *   className="w-80"
 * />
 * ```
 */

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

export interface PulseRelayLoaderProps {
    /** Section names. Default: ['header', 'body', 'footer'] */
    sections?: string[];
    /** Pulse color. Default: "#f43f5e" */
    color?: string;
    /** Pulse interval in ms. Default: 800 */
    interval?: number;
    /** Additional class names */
    className?: string;
}

const SECTION_HEIGHTS: Record<string, string> = {
    header: "40px",
    body: "100px",
    footer: "36px",
    sidebar: "80px",
    nav: "32px",
};

export const PulseRelayLoader: React.FC<PulseRelayLoaderProps> = ({
    sections = ["header", "body", "footer"],
    color = "#f43f5e",
    interval = 800,
    className = "",
}) => {
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % sections.length);
        }, interval);
        return () => clearInterval(timer);
    }, [sections.length, interval]);

    return (
        <div className={`flex flex-col gap-2 ${className}`} role="progressbar" aria-label="Loading">
            {sections.map((section, i) => {
                const isActive = i === activeIndex;
                const height = SECTION_HEIGHTS[section] || "60px";

                return (
                    <motion.div
                        key={i}
                        className="relative rounded-lg overflow-hidden"
                        style={{
                            height,
                            background: "rgba(255,255,255,0.04)",
                            border: "1px solid rgba(255,255,255,0.06)",
                        }}
                        animate={{
                            borderColor: isActive ? `${color}40` : "rgba(255,255,255,0.06)",
                        }}
                        transition={{ duration: 0.2 }}
                        aria-hidden="true"
                    >
                        {/* Section label */}
                        <span
                            className="absolute top-1 left-2 text-[10px] font-mono"
                            style={{ color: `${color}60` }}
                        >
                            {section}
                        </span>

                        {/* Pulse sweep */}
                        <motion.div
                            className="absolute inset-0"
                            style={{
                                background: `linear-gradient(90deg, transparent, ${color}15, transparent)`,
                            }}
                            animate={{
                                x: isActive ? ["calc(-100%)", "calc(100%)"] : "calc(-100%)",
                                opacity: isActive ? 1 : 0,
                            }}
                            transition={{
                                x: { duration: 0.6, ease: "easeInOut" },
                                opacity: { duration: 0.15 },
                            }}
                        />

                        {/* Connection dot relay line */}
                        {i < sections.length - 1 && (
                            <motion.div
                                className="absolute -bottom-2 left-1/2 w-0.5 h-2"
                                style={{ background: isActive ? color : "rgba(255,255,255,0.1)" }}
                                animate={{ opacity: isActive ? [0, 1, 0] : 0.2 }}
                                transition={{ duration: 0.3 }}
                            />
                        )}
                    </motion.div>
                );
            })}
        </div>
    );
};

export default PulseRelayLoader;

