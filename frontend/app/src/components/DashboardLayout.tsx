"use client";
import { useState } from "react";
import { DashboardNavbar } from "./navbar/DashboardNavbar";
import { DashboardSidebar } from "./navbar/DashboardSidebar";

export const DashboardLayout = () => {
    const [expandSidebar, setExpandSidebar] = useState<boolean>(false);

    const toggleSidebar = () => {
        setExpandSidebar(!expandSidebar);
    }

    return (
        <>
            <DashboardNavbar
                expandSidebar={expandSidebar}
                toggleSidebar={toggleSidebar}
            />
            <DashboardSidebar
                expandSidebar={expandSidebar}
            />
        </>
    );
}