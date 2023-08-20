"use client";

import { HelpCircleIcon, NetworkIcon, NewspaperIcon, PieChartIcon, QrCodeIcon, SearchCheckIcon, TreeDeciduousIcon, TreesIcon, UsersIcon } from "lucide-react";

interface DashboardSidebarProps {
    expandSidebar: boolean;
}

export const DashboardSidebar = (props: DashboardSidebarProps) => {
    const { expandSidebar } = props;

    return (
        <aside
            className={`fixed top-0 left-0 z-40 w-64 h-screen pt-14 transition-transform 
            ${expandSidebar ? '' : '-translate-x-full'}
            bg-white border-r border-gray-200 md:translate-x-0 dark:bg-gray-800 dark:border-gray-700`}
            aria-label="Sidenav"
            id="drawer-navigation"
        >
            <div className="overflow-y-auto py-5 px-3 h-full bg-white dark:bg-gray-800">
                <ul className="space-y-2">
                    <li>
                        <a
                            href="#"
                            className="flex items-center p-2 text-base font-medium text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                        >
                            <PieChartIcon />
                            <span className="ml-3">Resumen</span>
                        </a>
                    </li>
                    <li>
                        <a
                            href="#"
                            className="flex items-center p-2 text-base font-medium text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                        >
                            <SearchCheckIcon />
                            <span className="ml-3">Buscador</span>
                        </a>
                    </li>
                    <li>
                        <a
                            href="#"
                            className="flex items-center p-2 text-base font-medium text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                        >
                            <NewspaperIcon />
                            <span className="ml-3">Blog</span>
                        </a>
                    </li>
                    <li>
                        <a
                            href="#"
                            className="flex items-center p-2 text-base font-medium text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                        >
                            <UsersIcon />
                            <span className="ml-3">Usuarios</span>
                        </a>
                    </li>
                    <li>
                        <a
                            href="#"
                            className="flex items-center p-2 text-base font-medium text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                        >
                            <NetworkIcon />
                            <span className="ml-3">Taxonomía</span>
                        </a>
                    </li>
                    <li>
                        <a
                            href="#"
                            className="flex items-center p-2 text-base font-medium text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                        >
                            <TreesIcon />
                            <span className="ml-3">Especies</span>
                        </a>
                    </li>
                    <li>
                        <a
                            href="#"
                            className="flex items-center p-2 text-base font-medium text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                        >
                            <TreeDeciduousIcon />
                            <span className="ml-3">Ejemplares</span>
                        </a>
                    </li>
                    <li>
                        <a
                            href="#"
                            className="flex items-center p-2 text-base font-medium text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                        >
                            <QrCodeIcon />
                            <span className="ml-3">Códigos QR</span>
                        </a>
                    </li>
                </ul>

            </div>
            <div
                className="absolute bottom-0 left-0 p-4 space-x-4 w-full bg-white dark:bg-gray-800 z-20"
            >
                <ul
                    className="pt-5 mt-5 space-y-2 border-t border-gray-200 dark:border-gray-700"
                >
                    <li>
                        <a
                            href="#"
                            className="flex items-center p-2 text-base font-medium text-gray-900 rounded-lg transition duration-75 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white group"
                        >
                            <HelpCircleIcon />
                            <span className="ml-3">Ayuda</span>
                        </a>
                    </li>
                </ul>
            </div>
        </aside>
    );
}