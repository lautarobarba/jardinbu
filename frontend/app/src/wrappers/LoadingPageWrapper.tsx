"use client";
import { ThemeContext } from "@/providers/ThemeProvider";
import { ReactNode, useContext } from "react";
import Image from "next/image";
import { LangContext } from "@/providers/LanguageProvider";
import Logo from "@/assets/images/logo-circulo.png";

const LoadingPage = () => {
  return (
    <section id="loading" className="bg-white h-screen">
      <h1 className="mb-4 text-4xl font-extrabold tracking-tight leading-none text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
        Jardín botánico de ushuaia
      </h1>

      <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
        <div className="mx-auto max-w-screen-sm text-center">
          {/* <h1 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">
            Jardín botánico de ushuaia
          </h1> */}
          <br />
          <h2 className="text-gray-500 sm:text-xl dark:text-gray-400">
            CARGANDO...
          </h2>

          <br />
          <br />
          <div className="text-center">
            <Image
              alt="logo-jbu"
              title="logo-jbu"
              src={Logo}
              placeholder="empty"
              width={200}
              height={200}
              style={{
                maxWidth: "100%",
                height: "auto",
              }}
              className="animate-spin m-auto"
              priority={false}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

type LoadingPageWrapperProps = {
  children?: ReactNode;
};

export const LoadingPageWrapper = (props: LoadingPageWrapperProps) => {
  const { children } = props;
  const { loading: loadingTheme } = useContext(ThemeContext);
  const { loading: loadingLang } = useContext(LangContext);
  // return <>{loadingTheme || loadingLang ? <LoadingPage /> : <>{children}</>}</>;
  return <>{true ? <LoadingPage /> : <>{children}</>}</>;
};
