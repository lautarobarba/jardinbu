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

                    <p className="mb-2 font-light text-light md:text-lg">
                        La Biblioteca del Bosque del Jardín Botánico de Ushuaia (JBU) - Un proyecto que iniciamos en octubre de 2022 con un subsidio de la Fundación Williams.
                    </p>
                    <p className="mb-2 font-light text-light md:text-lg">
                        Nos propusimos crear una biblioteca virtual a la que se pueda acceder a través de códigos QR ubicados en la cartelería del sendero de interpretación del JBU. Se realizó la investigación de las especies listadas en el informe florístico del JBU y se catalogó el material encontrado para
                        formar la biblioteca. La página que aloja la biblioteca virtual fue el resultado del trabajo de un estudiante de la carrera de Sistemas de la UNTDF.
                    </p>
                    <p className="mb-2 font-light text-light md:text-lg">
                        Con la idea de contribuir a la difusión de las especies a través del arte, creamos la Biblioteca Bordada, una realización conjunta de dieciséis bordadoras de nuestra comunidad.
                    </p>
                    <p className="mb-2 font-light text-light md:text-lg">
                        Además, invitamos a jóvenes a una capacitación en flora nativa y exótica del JBU para que hablen de este proyecto, desde su vivencia, en esta muestra itinerante.
                    </p>
                </div>
            </div>

            <div
                id="stages"
                className="items-center py-8 px-4 md:px-0 mx-auto max-w-screen-xl md:grid md:grid-cols-1 sm:py-16"
            >
                <h2 className="text-left mb-3 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">
                    Etapas de desarrollo
                </h2>
                <hr className="bg-dark dark:bg-light mb-10" />

                <TarjetaEtapa
                    bgColor="#E6E7E8"
                    title="Selección de las especies para bordar"
                    par="A partir del Relevamiento Florístico realizado en el Jardín Botánico de Ushuaia, se seleccionaron 48 especies para representar en la Biblioteca Bordada."
                    img1="/assets/images/proyecto/proy_1.webp"
                    img2="/assets/images/proyecto/proy_2.webp"
                />

                <TarjetaEtapa
                    bgColor="inherit"
                    title="Preparación para el bordado"
                    par="Se realizó la composición de los diseños y se los transfirió a la tela. Se hizo la selección de colores para representar cada ilustración y se armaron los kits de bordado."
                    img1="/assets/images/proyecto/proy_3.webp"
                    img2="/assets/images/proyecto/proy_4.webp"
                />

                <TarjetaEtapa
                    bgColor="#E6E7E8"
                    title="Reuniones mensuales del grupo de bordadoras"
                    par="Se conformó un grupo de 16 bordadoras que se reunieron a trabajar en la Casa de Té del JBU dos veces al mes."
                    img1="/assets/images/proyecto/proy_5.webp"
                    img2="/assets/images/proyecto/proy_6.webp"
                />

                <TarjetaEtapa
                    bgColor="#inherit"
                    title="Armado de exhibidores"
                    par="Los bordados fueron montados en exhibidores hechos en madera de lenga, sobre caballetes. Esto permite que la muestra sea itinerante."
                    img1="/assets/images/proyecto/proy_7.webp"
                    img2="/assets/images/proyecto/proy_8.webp"
                />

                <TarjetaEtapa
                    bgColor="#E6E7E8"
                    title="Búsqueda de información y creación de la página web"
                    par="Se realizó una búsqueda de información sobre cada una de las especies, creando una biblioteca virtual. Se creó una página para alojar la biblioteca virtual a la que se podrá acceder tanto a través de Internet como de códigos QR que estarán en la cartelería del sendero de interpretación del JBU."
                    img1="/assets/images/proyecto/proy_9.webp"
                    img2="/assets/images/proyecto/proy_10.webp"
                />

                <TarjetaEtapa
                    bgColor="#inherit"
                    title="Capacitación de Jóvenes"
                    par="Un grupo de jóvenes de nuestra comunidad, convocad@s a través de las redes sociales, participó de la Capacitación en flora nativa, al cabo de la cual elaboraron una presentación que acompaña a la Biblioteca Bordada en su muestra itinerante."
                    img1="/assets/images/proyecto/proy_11.webp"
                    img2="/assets/images/proyecto/proy_12.webp"
                />

                <TarjetaEtapa
                    bgColor="#E6E7E8"
                    title="Presentación de la Biblioteca Itinerante"
                    par="La Biblioteca Bordada fue presentada por el grupo de jóvenes en la Biblioteca Popular Sarmiento de Ushuaia, el 4 de noviembre de 2023, ante una nutrida concurrencia."
                    img1="/assets/images/proyecto/proy_13.webp"
                    img2="/assets/images/proyecto/proy_14.webp"
                />
            </div>

        </section>
    );
}
