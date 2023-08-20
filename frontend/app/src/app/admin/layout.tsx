import { DashboardLayout } from "@/components/DashboardLayout";
import { ConfigMenu } from "@/components/config-button/ConfigMenu";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="antialiased bg-gray-50 dark:bg-gray-900">
            <DashboardLayout />
            <ConfigMenu type="theme" />
            <main className="p-4 md:ml-64 h-auto pt-20">
                {children}
            </main>
        </div>
    );
}
