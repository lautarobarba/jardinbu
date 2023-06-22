import { Outlet } from "react-router-dom";
import RegistrationImage from '../assets/images/registration.svg';
import { Footer } from "../components/Footer";

export const AuthLayout = () => {
  return (
    <>
      <section 
        id='authentication-layout' 
        className="min-vh-100 d-flex"
      >
        {/* Imagen */}
        <div 
          className="d-none d-md-block col-md-7"
          style={{ backgroundColor: 'white' }}
        >
          <div className="h-100 d-flex justify-content-center align-items-center pl-1">
            <img 
              src={RegistrationImage} 
              title="welcome-garden" 
              alt="welcome-garden" 
              style={{ maxHeight: '100%', maxWidth: '98%' }} 
            />
          </div>
        </div>

        {/* Páginas */}
        <div 
          className="col-12 col-md-5 shadow-5-strong d-flex flex-column justify-content-between" 
          style={{ backgroundColor: '#fbfcfe' }}
        >
          <Outlet />
          <Footer />
        </div>
      </section>
    </>
  );
};
