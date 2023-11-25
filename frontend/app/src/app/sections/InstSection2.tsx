// "use client";
const TarjetaEtapa = ({
    bgColor,
    title,
    par,
    img1,
    img2,
}: {
    bgColor: string,
    title: string,
    par: string,
    img1: string,
    img2: string,
}) => {
    return (
        <div
            className="md:grid md:grid-cols-3 px-2 py-4 mb-3"
            style={{ backgroundColor: bgColor, borderRadius: '0.2rem' }}
        >
            <div className="px-2">
                <h3
                    className="text-left text-xl tracking-tight font-extrabold"
                    style={{ color: '#44722C' }}
                >
                    {title}
                </h3>
                <p className="text-left mb-2">{par}</p>
            </div>
            <img src={img1} title={`${title} 1`} alt={`${title} 1`} className="px-2" />
            <img src={img2} title={`${title} 2`} alt={`${title} 2`} className="px-2" />
        </div>
    );
}
export const InstSection2 = () => {
    return (
        <section
            id="inst"
            className="min-h-screen bg-light dark:bg-dark text-center"
            style={{ paddingTop: '10rem' }}
        >
            <div
                className="gap-8 items-center py-8 px-4 mx-auto max-w-screen-xl xl:gap-16 md:grid md:grid-cols-1 sm:py-16 lg:px-6"
                style={{ backgroundColor: '#BE1E2D', borderRadius: '0.2rem' }}
            >
                <div className="mt-4 md:mt-0 text-left">
                    <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-white">
                        El Proyecto
                    </h2>

                    <p className="mb-2 font-light text-light md:text-lg ">
                        La Biblioteca del Bosque Bordada es un proyecto de característica científica y cultural, donde se unieron los
                        saberes biológicos y el arte para confiormar ...... Fue subsidiado por la Fundación Williams y apollado por
                        todos loq ue formaron parte ......
                        Apuntamos a poder llevar este proyecto ..... OBJETIVOS, INSPIRACIÓN, OPORTUNIDAD....
                    </p>
                </div>
            </div>

            <div className="items-center py-8 px-4 md:px-0 mx-auto max-w-screen-xl md:grid md:grid-cols-1 sm:py-16">
                <h2 className="text-left mb-3 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">
                    Etapas de desarrollo
                </h2>
                <hr className="bg-dark dark:bg-light mb-10" />

                <TarjetaEtapa
                    bgColor="#E6E7E8"
                    title="Relevamiento de especies nativas"
                    par="Primero se relevaron especies de flora del bosque que se encuentra en el Jardin Botánico y se seleccionaron 80 para representar."
                    img1="/assets/images/proyecto/proy_1.webp"
                    img2="/assets/images/proyecto/proy_1.webp"
                />

                <TarjetaEtapa
                    bgColor="inherit"
                    title="Conversión de fotos a dibujos para el lienzo y selección de colores"
                    par="Se sacaron fotos o se consiguieron dibujos de las especies, se imprimieron y calcaron para pasarlos a las telas a bordar."
                    img1="/assets/images/proyecto/proy_1.webp"
                    img2="/assets/images/proyecto/proy_1.webp"
                />

                <TarjetaEtapa
                    bgColor="#E6E7E8"
                    title="Reuniones mensuales de equipo de bordadoras"
                    par="Se sacaron fotos o se consiguieron dibujos de las especies, se imprimieron y calcaron para pasarlos a las telas a bordar."
                    img1="/assets/images/proyecto/proy_1.webp"
                    img2="/assets/images/proyecto/proy_1.webp"
                />

            </div>

        </section>
    );
}
