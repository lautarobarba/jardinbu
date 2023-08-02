import { useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { PublicNavBar } from "../components/PublicNavBar";
import { SideBar } from "../components/SideBar";
import { useUserIsAuthenticated } from "../features/auth/authHooks";

export const PublicLayout = () => {

  // Redirecciono si el usuario ya esta autenticado
  const isAuthenticated = useUserIsAuthenticated();
  const location = useLocation();
  
  if(isAuthenticated){
    return (<Navigate to="/app/admin" replace state={{ location }}/>); 
  }

  return (
    <>
      <PublicNavBar />
      <div>
        <div id="navbar-spacer" className="" style={{ height: "65px" }}></div>
        {/* <p>PUBLIC LAYOUT</p> */}
        <Outlet />
      </div>
    </>
  );
};
