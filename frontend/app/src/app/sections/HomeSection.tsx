import './HomeSection.css';

export const HomeSection = () => {
    return (
        <section
            id="home"
            className="h-screen bg-light dark:bg-dark text-center forest-summer-background flex justify-center items-center"
        >
            <div className='flex flex-col items-center'>
                <img
                    src="/assets/images/logo-circulo.png"
                    alt="Logo JBU"
                    title="Logo JBU"
                    width="350"
                />
                <h1
                    className="text-white"
                    style={{ textShadow: "5px 5px 5px black", fontSize: "3rem" }} data-aos="zoom-in-up"
                >
                    Jardín Botánico de Ushuaia
                </h1>
            </div>
        </section>
    );
}