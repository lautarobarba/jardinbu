"use client";
import { FormEvent, useState } from 'react';
import { FormikHelpers, useFormik } from 'formik';
import * as Yup from 'yup';
import { Button, Input, Modal, ModalContent, Select, SelectItem, Tooltip } from '@nextui-org/react';
import {
    useCreateTag,
    useDeleteTag,
    useGetTag,
    useGetUser,
    useUpdateTag,
    useUpdateUser,
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
import { Role, Status, UpdateUserDto, User } from '@/interfaces/user.interface';
import { formatTitleCase } from '@/utils/tools';

const ValidationSchema = Yup.object().shape({
    role: Yup.string().required('Por favor seleccione un rol'),
    status: Yup.string().required('Por favor seleccione un estado'),
});

interface Values {
    role: string;
    status: string;
}

interface UpdateUserFormProps {
    toggleVisibility: Function;
    id: number;
}

export const UpdateUserForm = (props: UpdateUserFormProps) => {
    const { toggleVisibility, id } = props;
    const queryClient = useQueryClient();
    const { enqueueSnackbar } = useSnackbar();

    // Query
    const {
        data: getUserData,
    } = useGetUser({ id: id }, { keepPreviousData: true });

    // Mutación
    const {
        mutate: updateUserMutate,
        isLoading: updateUserIsLoading,
    } = useUpdateUser();

    const formik = useFormik({
        initialValues: {
            role: getUserData?.role ?? '',
            status: getUserData?.status ?? '',
        },
        enableReinitialize: true,
        validationSchema: ValidationSchema,
        onSubmit: async (values: Values, { setErrors }: FormikHelpers<Values>) => {
            const updateUserDto: UpdateUserDto = {
                id: id,
                isEmailConfirmed: getUserData?.isEmailConfirmed,
                firstname: getUserData?.firstname,
                lastname: getUserData?.lastname,
                role: values.role as Role,
                status: values.status as Status,
            };
            // console.log(updateUserDto);
            updateUserMutate(
                { updateUserDto },
                {
                    onError: (error: any) => {
                        console.log('ERROR: Error al actualizar usuario');
                        console.log(error);
                        enqueueSnackbar('ERROR: Error al actualizar usuario', {
                            anchorOrigin: { horizontal: 'right', vertical: 'bottom' },
                            variant: 'error',
                        });
                    },
                    onSuccess: (user: User) => {
                        console.log('Usuario actualizado correctamente');
                        console.log(user);
                        queryClient.invalidateQueries(['users']);
                        queryClient.invalidateQueries([`user-${id}`]);
                        toggleVisibility(false);
                        enqueueSnackbar('Usuario actualizado correctamente', {
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
                    <PageSubTitle title={`Actualizar usuario N° ${id}`} />
                </div>

                <div className="col-span-12 md:col-span-6">
                    <Input
                        // Value
                        type="text"
                        id="lastname"
                        name="lastname"
                        label="Apellido"
                        value={getUserData?.lastname ? formatTitleCase(getUserData.lastname) : ''}
                        // Validations
                        isRequired={true}
                        autoComplete="off"
                        // Style
                        fullWidth={true}
                        variant="bordered"
                        radius="sm"
                        className="text-dark dark:text-light"
                        isDisabled={true}
                    />
                </div>
                <div className="col-span-12 md:col-span-6">
                    <Input
                        // Value
                        type="text"
                        id="firstname"
                        name="firstname"
                        label="Nombre"
                        value={getUserData?.firstname ? formatTitleCase(getUserData.firstname) : ''}
                        // Validations
                        isRequired={true}
                        autoComplete="off"
                        // Style
                        fullWidth={true}
                        variant="bordered"
                        radius="sm"
                        className="text-dark dark:text-light"
                        isDisabled={true}
                    />
                </div>
                <div className="col-span-12">
                    <Input
                        // Value
                        type="text"
                        id="email"
                        name="email"
                        label="Email"
                        value={getUserData?.email ?? ''}
                        // Validations
                        isRequired={true}
                        autoComplete="off"
                        // Style
                        fullWidth={true}
                        variant="bordered"
                        radius="sm"
                        className="text-dark dark:text-light"
                        isDisabled={true}
                    />
                </div>
                <div className="col-span-12 md:col-span-6">
                    <Select
                        id='role'
                        name='role'
                        label="Rol"
                        value={formik.values.role}
                        selectedKeys={
                            formik.values.role
                                ? new Set([formik.values.role])
                                : new Set()
                        }
                        onChange={formik.handleChange}
                        validationState={
                            formik.touched.role && Boolean(formik.errors.role)
                                ? 'invalid'
                                : 'valid'
                        }
                        autoComplete='role'
                        isRequired
                        variant="bordered"
                        radius="sm"
                        className="text-dark dark:text-light"
                    >
                        <SelectItem key={Role.USER} value={Role.USER}>
                            {Role.USER}
                        </SelectItem>
                        <SelectItem key={Role.EDITOR} value={Role.EDITOR}>
                            {Role.EDITOR}
                        </SelectItem>
                        <SelectItem key={Role.ADMIN} value={Role.ADMIN}>
                            {Role.ADMIN}
                        </SelectItem>
                    </Select>
                </div>
                <div className="col-span-12 md:col-span-6">
                    <Select
                        id='status'
                        name='status'
                        label="Estado"
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
                        isRequired
                        variant="bordered"
                        radius="sm"
                        className="text-dark dark:text-light"
                    >
                        <SelectItem key={Status.ACTIVE} value={Status.ACTIVE}>
                            {Status.ACTIVE}
                        </SelectItem>
                        <SelectItem key={Status.INACTIVE} value={Status.INACTIVE}>
                            {Status.INACTIVE}
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
                    disabled={updateUserIsLoading}
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
                    disabled={updateUserIsLoading}
                >
                    {updateUserIsLoading ? 'Guardando...' : 'Guardar'}
                </Button>
            </div>
        </form>
    );
};

interface ModalCrudUserProps {
    id: number;
}

export const ModalCrudUser = (props: ModalCrudUserProps) => {
    const { id } = props;
    const [showEditModal, setShowEditModal] = useState<boolean>(false);
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
                                <UpdateUserForm toggleVisibility={setShowEditModal} id={id} />
                            </div>
                        </ModalContent>
                    </ModalThemeWrapper>
                </Modal>
            </div >
        </>
    );
};
