interface PageSubTitleProps {
    title: string;
    className?: string;
}

export const PageSubTitle = (props: PageSubTitleProps) => {
    const { title, className } = props;
    return <h2 className={`text-center mb-4 text-lg md:text-xl tracking-tight font-extrabold text-dark dark:text-light ${className}`}>{title}</h2>;
};
