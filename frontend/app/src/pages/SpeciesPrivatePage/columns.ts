import { createColumnHelper } from "@tanstack/react-table";
import { Species } from "../../interfaces/SpeciesInterface";
import moment from "moment";

const columnHelper = createColumnHelper<Species>();

export const columns: any = [
  // Accessor Column
  columnHelper.accessor("id", {
    header: "Id",
  }),
  // Accessor Column
  columnHelper.accessor("scientificName", {
    id: "scientificName",
    header: "Nombre científico",
    cell: (props) =>
      `${props.getValue().charAt(0).toUpperCase()}${props
        .getValue()
        .slice(1)
        .toLowerCase()}`,
  }),
  // Accessor Column
  columnHelper.accessor("description", {
    id: "description",
    header: "Descripción",
  }),
  // Accessor Column
  columnHelper.accessor("genus", {
    id: "genus",
    header: "Género",
    cell: (props) =>
      `${props.getValue().name.charAt(0).toUpperCase()}${props
        .getValue()
        .name.slice(1)
        .toLowerCase()} (${props.getValue().description.toLowerCase()})`,
  }),
  // Accessor Column
  columnHelper.accessor("genus", {
    id: "family",
    header: "Familia",
    cell: (props) =>
      `${props.getValue().family.name.charAt(0).toUpperCase()}${props
        .getValue()
        .family.name.slice(1)
        .toLowerCase()} (${props.getValue().family.description.toLowerCase()})`,
  }),
  // Accessor Column
  columnHelper.accessor("createdAt", {
    id: "createdAt",
    header: "Registrado",
    cell: (props) => moment(props.getValue()).format("DD/MM/YYYY"),
  }),
  // // Accessor Column
  // columnHelper.accessor("updatedAt", {
  //   id: "updatedAt",
  //   header: "Última modificación",
  // }),
  // Display Column
  columnHelper.display({
    id: "acciones",
    header: "Acciones",
    // cell: (props) => (
    //   <span>
    //     // <ModalCrudFamily objectId={props.row.original.id} />
    //   </span>
    // ),
  }),
];
