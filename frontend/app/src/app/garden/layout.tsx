import { ConfigMenu } from "@/components/config-button/ConfigMenu";
import { GardenNavbar } from "@/components/navbar/GardenNavbar";

export default function GardenLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="antialiased bg-gray-50 dark:bg-gray-900">
            <GardenNavbar />
            <ConfigMenu />
            <main>
                {children}
            </main>
        </div>
    );
}
