"use client";
import { useContext, useState } from "react";
import { ThemeContext } from "@/providers/ThemeProvider";
import { MoonIcon } from "@/components/icons/MoonIcon";
import { SunIcon } from "@/components/icons/SunIcon";
import { LangContext } from "@/providers/LanguageProvider";

// MenuBar
import {
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarTrigger,
} from "@/components/generic/Menubar"

export const ConfigMenu = () => {
    const { theme, toggleTheme } = useContext(ThemeContext);
    const { lang, setLang } = useContext(LangContext);

    return (
        <div id="config-menu" className="absolute right-5 bottom-5">
            <Menubar>
                {/* ToggleThemeButton */}
                <MenubarMenu>
                    <MenubarTrigger onClick={toggleTheme}>
                        <span className="mx-1">{theme === "light" ? <MoonIcon /> : <SunIcon />}</span>
                    </MenubarTrigger>
                </MenubarMenu>
                {/* ChangeLanguageButton */}
                <MenubarMenu>
                    <MenubarTrigger>
                        <span className="mx-1">{lang.toLocaleUpperCase()}</span>
                    </MenubarTrigger>
                    <MenubarContent>
                        <MenubarItem onClick={() => setLang("es")}>
                            ES
                        </MenubarItem>
                        <MenubarItem onClick={() => setLang("en")}>
                            EN
                        </MenubarItem>
                    </MenubarContent>
                </MenubarMenu>
            </Menubar>
        </div>
    );
}