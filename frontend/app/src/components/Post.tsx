interface Props {
  title: string;
  content: string;
}

export const Post = (props: Props) => {
  const { title, content } = props;
  return (
		<>
			<div style={{ width: '90%', margin: 'auto', border: 'solid 1px grey'}}>
				<h4 className={`text-center pb-4 pt-4`}>{title}</h4>
				<p style={{width: '50%', margin: 'auto'}}>{content}</p>
			</div>
			<br />
		</>
	);
};
