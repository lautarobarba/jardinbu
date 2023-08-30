"use client";
import { useParams } from 'next/navigation';
import { useGetPhylum } from '@/services/hooks';
import { ModalCrudPhylum } from '../forms/CrudPhylumForm';
import { Grid } from '@mui/material';

export const PhylumDetail = () => {
  const { id } = useParams();

  // Query
  const {
    isLoading: getPhylumIsLoading,
    isSuccess: getPhylumIsSuccess,
    data: getPhylumData,
    isError: getPhylumIsError,
    error: getPhylumError,
  } = useGetPhylum({ id: Number(id) ?? 0 }, { keepPreviousData: true });

  return (
    <>
      <br />
      <br />
      <Grid>
        <h1>Detalle de Reino N° {id}</h1>
        <ModalCrudPhylum id={Number(id)} />
      </Grid>
      <p>{JSON.stringify(getPhylumData)}</p>
    </>
  );
};
