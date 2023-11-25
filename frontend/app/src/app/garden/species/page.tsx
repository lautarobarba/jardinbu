'use client';
import { PageSubTitle } from "@/components/PageSubTitle";
import { PageTitle } from "@/components/PageTitle";
import { FoliageType, OrganismType, Presence, SearchSpeciesDto, Species, Status, speciesToString } from "@/interfaces/species.interface";
import { useGetClassesTax, useGetFamilies, useGetGenera, useGetKingdoms, useGetOrdersTax, useGetPhylums, useGetSpecies, useGetSpeciesFullSearch } from "@/services/hooks";
import { Autocomplete, Grid, TextField } from "@mui/material";
import { CircularProgress } from "@nextui-org/react";
import { PaginationState, SortingState } from "@tanstack/react-table";
import { HTMLAttributes, SyntheticEvent, useEffect, useMemo, useState } from "react";
import * as Yup from 'yup';
import { Button, Modal, ModalContent, Tooltip, Select, SelectItem, Input } from '@nextui-org/react';
import { SearchIcon } from "lucide-react";
import { Genus, genusToString } from "@/interfaces/genus.interface";
import { FormikHelpers, useFormik } from "formik";
import { Kingdom, kingdomToString } from "@/interfaces/kingdom.interface";
import { Family, familyToString } from "@/interfaces/family.interface";
import { OrderTax, orderTaxToString } from "@/interfaces/order-tax.interface";
import { ClassTax, classTaxToString } from "@/interfaces/class-tax.interface";
import { Phylum, phylumToString } from "@/interfaces/phylum.interface";
import { SmallCard } from "./SmallCard";
import { Pagination } from '@nextui-org/react';


interface Values {
    wildcard: string;

    kingdom: any;
    phylum: any;
    classTax: any;
    orderTax: any;
    family: any;
    genus: any;

    organismType: string;
    status: string;
    foliageType: string;
    presence: string;
}

