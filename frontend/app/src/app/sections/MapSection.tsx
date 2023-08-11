"use client";
import { getDictionary } from "@/dictionaries";
import { LangContext } from "@/providers/LanguageProvider";
import { useContext } from "react";

export const MapSection = () => {
    const { lang } = useContext(LangContext);
    const dictionary = getDictionary(lang);

    return (
        <section
            id="map"
            className="min-h-screen bg-light dark:bg-dark text-center flex justify-center items-center"
        >
            <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
                <div className="mx-auto max-w-screen-sm text-center lg:mb-16 mb-8">
                    <h2 className="mb-4 text-3xl lg:text-4xl tracking-tight font-extrabold text-dark dark:text-light">{dictionary.mapSection.title}</h2>
                </div>
            </div>
        </section>
    );
}
