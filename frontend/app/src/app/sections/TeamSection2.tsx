"use client";
import { FacebookIcon, InstagramIcon, TwitterIcon } from "lucide-react";
import Link from "next/link";
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
// import required modules
import { Navigation, Scrollbar, Autoplay } from 'swiper/modules';

type ProfileCardProps = {
    name: string;
    imageSrc: string;
    rol: string;
    description: string;
    facebookHref: string;
    instagramHref: string;
    twitterHref: string;
}

const ProfileCard = (props: ProfileCardProps) => {
    const { name, imageSrc, rol, description, facebookHref, instagramHref, twitterHref } = props;
    return (
        <div
            className="items-center rounded-lg shadow sm:flex dark:border-gray-700"
            style={{ backgroundColor: "#44722C" }}
        >
            <img
                loading='lazy'
                className="w-full rounded-lg sm:rounded-none sm:rounded-l-lg lg:border-r-1 border-white mx-auto md:max-w-[300px]"
                src={imageSrc}
                alt={name}
            />
            <div className="p-5 text-center w-full">
                <h3 className="text-xl font-bold tracking-tight text-light">
                    {name}
                </h3>
                <span className="text-light">{rol}</span>
                {/* <p className="text-left mt-3 mb-4 font-light text-light">{description}</p> */}
                {/* <ul className="flex space-x-4 sm:mt-0">
                    <li>
                        <Link href={facebookHref} target="_blank" className="text-dark dark:text-light hover:text-primary dark:hover:text-white">
                            <FacebookIcon />
                        </Link>
                    </li>
                    <li>
                        <Link href={instagramHref} target="_blank" className="text-dark dark:text-light hover:text-primary dark:hover:text-white">
                            <InstagramIcon />
                        </Link>
                    </li>
                    <li>
                        <Link href={twitterHref} target="_blank" className="text-dark dark:text-light hover:text-primary dark:hover:text-white">
                            <TwitterIcon />
                        </Link>
                    </li>
                </ul> */}
            </div>
        </div>
    );
}

