import { PageTitle } from '../components/PageTitle';
import { FormEvent, useEffect, useState } from 'react';
import { TextField, Grid } from '@mui/material';
import { MDBBtn, MDBIcon } from 'mdb-react-ui-kit';
import { useGetGlobalSearch } from '../api/hooks';
import { Link, useSearchParams } from 'react-router-dom';

export const SearchPrivatePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [value, setValue] = useState<string>(searchParams.get('value') ?? '');
  const [result, setResult] = useState({
    kingdoms: [],
  });

  // Query
  const {
    isLoading: getGlobalSearchIsLoading,
    isSuccess: getGlobalSearchIsSuccess,
    data: getGlobalSearchData,
    isError: getGlobalSearchIsError,
    error: getGlobalSearchError,
    refetch: getGlobalSearchRefetch,
  } = useGetGlobalSearch({ value: value }, { enabled: false });

  const search = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (value !== '') {
      // console.log({ search: value });
      getGlobalSearchRefetch();
      setSearchParams({ value });
    }
  };

  useEffect(() => {
    // console.log(getGlobalSearchData);
    if (getGlobalSearchData) setResult(getGlobalSearchData);
  }, [getGlobalSearchData]);

  useEffect(() => {
    if (value !== '') getGlobalSearchRefetch();
  }, []);

  return (
    <>
      <PageTitle title='Buscador global' />

      <div className='bg-white p-3 rounded'>
        <form onSubmit={(event) => search(event)}>
          <Grid container spacing={2} justifyContent={'center'}>
            <Grid item xs={12}>
              <TextField
                id='value'
                name='value'
                label=''
                value={value}
                placeholder='Buscar...'
                onChange={(e) => setValue(e.target.value)}
                fullWidth
                required
                autoFocus
              />
            </Grid>

            <Grid container item xs={12} justifyContent={'center'}>
              <MDBBtn color='primary' type='submit' disabled={false}>
                <MDBIcon icon='search' size='lg' className='text-white me-2' />
                Buscar
              </MDBBtn>
            </Grid>
          </Grid>
        </form>
      </div>

      <hr />

      {/* Busqueda de reinos */}
      {result && result.kingdoms && result.kingdoms.length === 0 && (
        <>
          <h3>Reinos</h3>
          <p>Sin resultados...</p>
        </>
      )}
      {result && result.kingdoms && result.kingdoms.length > 0 && (
        <>
          <h3>Reinos</h3>
          <ul>
            {result.kingdoms.map((kingdom: any) => (
              <li key={kingdom.id}>
                {kingdom.name}
                <Link to={`/app/admin/kingdom/detail/${kingdom.id}`}>Ver</Link>
              </li>
            ))}
          </ul>
        </>
      )}

      <h3>Filos encontrados...</h3>
      <h3>SubFilos encontrados...</h3>
      {/* <p>Estadísticas</p> */}
    </>
  );
};
