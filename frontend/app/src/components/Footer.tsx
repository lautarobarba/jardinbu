
export const Footer = () => {
	const date: Date = new Date();
	const year: string = date.getFullYear().toString();

	return (
		<footer id='footer'>
			<div className="container d-flex justify-content-center align-items-end my-2" style={{ minHeight: '100px'}}>
				<p className="text-center text-dark">{year} - Jardín Botánico Ushuaia</p>
			</div>
		</footer>
	);
}

