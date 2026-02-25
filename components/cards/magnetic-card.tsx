"use client";

/**
 * @component MagneticCard
 * @description Card that magnetically tilts toward the pointer with 3D perspective,
 * realistic rotateX/Y based on mouse position.
 * Based on mouse position → 3D CSS transform.
 *
 * @example
 * ```tsx
 * import { MagneticCard } from '@/components/cards/magnetic-card';
 *
 * <MagneticCard
 *   tiltIntensity={15}
 *   glareOpacity={0.15}
 *   className="w-80"
 * >
 *   <h3>Card Content</h3>
 *   <p>Some description here</p>
 * </MagneticCard>
 * ```
 */

import React, { useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";

export interface MagneticCardProps {
    /** Card children */
    children: React.ReactNode;
    /** Maximum tilt angle in degrees. Default: 15 */
    tiltIntensity?: number;
    /** Glare overlay opacity. Default: 0.15 */
    glareOpacity?: number;
    /** Scale on hover. Default: 1.02 */
    hoverScale?: number;
    /** Border radius in pixels. Default: 16 */
    borderRadius?: number;
    /** Shadow color. Default: "rgba(0,0,0,0.3)" */
    shadowColor?: string;
    /** Additional class names */
    className?: string;
}

export const MagneticCard: React.FC<MagneticCardProps> = ({
    children,
    tiltIntensity = 15,
    glareOpacity = 0.15,
    hoverScale = 1.02,
    borderRadius = 16,
    shadowColor = "rgba(0,0,0,0.3)",
    className = "",
}) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });
    const [glarePos, setGlarePos] = useState({ x: 50, y: 50 });
    const [isHovered, setIsHovered] = useState(false);

    const handlePointerMove = useCallback(
        (e: React.PointerEvent) => {
            const el = cardRef.current;
            if (!el) return;

            const rect = el.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;
            const y = (e.clientY - rect.top) / rect.height;

            const rotateY = (x - 0.5) * tiltIntensity * 2;
            const rotateX = -(y - 0.5) * tiltIntensity * 2;

            setTilt({ rotateX, rotateY });
            setGlarePos({ x: x * 100, y: y * 100 });
        },
        [tiltIntensity]
    );

    const handlePointerLeave = useCallback(() => {
        setTilt({ rotateX: 0, rotateY: 0 });
        setIsHovered(false);
    }, []);

    return (
        <motion.div
            ref={cardRef}
            className={`relative overflow-hidden ${className}`}
            style={{
                perspective: 1000,
                borderRadius,
            }}
            onPointerMove={handlePointerMove}
            onPointerEnter={() => setIsHovered(true)}
            onPointerLeave={handlePointerLeave}
            animate={{
                rotateX: tilt.rotateX,
                rotateY: tilt.rotateY,
                scale: isHovered ? hoverScale : 1,
                boxShadow: isHovered
                    ? `0 20px 40px ${shadowColor}, 0 0 0 1px rgba(255,255,255,0.05)`
                    : `0 4px 12px ${shadowColor}`,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            role="article"
        >
            {/* Content */}
            <div className="relative z-10 p-6 bg-gradient-to-br from-gray-800/90 to-gray-900/90 dark:from-gray-800/90 dark:to-gray-950/90 backdrop-blur-sm h-full">
                {children}
            </div>

            {/* Glare overlay */}
            <motion.div
                className="absolute inset-0 pointer-events-none z-20"
                style={{
                    background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(255,255,255,${glareOpacity}), transparent 60%)`,
                    borderRadius,
                }}
                animate={{ opacity: isHovered ? 1 : 0 }}
                transition={{ duration: 0.2 }}
                aria-hidden="true"
            />

            {/* Subtle border highlight */}
            <motion.div
                className="absolute inset-0 pointer-events-none z-20"
                style={{
                    borderRadius,
                    border: "1px solid transparent",
                    backgroundClip: "padding-box",
                    background: `linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%, rgba(255,255,255,0.05) 100%)`,
                    mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                    WebkitMaskComposite: "xor",
                    maskComposite: "exclude",
                    padding: 1,
                }}
                animate={{ opacity: isHovered ? 1 : 0.3 }}
                aria-hidden="true"
            />
        </motion.div>
    );
};

export default MagneticCard;

