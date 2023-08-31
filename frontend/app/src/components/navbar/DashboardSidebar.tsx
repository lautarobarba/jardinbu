"use client";

import { HelpCircleIcon, NetworkIcon, NewspaperIcon, PieChartIcon, QrCodeIcon, SearchCheckIcon, TreeDeciduousIcon, TreesIcon, UsersIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface DashboardSidebarProps {
    expandSidebar: boolean;
}

export const DashboardSidebar = (props: DashboardSidebarProps) => {
    const { expandSidebar } = props;
    const pathname = usePathname()

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
                        <Link
                            href="/admin"
                            className={`
                                flex items-center p-2 text-base font-medium rounded-lg
                                text-gray-900 dark:text-white
                                ${pathname === '/admin'
                                    ? "bg-gray-100 dark:bg-gray-700 group"
                                    : "hover:bg-gray-100 dark:hover:bg-gray-700 group"
                                }
                            `}
                        >
                            <PieChartIcon />
                            <span className="ml-3">Resumen</span>
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="/admin/browser"
                            className={`
                                flex items-center p-2 text-base font-medium rounded-lg
                                text-gray-900 dark:text-white
                                ${pathname === '/admin/browser'
                                    ? "bg-gray-100 dark:bg-gray-700 group"
                                    : "hover:bg-gray-100 dark:hover:bg-gray-700 group"
                                }
                            `}
                        >
                            <SearchCheckIcon />
                            <span className="ml-3">Buscador</span>
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="/admin/blog"
                            className={`
                                flex items-center p-2 text-base font-medium rounded-lg
                                text-gray-900 dark:text-white
                                ${pathname === '/admin/blog'
                                    ? "bg-gray-100 dark:bg-gray-700 group"
                                    : "hover:bg-gray-100 dark:hover:bg-gray-700 group"
                                }
                            `}
                        >
                            <NewspaperIcon />
                            <span className="ml-3">Blog</span>
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="/admin/users"
                            className={`
                                flex items-center p-2 text-base font-medium rounded-lg
                                text-gray-900 dark:text-white
                                ${pathname === '/admin/users'
                                    ? "bg-gray-100 dark:bg-gray-700 group"
                                    : "hover:bg-gray-100 dark:hover:bg-gray-700 group"
                                }
                            `}
                        >
                            <UsersIcon />
                            <span className="ml-3">Usuarios</span>
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="/admin/taxonomy"
                            className={`
                                flex items-center p-2 text-base font-medium rounded-lg
                                text-gray-900 dark:text-white
                                ${pathname === '/admin/taxonomy'
                                    ? "bg-gray-100 dark:bg-gray-700 group"
                                    : "hover:bg-gray-100 dark:hover:bg-gray-700 group"
                                }
                            `}
                        >
                            <NetworkIcon />
                            <span className="ml-3">Taxonomía</span>
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="/admin/species"
                            className={`
                                flex items-center p-2 text-base font-medium rounded-lg
                                text-gray-900 dark:text-white
                                ${pathname === '/admin/species'
                                    ? "bg-gray-100 dark:bg-gray-700 group"
                                    : "hover:bg-gray-100 dark:hover:bg-gray-700 group"
                                }
                            `}
                        >
                            <TreesIcon />
                            <span className="ml-3">Especies</span>
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="/admin/specimen"
                            className={`
                                flex items-center p-2 text-base font-medium rounded-lg
                                text-gray-900 dark:text-white
                                ${pathname === '/admin/specimen'
                                    ? "bg-gray-100 dark:bg-gray-700 group"
                                    : "hover:bg-gray-100 dark:hover:bg-gray-700 group"
                                }
                            `}
                        >
                            <TreeDeciduousIcon />
                            <span className="ml-3">Ejemplares</span>
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="/admin/qr-code"
                            className={`
                                flex items-center p-2 text-base font-medium rounded-lg
                                text-gray-900 dark:text-white
                                ${pathname === '/admin/qr-code'
                                    ? "bg-gray-100 dark:bg-gray-700 group"
                                    : "hover:bg-gray-100 dark:hover:bg-gray-700 group"
                                }
                            `}
                        >
                            <QrCodeIcon />
                            <span className="ml-3">Códigos QR</span>
                        </Link>
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
                        <Link
                            href="/admin/help"
                            className={`
                                flex items-center p-2 text-base font-medium rounded-lg
                                text-gray-900 dark:text-white
                                ${pathname === '/admin/help'
                                    ? "bg-gray-100 dark:bg-gray-700 group"
                                    : "hover:bg-gray-100 dark:hover:bg-gray-700 group"
                                }
                            `}
                        >
                            <HelpCircleIcon />
                            <span className="ml-3">Ayuda</span>
                        </Link>
                    </li>
                </ul>
            </div>
        </aside>
    );
}