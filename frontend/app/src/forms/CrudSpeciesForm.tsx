import * as Yup from "yup";
import { FormikHelpers, useFormik } from "formik";
import {
  Select,
  TextField,
  MenuItem,
  InputLabel,
  FormControl,
  Grid,
  Autocomplete,
  Button,
  Dialog,
} from "@mui/material";
import { MDBBtn } from "mdb-react-ui-kit";
import Axios from "axios";
import { useCreateSpecies, useGetFamilies, useGetGenera } from "../api/hooks";
import { useJwtToken } from "../features/auth/authHooks";
import { useQueryClient } from "@tanstack/react-query";
import { Family } from "../interfaces/FamilyInterface";
import { Genus } from "../interfaces/GenusInterface";
import {
  CreateSpeciesDto,
  FoliageType,
  Origin,
  Species,
  Status,
} from "../interfaces/SpeciesInterface";
import { useSnackbar } from "notistack";
import { PageSubTitle } from "../components/PageSubTitle";
import { useEffect, useState } from "react";
import { CreateGenusForm } from "./CrudGenusForm";

interface Props {
  toggleVisibility: Function;
}

export const CreateSpeciesForm = (props: Props) => {
  const { toggleVisibility } = props;
  const token = useJwtToken();
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  const [familia, setFamilia] = useState<string>("");

  const [openCreateGenusModal, setOpenCreateGenusModal] =
    useState<boolean>(false);

  const toggleOpenCreateGenusModal = () => {
    setOpenCreateGenusModal(!openCreateGenusModal);
  };

  // Mutación
  const {
    mutate: createSpeciesMutate,
    isLoading: createSpeciesIsLoading,
    // isSuccess: createSpeciesIsSuccess,
    // isError: createSpeciesIsError,
    // error: createSpeciesError
  } = useCreateSpecies();

  const ValidationSchema = Yup.object().shape({
    scientificName: Yup.string()
      .min(2, "Demasiado corto")
      .max(100, "Demasiado largo")
      .required("La especie necesita un nombre"),
    commonName: Yup.string()
      .min(2, "Demasiado corto")
      .max(100, "Demasiado largo"),
    description: Yup.string()
      .min(2, "Demasiado corto")
      .max(100, "Demasiado largo"),
    genusId: Yup.number().required("Por favor seleccione un género"),
    status: Yup.string()
      .min(2, "Demasiado corto")
      .max(100, "Demasiado largo")
      .required("La especie necesita un estado"),
    origin: Yup.string()
      .min(2, "Demasiado corto")
      .max(100, "Demasiado largo")
      .required("La especie necesita un origen"),
    foliageType: Yup.string()
      .min(2, "Demasiado corto")
      .max(100, "Demasiado largo"),
  });

  interface Values {
    scientificName: string;
    commonName: string;
    description: string;
    genusId: number;
    status: string;
    origin: string;
    foliageType: string;
  }

  // Lista de géneros para select
  const { isSuccess: getGeneraIsSuccess, data: getGeneraData } = useGetGenera(
    {}
  );

  // Lista de familias para Select
  const { isSuccess: getFamiliesIsSuccess, data: getFamiliesData } =
    useGetFamilies({});

  const formik = useFormik({
    initialValues: {
      scientificName: "",
      commonName: "",
      description: "",
      genusId: 0,
      status: Status.PRESENT,
      origin: Origin.NATIVE,
      foliageType: FoliageType.PERENNE,
    },
    validationSchema: ValidationSchema,
    onSubmit: async (values: any, { setErrors }: FormikHelpers<any>) => {
      const createSpeciesDto: CreateSpeciesDto = {
        scientificName: values.scientificName,
        commonName: values.commonName,
        description: values.description,
        genusId: values.genusId,
        status: values.status,
        origin: values.origin,
        foliageType: values.foliageType,
      };

      createSpeciesMutate(
        { token: token ?? "", createSpeciesDto },
        {
          onError: (error: any) => {
            console.log("ERROR: Error al crear una especie");
            console.log(error);
            enqueueSnackbar("ERROR: Error al crear una especie", {
              anchorOrigin: { horizontal: "right", vertical: "bottom" },
              variant: "error",
            });
          },
          onSuccess: (species: Species) => {
            console.log("Especie creada correctamente");
            console.log(species);
            queryClient.invalidateQueries(["species"]);
            toggleVisibility(false);
            enqueueSnackbar("Especie creada correctamente", {
              anchorOrigin: { horizontal: "right", vertical: "bottom" },
              variant: "success",
            });
          },
        }
      );
    },
  });

  // Formateo para select
  const getGeneraForSelect = () => {
    if (getGeneraData) {
      return getGeneraData?.rows.map((genus: Genus) => {
        return {
          value: genus.id,
          label: `${genus.name.charAt(0).toUpperCase()}${genus.name
            .slice(1)
            .toLowerCase()}`,
        };
      });
    } else {
      return [];
    }
  };

  // Actualizo la familia al cambiar el genero
  useEffect(() => {
    if (formik.values.genusId) {
      const generoSelected: Genus | undefined = getGeneraData?.rows.filter(
        (genus) => genus.id === formik.values.genusId
      )[0];
      setFamilia(
        `${generoSelected?.family.name
          .charAt(0)
          .toUpperCase()}${generoSelected?.family.name
          .slice(1)
          .toLowerCase()}` ?? ""
      );
    }
  }, [formik.values.genusId]);

  return (
    <form onSubmit={formik.handleSubmit}>
      <Grid container spacing={2} justifyContent={"center"}>
        <Grid container item xs={12} justifyContent={"center"}>
          <PageSubTitle title="Registrar nueva especie" />
        </Grid>

        <Grid item xs={11} md={5}>
          <Autocomplete
            id="genusId"
            selectOnFocus={true}
            clearOnBlur={true}
            options={getGeneraForSelect()}
            fullWidth
            renderInput={(params) => (
              <TextField
                name="genusId"
                label="Género"
                value={formik.values.genusId}
                error={formik.touched.genusId && Boolean(formik.errors.genusId)}
                helperText={formik.touched.genusId && formik.errors.genusId}
                {...params}
                required={true}
              />
            )}
            isOptionEqualToValue={(option: any, selection: any) =>
              option.value === selection.value
            }
            onChange={(e, selection) => {
              formik.setFieldValue("genusId", selection?.value);
              formik.setFieldValue("scientificName", `${selection?.label} `);
            }}
            disableClearable={true}
          />
        </Grid>
        <Grid item xs={1}>
          <Button
            style={{ height: "100%" }}
            onClick={() => setOpenCreateGenusModal(true)}
          >
            <i className="fas fa-plus fa-2x"></i>
          </Button>
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            name="Familia"
            label="Familia"
            fullWidth
            value={familia}
            disabled
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            id="scientificName"
            name="scientificName"
            label="Nombre científico"
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
            autoComplete="scientificName"
            autoFocus
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            id="commonName"
            name="commonName"
            label="Nombre común"
            value={formik.values.commonName}
            onChange={formik.handleChange}
            error={
              formik.touched.commonName && Boolean(formik.errors.commonName)
            }
            helperText={formik.touched.commonName && formik.errors.commonName}
            fullWidth
            autoComplete="commonName"
            autoFocus
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            id="description"
            name="description"
            label="Descripción"
            value={formik.values.description}
            onChange={formik.handleChange}
            error={
              formik.touched.description && Boolean(formik.errors.description)
            }
            helperText={formik.touched.description && formik.errors.description}
            fullWidth
            autoComplete="description"
            autoFocus
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel>Estatus</InputLabel>
            <Select
              id="status"
              name="status"
              label="Estatus"
              value={formik.values.status}
              onChange={formik.handleChange}
              error={formik.touched.status && Boolean(formik.errors.status)}
              fullWidth
              autoComplete="status"
              autoFocus
            >
              <MenuItem key={0} value={"PRESENT"}>
                Presente
              </MenuItem>
              <MenuItem key={1} value={"ABSENT"}>
                Ausente
              </MenuItem>
              <MenuItem key={2} value={"EXTINCT"}>
                Extinta
              </MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel>Origen</InputLabel>
            <Select
              id="origin"
              name="origin"
              label="Origen"
              value={formik.values.origin}
              onChange={formik.handleChange}
              error={formik.touched.origin && Boolean(formik.errors.origin)}
              fullWidth
              autoComplete="origin"
              autoFocus
            >
              <MenuItem key={0} value={"NATIVE"}>
                Nativa
              </MenuItem>
              <MenuItem key={1} value={"INTRODUCED"}>
                Introducida
              </MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel>Tipo de follaje</InputLabel>
            <Select
              id="foliageType"
              name="foliageType"
              label="Tipo de follaje"
              value={formik.values.foliageType}
              onChange={formik.handleChange}
              error={
                formik.touched.foliageType && Boolean(formik.errors.foliageType)
              }
              fullWidth
              autoComplete="foliageType"
              autoFocus
            >
              <MenuItem key={0} value={"PERENNE"}>
                Perenne
              </MenuItem>
              <MenuItem key={1} value={"CADUCA"}>
                Caducifolia
              </MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <br />
      <Grid container spacing={2} justifyContent={"center"}>
        <MDBBtn
          color="danger"
          style={{ margin: "1rem" }}
          disabled={createSpeciesIsLoading}
          onClick={() => toggleVisibility(false)}
        >
          Cancelar
        </MDBBtn>
        <MDBBtn
          color="primary"
          type="submit"
          style={{ margin: "1rem" }}
          disabled={createSpeciesIsLoading}
        >
          {createSpeciesIsLoading ? "Guardando..." : "Guardar"}
        </MDBBtn>
      </Grid>

      <Dialog
        onClose={() => setOpenCreateGenusModal(false)}
        open={openCreateGenusModal}
        maxWidth={"md"}
        fullWidth
      >
        <div className="p-5">
          <CreateGenusForm toggleVisibility={toggleOpenCreateGenusModal} />
        </div>
      </Dialog>
    </form>
  );
};
