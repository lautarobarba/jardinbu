import Link from "next/link";

interface DashboardBrandProps {
  href: string;
}

export const DashboardBrand = (props: DashboardBrandProps) => {
  const { href } = props;
  return (
    <Link href={href} className="flex items-center justify-between">
      <img
        loading='lazy'
        alt="logo-jbu"
        title="logo-jbu"
        src="/assets/images/logo-circulo.png"
        width={35}
        height={35}
        style={{
          maxWidth: "100%",
          height: "auto",
          marginRight: "0.5rem"
        }}
      />
      <span className="text-xl md:text-2xl font-semibold whitespace-nowrap text-white">
        JBU<span className="hidden md:inline-block">&nbsp;-&nbsp;Dashboard (ROL)</span>
      </span>
    </Link>
  );
};
