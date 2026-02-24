import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";

export default function DocsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-background-light text-text-main flex flex-col font-display">
            <Topbar />
            <div className="flex flex-1 w-full mx-auto max-w-[1600px]">
                <Sidebar />
                <main className="flex-1 w-full md:pl-64 min-h-[calc(100vh-64px)] overflow-x-hidden">
                    <div className="w-full max-w-5xl mx-auto p-6 md:p-10 lg:p-14">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
