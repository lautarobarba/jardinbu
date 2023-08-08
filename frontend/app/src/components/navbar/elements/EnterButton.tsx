import Link from "next/link";
import { Button } from "@/components/generic/ui/Button";
import { useContext } from "react";
import { LangContext } from "@/providers/LanguageProvider";

export const EnterButton = () => {
  const { lang } = useContext(LangContext);
  return (
    <Link href="/library">
      <Button>
        {lang == "es" && "Biblioteca"}
        {lang == "en" && "Library"}
      </Button>
    </Link>
  );
};
