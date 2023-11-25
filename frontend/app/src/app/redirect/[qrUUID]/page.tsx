'use client';
import { QRCode } from "@/interfaces/qr-code.interface";
import { useGetQRCode, useGetQRCodeByUUID } from "@/services/hooks";
import { redirect, useParams } from "next/navigation";
import { useEffect } from "react";
import { json } from "stream/consumers";


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