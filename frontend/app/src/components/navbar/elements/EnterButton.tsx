import Link from "next/link";
import { Button } from "@nextui-org/react";
import { useContext } from "react";
import { LangContext } from "@/providers/LanguageProvider";

export const EnterButton = () => {
  const { lang } = useContext(LangContext);

  return (
    <Link href="/garden" className="w-full">
      <Button color="primary" radius="sm" className="w-full uppercase">
        {lang == "es" && "Jardín"}
        {lang == "en" && "Garden"}
      </Button>
    </Link>
  );
};
