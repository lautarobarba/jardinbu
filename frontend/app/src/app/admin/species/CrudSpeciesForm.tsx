"use client";
import { FormEvent, HTMLAttributes, SyntheticEvent, useEffect, useState } from 'react';
import { FormikHelpers, useFormik } from 'formik';
import * as Yup from 'yup';
import { Button, Modal, ModalContent, Tooltip, Select, SelectItem } from '@nextui-org/react';
import {
  Chip,
  TextField,
  Grid,
  Autocomplete,
  IconButton,
  FormControl,
  InputLabel,
  MenuItem,
  Alert,
} from '@mui/material';
import {
  useCreateSpecies,
  useDeleteSpecies,
  useGetGenera,
  useGetOneSpecies,
  useUpdateSpecies
} from '@/services/hooks';
import { useQueryClient } from '@tanstack/react-query';
import { Genus, genusToString } from '@/interfaces/genus.interface';
import {
  CreateSpeciesDto,
  FoliageType,
  OrganismType,
  Presence,
  Species,
  Status,
  UpdateSpeciesDto,
} from '@/interfaces/species.interface';
import { useSnackbar } from 'notistack';
import { PageSubTitle } from '@/components/PageSubTitle';
import { CreateGenusForm } from '../taxonomy/sections/forms/CrudGenusForm';
import { formatTitleCase } from '@/utils/tools';
import { ModalThemeWrapper } from '@/wrappers/ModalThemeWrapper';
import { PlusIcon, PencilIcon, TrashIcon } from 'lucide-react';



const ValidationSchema = Yup.object().shape({
  scientificName: Yup.string()
    .min(2, 'Demasiado corto')
    .max(100, 'Demasiado largo')
    .required('La especie necesita un nombre científico'),
  commonName: Yup.string(),
  englishName: Yup.string(),
  description: Yup.string(),
  genus: Yup.object().required('Por favor seleccione un género'),
  organismType: Yup.string().required(
    'Por favor seleccione un tipo de organismo'
  ),
  status: Yup.string().required('Por favor seleccione un status'),
  foliageType: Yup.string().required('Por favor seleccione un tipo de follage'),
  presence: Yup.string().required(
    'Por favor seleccione el estado de presencia'
  ),
  exampleImg: Yup.mixed()
    .nullable()
    .notRequired(),
  foliageImg: Yup.mixed()
    .nullable()
    .notRequired(),
});

interface Values {
  scientificName: string;
  commonName: string;
  englishName: string;
  description: string;
  genus: any;
  organismType: string;
  status: string;
  foliageType: string;
  presence: string;
  exampleImg?: null,
  foliageImg?: null,
}

interface CreateSpeciesFormProps {
  toggleVisibility: Function;
}

