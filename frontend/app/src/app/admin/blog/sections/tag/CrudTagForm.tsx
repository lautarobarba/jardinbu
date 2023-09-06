"use client";
import { FormEvent, useState } from 'react';
import { FormikHelpers, useFormik } from 'formik';
import * as Yup from 'yup';
import { Button, Modal, ModalContent, Select, SelectItem, Tooltip } from '@nextui-org/react';
import { Alert, Grid, TextField } from '@mui/material';
import {
    useCreateTag,
    useDeleteTag,
    // useGetTag,
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
            <Grid container spacing={2} justifyContent={'center'}>
                <Grid container item xs={12} justifyContent={'center'}>
                    <PageSubTitle title='Registrar nuevo tag' />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        id='name'
                        name='name'
                        label='Nombre'
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        error={formik.touched.name && Boolean(formik.errors.name)}
                        helperText={formik.touched.name && formik.errors.name}
                        fullWidth
                        required
                        autoComplete='name'
                        autoFocus
                    />
                </Grid>
                <Grid item xs={12} md={6}>
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
                </Grid>
            </Grid>
            <br />
            <Grid container spacing={2} justifyContent={'center'}>
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
            </Grid>
        </form>
    );
};