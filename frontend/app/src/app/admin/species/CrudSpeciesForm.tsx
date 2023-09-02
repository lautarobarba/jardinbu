"use client";
import { ChangeEventHandler, FormEvent, HTMLAttributes, SyntheticEvent, useEffect, useRef, useState } from 'react';
import { FormikHelpers, useFormik } from 'formik';
import * as Yup from 'yup';
import { Button, Modal, ModalContent, Tooltip, Select, SelectItem, Input } from '@nextui-org/react';
import { ModalThemeWrapper } from '@/wrappers/ModalThemeWrapper';
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
import { CreateGenusForm } from '../taxonomy/sections/forms/CrudGenusForm';
import { useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { PageSubTitle } from '@/components/PageSubTitle';
import { formatTitleCase, getUrlForImageByUUID } from '@/utils/tools';
import { PlusIcon, PencilIcon, TrashIcon, DeleteIcon } from 'lucide-react';
import { EmblaOptionsType } from 'embla-carousel-react'
import useEmblaCarousel from 'embla-carousel-react'
import "./CrudSpeciesForm.css";

// TODO: mover esta restriccion a otro lugar mas generico
const imageMimeType = /image\/(png|jpg|jpeg)/i;

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
  galleryImg: Yup.mixed()
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
  exampleImg?: File,
  galleryImg?: File[],
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

  const exampleImgInputRef = useRef<HTMLInputElement>(null);
  const galleryImgInputRef = useRef<HTMLInputElement>(null);

  const [exampleImgPreview, setExampleImgPreview] = useState<any>(null);
  const [galleryImgPreview, setGalleryImgPreview] = useState<any[]>([]);

  const [emblaRef] = useEmblaCarousel({
    slidesToScroll: 'auto',
    containScroll: 'trimSnaps'
  });

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
        galleryImg: values.galleryImg
      };

      // TODO: sacar y reemplazar por reactqueryhook
      // const response = await axiosClient
      //   .patch("species", updateSpeciesDto, {
      //     headers: {
      //       "Content-Type": "multipart/form-data",
      //     },
      //   })
      //   .then((response) => response.data);

      // console.log(response);

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

  const setImagesOnFirstFetch = async () => {
    // Recupero la exampleImg
    if (getOneSpeciesData && getOneSpeciesData.exampleImg) {
      // console.log(getOneSpeciesData.exampleImg);
      const response = await fetch(getUrlForImageByUUID(getOneSpeciesData.exampleImg.uuid));
      const blob = await response.blob();
      const file = new File([blob], getOneSpeciesData.exampleImg.originalName, { type: blob.type });
      formik.setFieldValue('exampleImg', file);

      if (exampleImgInputRef.current) {
        const dataTransfer = new DataTransfer();
        [file].forEach((file) => dataTransfer.items.add(file));
        exampleImgInputRef.current.files = dataTransfer.files;
      }
    }
    // Recupero todas las imagenes de la galleryImg
    if (getOneSpeciesData && getOneSpeciesData.galleryImg && getOneSpeciesData.galleryImg.length > 0) {
      const arrayFiles: File[] = [];
      for (let i = 0; i < getOneSpeciesData.galleryImg.length; i++) {
        // console.log(getOneSpeciesData.galleryImg[i]);
        const response = await fetch(getUrlForImageByUUID(getOneSpeciesData.galleryImg[i].uuid));
        const blob = await response.blob();
        const file = new File([blob], getOneSpeciesData.galleryImg[i].originalName, { type: blob.type });
        arrayFiles.push(file);
      }
      formik.setFieldValue('galleryImg', arrayFiles);

      if (galleryImgInputRef.current) {
        const dataTransfer = new DataTransfer();
        arrayFiles.forEach((file) => dataTransfer.items.add(file));
        galleryImgInputRef.current.files = dataTransfer.files;
      }
    }
  }

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

      // También recupero las imágenes
      setImagesOnFirstFetch();
    }
  }, [getOneSpeciesIsSuccess]);

  useEffect(() => {
    console.log(formik.errors);
  }, [formik.errors]);

  // useEffect(() => {
  //   console.log(galleryImgPreview);
  // }, [galleryImgPreview]);

  // El ejemplo del previe lo saque de aca:
  // https://blog.logrocket.com/using-filereader-api-preview-images-react/

  // Update exampleImgPreview
  useEffect(() => {
    if (formik.values.exampleImg) {
      const fileReader = new FileReader();
      fileReader.onload = (event: any) => {
        const { result } = event.target;
        if (result) {
          setExampleImgPreview(result);
        }
      }
      fileReader.readAsDataURL(formik.values.exampleImg);
    }
    // TODO: investigar como limpiar el filereader creado
    // return () => {  
    //   fileReader.abort();
    // } 
  }, [formik.values.exampleImg]);

  // Update galleryImgPreview
  useEffect(() => {
    // console.log(formik.values.galleryImg);
    if (formik.values.galleryImg && formik.values.galleryImg.length > 0) {
      const fileReaders: FileReader[] = [];
      const imagesAux: any[] = [];

      for (let i = 0; i < formik.values.galleryImg.length; i++) {
        const image: File = formik.values.galleryImg[i];
        const fileReader = new FileReader();
        fileReaders.push(fileReader);
        fileReader.onload = (event: any) => {
          const { result } = event.target;
          if (result) {
            imagesAux.push(result);
          }
          if (formik.values.galleryImg && (imagesAux.length === formik.values.galleryImg.length)) {
            setGalleryImgPreview(imagesAux);
          }
        }
        fileReader.readAsDataURL(image);
      }
    }


    // TODO: investigar como limpiar el filereader creado
    // return () => {
    //   fileReaders.forEach(fileReader => {
    //     if (fileReader.readyState === 1) {
    //       fileReader.abort()
    //     }
    //   })
    // }
  }, [formik.values.galleryImg]);


  const handleRemoveExampleImage = () => {
    formik.setFieldValue('exampleImg', null);
    setExampleImgPreview(null);
  }

  const handleRemoveGalleryImage = (index: number) => {
    console.log('Quitando prev', index);
    const tempGalleryImgPrevie = galleryImgPreview.filter((item: any, itemIndex: number) => itemIndex !== index);
    setGalleryImgPreview(tempGalleryImgPrevie);
    const tempFormikGalleryValue = formik.values.galleryImg?.filter((item: any, itemIndex: number) => itemIndex !== index);
    formik.setFieldValue('galleryImg', tempFormikGalleryValue);
  }

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

      {/* <Grid item xs={12} md={4}>
        <div className="flex items-center justify-center w-full">
          <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
              </svg>
              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
            </div>
            <input id="dropzone-file" type="file" className="hidden" multiple />
          </label>
        </div>
      </Grid> */}

      <Grid container alignItems={'center'} justifyContent={'space-around'} className='pt-5 pb-5'>
        {/* Example image input */}
        <Grid item alignItems={'center'} xs={12} md={exampleImgPreview && !Boolean(formik.errors.exampleImg) ? 6 : 12}>
          <label
            className="m-2 text-sm font-medium text-gray-900 dark:text-white"
            htmlFor="exampleImg"
          >Foto principal</label>
          <input
            type="file"
            ref={exampleImgInputRef}
            id="exampleImg"
            name="exampleImg"
            accept="image/*"
            // TODO: agregar control de tipos de archivos imagenes
            className={`block mb-2 w-full text-sm focus:outline-none rounded-lg cursor-pointer 
              border border-gray-300 dark:border-gray-600 
              text-gray-900 dark:text-gray-400 bg-gray-50 dark:bg-gray-700
              dark:placeholder-gray-400`}
            onChange={(event: any) => {
              const auxFile: File = event.target.files[0];
              if (auxFile) {
                if (auxFile.type.match(imageMimeType)) {
                  formik.setFieldValue('exampleImg', auxFile);
                } else {
                  formik.setErrors({ exampleImg: 'Error en el tipo de archivo. No es una imagen' });
                  console.log('Error en el tipo de archivo. No es una imagen');
                }
              }
            }}
          />
        </Grid>

        {/* {Boolean(formik.errors.exampleImg) && (
        <Grid item xs={12}>
          <p className='text-error'>ERROR:{formik.errors.exampleImg}</p>
        </Grid>
      )} */}

        {/* Example image preview */}
        {exampleImgPreview && !Boolean(formik.errors.exampleImg) && (
          <Grid item xs={12} md={6}>
            <img
              loading='lazy'
              src={exampleImgPreview}
              alt="Logo JBU"
              title="Logo JBU"
              className="h-96 m-auto"
            />
            <div
              className='flex flex-row justify-center text-error mt-1 align-middle'
              onClick={handleRemoveExampleImage}
            >
              <TrashIcon className='mr-2' />Quitar
            </div>
          </Grid>
        )}
      </Grid>

      <hr />

      <Grid item xs={12} md={4}>
        <label
          className="block mb-2 mt-2 text-sm font-medium text-gray-900 dark:text-white"
          htmlFor="galleryImg"
        >Galeria (opcional)</label>
        <input
          type="file"
          ref={galleryImgInputRef}
          id="galleryImg"
          name="galleryImg"
          className="block w-full text-sm focus:outline-none rounded-lg cursor-pointer 
            border border-gray-300 dark:border-gray-600 
            text-gray-900 dark:text-gray-400 bg-gray-50 dark:bg-gray-700
            dark:placeholder-gray-400"
          // TODO: cambiar el tipo del event al correcto
          onChange={(event: any) => {
            const auxFiles: File[] = event.target.files;
            formik.setFieldValue('galleryImg', auxFiles);
          }}
          multiple
        />
      </Grid>

      {/* Example image preview
      {galleryImgPreview && galleryImgPreview.length > 0 && (
        <>
          <Grid item xs={12}>
            <div className='flex flex-row items-center flex-wrap'>
              {galleryImgPreview.map((imagePreview: any, index: number) => {
                return (
                  <img
                    key={index}
                    loading='lazy'
                    src={imagePreview}
                    alt={`gallery_${index}`}
                    title={`gallery_${index}`}
                    width={100}
                  // className="w-60 md:w-80 lg:w-96 mb-6"
                  />
                );
              })}
            </div>
          </Grid>
        </>
      )} */}

      {/* <EmblaCarousel>  */}

      <div className="embla">
        <div className="embla__viewport" ref={emblaRef}>
          <div className="embla__container">
            {galleryImgPreview.map((imagePreview: any, index: number) => (
              <div className="embla__slide" key={index}>
                <div className="embla__slide__number">
                  <span>{index + 1}</span>
                </div>
                <img
                  className="embla__slide__img"
                  src={imagePreview}
                  alt="Your alt text"
                />
                <div
                  className='flex flex-row justify-center text-error mt-1 align-middle'
                  onClick={() => handleRemoveGalleryImage(index)}
                >
                  <TrashIcon className='mr-2' />Quitar
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* </EmblaCarousel>  */}

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
          scrollBehavior="outside"
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
          scrollBehavior="outside"
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
