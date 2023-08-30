"use client";
import { useParams } from 'next/navigation';
import { useGetKingdom } from '@/services/hooks';
import { ModalCrudKingdom } from '../forms/CrudKingdomForm';
import { Grid } from '@mui/material';

export const KingdomDetail = () => {
  const { id } = useParams();

  // Query
  const {
    isLoading: getKingdomIsLoading,
    isSuccess: getKingdomIsSuccess,
    data: getKingdomData,
    isError: getKingdomIsError,
    error: getKingdomError,
  } = useGetKingdom({ id: Number(id) ?? 0 }, { keepPreviousData: true });

  return (
    <>
      <br />
      <br />
      <Grid>
        <h1>Detalle de Reino N° {id}</h1>
        <ModalCrudKingdom id={Number(id)} />
      </Grid>
      <p>{JSON.stringify(getKingdomData)}</p>
    </>
  );
};
