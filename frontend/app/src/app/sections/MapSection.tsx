"use client";
import { getDictionary } from "@/dictionaries";
import { LangContext } from "@/providers/LanguageProvider";
import { Button } from "@nextui-org/react";
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
                <div className="mx-auto max-w-screen-sm text-center">
                    <h2 className="mb-4 text-3xl lg:text-4xl tracking-tight font-extrabold text-dark dark:text-light">{dictionary.mapSection.title}</h2>
                </div>
                <div className="mx-auto max-w-screen-sm text-center my-5">
                    <img
                        loading='lazy'
                        src="/assets/images/cartel.jpg"
                        alt="dashboard image"
                        className="w-auto h-60 md:h-full mx-auto rounded-lg border-2 border-primary"
                    />
                </div>
                <div className="mx-auto text-center">
                    <Button color="primary" radius="sm" className="w-auto uppercase">¡{dictionary.mapSection.navigateButton}!</Button>
                </div>
            </div>
        </section>
    );
}
