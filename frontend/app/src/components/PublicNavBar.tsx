import {
  MDBBtn,
  MDBCollapse,
  MDBContainer,
  MDBIcon,
  MDBNavbar,
  MDBNavbarBrand,
  MDBNavbarItem,
  MDBNavbarNav,
  MDBNavbarToggler,
} from "mdb-react-ui-kit";
import { useState } from "react";
import { Link } from "react-router-dom";

export const PublicNavBar = () => {
  const [showNav, setShowNav] = useState<boolean>(true);

  return (
    <MDBNavbar expand='md' className="navbar fixed-top navbar-expand-md bg-dark">
      <MDBContainer fluid>
          <MDBNavbarBrand className="text-white" href="/app">
            Biblioteca del Bosque
          </MDBNavbarBrand>
            <MDBNavbarToggler
            type='button'
            aria-expanded='false'
            aria-label='Toggle navigation'
            onClick={() => setShowNav(!showNav)}
          >
            <MDBIcon icon='bars' fas style={{ color: 'white' }} />
          </MDBNavbarToggler>

          <MDBCollapse navbar show={showNav}>
            <MDBNavbarNav right fullWidth={false}>
              <MDBNavbarItem className="nav-item text-center">
                <Link to={"/app"} className="nav-link text-white custom-link">Inicio</Link>
              </MDBNavbarItem>
              <MDBNavbarItem className="nav-item text-center">
                <Link to={"/app"} className="nav-link text-white custom-link">Blog</Link>
              </MDBNavbarItem>
              <MDBNavbarItem className="nav-item text-center">
                <Link to={"/app/species"} className="nav-link text-white custom-link">Especies</Link>
              </MDBNavbarItem>
              <MDBNavbarItem className="nav-item text-center">
                <Link to={"/app/specimen"} className="nav-link text-white custom-link">Ejemplares</Link>
              </MDBNavbarItem>
              <MDBNavbarItem className="nav-item text-center">
                <Link to={"/app/auth/login"} className="nav-link text-white custom-link" style={{ padding: 0 }}>
                  <MDBBtn
                    type="button" 
                    className="btn btn-bg-primary custom-link w-100 w-md-auto" 
                    style={{ textTransform: 'none', padding: '8px', marginTop: 'auto' }}
                  >
                    Ingresar
                  </MDBBtn>
                </Link>
              </MDBNavbarItem>
            </MDBNavbarNav>
          </MDBCollapse>
      </MDBContainer>
    </MDBNavbar>
  );
};
