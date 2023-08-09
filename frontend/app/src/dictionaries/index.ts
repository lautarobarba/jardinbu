import { LangOptions } from "@/providers/LanguageProvider";

type DictionaryContent = {
  // El contenido de cada diccionario
  publicNavBarContent: {
    home: string;
    inst: string;
    team: string;
    map: string;
  };
};

type DictionaryType = {
  // Un diccionario por cada lenguaje
  en: DictionaryContent;
  es: DictionaryContent;
};

export const getDictionary = (lang: LangOptions): DictionaryContent => {
  const diccionario: DictionaryType = {
    en: {
      publicNavBarContent: {
        home: "Home",
        inst: "Institucional",
        team: "Team",
        map: "Map",
      },
    },
    es: {
      publicNavBarContent: {
        home: "Inicio",
        inst: "Institucional",
        team: "Equipo",
        map: "Mapa",
      },
    },
  } as DictionaryType;

  return diccionario[lang];
};