const SpeciesPage = () => {
    // Pagination state
    const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });
    const [sorting, setSorting] = useState<SortingState>([
        { id: 'scientificName', desc: false },
    ]);

    // Form search inputs
    const [openAdvanceSearch, setOpenAdvanceSearch] = useState<boolean>(false);
    const [search, setSearch] = useState<SearchSpeciesDto>({});

    const pagination = useMemo(
        () => ({
            pageIndex,
            pageSize,
        }),
        [pageIndex, pageSize]
    );

    // Queries
    const {
        isLoading: getSpeciesIsLoading,
        isSuccess: getSpeciesIsSuccess,
        data: getSpeciesData,
        isError: getSpeciesIsError,
        error: getSpeciesError,
        refetch: getSpeciesRefetch,
    } = useGetSpeciesFullSearch(
        {
            pagination: {
                page: pagination.pageIndex + 1,
                limit: pagination.pageSize,
                orderBy: sorting.length === 1 ? sorting[0].id : undefined,
                orderDirection:
                    sorting.length === 1 ? (sorting[0].desc ? 'DESC' : 'ASC') : undefined,
                search: search
            },
        },
        { keepPreviousData: true }
    );

    // Lista de reinos para Select
    const { isSuccess: getKingdomsIsSuccess, data: getKingdomsData } =
        useGetKingdoms({});
    // Lista de reinos para Select
    const { isSuccess: getPhylumsIsSuccess, data: getPhylumsData } =
        useGetPhylums({});
    // Lista de clases para Select
    const { isSuccess: getClassesTaxIsSuccess, data: getClassesTaxData } =
        useGetClassesTax({});
    // Lista de familias para Select
    const { isSuccess: getOrdersTaxIsSuccess, data: getOrdersTaxData } =
        useGetOrdersTax({});
    // Lista de familias para Select
    const { isSuccess: getFamiliesIsSuccess, data: getFamiliesData } =
        useGetFamilies({});
    // Lista de géneros para Select
    const { isSuccess: getGeneraIsSuccess, data: getGeneraData } =
        useGetGenera({});

    const formik = useFormik({
        initialValues: {
            wildcard: '',

            kingdom: {},
            phylum: {},
            classTax: {},
            orderTax: {},
            family: {},
            genus: {},

            organismType: '',
            status: '',
            foliageType: '',
            presence: '',
        },
        // validationSchema: ValidationSchema,
        onSubmit: async (values: Values, { setErrors }: FormikHelpers<Values>) => {
            const searchSpeciesDto: SearchSpeciesDto = {};

            if (values.wildcard && values.wildcard !== '')
                searchSpeciesDto.wildcard = values.wildcard;

            if (values.kingdom && values.kingdom.id) searchSpeciesDto.kingdomId = values.kingdom.id;
            if (values.phylum && values.phylum.id) searchSpeciesDto.phylumId = values.phylum.id;
            if (values.classTax && values.classTax.id) searchSpeciesDto.classTaxId = values.classTax.id;
            if (values.orderTax && values.orderTax.id) searchSpeciesDto.orderTaxId = values.orderTax.id;
            if (values.family && values.family.id) searchSpeciesDto.familyId = values.family.id;
            if (values.genus && values.genus.id) searchSpeciesDto.genusId = values.genus.id;

            if (values.organismType && values.organismType !== '')
                searchSpeciesDto.organismType = values.organismType as OrganismType;
            if (values.status && values.status !== '')
                searchSpeciesDto.status = values.status as Status;
            if (values.foliageType && values.foliageType !== '')
                searchSpeciesDto.foliageType = values.foliageType as FoliageType;
            if (values.presence && values.presence !== '')
                searchSpeciesDto.presence = values.presence as Presence;

            console.log(searchSpeciesDto);
            setPagination({ pageIndex: 0, pageSize });
            setSearch(searchSpeciesDto);
            getSpeciesRefetch();
        },
    });

    const toggleBusquedaAvanzada = () => {
        const newState: boolean = !openAdvanceSearch;
        setOpenAdvanceSearch(newState);
        if (!newState)
            formik.setValues({
                wildcard: formik.values.wildcard,

                kingdom: {},
                phylum: {},
                classTax: {},
                orderTax: {},
                family: {},
                genus: {},

                organismType: '',
                status: '',
                foliageType: '',
                presence: '',
            });
    }

    const handlePageChange = (page: number) => {
        setPagination({ pageIndex: page - 1, pageSize });
    }

    const handlePaginationSizeChange = (event: any) => {
        const newPageSize: number = Number(event.target.value);
        setPagination({ pageIndex, pageSize: newPageSize });
    }

    return (
        <section id="species">
            <PageTitle title='Especies' />

            <div className='p-3'>
                <hr />

                <div className="grid grid-cols-12 gap-2 mt-2">
                    <div className="col-span-12 md:col-span-4 order-1 flex justify-center md:justify-start items-center">
                        <PageSubTitle title='Buscador' className='mb-0' />
                    </div>
                    <div className="col-span-12 md:col-span-4 order-3 md:order-2 flex justify-center items-center">
                        {/* Placeholder */}
                    </div>
                    <div className="col-span-12 md:col-span-4 order-2 md:order-3 flex justify-center md:justify-end items-center">
                        <Button
                            color={'primary'}
                            radius="sm"
                            className="uppercase text-white w-full md:w-auto h-8"
                            onClick={() => toggleBusquedaAvanzada()}
                        >
                            {openAdvanceSearch ? 'Búsqueda simple' : 'Búsqueda avanzada'}
                        </Button>
                    </div>
                </div>

                <form onSubmit={formik.handleSubmit}>
                    <Grid container spacing={2} justifyContent={'center'}>

                        <Grid item xs={12}>
                            <TextField
                                id='wildcard'
                                name='wildcard'
                                label='Texto libre'
                                placeholder='Texto libre...'
                                value={formik.values.wildcard}
                                onChange={formik.handleChange}
                                fullWidth
                                autoComplete='wildcard'
                            />
                        </Grid>

                        {openAdvanceSearch && (
                            <>
                                <Grid item xs={12} md={6}>
                                    <Autocomplete
                                        id='kingdom'
                                        options={(getKingdomsData ?? []) as Kingdom[]}
                                        getOptionLabel={(kingdom: Kingdom) => kingdomToString(kingdom)}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                name='kingdom'
                                                label='Reino'
                                                placeholder='Reino...'
                                                required={false}
                                            />
                                        )}
                                        renderOption={(props: HTMLAttributes<HTMLLIElement>, kingdom: Kingdom) => {
                                            return (
                                                <li {...props} key={kingdom.id}>
                                                    {kingdomToString(kingdom)}
                                                </li>
                                            );
                                        }}
                                        isOptionEqualToValue={(option: any, selection: any) =>
                                            option.value === selection.value
                                        }
                                        onChange={(event: SyntheticEvent<Element, Event>, value: Kingdom | null) => {
                                            formik.setFieldValue('kingdom', value);
                                        }}
                                        fullWidth
                                        disableClearable={false}
                                        autoSelect={true}
                                    />
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <Autocomplete
                                        id='phylum'
                                        options={(getPhylumsData ?? []) as Phylum[]}
                                        getOptionLabel={(phylum: Phylum) => phylumToString(phylum)}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                name='phylum'
                                                label='Filo'
                                                placeholder='Filo...'
                                                required={false}
                                            />
                                        )}
                                        renderOption={(props: HTMLAttributes<HTMLLIElement>, phylum: Phylum) => {
                                            return (
                                                <li {...props} key={phylum.id}>
                                                    {kingdomToString(phylum)}
                                                </li>
                                            );
                                        }}
                                        isOptionEqualToValue={(option: any, selection: any) =>
                                            option.value === selection.value
                                        }
                                        onChange={(event: SyntheticEvent<Element, Event>, value: Phylum | null) => {
                                            formik.setFieldValue('phylum', value);
                                        }}
                                        fullWidth
                                        disableClearable={false}
                                        autoSelect={true}
                                    />
                                </Grid>

                                <Grid item xs={12} md={4}>
                                    <Autocomplete
                                        id='classTax'
                                        options={(getClassesTaxData ?? []) as ClassTax[]}
                                        getOptionLabel={(classTax: ClassTax) => classTaxToString(classTax)}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                name='classTax'
                                                label='Clase'
                                                placeholder='Clase...'
                                                required={false}
                                            />
                                        )}
                                        renderOption={(props: HTMLAttributes<HTMLLIElement>, classTax: ClassTax) => {
                                            return (
                                                <li {...props} key={classTax.id}>
                                                    {classTaxToString(classTax)}
                                                </li>
                                            );
                                        }}
                                        isOptionEqualToValue={(option: any, selection: any) =>
                                            option.value === selection.value
                                        }
                                        onChange={(event: SyntheticEvent<Element, Event>, value: ClassTax | null) => {
                                            formik.setFieldValue('classTax', value);
                                        }}
                                        fullWidth
                                        disableClearable={false}
                                        autoSelect={true}
                                    />
                                </Grid>

                                <Grid item xs={12} md={4}>
                                    <Autocomplete
                                        id='orderTax'
                                        options={(getOrdersTaxData ?? []) as OrderTax[]}
                                        getOptionLabel={(orderTax: OrderTax) => orderTaxToString(orderTax)}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                name='orderTax'
                                                label='Orden'
                                                placeholder='Orden...'
                                                required={false}
                                            />
                                        )}
                                        renderOption={(props: HTMLAttributes<HTMLLIElement>, orderTax: OrderTax) => {
                                            return (
                                                <li {...props} key={orderTax.id}>
                                                    {orderTaxToString(orderTax)}
                                                </li>
                                            );
                                        }}
                                        isOptionEqualToValue={(option: any, selection: any) =>
                                            option.value === selection.value
                                        }
                                        onChange={(event: SyntheticEvent<Element, Event>, value: OrderTax | null) => {
                                            formik.setFieldValue('orderTax', value);
                                        }}
                                        fullWidth
                                        disableClearable={false}
                                        autoSelect={true}
                                    />
                                </Grid>

                                <Grid item xs={12} md={4}>
                                    <Autocomplete
                                        id='family'
                                        options={(getFamiliesData ?? []) as Family[]}
                                        getOptionLabel={(family: Family) => familyToString(family)}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                name='family'
                                                label='Familia'
                                                placeholder='Familia...'
                                                required={false}
                                            />
                                        )}
                                        renderOption={(props: HTMLAttributes<HTMLLIElement>, family: Family) => {
                                            return (
                                                <li {...props} key={family.id}>
                                                    {familyToString(family)}
                                                </li>
                                            );
                                        }}
                                        isOptionEqualToValue={(option: any, selection: any) =>
                                            option.value === selection.value
                                        }
                                        onChange={(event: SyntheticEvent<Element, Event>, value: Family | null) => {
                                            formik.setFieldValue('family', value);
                                        }}
                                        fullWidth
                                        disableClearable={false}
                                        autoSelect={true}
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <Autocomplete
                                        id='genus'
                                        options={(getGeneraData ?? []) as Genus[]}
                                        getOptionLabel={(genus: Genus) => genusToString(genus)}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                name='genus'
                                                label='Género'
                                                placeholder='Género...'
                                                required={false}
                                            />
                                        )}
                                        renderOption={(props: HTMLAttributes<HTMLLIElement>, genus: Genus) => {
                                            return (
                                                <li {...props} key={genus.id}>
                                                    {genusToString(genus)}
                                                </li>
                                            );
                                        }}
                                        isOptionEqualToValue={(option: any, selection: any) =>
                                            option.value === selection.value
                                        }
                                        onChange={(event: SyntheticEvent<Element, Event>, value: Genus | null) => {
                                            formik.setFieldValue('genus', value);
                                        }}
                                        fullWidth
                                        disableClearable={false}
                                        autoSelect={true}
                                    />
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <Select
                                        id='organismType'
                                        name='organismType'
                                        label="Tipo de organismo"
                                        value={formik.values.organismType}
                                        selectedKeys={
                                            formik.values.organismType
                                                ? new Set([formik.values.organismType])
                                                : new Set()
                                        }
                                        onChange={formik.handleChange}
                                        validationState={
                                            formik.touched.organismType && Boolean(formik.errors.organismType)
                                                ? 'invalid'
                                                : 'valid'
                                        }
                                        autoComplete='organismType'
                                        isRequired={false}

                                        variant="bordered"
                                        radius="sm"
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
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <Select
                                        id='foliageType'
                                        name='foliageType'
                                        label="Tipo de follage"
                                        value={formik.values.foliageType}
                                        selectedKeys={
                                            formik.values.foliageType
                                                ? new Set([formik.values.foliageType])
                                                : new Set()
                                        }
                                        onChange={formik.handleChange}
                                        validationState={
                                            formik.touched.foliageType && Boolean(formik.errors.foliageType)
                                                ? 'invalid'
                                                : 'valid'
                                        }
                                        autoComplete='foliageType'
                                        isRequired={false}
                                        variant="bordered"
                                        radius="sm"
                                    >
                                        <SelectItem key={'PERENNIAL'} value={'PERENNIAL'}>
                                            PERENNE
                                        </SelectItem>
                                        <SelectItem key={'DECIDUOUS'} value={'DECIDUOUS'}>
                                            CADUCIFOLIA
                                        </SelectItem>
                                    </Select>
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <Select
                                        id='status'
                                        name='status'
                                        label="Status"
                                        value={formik.values.status}
                                        selectedKeys={
                                            formik.values.status
                                                ? new Set([formik.values.status])
                                                : new Set()
                                        }
                                        onChange={formik.handleChange}
                                        validationState={
                                            formik.touched.status && Boolean(formik.errors.status)
                                                ? 'invalid'
                                                : 'valid'
                                        }
                                        autoComplete='status'
                                        isRequired={false}
                                        variant="bordered"
                                        radius="sm"
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
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <Select
                                        id='presence'
                                        name='presence'
                                        label="Presencia"
                                        value={formik.values.presence}
                                        selectedKeys={
                                            formik.values.presence
                                                ? new Set([formik.values.presence])
                                                : new Set()
                                        }
                                        onChange={formik.handleChange}
                                        validationState={
                                            formik.touched.presence && Boolean(formik.errors.presence)
                                                ? 'invalid'
                                                : 'valid'
                                        }
                                        autoComplete='presence'
                                        isRequired={false}
                                        variant="bordered"
                                        radius="sm"
                                    >
                                        <SelectItem key={'PRESENT'} value={'PRESENT'}>
                                            PRESENTE
                                        </SelectItem>
                                        <SelectItem key={'ABSENT'} value={'ABSENT'}>
                                            AUSENTE
                                        </SelectItem>
                                    </Select>
                                </Grid>
                            </>
                        )}
                        <Grid container spacing={2} justifyContent={'center'} style={{ marginTop: '1rem' }}>
                            {/* <Button
                            color='danger'
                            radius="sm"
                            className="uppercase text-white"
                            type='button'
                            style={{ margin: '1rem' }}
                            disabled={false}
                            onClick={() => resetForm(false)}
                        >
                            Limpiar campos
                        </Button> */}
                            <Button
                                color='success'
                                radius="sm"
                                className="uppercase text-white"
                                type='submit'
                                style={{ margin: '1rem' }}
                                disabled={getSpeciesIsLoading}
                            >
                                {getSpeciesIsLoading ? 'Buscando...' : 'Buscar'}
                            </Button>
                        </Grid>
                    </Grid>
                </form>

                {getSpeciesIsError && <p className='text-danger'>Error...</p>}

                {getSpeciesIsLoading && (
                    <div className='flex justify-center mt-10'>
                        <hr />
                        <CircularProgress aria-label="loading" />
                    </div>
                )}

                {getSpeciesIsSuccess && (
                    <section id='species' className='species mt-5'>
                        <hr />
                        {(getSpeciesData.items.length > 0)
                            ? (
                                <>
                                    {
                                        getSpeciesData.items.map((species: Species) => (
                                            <SmallCard key={species.id} species={species} />
                                        ))
                                    }
                                    <div className='flex flex-col md:flex-row justify-center items-center md:justify-between align-center m-2 space-y-2'>
                                        <div>
                                            <p className="text-dark dark:text-light text-center md:text-left">
                                                Registros&nbsp;<strong>{getSpeciesData.meta.totalItems}</strong>
                                            </p>
                                            <p className="text-dark dark:text-light text-center md:text-left">
                                                Página&nbsp;
                                                <strong>
                                                    {getSpeciesData.meta.currentPage} de {getSpeciesData.meta.totalPages}
                                                </strong>
                                            </p>
                                        </div>

                                        <div>
                                            <Pagination
                                                isCompact
                                                showControls
                                                total={getSpeciesData.meta.totalPages ?? 1}
                                                page={getSpeciesData.meta.currentPage}
                                                onChange={handlePageChange}
                                                classNames={{
                                                    wrapper: "shadow-md",
                                                    prev: "bg-white dark:bg-gray-800 text-gray-900 dark:text-white",
                                                    next: "bg-white dark:bg-gray-800 text-gray-900 dark:text-white",
                                                    item: "bg-white dark:bg-gray-800 text-gray-900 dark:text-white",
                                                    cursor: "bg-navbar-bg text-white"
                                                }}
                                            />
                                        </div>

                                        <div className='min-w-unit-6'>
                                            <select
                                                id="pageSize"
                                                className="bg-white dark:bg-gray-800 shadow-md text-gray-900 dark:text-white text-md rounded-lg block w-full p-1 h-9"
                                                onChange={handlePaginationSizeChange}
                                                value={pageSize}
                                            >
                                                <option value="5">Mostrar&nbsp;&nbsp;&nbsp;5</option>
                                                <option value="10">Mostrar&nbsp;&nbsp;10</option>
                                                <option value="25">Mostrar&nbsp;&nbsp;25</option>
                                                <option value="50">Mostrar&nbsp;&nbsp;50</option>
                                                <option value="100">Mostrar&nbsp;100</option>
                                            </select>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <p>No se encontraron resultados..</p>
                            )
                        }
                    </section>
                )}
            </div>
        </section >
    );
}
export default SpeciesPage;