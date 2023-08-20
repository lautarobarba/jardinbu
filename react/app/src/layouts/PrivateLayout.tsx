import { useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { PrivateNavBar } from "../components/PrivateNavBar";
import { SideBar } from "../components/SideBar";
import { useCurrentUser, useUserIsAuthenticated } from "../features/auth/authHooks";

export const PrivateLayout = () => {

  // Redirecciono si el usuario no esta autenticado
  const isAuthenticated = useUserIsAuthenticated();
  const location = useLocation();
  const user = useCurrentUser();

  const getSideBarLastState = () => {
    const sideBarData: string | null = localStorage.getItem("sidebar");
    if (sideBarData) {
      const sideBar: boolean = Boolean(JSON.parse(sideBarData));
      return sideBar;
    }
    return false;
  };

  const [menuState, setMenuState] = useState<boolean>(getSideBarLastState());
  // const [menuState, setMenuState] = useState<boolean>(true);

  const DRAWERWIDTH: number = 250;

  const toggleSideBar = () => {
    const prevState = menuState;
    setMenuState(!prevState);
    localStorage.setItem("sidebar", JSON.stringify(!prevState));
  };

  // // Valido si el usuario esta autenticado
  // if(!isAuthenticated){
  //   return (<Navigate to="/app/auth/login" replace state={{ location }}/>); 
  // }

  // // Valido si el usuario confirmó su correo electrónico
  // if(user && !user.isEmailConfirmed){
  //   return (<Navigate to="/app/auth/email-confirmation-required" replace state={{ location }}/>);
  // }

  return (
    <>
      <PrivateNavBar
        toggleSideBar={toggleSideBar}
        drawerWidth={DRAWERWIDTH}
      />
      <SideBar
        toggleSideBar={toggleSideBar}
        drawerWidth={DRAWERWIDTH}
        menuState={menuState}
      />
      <div className="d-flex flex-row">
        <div
          id="sidebar-spacer"
          className="d-none d-md-block"
          style={{ backgroundColor: 'red', minWidth: menuState ? DRAWERWIDTH : 0, transitionDuration: '0.2s' }}
        ></div>
        <div className="w-100">
          <div id="navbar-spacer" style={{ height: "65px" }}></div>
          {/* <p>DASHBOARD LAYOUT</p> */}
          <div className="container-fluid">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
};
