import { ConfigMenu } from "@/components/config-button/ConfigMenu";
import { DashboardNavbar } from "@/components/navbar/DashboardNavbar";
import { DashboardSidebar } from "@/components/navbar/DashboardSidebar";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="antialiased bg-gray-50 dark:bg-gray-900">
            <DashboardNavbar />
            {/* <ConfigMenu /> */}
            <DashboardSidebar />
            <main className="p-4 md:ml-64 h-auto pt-20">
                {children}
            </main>
        </div>
    );
}
