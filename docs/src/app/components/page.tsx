import { NavigationData } from "@/lib/registry";
import { DocsHeader } from "@/components/layout/DocsHeader";
import { DocsSidebar } from "@/components/layout/DocsSidebar";
import Link from "next/link";

export default function ComponentsOverview() {
    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display min-h-screen flex flex-col overflow-hidden">
            <DocsHeader />

            <div className="flex flex-1 overflow-hidden">
                <DocsSidebar />

                <main className="flex-1 overflow-y-auto p-8 lg:p-12 scroll-smooth">
                    <div className="max-w-6xl mx-auto">
                        <h1 className="text-4xl font-extrabold mb-8">All Components</h1>

                        <div className="flex flex-col gap-12">
                            {Object.entries(NavigationData).map(([category, items]) => (
                                <section key={category}>
                                    <h2 className="text-2xl font-bold mb-6 capitalize border-b border-white/10 dark:border-border-dark pb-2 text-primary">{category}</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {(items as any[]).map((item: any) => (
                                            <Link
                                                key={item.slug}
                                                href={item.href}
                                                className="group relative bg-surface-dark border border-white/5 rounded-2xl overflow-hidden hover:border-primary/50 transition-colors duration-300 p-6 flex flex-col min-h-[120px] shadow-lg shadow-black/20"
                                            >
                                                <h3 className="text-lg font-semibold text-white group-hover:text-primary transition-colors mb-2">{item.title}</h3>
                                                <p className="text-sm text-slate-400">View component &rarr;</p>
                                            </Link>
                                        ))}
                                    </div>
                                </section>
                            ))}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
