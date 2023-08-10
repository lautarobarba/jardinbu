import { LangOptions } from "@/providers/LanguageProvider";

type DictionaryContent = {
  // El contenido de cada diccionario
  publicNavBarContent: {
    home: string;
    inst: string;
    team: string;
    map: string;
  };
  instSection: {
    title: string;
    contentParagraph1: string;
    contentParagraph2: string;
    contentParagraph3: string;
    objective: string;
  };
};

type DictionaryType = {
  en: DictionaryContent;
  es: DictionaryContent;
};

export const getDictionary = (lang: LangOptions): DictionaryContent => {
  // Un diccionario por cada lenguaje
  const diccionario: DictionaryType = {
    en: {
      publicNavBarContent: {
        home: "Home",
        inst: "Institucional",
        team: "Team",
        map: "Map",
      },
      instSection: {
        title: "History",
        contentParagraph1: "FALTA TRADUCCIÓN....",
        contentParagraph2: "FALTA TRADUCCIÓN....",
        contentParagraph3: "FALTA TRADUCCIÓN....",
        objective: "FALTA TRADUCCIÓN....",
      },
    },
    es: {
      publicNavBarContent: {
        home: "Inicio",
        inst: "Institucional",
        team: "Equipo",
        map: "Mapa",
      },
      instSection: {
        title: "Historia",
        contentParagraph1:
          "En 2018, se firmó el convenio N°12.546/18 entre la Municipalidad de Ushuaia la Asociación Nuria TDF, que fue ratificado por el Concejo Deliberante de Ushuaia. Este convenio otorgó a la Asociación el uso y custodia de un predio de 10 hectáreas de bosque nativo en el área de Dos Banderas, con el propósito de crear el Jardín Botánico de Ushuaia.",
        contentParagraph2:
          "La Asociación fue creada en 1997 (personería jurídica N° 415).",
        contentParagraph3: "Su objeto social es",
        objective:
          "Propiciar la interacción armónica del hombre con su medio natural y cultural.",
      },
    },
  } as DictionaryType;

  return diccionario[lang];
};
