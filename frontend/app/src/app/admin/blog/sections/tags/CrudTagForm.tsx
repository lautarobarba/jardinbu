"use client";
import { FormEvent, useState } from 'react';
import { FormikHelpers, useFormik } from 'formik';
import * as Yup from 'yup';
import { Button, Input, Modal, ModalContent, Select, SelectItem, Tooltip } from '@nextui-org/react';
import {
    useCreateTag,
    useDeleteTag,
    useGetTag,
    useUpdateTag,
} from '@/services/hooks';
import {
    Tag,
    CreateTagDto,
    UpdateTagDto,
    BGColor,
} from '@/interfaces/tag.interface';
import { useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { PageSubTitle } from '@/components/PageSubTitle';
import { ModalThemeWrapper } from '@/wrappers/ModalThemeWrapper';
import { PencilIcon, TrashIcon } from 'lucide-react';
import { Alert } from '@/components/Alert';

const ValidationSchema = Yup.object().shape({
    name: Yup.string()
        .min(1, 'Demasiado corto')
        .max(50, 'Demasiado largo')
        .required('El tag necesita un contenido'),
    bgColor: Yup.string().required(
        'Por favor seleccione un color'
    ),
});

interface Values {
    name: string;
    bgColor: string;
}

interface CreateTagFormProps {
    toggleVisibility: Function;
}

export const CreateTagForm = (props: CreateTagFormProps) => {
    const { toggleVisibility } = props;
    const queryClient = useQueryClient();
    const { enqueueSnackbar } = useSnackbar();

    // Mutación
    const {
        mutate: createTagMutate,
        isLoading: createTagIsLoading,
    } = useCreateTag();

    const formik = useFormik({
        initialValues: {
            name: '',
            bgColor: '',
        },
        validationSchema: ValidationSchema,
        onSubmit: async (values: Values, { setErrors }: FormikHelpers<Values>) => {
            const createTagDto: CreateTagDto = {
                name: values.name,
                bgColor: values.bgColor as BGColor,
            };

            createTagMutate(
                { createTagDto },
                {
                    onError: (error: any) => {
                        console.log('ERROR: Error al crear tag');
                        console.log(error);
                        enqueueSnackbar('ERROR: Error al crear tag', {
                            anchorOrigin: { horizontal: 'right', vertical: 'bottom' },
                            variant: 'error',
                        });
                    },
                    onSuccess: (tag: Tag) => {
                        console.log('Tag creado correctamente');
                        console.log(tag);
                        queryClient.invalidateQueries(['tags']);
                        toggleVisibility(false);
                        enqueueSnackbar('Tag creado correctamente', {
                            anchorOrigin: { horizontal: 'right', vertical: 'bottom' },
                            variant: 'success',
                        });
                    },
                }
            );
        },
    });

    return (
        <form onSubmit={formik.handleSubmit} >
            <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12">
                    <PageSubTitle title='Registrar nuevo tag' />
                </div>
                <div className="col-span-12 md:col-span-6">
                    <Input
                        // Value
                        type="text"
                        id="name"
                        name="name"
                        label="Nombre"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        // Validations
                        isRequired={true}
                        autoComplete="off"
                        validationState={
                            formik.touched.name && Boolean(formik.errors.name)
                                ? 'invalid'
                                : 'valid'
                        }
                        errorMessage={formik.touched.name && formik.errors.name}
                        // Style
                        fullWidth={true}
                        variant="bordered"
                        radius="sm"
                        className="text-dark dark:text-light"
                    />
                </div>
                <div className="col-span-12 md:col-span-6">
                    <Select
                        id='bgColor'
                        name='bgColor'
                        label="Color"
                        value={formik.values.bgColor}
                        selectedKeys={
                            formik.values.bgColor
                                ? new Set([formik.values.bgColor])
                                : new Set()
                        }
                        onChange={formik.handleChange}
                        validationState={
                            formik.touched.bgColor && Boolean(formik.errors.bgColor)
                                ? 'invalid'
                                : 'valid'
                        }
                        autoComplete='bgColor'
                        isRequired
                        variant="bordered"
                        radius="sm"
                        className="text-dark dark:text-light"
                    >
                        <SelectItem key={'tagBgGreen'} value={'tagBgGreen'}>
                            VERDE
                        </SelectItem>
                        <SelectItem key={'tagBgBlue'} value={'tagBgBlue'}>
                            CELESTE
                        </SelectItem>
                        <SelectItem key={'tagBgJade'} value={'tagBgJade'}>
                            JADE
                        </SelectItem>
                        <SelectItem key={'tagBgLima'} value={'tagBgLima'}>
                            LIMA
                        </SelectItem>
                        <SelectItem key={'tagBgPink'} value={'tagBgPink'}>
                            ROSA
                        </SelectItem>
                        <SelectItem key={'tagBgYellow'} value={'tagBgYellow'}>
                            AMARILLO
                        </SelectItem>
                        <SelectItem key={'tagBgRed'} value={'tagBgRed'}>
                            ROJO
                        </SelectItem>
                        <SelectItem key={'tagBgGrey'} value={'tagBgGrey'}>
                            GRIS
                        </SelectItem>
                        <SelectItem key={'tagBgPurple'} value={'tagBgPurple'}>
                            VIOLETA
                        </SelectItem>
                    </Select>
                </div>
            </div>
            <br />
            <div className="flex flex-row justify-center">
                <Button
                    color='danger'
                    radius="sm"
                    className="uppercase text-white"
                    type='button'
                    style={{ margin: '1rem' }}
                    disabled={createTagIsLoading}
                    onClick={() => toggleVisibility(false)}
                >
                    Cancelar
                </Button>
                <Button
                    color='success'
                    radius="sm"
                    className="uppercase text-white"
                    type='submit'
                    style={{ margin: '1rem' }}
                    disabled={createTagIsLoading}
                >
                    {createTagIsLoading ? 'Guardando...' : 'Guardar'}
                </Button>
            </div>
        </form>
    );
};


interface UpdateTagFormProps {
    toggleVisibility: Function;
    id: number;
}

export const UpdateTagForm = (props: UpdateTagFormProps) => {
    const { toggleVisibility, id } = props;
    const queryClient = useQueryClient();
    const { enqueueSnackbar } = useSnackbar();

    // Query
    const {
        data: getTagData,
    } = useGetTag({ id: id }, { keepPreviousData: true });

    // Mutación
    const {
        mutate: updateTagMutate,
        isLoading: updateTagIsLoading,
    } = useUpdateTag();

    const formik = useFormik({
        initialValues: {
            name: getTagData?.name ?? '',
            bgColor: getTagData?.bgColor ?? '',
        },
        enableReinitialize: true,
        validationSchema: ValidationSchema,
        onSubmit: async (values: Values, { setErrors }: FormikHelpers<Values>) => {
            const updateTagDto: UpdateTagDto = {
                id: id,
                name: values.name,
                bgColor: values.bgColor as BGColor,
            };

            updateTagMutate(
                { updateTagDto },
                {
                    onError: (error: any) => {
                        console.log('ERROR: Error al actualizar tag');
                        console.log(error);
                        enqueueSnackbar('ERROR: Error al actualizar tag', {
                            anchorOrigin: { horizontal: 'right', vertical: 'bottom' },
                            variant: 'error',
                        });
                    },
                    onSuccess: (tag: Tag) => {
                        console.log('Tag actualizado correctamente');
                        console.log(tag);
                        queryClient.invalidateQueries(['tags']);
                        queryClient.invalidateQueries([`tag-${id}`]);
                        toggleVisibility(false);
                        enqueueSnackbar('Tag actualizado correctamente', {
                            anchorOrigin: { horizontal: 'right', vertical: 'bottom' },
                            variant: 'success',
                        });
                    },
                }
            );
        },
    });

    return (
        <form onSubmit={formik.handleSubmit}>
            <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12">
                    <PageSubTitle title={`Actualizar tag N° ${id}`} />
                </div>

                <div className="col-span-12 md:col-span-6">
                    <Input
                        // Value
                        type="text"
                        id="name"
                        name="name"
                        label="Nombre"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        // Validations
                        isRequired={true}
                        autoComplete="off"
                        validationState={
                            formik.touched.name && Boolean(formik.errors.name)
                                ? 'invalid'
                                : 'valid'
                        }
                        errorMessage={formik.touched.name && formik.errors.name}
                        // Style
                        fullWidth={true}
                        variant="bordered"
                        radius="sm"
                        className="text-dark dark:text-light"
                    />
                </div>
                <div className="col-span-12 md:col-span-6">
                    <Select
                        id='bgColor'
                        name='bgColor'
                        label="Color"
                        value={formik.values.bgColor}
                        selectedKeys={
                            formik.values.bgColor
                                ? new Set([formik.values.bgColor])
                                : new Set()
                        }
                        onChange={formik.handleChange}
                        validationState={
                            formik.touched.bgColor && Boolean(formik.errors.bgColor)
                                ? 'invalid'
                                : 'valid'
                        }
                        autoComplete='bgColor'
                        isRequired
                        variant="bordered"
                        radius="sm"
                        className="text-dark dark:text-light"
                    >
                        <SelectItem key={'tagBgGreen'} value={'tagBgGreen'}>
                            VERDE
                        </SelectItem>
                        <SelectItem key={'tagBgBlue'} value={'tagBgBlue'}>
                            CELESTE
                        </SelectItem>
                        <SelectItem key={'tagBgJade'} value={'tagBgJade'}>
                            JADE
                        </SelectItem>
                        <SelectItem key={'tagBgLima'} value={'tagBgLima'}>
                            LIMA
                        </SelectItem>
                        <SelectItem key={'tagBgPink'} value={'tagBgPink'}>
                            ROSA
                        </SelectItem>
                        <SelectItem key={'tagBgYellow'} value={'tagBgYellow'}>
                            AMARILLO
                        </SelectItem>
                        <SelectItem key={'tagBgRed'} value={'tagBgRed'}>
                            ROJO
                        </SelectItem>
                        <SelectItem key={'tagBgGrey'} value={'tagBgGrey'}>
                            GRIS
                        </SelectItem>
                        <SelectItem key={'tagBgPurple'} value={'tagBgPurple'}>
                            VIOLETA
                        </SelectItem>
                    </Select>
                </div>
            </div>
            <br />
            <div className="flex flex-row justify-center">
                <Button
                    color='danger'
                    radius="sm"
                    className="uppercase"
                    type='button'
                    style={{ margin: '1rem' }}
                    disabled={updateTagIsLoading}
                    onClick={() => toggleVisibility(false)}
                >
                    Cancelar
                </Button>
                <Button
                    color='success'
                    radius="sm"
                    className="uppercase"
                    type='submit'
                    style={{ margin: '1rem' }}
                    disabled={updateTagIsLoading}
                >
                    {updateTagIsLoading ? 'Guardando...' : 'Guardar'}
                </Button>
            </div>
        </form>
    );
};

interface DeleteTagFormProps {
    toggleVisibility: Function;
    id: number;
}

export const DeleteTagForm = (props: DeleteTagFormProps) => {
    const { toggleVisibility, id } = props;
    const queryClient = useQueryClient();
    const { enqueueSnackbar } = useSnackbar();

    // Query
    const {
        data: getTagData,
    } = useGetTag({ id: id }, { keepPreviousData: true });

    // Mutación
    const {
        mutate: deleteTagMutate,
        isLoading: deleteTagIsLoading,
    } = useDeleteTag();

    const deleteTag = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        deleteTagMutate(
            { id: id },
            {
                onError: (error: any) => {
                    console.log('ERROR: Error al eliminar tag');
                    console.log(error);
                    enqueueSnackbar('ERROR: Error al eliminar tag', {
                        anchorOrigin: { horizontal: 'right', vertical: 'bottom' },
                        variant: 'error',
                    });
                },
                onSuccess: () => {
                    console.log('Tag eliminado correctamente');
                    queryClient.invalidateQueries(['tags']);
                    queryClient.invalidateQueries([`tag-${id}`]);
                    toggleVisibility(false);
                    enqueueSnackbar('Tag eliminado correctamente', {
                        anchorOrigin: { horizontal: 'right', vertical: 'bottom' },
                        variant: 'success',
                    });
                },
            }
        );
    };

    return (
        <form onSubmit={(event) => deleteTag(event)}>
            <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12">
                    <PageSubTitle title={`Eliminar tag N° ${id}`} />
                </div>

                <div className="col-span-12">
                    <Alert severity='error'>¡Está por eliminar un tag!</Alert>
                </div>
                <div className="col-span-12 md:col-span-6">
                    <Input
                        // Value
                        type="text"
                        id="name"
                        name="name"
                        label="Nombre"
                        value={getTagData?.name ?? ''}
                        // Style
                        fullWidth={true}
                        variant="bordered"
                        radius="sm"
                        className="text-dark dark:text-light"
                        disabled
                    />
                </div>
                <div className="col-span-12 md:col-span-6">
                    <Select
                        id='bgColor'
                        name='bgColor'
                        label="Color"
                        value={getTagData?.bgColor}
                        selectedKeys={
                            getTagData?.bgColor
                                ? new Set([getTagData?.bgColor])
                                : new Set()
                        }
                        autoComplete='bgColor'
                        isRequired
                        variant="bordered"
                        radius="sm"
                        className="text-dark dark:text-light"
                        isDisabled={true}
                    >
                        <SelectItem key={'tagBgGreen'} value={'tagBgGreen'}>
                            VERDE
                        </SelectItem>
                        <SelectItem key={'tagBgBlue'} value={'tagBgBlue'}>
                            CELESTE
                        </SelectItem>
                        <SelectItem key={'tagBgJade'} value={'tagBgJade'}>
                            JADE
                        </SelectItem>
                        <SelectItem key={'tagBgLima'} value={'tagBgLima'}>
                            LIMA
                        </SelectItem>
                        <SelectItem key={'tagBgPink'} value={'tagBgPink'}>
                            ROSA
                        </SelectItem>
                        <SelectItem key={'tagBgYellow'} value={'tagBgYellow'}>
                            AMARILLO
                        </SelectItem>
                        <SelectItem key={'tagBgRed'} value={'tagBgRed'}>
                            ROJO
                        </SelectItem>
                        <SelectItem key={'tagBgGrey'} value={'tagBgGrey'}>
                            GRIS
                        </SelectItem>
                        <SelectItem key={'tagBgPurple'} value={'tagBgPurple'}>
                            VIOLETA
                        </SelectItem>
                    </Select>
                </div>
            </div>
            <br />
            <div className="flex flex-row justify-center">
                <Button
                    color='success'
                    radius="sm"
                    className="uppercase text-white"
                    type='button'
                    style={{ margin: '1rem' }}
                    disabled={deleteTagIsLoading}
                    onClick={() => toggleVisibility(false)}
                >
                    Cancelar
                </Button>
                <Button
                    color='danger'
                    radius="sm"
                    className="uppercase text-white"
                    type='submit'
                    style={{ margin: '1rem' }}
                    disabled={deleteTagIsLoading}
                >
                    {deleteTagIsLoading ? 'Eliminando...' : 'Eliminar'}
                </Button>
            </div>
        </form>
    );
};

