import Link from "next/link";

export const Brand = () => {
  return (
    <Link href="/" className="flex items-center">
      <span className="text-xl text-2xl font-semibold whitespace-nowrap text-dark dark:text-light">
        Jardín Botánico de Ushuaia
      </span>
    </Link>
  );
};
