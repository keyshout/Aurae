"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/config/site-config";
import { cn } from "@/lib/utils";

export function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="fixed top-[64px] left-0 z-40 w-64 h-[calc(100vh-64px)] transition-transform -translate-x-full md:translate-x-0 bg-background-light border-r border-white/5 hidden md:block">
            <div className="h-full px-3 py-6 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                <div className="space-y-8">
                    {siteConfig.sidebar.map((group, index) => (
                        <div key={index} className="flex flex-col gap-2">
                            <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider px-3 mb-1">
                                {group.title}
                            </h4>
                            <div className="flex flex-col gap-1">
                                {group.items.map((item, i) => {
                                    const isActive = pathname === item.href;
                                    return (
                                        <Link
                                            key={i}
                                            href={item.href}
                                            className={cn(
                                                "relative flex items-center px-3 py-1.5 text-sm rounded-lg transition-colors overflow-hidden",
                                                isActive
                                                    ? "text-white font-medium bg-white/5 border border-white/5"
                                                    : "text-text-muted hover:text-white hover:bg-white/5"
                                            )}
                                        >
                                            {isActive && (
                                                <span className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-full" />
                                            )}
                                            {item.title}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </aside>
    );
}
