"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavigationData } from "@/lib/registry";

export function DocsSidebar() {
    const pathname = usePathname();

    return (
        <aside className="hidden lg:flex w-64 flex-col border-r border-gray-200 dark:border-border-dark bg-gray-50 dark:bg-background-dark overflow-y-auto pb-10">
            <div className="p-4 space-y-8">

                {Object.entries(NavigationData).map(([category, items]) => (
                    <div key={category}>
                        <h3 className="px-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                            {category}
                        </h3>
                        <div className="space-y-1">
                            {(items as any[]).map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.slug}
                                        href={item.href}
                                        className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${isActive
                                                ? "bg-primary/10 text-primary dark:text-primary"
                                                : "text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-surface-dark hover:text-primary"
                                            }`}
                                    >
                                        {item.title}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                ))}

            </div>
        </aside>
    );
}
