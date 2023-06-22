interface Props {
  title: string;
  className?: string;
}

export const PageTitle = (props: Props) => {
  const { title, className } = props;
  return <h1 className={`text-center pb-4 pt-4 ${className}`}>{title}</h1>;
};
