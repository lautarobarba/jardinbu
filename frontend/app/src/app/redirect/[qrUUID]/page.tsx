'use client';
import { QRCode } from "@/interfaces/qr-code.interface";
import { useGetQRCode, useGetQRCodeByUUID } from "@/services/hooks";
import { redirect, useParams } from "next/navigation";
import { useEffect } from "react";
import { json } from "stream/consumers";

// Api Url
const apiBaseUrl: string =
    process.env.NEXT_PUBLIC_APP_ROUTE ?? "http://ERROR/api";

const getQRCodeByUUID = async (uuid: number): Promise<QRCode | null> => {
    const res = await fetch(`${apiBaseUrl}/api/qr-code/uuid/${uuid}`);
    if (!res.ok) return null;
    return res.json();
};

export default function ExampleClientComponent() {
    const params = useParams();

    // const qRCode = await getQRCodeByUUID(params.qrUUID);
    console.log(params)
    // return JSON.stringify(qRCode);

    // Query
    const {
        isLoading: getQRCodeIsLoading,
        isSuccess: getQRCodeIsSuccess,
        data: getQRCodeData,
    } = useGetQRCodeByUUID({ uuid: params.qrUUID }, { keepPreviousData: true });

    // useEffect(() => {
    //     console.log(getQRCodeData);
    // }, [getQRCodeData]);

    const redirectToLink = (enlace: string) => {
        console.log('Redireccionando enlace de QRCODE...');
        redirect(enlace);
        // window.location.replace(enlace);
    }

    if (getQRCodeIsSuccess && getQRCodeData.link) redirectToLink(getQRCodeData.link);

    if (getQRCodeIsLoading)
        return (<p>Cargando...</p>);

    return <>Error...</>
}