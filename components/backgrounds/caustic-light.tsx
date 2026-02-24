"use client";

/**
 * @component CausticLight
 * @description Underwater light refraction patterns — organic, shimmering pools of light
 * using SVG turbulence and displacement filters.
 * Principle: feTurbulence + feDisplacementMap light caustic simulation.
 *
 * @example
 * ```tsx
 * import { CausticLight } from '@/components/backgrounds/caustic-light';
 *
 * <CausticLight color="#06b6d4" intensity={0.6} className="w-full h-64" />
 * ```
 */

import React, { useId } from "react";
import { motion, useReducedMotion } from "framer-motion";

export interface CausticLightProps {
    /** Light color. Default: "#06b6d4" */
    color?: string;
    /** Light intensity (0-1). Default: 0.5 */
    intensity?: number;
    /** Animation speed. Default: 1 */
    speed?: number;
    /** Additional class names */
    className?: string;
}

export const CausticLight: React.FC<CausticLightProps> = ({
    color = "#06b6d4",
    intensity = 0.5,
    speed = 1,
    className = "",
}) => {
    const prefersReducedMotion = useReducedMotion();
    const filterId = useId();
    const gradId = useId();

    return (
        <div className={`relative overflow-hidden ${className}`} role="presentation" aria-hidden="true">
            <svg className="absolute inset-0 w-full h-full">
                <defs>
                    <filter id={filterId} x="-20%" y="-20%" width="140%" height="140%">
                        <feTurbulence
                            type="fractalNoise"
                            baseFrequency="0.015 0.02"
                            numOctaves={3}
                            seed={42}
                            result="noise"
                        >
                            {!prefersReducedMotion && (
                                <animate
                                    attributeName="baseFrequency"
                                    dur={`${20 / speed}s`}
                                    values="0.015 0.02;0.02 0.015;0.015 0.02"
                                    repeatCount="indefinite"
                                />
                            )}
                        </feTurbulence>
                        <feDisplacementMap
                            in="SourceGraphic"
                            in2="noise"
                            scale={40}
                            xChannelSelector="R"
                            yChannelSelector="G"
                        />
                        <feGaussianBlur stdDeviation={2} />
                    </filter>
                    <radialGradient id={gradId} cx="50%" cy="50%" r="70%">
                        <stop offset="0%" stopColor={color} stopOpacity={intensity} />
                        <stop offset="40%" stopColor={color} stopOpacity={intensity * 0.6} />
                        <stop offset="100%" stopColor={color} stopOpacity={0} />
                    </radialGradient>
                </defs>

                {/* Caustic light layer 1 */}
                <motion.rect
                    x="-10%"
                    y="-10%"
                    width="120%"
                    height="120%"
                    fill={`url(#${gradId})`}
                    filter={`url(#${filterId})`}
                    animate={prefersReducedMotion ? {} : {
                        x: ["-10%", "-5%", "-10%"],
                        y: ["-10%", "-15%", "-10%"],
                    }}
                    transition={{
                        duration: 15 / speed,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                />

                {/* Caustic light layer 2 — offset for complexity */}
                <motion.rect
                    x="-5%"
                    y="-5%"
                    width="110%"
                    height="110%"
                    fill={`url(#${gradId})`}
                    filter={`url(#${filterId})`}
                    opacity={0.5}
                    animate={prefersReducedMotion ? {} : {
                        x: ["-5%", "-15%", "-5%"],
                        y: ["-5%", "0%", "-5%"],
                    }}
                    transition={{
                        duration: 22 / speed,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                />
            </svg>
        </div>
    );
};

export default CausticLight;
