import Link from "next/link";
import { Button } from "@/components/generic/Button";
import { useContext } from "react";
import { LangContext } from "@/providers/LanguageProvider";

export const EnterButton = () => {
  const { lang } = useContext(LangContext);

  return (
    <Link href="/library" className="w-full">
      <Button className="w-full">
        {lang == "es" && "Biblioteca"}
        {lang == "en" && "Library"}
      </Button>
    </Link>
  );
};
