"use client";
import { useEffect, useMemo, useState } from 'react';
import { PageTitle } from '@/components/PageTitle';
import { PageSubTitle } from '@/components/PageSubTitle';
import { useGetTags } from '@/services/hooks';
import { Chip, CircularProgress, Modal, ModalContent } from "@nextui-org/react";
import { ModalThemeWrapper } from '@/wrappers/ModalThemeWrapper';
import { Button } from '@nextui-org/react';
import { CreateTagForm } from './CrudTagForm';
// import { CreateKingdomForm } from '../forms/CrudKingdomForm';
import { CustomTable } from '@/components/CustomTable';
import {
    PaginationState,
    SortingState,
    getCoreRowModel,
    useReactTable,
} from '@tanstack/react-table';
import { Tag } from '@/interfaces/tag.interface';
import { columns } from './columns';


export const TagPrivateSection = () => {
    const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });
    const [sorting, setSorting] = useState<SortingState>([
        { id: 'name', desc: false },
    ]);

    const pagination = useMemo(
        () => ({
            pageIndex,
            pageSize,
        }),
        [pageIndex, pageSize]
    );

    // Queries
    const {
        isLoading: getTagsIsLoading,
        isSuccess: getTagsIsSuccess,
        data: getTagsData,
        isError: getTagsIsError,
        error: getTagsError,
    } = useGetTags(
        {
            pagination: {
                page: pagination.pageIndex + 1,
                limit: pagination.pageSize,
                orderBy: sorting.length === 1 ? sorting[0].id : undefined,
                orderDirection:
                    sorting.length === 1 ? (sorting[0].desc ? 'DESC' : 'ASC') : undefined,
            },
        },
        { keepPreviousData: true }
    );

    const [openCreate, setOpenCreate] = useState<boolean>(false);

    const toggleCreateForm = () => {
        setOpenCreate(!openCreate);
    };

    const table = useReactTable<Tag>({
        data: getTagsData?.items ?? [],
        columns: columns,
        state: { pagination, sorting },
        manualPagination: true,
        pageCount: getTagsData?.meta?.totalPages ?? 1,
        onPaginationChange: setPagination,
        manualSorting: true,
        enableMultiSort: false,
        onSortingChange: setSorting,
        enableSorting: true,
        getCoreRowModel: getCoreRowModel(),
    });

    useEffect(() => {
        if (getTagsIsSuccess) {
            console.log({ getTagsData });
        } else if (getTagsIsError) {
            console.log({ getTagsError });
        }
    }, [
        getTagsIsSuccess,
        getTagsData,
        getTagsIsError,
        getTagsError,
    ]);

    return (
        <div className='p-3'>
            <PageTitle title='Tags' />

            <div className='flex flex-row justify-left'>
                <PageSubTitle title='Ejemplos' />
            </div>

            <div className='flex flex-row flex-wrap justify-around items-baseline space-x-2 space-y-2 mb-2'>
                <Chip variant="faded" className='text-black bg-tagBgGreen'>verde</Chip>
                <Chip variant="faded" className='text-black bg-tagBgBlue'>celeste</Chip>
                <Chip variant="faded" className='text-black bg-tagBgJade'>jade</Chip>
                <Chip variant="faded" className='text-black bg-tagBgLima'>lima</Chip>
                <Chip variant="faded" className='text-black bg-tagBgPink'>rosa</Chip>
                <Chip variant="faded" className='text-black bg-tagBgYellow'>amarillo</Chip>
                <Chip variant="faded" className='text-black bg-tagBgRed'>rojo</Chip>
                <Chip variant="faded" className='text-black bg-tagBgGrey'>gris</Chip>
                <Chip variant="faded" className='text-black bg-tagBgPurple'>violeta</Chip>
            </div>

            <hr />

            <div className='flex flex-row justify-between mt-2'>
                <PageSubTitle title='Listado de tags' />
                <Button
                    color={openCreate ? 'danger' : 'success'}
                    radius="sm"
                    className="uppercase text-white"
                    onClick={toggleCreateForm}
                >
                    {openCreate ? 'Cancelar' : 'Nuevo'}
                </Button>
            </div>

            <br />

            <Modal
                size="5xl"
                radius="sm"
                isOpen={openCreate}
                onClose={() => setOpenCreate(false)}
                isDismissable={false}
                scrollBehavior="outside"
            >
                <ModalThemeWrapper>
                    <ModalContent>
                        <div className='p-5 bg-light dark:bg-dark'>
                            <CreateTagForm toggleVisibility={setOpenCreate} />
                        </div>
                    </ModalContent>
                </ModalThemeWrapper>
            </Modal>


            {getTagsIsError && <p className='text-danger'>Error...</p>}

            {getTagsIsLoading && (
                <div className='flex justify-center'>
                    <CircularProgress aria-label="loading" />
                </div>
            )}

            {getTagsIsSuccess && (
                <section id='tags' className='tags'>
                    <CustomTable table={table} />
                </section>
            )}
        </div>
    );
};
