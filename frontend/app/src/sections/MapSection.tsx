"use client";
import 'leaflet/dist/leaflet.css';
import './MapSection.css';
import { getDictionary } from "@/dictionaries";
import { LangContext } from "@/providers/LanguageProvider";
import { Button } from "@nextui-org/react";
import { useContext } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { LeafletMarkerIcon } from '@/components/LeafletMarkerIcon';
import Link from 'next/link';

export const MapSection = () => {
    const { lang } = useContext(LangContext);
    const dictionary = getDictionary(lang);

    return (
        <section
            id="map"
            className="min-h-screen bg-light dark:bg-dark text-center flex justify-center items-center"
        >
            <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
                <div className="mx-auto max-w-screen-sm text-center">
                    <h2 className="mb-4 text-3xl lg:text-4xl tracking-tight font-extrabold text-dark dark:text-light">{dictionary.mapSection.title}</h2>
                </div>
                <div className="mx-auto text-center my-5">
                    <MapContainer
                        id="map-container"
                        className="rounded-lg border-2 border-primary"
                        center={[-54.781111, -68.292613]}
                        zoom={14}
                        scrollWheelZoom={true}
                    >
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        />
                        <Marker
                            position={[-54.781111, -68.292613]}
                            icon={LeafletMarkerIcon}
                            draggable={false}
                        >
                            <Popup>
                                Jardín Botánico de Ushuaia
                            </Popup>
                        </Marker>
                    </MapContainer>
                </div>
                <div className="mx-auto text-center">
                    {/* Instrucciones para google maps */}
                    {/* https://aiocollective.com/blog/how-to-add-a-link-to-google-maps-with-directions/ */}
                    <Link href="https://goo.gl/maps/d5uRfStrQBMdBMZM9" target="_blank">
                        <Button color="primary" radius="sm" className="w-auto uppercase">¡{dictionary.mapSection.navigateButton}!</Button>
                    </Link>
                </div>
            </div>
        </section>
    );
}
