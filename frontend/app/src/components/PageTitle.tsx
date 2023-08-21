interface PageTitleProps {
    title: string;
    className?: string;
}

export const PageTitle = (props: PageTitleProps) => {
    const { title, className } = props;
    return <h1 className={`text-center mb-4 text-xl md:text-2xl tracking-tight font-extrabold text-dark dark:text-light ${className}`}>{title}</h1>;
};
