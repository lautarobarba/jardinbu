import {
  Drawer,
  // Toolbar,
  // List,
  // Typography,
  // IconButton,
  // ListItem,
  // ListItemIcon,
  // ListItemText,
  // AppBar,
  // Grid
} from '@mui/material';
import {
  MDBIcon,
  MDBNavbar,
  MDBNavbarBrand,
  MDBNavbarItem,
} from 'mdb-react-ui-kit';
import { Link } from 'react-router-dom';
// import { Link } from "react-router-dom";

interface Props {
  toggleSideBar: Function;
  drawerWidth: number;
  menuState: boolean;
}

export const SideBar = (props: Props) => {
  const { toggleSideBar, drawerWidth, menuState } = props;

  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
        },
      }}
      variant='persistent'
      anchor='left'
      open={menuState}
      id='sidebar'
    >
      {/* Brand */}
      <MDBNavbar className='navbar navbar-expand-md bg-dark'>
        <div
          className='d-flex justify-content-between'
          style={{ width: drawerWidth }}
        >
          <MDBNavbarBrand className='text-white' href='/app/admin'>
            Biblioteca
          </MDBNavbarBrand>
          <MDBIcon
            icon='times'
            size='lg'
            className='text-white'
            style={{ marginTop: 'auto', marginBottom: 'auto' }}
            onClick={toggleSideBar}
          />
        </div>
      </MDBNavbar>

      {/* Enlaces */}
      <hr style={{ margin: 0 }} />
      <Link className='nav-link custom-link' to={'/app/admin/profile'}>
        Perfil
      </Link>
      <hr style={{ margin: 0 }} />
      <Link className='nav-link custom-link' to={'/app/admin/browser'}>
        Buscador
      </Link>
      <Link className='nav-link custom-link' to={'/app/admin/taxonomy'}>
        Taxonomía
      </Link>
      {/* <Link className='nav-link custom-link' to={'/app/admin/family'}>
        Familias
      </Link>
      <Link className='nav-link custom-link' to={'/app/admin/genus'}>
        Géneros
      </Link> */}
      <Link className='nav-link custom-link' to={'/app/admin/species'}>
        Especies
      </Link>
      <Link className='nav-link custom-link' to={'/app/admin/specimen'}>
        Ejemplares
      </Link>
      <Link className='nav-link custom-link' to={'/app/admin/blog'}>
        Blog
      </Link>
      <hr style={{ margin: 0 }} />
      <Link className='nav-link custom-link' to={'/app/auth/logout'}>
        Salir
      </Link>
    </Drawer>
  );
};
