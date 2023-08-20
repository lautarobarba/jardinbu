interface PageTitleProps {
    title: string;
    className?: string;
}

export const PageTitle = (props: PageTitleProps) => {
    const { title, className } = props;
    return <h1 className={`text-center pb-4 pt-4 text-dark dark:text-light wei ${className}`}>{title}</h1>;
};
