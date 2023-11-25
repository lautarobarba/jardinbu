'use client';
import { CustomChip } from "@/components/CustomChip";
import { PageSubTitle } from "@/components/PageSubTitle";
import { classTaxToString } from "@/interfaces/class-tax.interface";
import { familyToString } from "@/interfaces/family.interface";
import { genusToString } from "@/interfaces/genus.interface";
import { kingdomToString } from "@/interfaces/kingdom.interface";
import { orderTaxToString } from "@/interfaces/order-tax.interface";
import { phylumToString } from "@/interfaces/phylum.interface";
import { useGetOneSpecies, useGetQRCode } from "@/services/hooks";
import { formatTitleCase, getUrlForImageByUUID } from "@/utils/tools";
import { ModalThemeWrapper } from "@/wrappers/ModalThemeWrapper";
import { Grid, TextField } from "@mui/material";
import { Button, Modal, ModalContent, Select, SelectItem, Tooltip } from "@nextui-org/react";
import { ChevronRight, EyeIcon, LinkIcon, MoveRightIcon } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import QRCode from 'qrcode';


interface QRCodePrivateDetailViewProps {
    toggleVisibility: Function;
    id: number;
}

export const QRCodePrivateDetailView = (props: QRCodePrivateDetailViewProps) => {
    const { toggleVisibility, id } = props;
    const [qrImageUrl, setQrImageUrl] = useState('');
    const qrRef = useRef(null);

    // Query
    const {
        isLoading: getQRCodeIsLoading,
        isSuccess: getQRCodeIsSuccess,
        data: getQRCodeData,
    } = useGetQRCode({ id: id }, { keepPreviousData: true });

    const generateQrCode = async (link: string) => {
        try {
            const base64Img = await QRCode.toDataURL(link, { scale: 15 });
            setQrImageUrl(base64Img);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if (getQRCodeData?.uuid) {
            // Hay que formar el enlace del link 
            //  con la url de la pagina y la uuid del qr
            generateQrCode(getQRCodeData.uuid);
        }
    }, [getQRCodeData]);

    if (getQRCodeIsLoading)
        return (<p>Cargando...</p>);

    return (
        <div>
            <Grid container spacing={2} justifyContent={'center'}>
                <Grid container item xs={12} justifyContent={'center'}>
                    <PageSubTitle title={`Código QR N° ${id}`} />
                </Grid>


                <Grid item xs={12}>
                    <TextField
                        id='title'
                        name='title'
                        label='Título/Descripción'
                        value={getQRCodeData?.title ?? ''}
                        fullWidth
                        required
                        autoComplete='title'
                        autoFocus
                        disabled
                    />
                </Grid>

                <Grid item xs={12}>
                    <TextField
                        id='link'
                        name='link'
                        label='Link/Enlace'
                        value={getQRCodeData?.link ?? ''}
                        fullWidth
                        autoComplete='link'
                        autoFocus
                        disabled
                    />
                </Grid>

                {getQRCodeData?.uuid && (
                    <>
                        <Grid item xs={12}

                            justifyContent={'center'}
                            alignItems={'center'}
                            style={{ padding: '1rem' }}
                        >
                            {qrImageUrl && (
                                <div style={{ margin: 'auto', textAlign: 'center' }}>
                                    <img
                                        src={qrImageUrl} alt="img"
                                        style={{ margin: 'auto' }}
                                        className="w-2/6"
                                    />
                                    <a
                                        href={qrImageUrl}
                                        download
                                        className="block mt-2"
                                    >
                                        <Button
                                            color='success'
                                            radius="sm"
                                            className="uppercase text-white"
                                            type='button'
                                        >Descargar QR</Button>
                                    </a>
                                </div>
                            )}
                        </Grid>
                    </>
                )}

                <Grid container item xs={12}
                    flexDirection={'column'}
                    justifyContent={'center'}
                    alignContent={'center'}
                >
                    <PageSubTitle title="Preview" />
                    <iframe
                        src="http://localhost"
                        className="w-5/6 min-h-[600px] border-2 border-green-700"
                    />
                </Grid>
            </Grid>

            <div className="col-span-12 flex justify-center mt-2">
                <Button
                    color='success'
                    radius="sm"
                    className="uppercase text-white"
                    type='button'
                    onClick={() => toggleVisibility(false)}
                >Volver</Button>
            </div>
        </div>
    );
};

interface ModalQRCodePrivateDetailViewProps {
    id: number;
}

export const ModalQRCodePrivateDetailView = (props: ModalQRCodePrivateDetailViewProps) => {
    const { id } = props;
    const [showDetailModal, setShowDetailModal] = useState<boolean>(false);
    return (
        <>
            <div className='flex flex-row space-x-2 mr-2'>
                <Tooltip content="Ver">
                    <span
                        onClick={() => setShowDetailModal(true)}
                    >
                        <EyeIcon className='text-primary' />
                    </span>
                </Tooltip>
            </div>
            <div>
                <Modal
                    size="5xl"
                    radius="sm"
                    isOpen={showDetailModal}
                    onClose={() => setShowDetailModal(false)}
                    isDismissable={false}
                    scrollBehavior="outside"
                >
                    <ModalThemeWrapper>
                        <ModalContent>
                            <div className='p-5 bg-light dark:bg-dark'>
                                <QRCodePrivateDetailView toggleVisibility={setShowDetailModal} id={id} />
                            </div>
                        </ModalContent>
                    </ModalThemeWrapper>
                </Modal>
            </div>
        </>
    );
};