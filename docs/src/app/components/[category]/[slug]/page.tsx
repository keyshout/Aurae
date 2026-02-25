import { Registry } from "@/lib/registry";
import { notFound } from "next/navigation";
import { DocsHeader } from "@/components/layout/DocsHeader";
import { DocsSidebar } from "@/components/layout/DocsSidebar";
import { ComponentPreview } from "@/components/layout/ComponentPreview";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
export function generateStaticParams() {
    return Object.keys(Registry).map((key) => {
        const [category, slug] = key.split("/");
        return { category, slug };
    });
}

export default async function ComponentPage({ params }: { params: Promise<{ category: string, slug: string }> }) {
    const { category, slug } = await params;
    const item = Registry[`${category}/${slug}`];

    if (!item) {
        return notFound();
    }

    const registryKeys = Object.keys(Registry);
    const currentIndex = registryKeys.findIndex(key => key === `${category}/${slug}`);

    const prevKey = currentIndex > 0 ? registryKeys[currentIndex - 1] : null;
    const nextKey = currentIndex < registryKeys.length - 1 ? registryKeys[currentIndex + 1] : null;

    const prevItem = prevKey ? Registry[prevKey as keyof typeof Registry] : null;
    const nextItem = nextKey ? Registry[nextKey as keyof typeof Registry] : null;

    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display min-h-screen flex flex-col overflow-hidden">
            <DocsHeader />

            <div className="flex flex-1 overflow-hidden">
                <DocsSidebar />

                <main className="flex-1 overflow-y-auto p-8 lg:p-12 scroll-smooth relative">
                    <div className="max-w-4xl mx-auto">

                        {/* Breadcrumbs */}
                        <div className="flex items-center gap-2 text-sm text-text-secondary mb-6">
                            <span className="hover:text-primary cursor-pointer capitalize">{category}</span>
                            <span className="material-symbols-outlined text-xs">chevron_right</span>
                            <span className="text-primary font-medium">{item.name}</span>
                        </div>

                        {/* Title Header */}
                        <div className="mb-10">
                            <div className="flex items-center justify-between mb-4">
                                <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                                    {item.name}
                                </h1>
                            </div>
                        </div>

                        {(() => {
                            const TargetComponent = item.component;
                            const defaultProps: any = {};

                            // Prevent runtime errors for components expecting specific props
                            if (category === "text") {
                                defaultProps.text = "Aurae UI";
                            } else if (category === "buttons") {
                                defaultProps.children = "Aurae UI Component";
                                defaultProps.text = "Aurae UI";
                                defaultProps.label = "Aurae Default";
                                defaultProps.hoverLabel = "Aurae Hover";
                            } else if (category === "cards") {
                                defaultProps.children = (
                                    <div className="p-6 h-full flex flex-col justify-end text-white relative z-10 font-sans">
                                        <h3 className="text-xl font-bold mb-2">Aurae UI Card</h3>
                                        <p className="text-sm opacity-80">Interactive hover effects and animations</p>
                                    </div>
                                );
                                defaultProps.title = "Aurae UI";
                                defaultProps.description = "Aurae UI Description";
                                defaultProps.className = "w-80 h-96 mx-auto"; // Zorunlu genişlik/yükseklik prop'u
                            } else if (category === "sections") {
                                defaultProps.children = "Aurae UI Component";
                                defaultProps.items = ["Item 1", "Item 2", "Item 3"]; // Daha basit bir diziye (string array) dönüştürüldü
                                defaultProps.stats = [
                                    { value: 99, label: "Performance", suffix: "%" },
                                    { value: 10, label: "Downloads", suffix: "k" }
                                ];
                            } else if (category === "backgrounds") {
                                defaultProps.className = "!absolute !inset-0 !w-full !h-full !m-0 !p-0 z-0";
                                defaultProps.idleThreshold = 100; // Frost Crystal ve benzeri bileşenlerin mouse beklemeden renderlanması için
                            } else if (category === "chat") {
                                defaultProps.text = "Aurae UI chat message...";
                                defaultProps.message = "Aurae UI message";
                            } else if (category === "loaders") {
                                defaultProps.text = "Loading...";
                                defaultProps.className = "w-full max-w-md mx-auto"; // Sıfıra çöken loader'ların görünmesi için
                            } else if (category === "navigation") {
                                defaultProps.items = [{ label: "Home", href: "#" }, { label: "About", href: "#" }];
                                defaultProps.links = [
                                    { label: "Home", href: "#home" },
                                    { label: "Features", href: "#features" },
                                    { label: "Pricing", href: "#pricing" }
                                ];
                                defaultProps.commands = [
                                    { id: "docs", label: "Go to Docs", icon: "📚", description: "Browse docs" },
                                    { id: "components", label: "Open Components", icon: "🧩", description: "Jump to components" },
                                    { id: "search", label: "Search UI Patterns", icon: "🔎", description: "Find matching component" }
                                ];
                            }

                            // Component bazlı özel proplar / çakışma önleyici
                            if (slug === "command-palette") {
                                defaultProps.defaultOpen = true;
                            } else if (slug === "gravity-well-hero") {
                                defaultProps.items = ["⚡", "🎨", "🔧", "🚀", "💎", "🌊"];
                            } else if (slug === "bento-grid") {
                                defaultProps.items = [
                                    { title: "Fast", description: "Blazing speed", span: 2 },
                                    { title: "Secure", description: "Enterprise ready" }
                                ];
                            } else if (slug === "breadcrumb-morph") {
                                defaultProps.items = [
                                    { label: "Home", href: "/" },
                                    { label: "Components", href: "/components" }
                                ];
                            } else if (slug === "timeline") {
                                defaultProps.items = [
                                    { title: "Point 1", description: "First timeline event", date: "2024" },
                                    { title: "Point 2", description: "Second timeline event", date: "2025" }
                                ];
                            } else if (slug === "thread-connector") {
                                defaultProps.from = { x: 50, y: 50 };
                                defaultProps.to = { x: 250, y: 150 };
                            } else if (slug === "particle-coalesce-loader") {
                                defaultProps.className = "w-full h-64";
                            } else if (slug === "blueprint-loader") {
                                defaultProps.width = 300;
                                defaultProps.height = 200;
                            } else if (slug === "dna-loader") {
                                defaultProps.size = 80;
                            } else if (slug === "pulse-relay-loader" || slug === "clay-morph-skeleton") {
                                defaultProps.className = "w-full max-w-sm mx-auto";
                            } else if (slug === "comparison-matrix") {
                                defaultProps.plans = ["Free", "Pro", "Enterprise"];
                            }
                            // Generic fallback for any component that might ask for 'text', 'children', 'items', 'stats', 'blocks', 'nodes', 'metadata', 'logos' or 'plans' not explicitly covered above
                            if (!("text" in defaultProps)) defaultProps.text = "Aurae UI";
                            if (!("children" in defaultProps)) defaultProps.children = "Aurae UI";
                            if (!("items" in defaultProps)) defaultProps.items = [{ title: "Item 1", label: "Item 1" }, { title: "Item 2", label: "Item 2" }];
                            if (!("stats" in defaultProps)) defaultProps.stats = [{ value: 100, label: "Stat 1" }];
                            if (!("blocks" in defaultProps)) defaultProps.blocks = [1, 2, 3];
                            if (!("nodes" in defaultProps)) defaultProps.nodes = [1, 2, 3];
                            if (!("metadata" in defaultProps)) defaultProps.metadata = [{ label: "React", icon: "⚛" }, { label: "TypeScript", icon: "📘" }];
                            if (!("logos" in defaultProps)) defaultProps.logos = [{ name: "Aurae UI" }, { name: "Next.js" }, { name: "Tailwind CSS" }];
                            if (!("plans" in defaultProps)) defaultProps.plans = [
                                { name: "Starter", monthly: 9, annual: 7, features: ["5 projects"] },
                                { name: "Pro", monthly: 29, annual: 24, features: ["Unlimited projects", "Analytics"], popular: true }
                            ];
                            if (!("features" in defaultProps)) defaultProps.features = [
                                { title: "Speed", name: "Speed", description: "Built for performance", icon: "⚡", values: ["Fast", "Faster"] },
                                { title: "Design", name: "Design", description: "Beautiful defaults", icon: "🎨", values: ["Good", "Great"] }
                            ];

                            return (
                                <ComponentPreview code={item.code}>
                                    {slug === "command-palette" && (
                                        <div className="absolute top-8 left-1/2 -translate-x-1/2 text-center text-slate-500 text-sm font-medium z-10 px-4 py-2 bg-white/50 dark:bg-black/50 backdrop-blur-md rounded-full border border-gray-200 dark:border-gray-800">
                                            Press <kbd className="px-1.5 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 font-mono text-xs">⌘</kbd> + <kbd className="px-1.5 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 font-mono text-xs">K</kbd> to open the palette
                                        </div>
                                    )}
                                    <TargetComponent {...defaultProps} />
                                </ComponentPreview>
                            );
                        })()}

                        {/* Pagination */}
                        <div className="mt-16 flex items-center justify-between pt-6 border-t border-gray-200 dark:border-border-dark">
                            {prevKey && prevItem ? (
                                <Link href={`/components/${prevKey}`} className="flex flex-col gap-1 text-left group">
                                    <span className="text-xs font-medium text-slate-500 flex items-center gap-1 group-hover:text-primary transition-colors">
                                        <ArrowLeft className="w-3.5 h-3.5" />
                                        Previous
                                    </span>
                                    <span className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-primary transition-colors">
                                        {prevItem.name}
                                    </span>
                                </Link>
                            ) : <div></div>}

                            {nextKey && nextItem ? (
                                <Link href={`/components/${nextKey}`} className="flex flex-col gap-1 text-right group">
                                    <span className="text-xs font-medium text-slate-500 flex items-center justify-end gap-1 group-hover:text-primary transition-colors">
                                        Next
                                        <ArrowRight className="w-3.5 h-3.5" />
                                    </span>
                                    <span className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-primary transition-colors">
                                        {nextItem.name}
                                    </span>
                                </Link>
                            ) : <div></div>}
                        </div>

                    </div>
                </main>
            </div>
        </div>
    );
}
