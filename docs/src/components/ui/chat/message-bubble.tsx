"use client";

/**
 * @component MessageBubble
 * @description Chat message bubble with distinct physics for user vs AI messages.
 * User messages bounce in; AI messages fade-slide in.
 * Principle: spring bounce (user) vs. fade slide (AI) entrance physics.
 *
 * @example
 * ```tsx
 * import { MessageBubble } from '@/components/chat/message-bubble';
 *
 * <MessageBubble role="user" text="Hello!" />
 * <MessageBubble role="assistant" text="Hi! How can I help?" />
 * ```
 */

import React from "react";
import { motion, useReducedMotion } from "framer-motion";

export interface MessageBubbleProps {
    /** Message sender role */
    role: "user" | "assistant";
    /** Message text */
    text: string;
    /** Avatar emoji or letter. Default: role-based */
    avatar?: string;
    /** Timestamp string */
    timestamp?: string;
    /** Additional class names */
    className?: string;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
    role,
    text,
    avatar,
    timestamp,
    className = "",
}) => {
    const prefersReducedMotion = useReducedMotion();
    const isUser = role === "user";
    const defaultAvatar = isUser ? "👤" : "✦";

    const userVariants = {
        hidden: { opacity: 0, x: 40, scale: 0.9 },
        visible: { opacity: 1, x: 0, scale: 1 },
    };

    const aiVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0 },
    };

    return (
        <motion.div
            className={`flex gap-3 max-w-lg ${isUser ? "ml-auto flex-row-reverse" : ""} ${className}`}
            variants={prefersReducedMotion ? {} : (isUser ? userVariants : aiVariants)}
            initial="hidden"
            animate="visible"
            transition={
                isUser
                    ? { type: "spring", stiffness: 400, damping: 20 }
                    : { duration: 0.4, ease: "easeOut" }
            }
        >
            {/* Avatar */}
            <div
                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm ${isUser ? "bg-violet-600" : "bg-gray-700"
                    }`}
            >
                {avatar || defaultAvatar}
            </div>

            {/* Bubble */}
            <div
                className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${isUser
                        ? "bg-violet-600 text-white rounded-br-md"
                        : "bg-gray-800 text-gray-200 rounded-bl-md border border-gray-700/50"
                    }`}
            >
                {text}
                {timestamp && (
                    <div className={`text-[10px] mt-1 ${isUser ? "text-violet-300" : "text-gray-500"}`}>
                        {timestamp}
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default MessageBubble;