interface ModalCrudTagProps {
    id: number;
}

export const ModalCrudTag = (props: ModalCrudTagProps) => {
    const { id } = props;
    const [showEditModal, setShowEditModal] = useState<boolean>(false);
    const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
    return (
        <>
            <div className='flex flex-row space-x-2'>
                <Tooltip content="Editar">
                    <span
                        onClick={() => setShowEditModal(true)}
                    >
                        <PencilIcon className='text-green-700 dark:text-green-500' />
                    </span>
                </Tooltip>
                <Tooltip content="Eliminar">
                    <span
                        onClick={() => setShowDeleteModal(true)}
                    >
                        <TrashIcon className='text-error' />
                    </span>
                </Tooltip>
            </div>
            <div>
                <Modal
                    size="5xl"
                    radius="sm"
                    isOpen={showEditModal}
                    onClose={() => setShowEditModal(false)}
                    isDismissable={false}
                    scrollBehavior="outside"
                >
                    <ModalThemeWrapper>
                        <ModalContent>
                            <div className='p-5 bg-light dark:bg-dark'>
                                <UpdateTagForm toggleVisibility={setShowEditModal} id={id} />
                            </div>
                        </ModalContent>
                    </ModalThemeWrapper>
                </Modal>
                <Modal
                    size="5xl"
                    radius="sm"
                    isOpen={showDeleteModal}
                    onClose={() => setShowDeleteModal(false)}
                    isDismissable={false}
                    scrollBehavior="outside"
                >
                    <ModalThemeWrapper>
                        <ModalContent>
                            <div className='p-5 bg-light dark:bg-dark'>
                                <DeleteTagForm toggleVisibility={setShowDeleteModal} id={id} />
                            </div>
                        </ModalContent>
                    </ModalThemeWrapper>
                </Modal>
            </div >
        </>
    );
};
