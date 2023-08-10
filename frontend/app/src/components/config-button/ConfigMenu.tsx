"use client";
import { useContext, useState } from "react";
import { ThemeContext } from "@/providers/ThemeProvider";
import { MoonIcon } from "@/components/icons/MoonIcon";
import { SunIcon } from "@/components/icons/SunIcon";
import { LangContext } from "@/providers/LanguageProvider";

import {
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownSection,
    DropdownItem,
    Button
} from "@nextui-org/react";

export const ConfigMenu = () => {
    const { theme, toggleTheme } = useContext(ThemeContext);
    const { lang, setLang } = useContext(LangContext);

    return (
        <div id="config-menu" className="fixed right-5 bottom-5">
            <div className="flex flex-row items-center">
                <Button isIconOnly type="button" size="sm" onClick={toggleTheme} className="h-8 bg-light dark:bg-dark p-1">
                    <span className="mx-1 text-dark dark:text-light">{theme === "light" ? <MoonIcon /> : <SunIcon />}</span>
                </Button>

                <Dropdown className="h-auto">
                    <DropdownTrigger>
                        <Button isIconOnly type="button" size="sm" className="h-8 bg-light dark:bg-dark p-1 uppercase font-semibold">
                            <span className="mx-1 text-dark dark:text-light">{lang.toLocaleUpperCase()}</span>
                        </Button>
                    </DropdownTrigger>
                    <DropdownMenu
                        aria-label="language-selector"
                        variant="solid"
                        className="text-dark dark:text-light bg-light dark:bg-dark hover:bg-red w-auto"
                    // TODO: Arreglar el ancho de las opciones
                    // style={{ width: '1rem !important' }}
                    >
                        <DropdownItem key="ES" onClick={() => setLang("es")} className="text-dark dark:text-light bg-light dark:bg-dark hover:bg-red w-auto">
                            ES
                        </DropdownItem>
                        <DropdownItem key="EN" onClick={() => setLang("en")} className="text-dark dark:text-light bg-light dark:bg-dark hover:bg-red w-auto">
                            EN
                        </DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </div>
        </div>
    );
}