export const TeamSection2 = () => {

    return (
        <section
            id="team"
            className="min-h-screen bg-light dark:bg-dark text-center"
        >
            {/* <div
                className="items-center px-4 md:px-0 mx-auto max-w-screen-xl md:grid md:grid-cols-1 sm:pt-16"
            >
                <h2 className="text-left mb-3 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">
                    Equipo de trabajo
                </h2>
                <hr className="bg-dark dark:bg-light" />
            </div> */}

            {/* Carrousel widescreen */}
            <div className="hidden lg:block mx-auto max-w-screen-xl">
                <Swiper
                    navigation={true}
                    modules={[Navigation, Scrollbar, Autoplay]}
                    scrollbar={{
                        hide: true,
                    }}
                    loop={true}
                    autoplay={{
                        delay: 3500,
                        disableOnInteraction: false,
                    }}
                >
                    <SwiperSlide>
                        <div
                            className="items-center px-4 md:px-0 mx-auto max-w-screen-xl md:grid md:grid-cols-1 sm:pt-16"
                        >
                            <h2 className="text-left mb-3 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">
                                Equipo de trabajo
                            </h2>
                            <hr className="bg-dark dark:bg-light" />
                        </div>
                        <div className="grid grid-cols-2 px-2 py-4 mb-3 gap-4">
                            {/* MIEMBRO1: Estela Caipillán */}
                            <ProfileCard
                                name="Estela Caipillán"
                                imageSrc="/assets/images/equipo/estela_caipillan.webp"
                                rol="Coordinación general"
                                description="Pequeña descripcion de no más de 2 renglones. Puede ser hasta aca."
                                facebookHref="#"
                                instagramHref="#"
                                twitterHref="#"
                            />
                            {/* MIEMBRO2: Cristián Petracchi */}
                            <ProfileCard
                                name="Cristián Petracchi"
                                imageSrc="/assets/images/equipo/cristian_petracchi.webp"
                                rol="Biólogo - Diseño de contenido"
                                description="Pequeña descripcion de no más de 2 renglones. Puede ser hasta aca."
                                facebookHref="#"
                                instagramHref="#"
                                twitterHref="#"
                            />
                            {/* MIEMBRO3: Isis del Mar Morillas */}
                            <ProfileCard
                                name="Isis del Mar Morillas"
                                imageSrc="/assets/images/equipo/isis_morillas.webp"
                                rol="Diseñadora textil"
                                description="Pequeña descripcion de no más de 2 renglones. Puede ser hasta aca."
                                facebookHref="#"
                                instagramHref="#"
                                twitterHref="#"
                            />
                            {/* MIEMBRO4: Johana Burgués */}
                            <ProfileCard
                                name="Johana Burgués"
                                imageSrc="/assets/images/equipo/johana_burgues.webp"
                                rol="Bibliotecaria"
                                description="Pequeña descripcion de no más de 2 renglones. Puede ser hasta aca."
                                facebookHref="#"
                                instagramHref="#"
                                twitterHref="#"
                            />
                            {/* MIEMBRO5: Sol Rodríguez */}
                            <ProfileCard
                                name="Sol Rodríguez"
                                imageSrc="/assets/images/equipo/sol_rodriguez.webp"
                                rol="Profesora en lengua y literatura"
                                description="Pequeña descripcion de no más de 2 renglones. Puede ser hasta aca."
                                facebookHref="#"
                                instagramHref="#"
                                twitterHref="#"
                            />
                            {/* MIEMBRO6: Lautaro Barba */}
                            <ProfileCard
                                name="Lautaro Barba"
                                imageSrc="/assets/images/equipo/lautaro_barba.webp"
                                rol="Desarrollador web"
                                description="Estudiante de Lic. en sistemas de la Universidad Nacional de Tierra del Fuego."
                                facebookHref="#"
                                instagramHref="#"
                                twitterHref="#"
                            />
                        </div>
                    </SwiperSlide>
                    <SwiperSlide>
                        <div
                            className="items-center px-4 md:px-0 mx-auto max-w-screen-xl md:grid md:grid-cols-1 sm:pt-16"
                        >
                            <h2 className="text-left mb-3 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">
                                Equipo de bordadoras
                            </h2>
                            <hr className="bg-dark dark:bg-light" />
                        </div>
                        <div className="grid grid-cols-2 px-2 py-4 mb-3 gap-4">
                            {/* MIEMBRO7: Alicia Gallardo */}
                            <ProfileCard
                                name="Alicia Gallardo"
                                imageSrc="/assets/images/equipo/alicia_gallardo.webp"
                                rol=""
                                description="Pequeña descripcion de no más de 2 renglones. Puede ser hasta aca."
                                facebookHref="#"
                                instagramHref="#"
                                twitterHref="#"
                            />
                            {/* MIEMBRO8: Beatriz Navarro */}
                            <ProfileCard
                                name="Beatriz Navarro"
                                imageSrc="/assets/images/equipo/beatriz_navarro.webp"
                                rol=""
                                description="Pequeña descripcion de no más de 2 renglones. Puede ser hasta aca."
                                facebookHref="#"
                                instagramHref="#"
                                twitterHref="#"
                            />
                            {/* MIEMBRO9: Carolina Camilión */}
                            <ProfileCard
                                name="Carolina Camilión"
                                imageSrc="/assets/images/equipo/carolina_camilion.webp"
                                rol=""
                                description="Pequeña descripcion de no más de 2 renglones. Puede ser hasta aca."
                                facebookHref="#"
                                instagramHref="#"
                                twitterHref="#"
                            />
                            {/* MIEMBRO10: Concepción Pérez Baldiviezo */}
                            <ProfileCard
                                name="Concepción Pérez Baldiviezo"
                                imageSrc="/assets/images/equipo/concepción_perez_baldiviezo.webp"
                                rol=""
                                description="Pequeña descripcion de no más de 2 renglones. Puede ser hasta aca."
                                facebookHref="#"
                                instagramHref="#"
                                twitterHref="#"
                            />
                            {/* MIEMBRO11: Elina Orozco */}
                            <ProfileCard
                                name="Elina Orozco"
                                imageSrc="/assets/images/equipo/elina_orozco.webp"
                                rol=""
                                description="Pequeña descripcion de no más de 2 renglones. Puede ser hasta aca."
                                facebookHref="#"
                                instagramHref="#"
                                twitterHref="#"
                            />
                            {/* MIEMBRO12: Elo Giménez Irós */}
                            <ProfileCard
                                name="Elo Giménez Irós"
                                imageSrc="/assets/images/equipo/elo_gimenez_iros.webp"
                                rol=""
                                description="Pequeña descripcion de no más de 2 renglones. Puede ser hasta aca."
                                facebookHref="#"
                                instagramHref="#"
                                twitterHref="#"
                            />
                        </div>
                    </SwiperSlide>
                    <SwiperSlide>
                        <div
                            className="items-center px-4 md:px-0 mx-auto max-w-screen-xl md:grid md:grid-cols-1 sm:pt-16"
                        >
                            <h2 className="text-left mb-3 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">
                                Equipo de bordadoras
                            </h2>
                            <hr className="bg-dark dark:bg-light" />
                        </div>
                        <div className="grid grid-cols-2 px-2 py-4 mb-3 gap-4">
                            {/* MIEMBRO13: Laura Omielczuk */}
                            <ProfileCard
                                name="Laura Omielczuk"
                                imageSrc="/assets/images/equipo/laura_omielczuk.webp"
                                rol=""
                                description="Pequeña descripcion de no más de 2 renglones. Puede ser hasta aca."
                                facebookHref="#"
                                instagramHref="#"
                                twitterHref="#"
                            />
                            {/* MIEMBRO14: Liliana Sagulo */}
                            <ProfileCard
                                name="Liliana Sagulo"
                                imageSrc="/assets/images/equipo/liliana_sagulo.webp"
                                rol=""
                                description="Pequeña descripcion de no más de 2 renglones. Puede ser hasta aca."
                                facebookHref="#"
                                instagramHref="#"
                                twitterHref="#"
                            />
                            {/* MIEMBRO15: Lola Boffo */}
                            <ProfileCard
                                name="Lola Boffo"
                                imageSrc="/assets/images/equipo/lola_boffo.webp"
                                rol=""
                                description="Pequeña descripcion de no más de 2 renglones. Puede ser hasta aca."
                                facebookHref="#"
                                instagramHref="#"
                                twitterHref="#"
                            />
                            {/* MIEMBRO16: Maca Demattia */}
                            <ProfileCard
                                name="Maca Demattia"
                                imageSrc="/assets/images/equipo/maca_demattia.webp"
                                rol=""
                                description="Pequeña descripcion de no más de 2 renglones. Puede ser hasta aca."
                                facebookHref="#"
                                instagramHref="#"
                                twitterHref="#"
                            />
                            {/* MIEMBRO17: Nancy Díaz */}
                            <ProfileCard
                                name="Nancy Díaz"
                                imageSrc="/assets/images/equipo/nancy_diaz.webp"
                                rol=""
                                description="Pequeña descripcion de no más de 2 renglones. Puede ser hasta aca."
                                facebookHref="#"
                                instagramHref="#"
                                twitterHref="#"
                            />
                            {/* MIEMBRO18: Rosana Gómez  */}
                            <ProfileCard
                                name="Rosana Gómez "
                                imageSrc="/assets/images/equipo/rosana_gomez.webp"
                                rol=""
                                description="Pequeña descripcion de no más de 2 renglones. Puede ser hasta aca."
                                facebookHref="#"
                                instagramHref="#"
                                twitterHref="#"
                            />
                        </div>
                    </SwiperSlide>
                    <SwiperSlide>
                        <div
                            className="items-center px-4 md:px-0 mx-auto max-w-screen-xl md:grid md:grid-cols-1 sm:pt-16"
                        >
                            <h2 className="text-left mb-3 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">
                                Equipo de bordadoras
                            </h2>
                            <hr className="bg-dark dark:bg-light" />
                        </div>
                        <div className="grid grid-cols-2 px-2 py-4 mb-3 gap-4">
                            {/* MIEMBRO19:Sil Romano */}
                            <ProfileCard
                                name="Sil Romano"
                                imageSrc="/assets/images/equipo/sil_romano.webp"
                                rol=""
                                description="Pequeña descripcion de no más de 2 renglones. Puede ser hasta aca."
                                facebookHref="#"
                                instagramHref="#"
                                twitterHref="#"
                            />
                            {/* MIEMBRO20: Vero Vezzosi */}
                            <ProfileCard
                                name="Vero Vezzosi"
                                imageSrc="/assets/images/equipo/vero_vezzosi.webp"
                                rol=""
                                description="Pequeña descripcion de no más de 2 renglones. Puede ser hasta aca."
                                facebookHref="#"
                                instagramHref="#"
                                twitterHref="#"
                            />
                        </div>
                    </SwiperSlide>
                </Swiper>
            </div>

            {/* Carrousel mobilescreen */}
            <div className="block lg:hidden mx-auto max-w-screen-xl px-2">
                <Swiper
                    navigation={true}
                    modules={[Navigation, Scrollbar, Autoplay]}
                    scrollbar={{
                        hide: true,
                    }}
                    loop={true}
                    autoplay={{
                        delay: 3500,
                        disableOnInteraction: false,
                    }}
                >
                    <SwiperSlide>
                        {/* MIEMBRO1: Estela Caipillán */}
                        <ProfileCard
                            name="Estela Caipillán"
                            imageSrc="/assets/images/equipo/estela_caipillan.webp"
                            rol="Coordinación general"
                            description="Pequeña descripcion de no más de 2 renglones. Puede ser hasta aca."
                            facebookHref="#"
                            instagramHref="#"
                            twitterHref="#"
                        />
                    </SwiperSlide>
                    <SwiperSlide>
                        {/* MIEMBRO2: Luis Cánepa */}
                        <ProfileCard
                            name="Luis Cánepa"
                            imageSrc="/assets/images/equipo/usuario.webp"
                            rol=""
                            description="Pequeña descripcion de no más de 2 renglones. Puede ser hasta aca."
                            facebookHref="#"
                            instagramHref="#"
                            twitterHref="#"
                        />
                    </SwiperSlide>
                    <SwiperSlide>
                        {/* MIEMBRO3: Lic. Cristian Petracchi */}
                        <ProfileCard
                            name="Lic. Cristian Petracchi"
                            imageSrc="/assets/images/equipo/usuario.webp"
                            rol=""
                            description="Pequeña descripcion de no más de 2 renglones. Puede ser hasta aca."
                            facebookHref="#"
                            instagramHref="#"
                            twitterHref="#"
                        />
                    </SwiperSlide>
                    <SwiperSlide>
                        {/* MIEMBRO4: Johana Burgues */}
                        <ProfileCard
                            name="Johana Burgues"
                            imageSrc="/assets/images/equipo/usuario.webp"
                            rol="Rol en JBU"
                            description="Pequeña descripcion de no más de 2 renglones. Puede ser hasta aca."
                            facebookHref="#"
                            instagramHref="#"
                            twitterHref="#"
                        />
                    </SwiperSlide>
                    <SwiperSlide>
                        {/* MIEMBRO5: Isis */}
                        <ProfileCard
                            name="Isis"
                            imageSrc="/assets/images/equipo/usuario.webp"
                            rol="Rol en JBU"
                            description="Pequeña descripcion de no más de 2 renglones. Puede ser hasta aca."
                            facebookHref="#"
                            instagramHref="#"
                            twitterHref="#"
                        />
                    </SwiperSlide>
                    <SwiperSlide>
                        {/* MIEMBRO6: Lautaro Barba */}
                        <ProfileCard
                            name="Lautaro Barba"
                            imageSrc="/assets/images/equipo/usuario.webp"
                            rol="Desarrollador web"
                            description="Estudiante de Lic. en sistemas de la Universidad Nacional de Tierra del Fuego."
                            facebookHref="#"
                            instagramHref="#"
                            twitterHref="#"
                        />
                    </SwiperSlide>
                    <SwiperSlide>
                        {/* MIEMBRO7: 7 */}
                        <ProfileCard
                            name="MIEMBRO7: 7"
                            imageSrc="/assets/images/equipo/usuario.webp"
                            rol="Rol en JBU"
                            description="Pequeña descripcion de no más de 2 renglones. Puede ser hasta aca."
                            facebookHref="#"
                            instagramHref="#"
                            twitterHref="#"
                        />
                    </SwiperSlide>
                    <SwiperSlide>
                        {/* MIEMBRO8: 8 */}
                        <ProfileCard
                            name="MIEMBRO8: 8"
                            imageSrc="/assets/images/equipo/usuario.webp"
                            rol="Rol en JBU"
                            description="Pequeña descripcion de no más de 2 renglones. Puede ser hasta aca."
                            facebookHref="#"
                            instagramHref="#"
                            twitterHref="#"
                        />
                    </SwiperSlide>
                    <SwiperSlide>
                        {/* MIEMBRO9: 9 */}
                        <ProfileCard
                            name="MIEMBRO9: 9"
                            imageSrc="/assets/images/equipo/usuario.webp"
                            rol="Rol en JBU"
                            description="Pequeña descripcion de no más de 2 renglones. Puede ser hasta aca."
                            facebookHref="#"
                            instagramHref="#"
                            twitterHref="#"
                        />
                    </SwiperSlide>
                    <SwiperSlide>
                        {/* MIEMBRO10: 10 */}
                        <ProfileCard
                            name="MIEMBRO10: 10"
                            imageSrc="/assets/images/equipo/usuario.webp"
                            rol="Rol en JBU"
                            description="Pequeña descripcion de no más de 2 renglones. Puede ser hasta aca."
                            facebookHref="#"
                            instagramHref="#"
                            twitterHref="#"
                        />
                    </SwiperSlide>
                    <SwiperSlide>
                        {/* MIEMBRO11: 11 */}
                        <ProfileCard
                            name="MIEMBRO11: 11"
                            imageSrc="/assets/images/equipo/usuario.webp"
                            rol="Rol en JBU"
                            description="Pequeña descripcion de no más de 2 renglones. Puede ser hasta aca."
                            facebookHref="#"
                            instagramHref="#"
                            twitterHref="#"
                        />
                    </SwiperSlide>
                    <SwiperSlide>
                        {/* MIEMBRO12: 12 */}
                        <ProfileCard
                            name="MIEMBRO12: 12"
                            imageSrc="/assets/images/equipo/usuario.webp"
                            rol="Desarrollador web"
                            description="Estudiante de Lic. en sistemas de la Universidad Nacional de Tierra del Fuego."
                            facebookHref="#"
                            instagramHref="#"
                            twitterHref="#"
                        />
                    </SwiperSlide>
                </Swiper >
            </div >
        </section >
    );
}
