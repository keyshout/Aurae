"use client";

import React, { useState } from "react";
import { Copy, Check, Eye, Code2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ComponentShowcaseProps {
    name: string;
    description?: string;
    preview: React.ReactNode;
    code: string;
    controls?: React.ReactNode;
    installCommand?: string;
}

export function ComponentShowcase({
    name,
    description,
    preview,
    code,
    controls,
    installCommand = "npm install @keyshout/aurae",
}: ComponentShowcaseProps) {
    const [activeTab, setActiveTab] = useState<"preview" | "code">("preview");
    const [copied, setCopied] = useState(false);

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="flex flex-col gap-8 w-full max-w-[900px]">
            {/* Header */}
            <div className="flex flex-col gap-4">
                <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">{name}</h1>
                {description && <p className="text-text-muted text-base md:text-lg max-w-2xl leading-relaxed">{description}</p>}
            </div>

            {/* Main Area */}
            <div className="flex flex-col gap-4 mt-2">
                {/* Tabs */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setActiveTab("preview")}
                        className={cn(
                            "flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-full transition-colors border",
                            activeTab === "preview"
                                ? "bg-white/10 text-white border-white/20 shadow-sm"
                                : "text-text-muted border-transparent hover:text-white hover:bg-white/5"
                        )}
                    >
                        <Eye className="w-4 h-4" />
                        Preview
                    </button>
                    <button
                        onClick={() => setActiveTab("code")}
                        className={cn(
                            "flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-full transition-colors border",
                            activeTab === "code"
                                ? "bg-white/10 text-white border-white/20 shadow-sm"
                                : "text-text-muted border-transparent hover:text-white hover:bg-white/5"
                        )}
                    >
                        <Code2 className="w-4 h-4" />
                        Code
                    </button>
                </div>

                {/* Content Box */}
                <div className="relative rounded-2xl border border-white/10 bg-surface overflow-hidden shadow-2xl">
                    {activeTab === "preview" ? (
                        <div className="flex flex-col">
                            <div className="min-h-[450px] flex items-center justify-center p-8 relative overflow-hidden bg-gradient-to-br from-background-light to-[#11101a]">
                                <div className="relative z-10 w-full flex items-center justify-center">
                                    {preview}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="relative group">
                            <div className="absolute right-4 top-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => copyToClipboard(code)}
                                    className="p-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-md text-gray-300 transition-colors"
                                    title="Copy code"
                                >
                                    {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                                </button>
                            </div>
                            <pre className="p-6 overflow-x-auto text-sm font-mono text-gray-300 bg-background-light h-[450px]">
                                <code>{code}</code>
                            </pre>
                        </div>
                    )}
                </div>
            </div>

            {/* Customization Panel */}
            {controls && (
                <div className="flex flex-col gap-4 mt-8">
                    <h3 className="text-xl font-bold text-white tracking-tight">Customize</h3>
                    <div className="bg-surface border border-white/5 rounded-2xl p-6">
                        {controls}
                    </div>
                </div>
            )}

            {/* Installation block */}
            <div className="flex flex-col gap-4 mt-8 pt-8 border-t border-white/5">
                <h3 className="text-xl font-bold text-white tracking-tight">Installation</h3>
                <div className="relative flex items-center w-full max-w-xl group">
                    <pre className="flex-1 p-4 rounded-xl bg-surface border border-white/10 text-sm font-mono text-gray-300 overflow-x-auto shadow-inner">
                        <code>{installCommand}</code>
                    </pre>
                    <button
                        onClick={() => copyToClipboard(installCommand)}
                        className="absolute right-3 p-2 text-text-muted hover:text-white bg-surface-highlight border border-white/10 rounded-lg group-hover:opacity-100 transition-all shadow-sm"
                    >
                        {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                </div>
            </div>
        </div>
    );
}
