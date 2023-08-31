"use client";
import { useContext, useState } from "react";
import { DashboardBrand } from "./elements/DashboardBrand";
import { ChevronDownIcon, ChevronLeftIcon, DoorOpenIcon, KeyIcon, MenuIcon, UserIcon, XIcon } from "lucide-react";
import { AuthContext } from "@/providers/AuthProvider";

interface DashboardNavbarProps {
  expandSidebar: boolean;
  toggleSidebar: () => void;
}

export const DashboardNavbar = (props: DashboardNavbarProps) => {
  const { expandSidebar, toggleSidebar } = props;
  const [expandUserMenu, setExpandUserMenu] = useState<boolean>(false);

  const { user, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
  }

  return (
    <nav className="bg-navbar-bg px-4 py-2.5 fixed left-0 right-0 top-0 z-50">
      <div className="flex flex-wrap justify-between items-center">
        <div className="flex justify-start items-center">
          {/* Sidebar expand button */}
          <button
            type="button"
            className="inline-flex items-center p-2 text-sm text-white rounded-lg md:hidden focus:outline-none"
            onClick={toggleSidebar}
          >
            <span className="sr-only">Toggle sidebar</span>
            {expandSidebar ? <XIcon /> : <MenuIcon />}
          </button>

          {/* Brand */}
          <DashboardBrand href="/admin" role={user?.role} />
        </div>

        <div className="flex items-center lg:order-2">
          {/* Avatar */}
          <button
            type="button"
            className="flex items-center mx-3 text-sm rounded-full md:mr-0 focus:outline-none"
            onClick={() => setExpandUserMenu(!expandUserMenu)}
          >
            <span className="sr-only">Open user menu</span>
            <span className="hidden md:inline-block text-white">
              {user ? `${user.firstname.toUpperCase()} ${user.lastname.toUpperCase()}` : ""}
            </span>
            <img
              className="w-8 h-8 rounded-full ml-4 mr-2"
              src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/michael-gough.png"
              alt="user photo"
            />
            {expandUserMenu
              ? <ChevronLeftIcon className="text-white" />
              : <ChevronDownIcon className="text-white" />
            }
          </button>

          {/* UserMenu */}
          <div
            className={`${expandUserMenu ? '' : 'hidden'} absolute top-12 right-8 z-10 flex flex-col text-sm rounded bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-md`}
            id="dropdown"
          >
            <ul
              className="text-gray-900 dark:text-white"
              aria-labelledby="dropdown"
            >
              <li>
                <a
                  href="#"
                  className="flex flex-row py-2 px-4 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-400 dark:hover:text-white"
                ><UserIcon className="mr-2" />Perfil</a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex flex-row py-2 px-4 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-400 dark:hover:text-white"
                ><KeyIcon className="mr-2" />Cambiar contraseña</a>
              </li>
              <li>
                <button
                  className="w-full flex flex-row py-2 px-4 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-400 dark:hover:text-white"
                  onClick={handleLogout}
                >
                  <DoorOpenIcon className="mr-2" />Salir
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};
