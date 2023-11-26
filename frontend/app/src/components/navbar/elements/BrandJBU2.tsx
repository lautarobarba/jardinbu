import { Divider } from "@nextui-org/react";
import Link from "next/link";

interface BrandJBUProps {
  href: string;
}

export const BrandJBU2 = (props: BrandJBUProps) => {
  const { href } = props;
  return (
    <Link href={href} className="flex items-center">
      {/* <span className="text-xl md:text-2xl font-semibold whitespace-nowrap text-white">
        <img
          loading='lazy'
          src="/assets/images/logo-blanco.webp"
          alt="Logo JBU"
          title="Logo JBU"
          className="w-60 md:w-80 lg:w-32"
        />
      </span> */}
      {/* TODO DIVIDER VERTICAL BLANCO */}
      {/* <Divider orientation="vertical" style={{ backgroundColor: 'black' }} /> */}
      <span className="text-xl md:text-2xl font-semibold whitespace-nowrap text-white">
        Biblioteca del bosque
      </span>
    </Link>
  );
};
