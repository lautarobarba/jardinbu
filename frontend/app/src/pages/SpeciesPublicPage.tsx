import { Link } from "react-router-dom";
import { PageSubTitle } from "../components/PageSubTitle";
import { PageTitle } from "../components/PageTitle";
// import { useQuery } from "@tanstack/react-query";
// import { getSpecies } from "../api/services";

// interface Species {
//   id: number;
//   name: string;
//   family: string;
//   description: string;
//   distribution: string;
//   createdAt: Date;
//   updatedAt: Date;
//   deleted: boolean;
// }

export const SpeciesPublicPage = () => {
  // Queries
  // const { isLoading, isError, data, error } = useQuery<Species[]>(
  //   ["species"],
  //   getSpecies
  // );

  // Mutations
  // const mutation = useMutation(postTodo, {
  //   onSuccess: () => {
  //     // Invalidate and refetch
  //     queryClient.invalidateQueries(["todos"]);
  //   },
  // });

  // if (isError) {
  //   console.log(error);
  //   return <h1>Error...</h1>;
  // }

  return (
    <>
      <PageTitle title="Especies (vista pública)" />
      <p><Link to={"/app"}>Volver al Inicio</Link></p>
      <PageSubTitle title="Listado de especies" />
{/* 
      {isLoading ? (
        <p>CARGANDO...</p>
      ) : (
        <div className="species">
          <ul>
            {data.map((species: any) => {
              return (
                <li key={species.id}>{`${species.id} - ${species.name}`}</li>
              );
            })}
          </ul>
        </div>
      )} */}
    </>
  );
};
