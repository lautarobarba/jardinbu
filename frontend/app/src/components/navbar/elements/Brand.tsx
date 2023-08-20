import Link from "next/link";

interface BrandProps {
  href: string;
}

export const Brand = (props: BrandProps) => {
  const { href } = props;
  return (
    <Link href={href} className="flex items-center">
      <span className="text-xl md:text-2xl font-semibold whitespace-nowrap text-white">
        Jardín Botánico de Ushuaia
      </span>
    </Link>
  );
};
