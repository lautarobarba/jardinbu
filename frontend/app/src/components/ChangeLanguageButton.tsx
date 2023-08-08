"use client";
import { useContext } from "react";
import { LangContext } from "@/providers/LanguageProvider";
export const ChangeLanguageButton = () => {
  const { lang, setLang } = useContext(LangContext);
  return (
    <>
      <div>
        <button onClick={() => setLang("en")}>EN</button>
        {" | "}
        <button onClick={() => setLang("es")}>ES</button>
        <p>Lang: {lang}</p>
      </div>
    </>
  );
};
