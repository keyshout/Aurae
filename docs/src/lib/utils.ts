/**
 * Shared utility functions for Aurae component library.
 * @module lib/utils
 */

/**
 * Convert a hex color string to an RGB object.
 * @param hex - Hex color string (e.g. "#ff0000" or "ff0000")
 * @returns Object with r, g, b values (0–255), or null if invalid
 *
 * @example
 * ```ts
 * hexToRgb("#8b5cf6") // { r: 139, g: 92, b: 246 }
 * hexToRgb("invalid") // null
 * ```
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
        ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16),
        }
        : null;
}

/**
 * Convert a hex color string to an "r, g, b" CSS-ready string.
 * Falls back to a default if the hex is invalid.
 * @param hex - Hex color string
 * @param fallback - Fallback RGB string. Default: "128, 128, 128"
 * @returns CSS-ready RGB string like "139, 92, 246"
 *
 * @example
 * ```ts
 * hexToRgbString("#8b5cf6") // "139, 92, 246"
 * ```
 */
export function hexToRgbString(hex: string, fallback = "128, 128, 128"): string {
    const rgb = hexToRgb(hex);
    return rgb ? `${rgb.r}, ${rgb.g}, ${rgb.b}` : fallback;
}

/**
 * Clamp a value between a minimum and maximum.
 * @param value - The value to clamp
 * @param min - Minimum bound
 * @param max - Maximum bound
 * @returns Clamped value
 *
 * @example
 * ```ts
 * clamp(15, 0, 10) // 10
 * clamp(-5, 0, 10) // 0
 * ```
 */
export function clamp(value: number, min: number, max: number): number {
    return Math.min(max, Math.max(min, value));
}

/**
 * Linear interpolation between two values.
 * @param a - Start value
 * @param b - End value
 * @param t - Interpolation factor (0–1)
 * @returns Interpolated value
 *
 * @example
 * ```ts
 * lerp(0, 100, 0.5) // 50
 * lerp(10, 20, 0.25) // 12.5
 * ```
 */
export function lerp(a: number, b: number, t: number): number {
    return a + (b - a) * t;
}

/**
 * Map a value from one range to another.
 * @param value - Input value
 * @param inMin - Input range minimum
 * @param inMax - Input range maximum
 * @param outMin - Output range minimum
 * @param outMax - Output range maximum
 * @returns Mapped value
 *
 * @example
 * ```ts
 * mapRange(50, 0, 100, 0, 1) // 0.5
 * mapRange(75, 0, 100, -1, 1) // 0.5
 * ```
 */
export function mapRange(
    value: number,
    inMin: number,
    inMax: number,
    outMin: number,
    outMax: number
): number {
    if (inMin === inMax) return outMin;
    return ((value - inMin) / (inMax - inMin)) * (outMax - outMin) + outMin;
}

/**
 * Ensure a value is finite, otherwise return a fallback.
 */
export function toFiniteNumber(value: number, fallback: number): number {
    return Number.isFinite(value) ? value : fallback;
}

/**
 * Ensure a value is a finite positive number above `min`.
 */
export function toPositiveNumber(value: number, fallback: number, min = 0.0001): number {
    const safe = toFiniteNumber(value, fallback);
    if (safe >= min) return safe;
    const safeFallback = toFiniteNumber(fallback, min);
    return safeFallback >= min ? safeFallback : min;
}

/**
 * Ensure a value is a finite integer above or equal to `min`.
 */
export function toPositiveInt(value: number, fallback: number, min = 1): number {
    const safe = Math.floor(toFiniteNumber(value, fallback));
    if (safe >= min) return safe;
    const safeFallback = Math.floor(toFiniteNumber(fallback, min));
    return safeFallback >= min ? safeFallback : min;
}
