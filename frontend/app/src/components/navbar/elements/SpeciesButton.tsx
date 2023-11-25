import Link from "next/link";
import { Button } from "@nextui-org/react";
import { useContext } from "react";
import { LangContext } from "@/providers/LanguageProvider";

export const SpeciesButton = () => {

  return (
    <Link href="/garden/species" className="w-full">
      <Button radius="sm" className="w-full uppercase">
        Especies
      </Button>
    </Link>
  );
};
