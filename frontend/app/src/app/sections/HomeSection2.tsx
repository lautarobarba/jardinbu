'use client';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';

export const HomeSection2 = () => {
    return (
        <section
            id="home"
            className="max-h-screen bg-light dark:bg-dark text-center forest-summer-background flex justify-center items-center"
        >
            <Carousel
                showArrows={true}
                infiniteLoop={true}
                showThumbs={false}
                autoPlay={true}
                swipeable={true}
                dynamicHeight={true}
            >
                <div>
                    <img src="/assets/images/carousel/car_1.webp" alt="Biblioteca bordada 1" />
                    {/* <p className="legend">Biblioteca bordada 1</p> */}
                </div>
                <div>
                    <img src="/assets/images/carousel/car_2.webp" alt="Biblioteca bordada 2" />
                    {/* <p className="legend">Biblioteca bordada 2</p> */}
                </div>
                <div>
                    <img src="/assets/images/carousel/car_3.webp" alt="Biblioteca bordada 3" />
                    {/* <p className="legend">Biblioteca bordada 3</p> */}
                </div>
                <div>
                    <img src="/assets/images/carousel/car_4.webp" alt="Biblioteca bordada 4" />
                    {/* <p className="legend">Biblioteca bordada 4</p> */}
                </div>
                <div>
                    <img src="/assets/images/carousel/car_5.webp" alt="Biblioteca bordada 5" />
                    {/* <p className="legend">Biblioteca bordada 5</p> */}
                </div>
            </Carousel>
            <div style={{
                position: 'absolute',
                left: '10%',
                top: '10%',
                // TODO: Quitar de aca los estilos de fuente
                fontSize: '4rem',
                fontWeight: 'bold',
                color: '#44722C',
                lineHeight: '3.8rem',
                textShadow: "1px 1px 2px black"
            }}>
                <p>La Biblioteca del</p>
                <p>Bosque Bordada</p>
            </div>
        </section>
    );
}