export const CreateSpeciesForm = (props: CreateSpeciesFormProps) => {
  const { toggleVisibility } = props;
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const [family, setFamily] = useState<string>('');
  const [orderTax, setOrderTax] = useState<string>('');
  const [classTax, setClassTax] = useState<string>('');
  const [phylum, setPhylum] = useState<string>('');
  const [kingdom, setKingdom] = useState<string>('');

  const [openCreateGenusModal, setOpenCreateGenusModal] =
    useState<boolean>(false);

  const toggleOpenCreateGenusModal = () => {
    setOpenCreateGenusModal(!openCreateGenusModal);
  };

  // Lista de géneros para Select
  const { isSuccess: getGeneraIsSuccess, data: getGeneraData } =
    useGetGenera({});

  // Mutación
  const {
    mutate: createSpeciesMutate,
    isLoading: createSpeciesIsLoading,
  } = useCreateSpecies();

  const formik = useFormik({
    initialValues: {
      scientificName: '',
      commonName: '',
      englishName: '',
      description: '',
      genus: {},
      organismType: '',
      status: '',
      foliageType: '',
      presence: '',
    },
    validationSchema: ValidationSchema,
    onSubmit: async (values: Values, { setErrors }: FormikHelpers<Values>) => {
      const createSpeciesDto: CreateSpeciesDto = {
        scientificName: values.scientificName,
        commonName: values.commonName,
        englishName: values.englishName,
        description: values.description,
        genusId: values.genus.id,
        organismType: values.organismType as OrganismType,
        status: values.status as Status,
        foliageType: values.foliageType as FoliageType,
        presence: values.presence as Presence,
      };

      createSpeciesMutate(
        { createSpeciesDto },
        {
          onError: (error: any) => {
            console.log('ERROR: Error al crear especie');
            console.log(error);
            enqueueSnackbar('ERROR: Error al crear especie', {
              anchorOrigin: { horizontal: 'right', vertical: 'bottom' },
              variant: 'error',
            });
          },
          onSuccess: (species: Species) => {
            console.log('Especie creada correctamente');
            console.log(species);
            queryClient.invalidateQueries(['species']);
            toggleVisibility(false);
            enqueueSnackbar('Especie creada correctamente', {
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
      <Grid container spacing={2} justifyContent={'center'}>
        <Grid container item xs={12} justifyContent={'center'}>
          <PageSubTitle title='Registrar nueva especie' />
        </Grid>

        <Grid item xs={11}>
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
                error={formik.touched.genus && Boolean(formik.errors.genus)}
                required={true}
              />
            )}
            renderOption={(props: HTMLAttributes<HTMLLIElement>, genus: Genus) => {
              return (
                <li {...props} key={genus.id}>
                  {genusToString(genus)}
                </li>
              );
            }}
            // renderTags={(tagValue, getTagProps) => {
            //   return tagValue.map((option, index) => (
            //     <Chip {...getTagProps({ index })} key={option.id} label={option.description} />
            //   ))
            // }}
            isOptionEqualToValue={(option: any, selection: any) =>
              option.value === selection.value
            }
            onChange={(event: SyntheticEvent<Element, Event>, selection: Genus) => {
              formik.setFieldValue('genus', selection);
              formik.setFieldValue(
                'scientificName',
                `${formatTitleCase(selection.name)} `
              );
              setFamily(selection?.family.name ?? '');
              setOrderTax(selection?.family.orderTax.name ?? '');
              setClassTax(selection?.family.orderTax.classTax.name ?? '');
              setPhylum(selection?.family.orderTax.classTax.phylum.name ?? '');
              setKingdom(
                selection?.family.orderTax.classTax.phylum.kingdom.name ?? ''
              );
            }}
            fullWidth
            disableClearable={true}
            autoSelect={true}
          />
        </Grid>
        <Grid
          container
          item
          xs={1}
          justifyContent={'center'}
          alignItems={'center'}
        >
          <Tooltip content='Nuevo'>
            <span
              onClick={() => toggleOpenCreateGenusModal()}
            >
              <PlusIcon className='text-primary' fontSize={'large'} />
            </span>
          </Tooltip>

          {/* <Dialog
            onClose={() => setOpenCreateGenusModal(false)}
            open={openCreateGenusModal}
            maxWidth={'md'}
            fullWidth
          >
            <div className='p-5'>
              <CreateGenusForm toggleVisibility={toggleOpenCreateGenusModal} />
            </div>
          </Dialog> */}
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            name='Familia'
            label='Familia'
            fullWidth
            value={family}
            disabled
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            name='Orden'
            label='Orden'
            fullWidth
            value={orderTax}
            disabled
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            name='Clase'
            label='Clase'
            fullWidth
            value={classTax}
            disabled
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            name='Filo'
            label='Filo'
            fullWidth
            value={phylum}
            disabled
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            name='Reino'
            label='Reino'
            fullWidth
            value={kingdom}
            disabled
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            id='scientificName'
            name='scientificName'
            label='Nombre científico'
            value={formik.values.scientificName}
            onChange={formik.handleChange}
            error={
              formik.touched.scientificName &&
              Boolean(formik.errors.scientificName)
            }
            helperText={
              formik.touched.scientificName && formik.errors.scientificName
            }
            fullWidth
            required
            autoComplete='scientificName'
            autoFocus
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            id='commonName'
            name='commonName'
            label='Nombre común'
            value={formik.values.commonName}
            onChange={formik.handleChange}
            error={
              formik.touched.commonName && Boolean(formik.errors.commonName)
            }
            helperText={formik.touched.commonName && formik.errors.commonName}
            fullWidth
            autoComplete='commonName'
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            id='englishName'
            name='englishName'
            label='Nombre en inglés'
            value={formik.values.englishName}
            onChange={formik.handleChange}
            error={
              formik.touched.englishName && Boolean(formik.errors.englishName)
            }
            helperText={formik.touched.englishName && formik.errors.englishName}
            fullWidth
            autoComplete='englishName'
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            id='description'
            name='description'
            label='Descripción'
            value={formik.values.description}
            onChange={formik.handleChange}
            error={
              formik.touched.description && Boolean(formik.errors.description)
            }
            helperText={formik.touched.description && formik.errors.description}
            fullWidth
            autoComplete='description'
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
            isRequired
            variant="bordered"
            radius="sm"
          >
            <SelectItem key={'TREE'} value={'TREE'}>
              ARBOL
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
            isRequired
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
            isRequired
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
            isRequired
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
      </Grid>

      <br />
      <Grid container spacing={2} justifyContent={'center'}>
        <Button
          color='danger'
          radius="sm"
          className="uppercase text-white"
          type='button'
          style={{ margin: '1rem' }}
          disabled={createSpeciesIsLoading}
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
          disabled={createSpeciesIsLoading}
        >
          {createSpeciesIsLoading ? 'Guardando...' : 'Guardar'}
        </Button>
      </Grid>
    </form>
  );
};

interface UpdateSpeciesFormProps {
  toggleVisibility: Function;
  id: number;
}

export const UpdateSpeciesForm = (props: UpdateSpeciesFormProps) => {
  const { toggleVisibility, id } = props;
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const [family, setFamily] = useState<string>('');
  const [orderTax, setOrderTax] = useState<string>('');
  const [classTax, setClassTax] = useState<string>('');
  const [phylum, setPhylum] = useState<string>('');
  const [kingdom, setKingdom] = useState<string>('');

  const [openCreateGenusModal, setOpenCreateGenusModal] =
    useState<boolean>(false);

  const toggleOpenCreateGenusModal = () => {
    setOpenCreateGenusModal(!openCreateGenusModal);
  };

  // Lista de géneros para Select
  const { isSuccess: getGeneraIsSuccess, data: getGeneraData } =
    useGetGenera({});

  // Query
  const {
    isSuccess: getOneSpeciesIsSuccess,
    data: getOneSpeciesData,
  } = useGetOneSpecies({ id: id }, { keepPreviousData: true });

  // Mutación
  const {
    mutate: updateSpeciesMutate,
    isLoading: updateSpeciesIsLoading,
  } = useUpdateSpecies();

  const formik = useFormik({
    initialValues: {
      scientificName: getOneSpeciesData?.scientificName ?? '',
      commonName: getOneSpeciesData?.commonName ?? '',
      englishName: getOneSpeciesData?.englishName ?? '',
      description: getOneSpeciesData?.description ?? '',
      genus: getOneSpeciesData?.genus ?? {},
      organismType: getOneSpeciesData?.organismType ?? '',
      status: getOneSpeciesData?.status ?? '',
      foliageType: getOneSpeciesData?.foliageType ?? '',
      presence: getOneSpeciesData?.presence ?? '',
    },
    enableReinitialize: true,
    validationSchema: ValidationSchema,
    onSubmit: async (values: Values, { setErrors }: FormikHelpers<Values>) => {
      const updateSpeciesDto: UpdateSpeciesDto = {
        id: id,
        scientificName: values.scientificName,
        commonName: values.commonName,
        englishName: values.englishName,
        description: values.description,
        genusId: values.genus.id,
        organismType: values.organismType as OrganismType,
        status: values.status as Status,
        foliageType: values.foliageType as FoliageType,
        presence: values.presence as Presence,

        exampleImg: values.exampleImg,
      };

      updateSpeciesMutate(
        { updateSpeciesDto },
        {
          onError: (error: any) => {
            console.log('ERROR: Error al actualizar especie');
            console.log(error);
            enqueueSnackbar('ERROR: Error al actualizar especie', {
              anchorOrigin: { horizontal: 'right', vertical: 'bottom' },
              variant: 'error',
            });
          },
          onSuccess: (species: Species) => {
            console.log('Especie actualizada correctamente');
            console.log(species);
            queryClient.invalidateQueries(['species']);
            queryClient.invalidateQueries([`species-${id}`]);
            toggleVisibility(false);
            enqueueSnackbar('Especie actualizada correctamente', {
              anchorOrigin: { horizontal: 'right', vertical: 'bottom' },
              variant: 'success',
            });
          },
        }
      );
    },
  });

  useEffect(() => {
    if (
      getOneSpeciesIsSuccess &&
      getOneSpeciesData.genus.family.orderTax.classTax.phylum.kingdom
    ) {
      setFamily(getOneSpeciesData.genus.family.name);
      setOrderTax(getOneSpeciesData.genus.family.orderTax.name);
      setClassTax(getOneSpeciesData.genus.family.orderTax.classTax.name);
      setPhylum(getOneSpeciesData.genus.family.orderTax.classTax.phylum.name);
      setKingdom(getOneSpeciesData.genus.family.orderTax.classTax.phylum.kingdom.name);
    }
  }, [getOneSpeciesIsSuccess]);

  useEffect(() => {
    console.log(formik.errors);
  }, [formik.errors]);

  useEffect(() => {
    console.log(formik.values);
  }, [formik.values]);

  return (
    <form onSubmit={formik.handleSubmit}>
      <Grid container spacing={2} justifyContent={'center'}>
        <Grid container item xs={12} justifyContent={'center'}>
          <PageSubTitle title={`Actualizar especie N° ${id}`} />
        </Grid>

        <Grid item xs={11}>
          <Autocomplete
            id='genus'
            options={(getGeneraData ?? []) as Genus[]}
            getOptionLabel={(genus: Genus) => genusToString(genus)}
            value={formik.values.genus as Genus}
            renderInput={(params) => (
              <TextField
                {...params}
                name='genus'
                label='Género'
                placeholder='Género...'
                error={formik.touched.genus && Boolean(formik.errors.genus)}
                required={true}
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
            onChange={(event: SyntheticEvent<Element, Event>, selection: Genus) => {
              formik.setFieldValue('genus', selection);
              formik.setFieldValue(
                'scientificName',
                `${formatTitleCase(selection.name)} `
              );
              setFamily(selection?.family.name ?? '');
              setOrderTax(selection?.family.orderTax.name ?? '');
              setClassTax(selection?.family.orderTax.classTax.name ?? '');
              setPhylum(selection?.family.orderTax.classTax.phylum.name ?? '');
              setKingdom(
                selection?.family.orderTax.classTax.phylum.kingdom.name ?? ''
              );
            }}
            fullWidth
            disableClearable={true}
            autoSelect={true}
          />
        </Grid>
        <Grid
          container
          item
          xs={1}
          justifyContent={'center'}
          alignItems={'center'}
        >
          <Tooltip content='Nuevo'>
            <span
              onClick={() => toggleOpenCreateGenusModal()}
            >
              <PlusIcon className='text-primary' fontSize={'large'} />
            </span>
          </Tooltip>

          {/* <Dialog
            onClose={() => setOpenCreateGenusModal(false)}
            open={openCreateGenusModal}
            maxWidth={'md'}
            fullWidth
          >
            <div className='p-5'>
              <CreateGenusForm toggleVisibility={toggleOpenCreateGenusModal} />
            </div>
          </Dialog> */}
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            name='Familia'
            label='Familia'
            fullWidth
            value={family}
            disabled
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            name='Orden'
            label='Orden'
            fullWidth
            value={orderTax}
            disabled
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            name='Clase'
            label='Clase'
            fullWidth
            value={classTax}
            disabled
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            name='Filo'
            label='Filo'
            fullWidth
            value={phylum}
            disabled
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            name='Reino'
            label='Reino'
            fullWidth
            value={kingdom}
            disabled
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            id='scientificName'
            name='scientificName'
            label='Nombre científico'
            value={formik.values.scientificName}
            onChange={formik.handleChange}
            error={
              formik.touched.scientificName &&
              Boolean(formik.errors.scientificName)
            }
            helperText={
              formik.touched.scientificName && formik.errors.scientificName
            }
            fullWidth
            required
            autoComplete='scientificName'
            autoFocus
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            id='commonName'
            name='commonName'
            label='Nombre común'
            value={formik.values.commonName}
            onChange={formik.handleChange}
            error={
              formik.touched.commonName && Boolean(formik.errors.commonName)
            }
            helperText={formik.touched.commonName && formik.errors.commonName}
            fullWidth
            autoComplete='commonName'
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            id='englishName'
            name='englishName'
            label='Nombre en inglés'
            value={formik.values.englishName}
            onChange={formik.handleChange}
            error={
              formik.touched.englishName && Boolean(formik.errors.englishName)
            }
            helperText={formik.touched.englishName && formik.errors.englishName}
            fullWidth
            autoComplete='englishName'
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            id='description'
            name='description'
            label='Descripción'
            value={formik.values.description}
            onChange={formik.handleChange}
            error={
              formik.touched.description && Boolean(formik.errors.description)
            }
            helperText={formik.touched.description && formik.errors.description}
            fullWidth
            autoComplete='description'
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
            isRequired
            variant="bordered"
            radius="sm"
          >
            <SelectItem key={'TREE'} value={'TREE'}>
              ARBOL
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
            isRequired
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
            isRequired
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
            isRequired
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
      </Grid>

      <Grid item xs={12} md={4}>
        {/* exampleImg?: null,
  foliageImg?: null, */}
        {/* <MDBFile
          // disabled={!editMode}
          id='exampleImg'
          name='exampleImg'
          label='Ejemplar'
          // value={formik.values.exampleImg}
          onChange={(event: any) => {
            formik.setFieldValue(
              'exampleImg',
              event.target.files[0]
            );
          }}
        // error={formik.touched.exampleImg && Boolean(formik.errors.exampleImg)}
        // helperText={formik.touched.exampleImg && formik.errors.exampleImg}
        /> */}
      </Grid>

      <br />
      <Grid container spacing={2} justifyContent={'center'}>
        <Button
          color='danger'
          radius="sm"
          className="uppercase text-white"
          type='button'
          style={{ margin: '1rem' }}
          disabled={updateSpeciesIsLoading}
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
          disabled={updateSpeciesIsLoading}
        >
          {updateSpeciesIsLoading ? 'Guardando...' : 'Guardar'}
        </Button>
      </Grid>
    </form>
  );
};

interface DeleteSpeciesFormProps {
  toggleVisibility: Function;
  id: number;
}

export const DeleteSpeciesForm = (props: DeleteSpeciesFormProps) => {
  const { toggleVisibility, id } = props;
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const [family, setFamily] = useState<string>('');
  const [orderTax, setOrderTax] = useState<string>('');
  const [classTax, setClassTax] = useState<string>('');
  const [phylum, setPhylum] = useState<string>('');
  const [kingdom, setKingdom] = useState<string>('');

  // Query
  const {
    // isLoading: getOneSpeciesIsLoading,
    isSuccess: getOneSpeciesIsSuccess,
    data: getOneSpeciesData,
    // isError: getOneSpeciesIsError,
    // error: getOneSpeciesError,
  } = useGetOneSpecies({ id: id }, { keepPreviousData: true });

  // Mutación
  const {
    mutate: deleteSpeciesMutate,
    isLoading: deleteSpeciesIsLoading,
    // isSuccess: deleteSpeciesIsSuccess,
    // isError: deleteSpeciesIsError,
    // error: deleteSpeciesError,
  } = useDeleteSpecies();

  const deleteSpecies = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    deleteSpeciesMutate(
      { id: id },
      {
        onError: (error: any) => {
          console.log('ERROR: Error al eliminar especie');
          console.log(error);
          enqueueSnackbar('ERROR: Error al eliminar especie', {
            anchorOrigin: { horizontal: 'right', vertical: 'bottom' },
            variant: 'error',
          });
        },
        onSuccess: () => {
          console.log('Especie eliminada correctamente');
          queryClient.invalidateQueries(['species']);
          queryClient.invalidateQueries([`species-${id}`]);
          toggleVisibility(false);
          enqueueSnackbar('Especie eliminada correctamente', {
            anchorOrigin: { horizontal: 'right', vertical: 'bottom' },
            variant: 'success',
          });
        },
      }
    );
  };

  useEffect(() => {
    if (
      getOneSpeciesIsSuccess &&
      getOneSpeciesData.genus.family.orderTax.classTax.phylum.kingdom
    ) {
      setFamily(getOneSpeciesData.genus.family.name);
      setOrderTax(getOneSpeciesData.genus.family.orderTax.name);
      setClassTax(getOneSpeciesData.genus.family.orderTax.classTax.name);
      setPhylum(getOneSpeciesData.genus.family.orderTax.classTax.phylum.name);
      setKingdom(getOneSpeciesData.genus.family.orderTax.classTax.phylum.kingdom.name);
    }
  }, [getOneSpeciesIsSuccess]);

  return (
    <form onSubmit={(event) => deleteSpecies(event)}>
      <Grid container spacing={2} justifyContent={'center'}>
        <Grid container item xs={12} justifyContent={'center'}>
          <PageSubTitle title={`Eliminar especie N° ${id}`} />
        </Grid>

        <Grid item xs={12}>
          <Alert severity='error'>¡Está por eliminar una especie!</Alert>
        </Grid>

        <Grid item xs={12}>
          <TextField
            id='genus'
            name='genus'
            label='Género'
            value={
              getOneSpeciesData?.genus ? genusToString(getOneSpeciesData.genus) : ''
            }
            fullWidth
            autoComplete='genus'
            autoFocus
            disabled
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <TextField
            name='Familia'
            label='Familia'
            fullWidth
            value={family}
            disabled
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            name='Orden'
            label='Orden'
            fullWidth
            value={orderTax}
            disabled
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            name='Clase'
            label='Clase'
            fullWidth
            value={classTax}
            disabled
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            name='Filo'
            label='Filo'
            fullWidth
            value={phylum}
            disabled
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            name='Reino'
            label='Reino'
            fullWidth
            value={kingdom}
            disabled
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            id='scientificName'
            name='scientificName'
            label='Nombre científico'
            value={getOneSpeciesData?.scientificName ?? ''}
            fullWidth
            autoComplete='scientificName'
            autoFocus
            disabled
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            id='commonName'
            name='commonName'
            label='Nombre común'
            value={getOneSpeciesData?.commonName ?? ''}
            fullWidth
            autoComplete='commonName'
            autoFocus
            disabled
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            id='englishName'
            name='englishName'
            label='Nombre en inglés'
            value={getOneSpeciesData?.englishName ?? ''}
            fullWidth
            autoComplete='englishName'
            autoFocus
            disabled
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            id='description'
            name='description'
            label='Descripción'
            value={getOneSpeciesData?.description ?? ''}
            fullWidth
            autoComplete='description'
            autoFocus
            disabled
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            id='organismType'
            name='organismType'
            label='Tipo de organismo'
            value={getOneSpeciesData?.organismType ?? ''}
            fullWidth
            autoComplete='organismType'
            autoFocus
            disabled
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            id='foliageType'
            name='foliageType'
            label='Tipo de follage'
            value={getOneSpeciesData?.foliageType ?? ''}
            fullWidth
            autoComplete='foliageType'
            autoFocus
            disabled
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            id='status'
            name='status'
            label='Status'
            value={getOneSpeciesData?.status ?? ''}
            fullWidth
            autoComplete='status'
            autoFocus
            disabled
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            id='presence'
            name='presence'
            label='Presencia'
            value={getOneSpeciesData?.presence ?? ''}
            fullWidth
            autoComplete='presence'
            autoFocus
            disabled
          />
        </Grid>

      </Grid>
      <br />
      <Grid container spacing={2} justifyContent={'center'}>
        {/* <MDBBtn
          color='primary'
          type='button'
          style={{ margin: '1rem' }}
          disabled={deleteSpeciesIsLoading}
          onClick={() => toggleVisibility(false)}
        >
          Cancelar
        </MDBBtn>
        <MDBBtn
          color='danger'
          type='submit'
          style={{ margin: '1rem' }}
          disabled={deleteSpeciesIsLoading}
        >
          {deleteSpeciesIsLoading ? 'Eliminando...' : 'Eliminar'}
        </MDBBtn> */}
      </Grid>
    </form>
  );
};

interface ModalCrudSpeciesProps {
  id: number;
}

export const ModalCrudSpecies = (props: ModalCrudSpeciesProps) => {
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
            <PencilIcon className='text-primary' />
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
        >
          <ModalThemeWrapper>
            <ModalContent>
              <div className='p-5 bg-light dark:bg-dark'>
                <UpdateSpeciesForm toggleVisibility={setShowEditModal} id={id} />
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
        >
          <ModalThemeWrapper>
            <ModalContent>
              <div className='p-5 bg-light dark:bg-dark'>
                <DeleteSpeciesForm toggleVisibility={setShowDeleteModal} id={id} />
              </div>
            </ModalContent>
          </ModalThemeWrapper>
        </Modal>
      </div>
    </>
  );
};
