"use client";
import { useContext, useState } from "react";
import Link from "next/link";
import { Brand } from "./elements/Brand";
import { EnterButton } from "./elements/EnterButton";
import { LangContext } from "@/providers/LanguageProvider";
import { Dictionary } from "@/utils/Dictionary";

export const PublicNavbar = () => {
  const [expandNavbar, setExpandNavbar] = useState<boolean>(false);

  const { lang } = useContext(LangContext);
  const getDictionary = (lang: keyof Dictionary) => {
    const dictionaries: Dictionary = {
      es: {
        home: "Inicio",
        inst: "Institucional",
        team: "Equipo",
        map: "Mapa",
      },
      en: {
        home: "Home",
        inst: "Institucional",
        team: "Team",
        map: "Map",
      },
    };
    return dictionaries[lang];
  };
  const dict = getDictionary(lang);

  return (
    <nav className="bg-light dark:bg-dark fixed w-full z-20 top-0 left-0 border-b border-gray-200 dark:border-gray-600">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Brand />
        <div className="flex md:hidden md:order-2">
          <button
            data-collapse-toggle="navbar-sticky"
            type="button"
            className="inline-flex items-center p-2 text-sm text-dark rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-light dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            aria-controls="navbar-sticky"
            aria-expanded="false"
          >
            <span className="sr-only">Open menu</span>
            <svg
              className="w-6 h-6"
              aria-hidden="true"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clipRule="evenodd"
              ></path>
            </svg>
          </button>
        </div>
        <div
          className="items-center justify-between w-full md:flex md:w-auto md:order-1"
          id="navbar-sticky"
        >
          <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium md:flex-row md:space-x-8 md:mt-0 md:border-0 text-light dark:text-dark">
            <li className="flex items-center">
              <Link
                href="/#home"
                className="block py-2 pl-3 pr-4 text-accent dark:text-accent-dark md:p-0"
              >
                {dict.home}
              </Link>
            </li>
            <li className="flex items-center">
              <Link
                href="/#inst"
                className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
              >
                {dict.inst}
              </Link>
            </li>
            <li className="flex items-center">
              <Link
                href="/#team"
                className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
              >
                {dict.team}
              </Link>
            </li>
            <li className="flex items-center">
              <Link
                href="/#map"
                className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
              >
                {dict.map}
              </Link>
            </li>
            <li className="flex items-center">
              <EnterButton />
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};
