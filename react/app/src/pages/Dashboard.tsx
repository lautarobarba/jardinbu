import { PageSubTitle } from '../components/PageSubTitle';
import { PageTitle } from '../components/PageTitle';
import { Link } from 'react-router-dom';
import { useCurrentUser } from '../features/auth/authHooks';

export const Dashboard = () => {
  const user = useCurrentUser();

  return (
    <>
      <PageTitle title='Biblioteca del Bosque' />
      <PageSubTitle title='Dashboard (PRIVADO)' className='w-100 text-center' />

      {/* <p>Estadísticas</p>
      <p>Todavía no sé qué, pero seguro va algo de estadísticas o algo así.</p>
      <hr /> */}
      {/* <PageSubTitle title="Testeando Autenticación.." />
      { user ? (
        <>
          <p>Usuario logueado: {user.firstname} {user.lastname}</p>
          <Link 
            to={"/app/auth/logout"} 
            className="btn bg-dark text-white"
          >
            SALIR
          </Link>
        </>
      ):(
        <>
          <p>No hay usuario logueado</p>
          <ul>
            <li>
              <Link to={"/app/auth/register"}>Registro</Link>
            </li>
            <li>
              <Link to={"/app/auth/login"}>Login</Link>
            </li>
          </ul>
        </>
      )} */}
    </>
  );
};
