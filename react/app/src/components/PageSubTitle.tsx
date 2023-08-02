interface Props {
  title: string;
  className?: string;
}

export const PageSubTitle = (props: Props) => {
  const { title, className } = props;
  return <h2 className={`${className}`}>{title}</h2>;
};
