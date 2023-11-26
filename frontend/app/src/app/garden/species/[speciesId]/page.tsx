'use client';
import { useParams } from 'next/navigation';
import { CustomChip } from "@/components/CustomChip";
import { PageSubTitle } from "@/components/PageSubTitle";
import { classTaxToString } from "@/interfaces/class-tax.interface";
import { familyToString } from "@/interfaces/family.interface";
import { genusToString } from "@/interfaces/genus.interface";
import { kingdomToString } from "@/interfaces/kingdom.interface";
import { orderTaxToString } from "@/interfaces/order-tax.interface";
import { phylumToString } from "@/interfaces/phylum.interface";
import { useGetOneSpecies } from "@/services/hooks";
import { formatTitleCase, getUrlForImageByUUID } from "@/utils/tools";
import { ModalThemeWrapper } from "@/wrappers/ModalThemeWrapper";
import { Button, Modal, ModalContent, Select, SelectItem, Tooltip } from "@nextui-org/react";
import { ChevronRight, EyeIcon, LinkIcon, MoveRightIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";


export default function ExampleClientComponent() {
    const params = useParams()

    // Query
    const {
        isLoading: getOneSpeciesIsLoading,
        isSuccess: getOneSpeciesIsSuccess,
        data: getOneSpeciesData,
    } = useGetOneSpecies({ id: Number(params.speciesId) }, { keepPreviousData: true });

    if (getOneSpeciesIsLoading)
        return (<p>Cargando...</p>);

    return (
        <div className="grid grid-cols-12 gap-4">

            <div className="col-span-12">
                <h2 className="mb-4 text-center text-3xl tracking-tight font-extrabold text-dark dark:text-light">
                    Detalle de especie{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r to-primary from-navbar-bg">
                        {formatTitleCase(getOneSpeciesData?.scientificName ?? '')}
                    </span>
                </h2>
            </div>

            <div className="col-span-12">
                <img
                    loading='lazy'
                    src={getOneSpeciesData?.exampleImg?.uuid
                        ? getUrlForImageByUUID(getOneSpeciesData?.exampleImg?.uuid ?? '')
                        : '/assets/images/tree_not_found.png'
                    }
                    // src={getUrlForImageByUUID(getOneSpeciesData?.exampleImg?.uuid ?? '')}
                    alt="Logo JBU"
                    title="Logo JBU"
                    className="w-auto max-h-[500px] m-auto"
                />
            </div>



            <div className="col-span-12 md:col-span-6 space-y-5">
                <div className="col-span-12">
                    <p className="text-xl font-bold text-gray-600 text-center">Nombre científico</p>
                    <p className="text-4xl tracking-tight font-extrabold text-center">{formatTitleCase(getOneSpeciesData?.scientificName ?? '')}</p>
                    <p className="text-gray-500 sm:text-xl dark:text-gray-400 ml-3">{formatTitleCase(getOneSpeciesData?.description ?? '')}</p>
                </div>


                <div className="col-span-12">
                    <p className="text-xl font-bold text-gray-600">Nombre común</p>
                    <p className="ml-5 text-2xl tracking-tight font-extrabold">{formatTitleCase(getOneSpeciesData?.commonName ?? '')}</p>
                </div>

                {getOneSpeciesData?.englishName && (
                    <div className="col-span-12">
                        <p className="text-xl font-bold text-gray-600">Nombre en inglés</p>
                        <p className="ml-5 text-2xl tracking-tight font-extrabold">{formatTitleCase(getOneSpeciesData?.englishName ?? '')}</p>
                    </div>
                )}
            </div>

            <div className="col-span-12 md:col-span-6">
                <p className="text-2xl font-bold text-gray-600 text-center underline">Taxonomía</p>

                <div
                    className="rounded-lg py-2"
                    style={{ width: '95%', backgroundColor: '#F8ADAB', margin: 'auto', marginTop: '0.5rem', marginBottom: '0.5rem', color: 'black', textAlign: 'center' }}>
                    <p>
                        <span className="text-xl">Reino: </span>
                        <span className="text-xl font-bold">
                            {getOneSpeciesData?.genus.family.orderTax.classTax.phylum.kingdom
                                ? kingdomToString(getOneSpeciesData.genus.family.orderTax.classTax.phylum.kingdom)
                                : ''
                            }
                        </span>
                    </p>
                </div>

                <div
                    className="rounded-lg py-2"
                    style={{ width: '85%', backgroundColor: '#F8C79B', margin: 'auto', marginTop: '0.5rem', marginBottom: '0.5rem', color: 'black', textAlign: 'center' }}>
                    <p>
                        <span className="text-xl">Filo: </span>
                        <span className="text-xl font-bold">
                            {getOneSpeciesData?.genus.family.orderTax.classTax.phylum
                                ? phylumToString(getOneSpeciesData.genus.family.orderTax.classTax.phylum)
                                : ''
                            }
                        </span>
                    </p>
                </div>

                <div
                    className="rounded-lg py-2"
                    style={{ width: '75%', backgroundColor: '#F8E18D', margin: 'auto', marginTop: '0.5rem', marginBottom: '0.5rem', color: 'black', textAlign: 'center' }}>
                    <p>
                        <span className="text-xl">Clase: </span>
                        <span className="text-xl font-bold">
                            {getOneSpeciesData?.genus.family.orderTax.classTax
                                ? classTaxToString(getOneSpeciesData.genus.family.orderTax.classTax)
                                : ''
                            }
                        </span>
                    </p>
                </div>

                <div
                    className="rounded-lg py-2"
                    style={{ width: '65%', backgroundColor: '#C7D6B5', margin: 'auto', marginTop: '0.5rem', marginBottom: '0.5rem', color: 'black', textAlign: 'center' }}>
                    <p>
                        <span className="text-xl">Orden: </span>
                        <span className="text-xl font-bold">
                            {getOneSpeciesData?.genus.family.orderTax
                                ? orderTaxToString(getOneSpeciesData.genus.family.orderTax)
                                : ''
                            }
                        </span>
                    </p>
                </div>

                <div
                    className="rounded-lg py-2"
                    style={{ width: '55%', backgroundColor: '#94CBDF', margin: 'auto', marginTop: '0.5rem', marginBottom: '0.5rem', color: 'black', textAlign: 'center' }}>
                    <p>
                        <span className="text-xl">Familia: </span>
                        <span className="text-xl font-bold">
                            {getOneSpeciesData?.genus.family
                                ? familyToString(getOneSpeciesData.genus.family)
                                : ''
                            }
                        </span>
                    </p>
                </div>

                <div
                    className="rounded-lg py-2"
                    style={{ width: '45%', backgroundColor: '#B1BAD8', margin: 'auto', marginTop: '0.5rem', marginBottom: '0.5rem', color: 'black', textAlign: 'center' }}>
                    <p>
                        <span className="text-xl">Género: </span>
                        <span className="text-xl font-bold">
                            {getOneSpeciesData?.genus
                                ? genusToString(getOneSpeciesData.genus)
                                : ''
                            }
                        </span>
                    </p>
                </div>

            </div>

            <div className="col-span-12 md:col-span-6">
                <Select
                    id='organismType'
                    name='organismType'
                    label="Tipo de organismo"
                    value={getOneSpeciesData?.organismType}
                    selectedKeys={
                        getOneSpeciesData?.organismType
                            ? new Set([getOneSpeciesData.organismType])
                            : new Set()
                    }
                    autoComplete='organismType'
                    variant="bordered"
                    radius="sm"
                    isDisabled={true}
                >
                    <SelectItem key={'TREE'} value={'TREE'}>
                        ÁRBOL
                    </SelectItem>
                    <SelectItem key={'BUSH'} value={'BUSH'}>
                        ARBUSTO
                    </SelectItem>
                    <SelectItem key={'SUBSHRUB'} value={'SUBSHRUB'}>
                        SUBARBUSTO
                    </SelectItem>
                    <SelectItem key={'FUNGUS'} value={'FUNGUS'}>
                        HONGO
                    </SelectItem>
                    <SelectItem key={'GRASS'} value={'GRASS'}>
                        HIERBA
                    </SelectItem>
                    <SelectItem key={'LICHEN'} value={'LICHEN'}>
                        LIQUEN
                    </SelectItem>
                    <SelectItem key={'HEMIPARASITE_SUBSHRUB'} value={'HEMIPARASITE_SUBSHRUB'}>
                        SUBARBUSTO HEMIPARÁSITO
                    </SelectItem>
                </Select>
            </div>

            <div className="col-span-12 md:col-span-6">
                <Select
                    id='foliageType'
                    name='foliageType'
                    label="Tipo de follage"
                    value={getOneSpeciesData?.foliageType}
                    selectedKeys={
                        getOneSpeciesData?.foliageType
                            ? new Set([getOneSpeciesData.foliageType])
                            : new Set()
                    }
                    autoComplete='foliageType'
                    variant="bordered"
                    radius="sm"
                    isDisabled={true}
                >
                    <SelectItem key={'PERENNIAL'} value={'PERENNIAL'}>
                        PERENNE
                    </SelectItem>
                    <SelectItem key={'DECIDUOUS'} value={'DECIDUOUS'}>
                        CADUCIFOLIA
                    </SelectItem>
                </Select>
            </div>

            <div className="col-span-12 md:col-span-6">
                <Select
                    id='status'
                    name='status'
                    label="Status"
                    value={getOneSpeciesData?.status}
                    selectedKeys={
                        getOneSpeciesData?.status
                            ? new Set([getOneSpeciesData.status])
                            : new Set()
                    }
                    autoComplete='status'
                    variant="bordered"
                    radius="sm"
                    isDisabled={true}
                >
                    <SelectItem key={'NATIVE'} value={'NATIVE'}>
                        NATIVA
                    </SelectItem>
                    <SelectItem key={'ENDEMIC'} value={'ENDEMIC'}>
                        ENDEMICA
                    </SelectItem>
                    <SelectItem key={'INTRODUCED'} value={'INTRODUCED'}>
                        INTRODUCIDA
                    </SelectItem>
                </Select>
            </div>

            <div className="col-span-12 md:col-span-6">
                <Select
                    id='presence'
                    name='presence'
                    label="Presencia"
                    value={getOneSpeciesData?.presence}
                    selectedKeys={
                        getOneSpeciesData?.presence
                            ? new Set([getOneSpeciesData.presence])
                            : new Set()
                    }
                    autoComplete='presence'
                    variant="bordered"
                    radius="sm"
                    isDisabled={true}
                >
                    <SelectItem key={'PRESENT'} value={'PRESENT'}>
                        PRESENTE
                    </SelectItem>
                    <SelectItem key={'ABSENT'} value={'ABSENT'}>
                        AUSENTE
                    </SelectItem>
                </Select>
            </div>

            {getOneSpeciesData?.links && getOneSpeciesData?.links.length > 0 && (
                <div className="col-span-12">
                    <p className="text-xl font-bold text-dark dark:text-light mb-2">Enlaces relacionados:</p>
                    {getOneSpeciesData.links.map((link) => (
                        <div key={link.id} className="flex flex-row">
                            <Link href={link.url} target="_blank" className="text-blue-500">
                                <span className="flex flex-row items-center mr-2">
                                    <LinkIcon size={20} className="mr-2" />{link.description}
                                </span>
                            </Link>
                            {link.tags && link.tags.length > 0 && (
                                <>({link.tags.map(tag => <CustomChip tag={tag} key={tag.id} />)})</>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* TODO: ALGUNOS EJEMPLARES. MOSTRAR UN MAPA CON LOS EJEMPLARES DENTRO DEL JARDIN */}
            <div className="col-span-4"></div>
            <div className="col-span-4"><hr /></div>
            <div className="col-span-4"></div>

            <Link href="/garden/species" className="col-span-12 flex justify-center mt-2">
                <Button
                    color='success'
                    radius="sm"
                    className="uppercase text-white"
                    type='button'
                >Volver al buscador</Button>
            </Link>

            <div className="col-span-4"></div>
            <div className="col-span-4"><hr /></div>
            <div className="col-span-4"></div>
        </div>
    );
}