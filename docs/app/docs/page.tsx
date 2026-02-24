import Link from "next/link";
import { siteConfig } from "@/config/site-config";
import { ArrowRight } from "lucide-react";

export default function DocsIndex() {
    const groups = siteConfig.sidebar.filter(g => g.title !== "Get Started");

    return (
        <div className="flex flex-col gap-12">
            <div className="flex flex-col gap-4">
                <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">Index</h1>
                <p className="text-text-muted text-lg max-w-2xl">Browse all {siteConfig.name} components, crafted with precision animations and layout support.</p>
            </div>

            <div className="flex flex-col gap-16">
                {groups.map((group, idx) => (
                    <section key={idx} className="flex flex-col gap-6">
                        <h2 className="text-2xl font-bold text-white border-b border-white/5 pb-3">
                            {group.title}
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {group.items.map((item, i) => (
                                <Link
                                    key={i}
                                    href={item.href}
                                    className="group relative flex flex-col justify-between p-6 bg-surface border border-white/5 rounded-2xl hover:border-primary/50 hover:bg-surface-highlight transition-all duration-300 overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

                                    <div className="relative z-10 flex flex-col gap-2">
                                        <h3 className="font-bold text-white group-hover:text-primary-hover transition-colors">
                                            {item.title}
                                        </h3>
                                    </div>
                                    <div className="relative z-10 mt-6 flex justify-end">
                                        <ArrowRight className="w-5 h-5 text-gray-500 group-hover:text-primary transition-colors group-hover:translate-x-1 duration-300" />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                ))}
            </div>
        </div>
    );
}
