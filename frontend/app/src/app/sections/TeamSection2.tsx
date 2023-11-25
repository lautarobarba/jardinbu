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
            <div className="p-5">
                <h3 className="text-xl font-bold tracking-tight text-light">
                    {name}
                </h3>
                <span className="text-light">{rol}</span>
                <p className="text-left mt-3 mb-4 font-light text-light">{description}</p>
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
            <div
                className="items-center px-4 md:px-0 mx-auto max-w-screen-xl md:grid md:grid-cols-1 sm:pt-16"
            >
                <h2 className="text-left mb-3 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">
                    Equipo de trabajo
                </h2>
                <hr className="bg-dark dark:bg-light" />
            </div>

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
                            {/* MIEMBRO2: Luis Cánepa */}
                            <ProfileCard
                                name="Luis Cánepa"
                                imageSrc="/assets/images/equipo/usuario.webp"
                                rol="Rol en JBU"
                                description="Pequeña descripcion de no más de 2 renglones. Puede ser hasta aca."
                                facebookHref="#"
                                instagramHref="#"
                                twitterHref="#"
                            />
                            {/* MIEMBRO3: Lic. Cristian Petracchi */}
                            <ProfileCard
                                name="Lic. Cristian Petracchi"
                                imageSrc="/assets/images/equipo/usuario.webp"
                                rol="Rol en JBU"
                                description="Pequeña descripcion de no más de 2 renglones. Puede ser hasta aca."
                                facebookHref="#"
                                instagramHref="#"
                                twitterHref="#"
                            />
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
                        </div>
                    </SwiperSlide>
                    <SwiperSlide>
                        <div className="grid grid-cols-2 px-2 py-4 mb-3 gap-4">
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
                            rol="Rol en JBU"
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
                            rol="Rol en JBU"
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
