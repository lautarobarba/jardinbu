"use client";
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react';
import { PageTitle } from '@/components/PageTitle';
import { PageSubTitle } from '@/components/PageSubTitle';
import { useGetTags } from '@/services/hooks';
import { Chip, CircularProgress, Input, Modal, ModalContent } from "@nextui-org/react";
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
import { SearchIcon } from 'lucide-react';


interface TagPrivateSectionProps {
    updateTitle: Dispatch<SetStateAction<string>>;
}

export const TagPrivateSection = (props: TagPrivateSectionProps) => {
    const { updateTitle } = props;
    const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });
    const [sorting, setSorting] = useState<SortingState>([
        { id: 'name', desc: false },
    ]);
    const [searchKey, setSearchKey] = useState<string>('');

    const handleSearch = (event: any) => {
        setPagination({ pageIndex: 0, pageSize });
        setSearchKey(event.target.value)
    }

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
                searchKey: searchKey
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

    useEffect(() => {
        updateTitle('Blog - Tags');
    }, []);

    return (
        <div className='p-3'>
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

            <div className="grid grid-cols-12 gap-2 mt-2">
                <div className="col-span-12 md:col-span-4 order-1 flex justify-center md:justify-start items-center">
                    <PageSubTitle title='Listado de tags' className='mb-0' />
                </div>

                <div className="col-span-12 md:col-span-4 order-3 md:order-2 flex justify-center items-center">
                    <Input
                        // Value
                        type="search"
                        value={searchKey}
                        onChange={handleSearch}
                        placeholder="Buscar..."
                        // Style
                        classNames={{
                            base: "max-w-full h-8",
                            mainWrapper: "h-full",
                            input: "text-small",
                            inputWrapper: "h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20",
                        }}
                        size="sm"
                        startContent={<SearchIcon size={18} />}
                    />
                </div>

                <div className="col-span-12 md:col-span-4 order-2 md:order-3 flex justify-center md:justify-end items-center">
                    <Button
                        color={openCreate ? 'danger' : 'success'}
                        radius="sm"
                        className="uppercase text-white w-full md:w-auto h-8"
                        onClick={toggleCreateForm}
                    >
                        {openCreate ? 'Cancelar' : 'Nuevo'}
                    </Button>
                </div>
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
                    <CustomTable table={table} totalItems={getTagsData.meta.totalItems ?? 0} />
                </section>
            )}
        </div>
    );
};
