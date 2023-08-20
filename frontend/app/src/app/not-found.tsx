"use client";
import { useContext } from "react";
import { LangContext } from '@/providers/LanguageProvider';
import { Button } from '@nextui-org/react';
import Link from 'next/link';

export const NotFound = () => {
    const { lang } = useContext(LangContext);
    return (
        <section
            className="min-h-screen bg-light dark:bg-dark text-center flex justify-center items-center"
        >
            <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
                <div className="mx-auto max-w-screen-sm text-center">
                    <h1 className="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-primary-600 dark:text-primary-500">
                        404
                    </h1>
                    <p className="mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl dark:text-white">
                        {lang == "es" && "Página no encontrada"}
                        {lang == "en" && "Page not found"}
                    </p>
                    <p className="mb-4 text-lg font-light text-gray-500 dark:text-gray-400">
                        {lang == "es" && `Será redireccionado automáticamente en ${'X'} segundos...`}
                        {lang == "en" && `You will be automatically redirected in ${'X'} seconds...`}
                    </p>
                    <Link href="/garden">
                        <Button color="primary" radius="sm" className="uppercase">
                            {lang == "es" && "Volver al inicio"}
                            {lang == "en" && "Back to home"}
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    )
}
export default NotFound;