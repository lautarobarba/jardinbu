import Link from "next/link";

interface BrandBDBProps {
  href: string;
}

export const BrandBDB = (props: BrandBDBProps) => {
  const { href } = props;
  return (
    <Link href={href} className="flex items-center">
      <span className="text-xl md:text-2xl font-semibold whitespace-nowrap text-white">
        Biblioteca del Bosque
      </span>
    </Link>
  );
};
