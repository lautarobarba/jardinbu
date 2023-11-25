import { ConfigMenu } from "@/components/config-button/ConfigMenu";
import { GardenNavbar } from "@/components/navbar/GardenNavbar";
import { LandingNavbar2 } from "@/components/navbar/LandingNavbar2";

export default function GardenLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="antialiased bg-gray-50 dark:bg-gray-900">
            {/* <GardenNavbar /> */}
            <LandingNavbar2 />
            {/* <ConfigMenu type="both" /> */}
            <main className="p-4 min-h-screen pt-20 bg-light dark:bg-dark">
                {children}
            </main>
        </div>
    );
}
