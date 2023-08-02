import Image from "next/image";
import Link from "next/link";

export const Brand = () => {
  return (
    <Link href="/" className="flex items-center">
      {/* WideScreen */}
      <span className="hidden md:block self-center text-2xl font-semibold whitespace-nowrap text-dark dark:text-light">
        Jardín Botánico de Ushuaia
      </span>
      {/* PhoneScreen */}
      <span className="block md:hidden self-center text-2xl font-semibold whitespace-nowrap text-dark dark:text-light">
        Jardín Botánico Ush
      </span>
    </Link>
  );
};
