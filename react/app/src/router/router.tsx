import { createBrowserRouter } from 'react-router-dom';
import { ROUTES } from './routes';
import { PublicLayout } from '../layouts/PublicLayout';
import { PrivateLayout } from '../layouts/PrivateLayout';
import { AuthLayout } from '../layouts/AuthLayout';
import { Page404 } from '../pages/Page404';
import { Dashboard } from '../pages/Dashboard';
import { RegisterPage } from '../pages/RegisterPage';
import { LoginPage } from '../pages/LoginPage';
import { TestPage } from '../pages/TestPage';
import { HomePage } from '../pages/HomePage';
import { SpeciesPublicPage } from '../pages/SpeciesPublicPage';
import { SpeciesPrivatePage } from '../pages/SpeciesPrivatePage/SpeciesPrivatePage';
import { LogoutPage } from '../pages/LogoutPage';
import { SpecimensPublicPage } from '../pages/SpecimensPublicPage';
import { EmailConfirmationRequiredPage } from '../pages/EmailConfirmationRequiredPage';
import { ConfirmEmailPage } from '../pages/ConfirmEmailPage';
import { SpecimensPrivatePage } from '../pages/SpecimensPrivatePage/SpecimensPrivatePage';
import { ProfilePage } from '../pages/ProfilePage';
import { TaxonomyPage } from '../pages/TaxonomyPage';
import { SearchPrivatePage } from '../pages/SearchPrivatePage';
import { KingdomDetail } from '../pages/Kingdom/KingdomDetail';

export const router = createBrowserRouter([
  {
    // path: '/',
    path: ROUTES.ROOT,
    element: <Page404 />,
  },
  {
    // path: '/app',
    path: ROUTES.APP,
    children: [
      {
        // path: '/app',
        path: ROUTES.PUBLIC,
        element: <PublicLayout />,
        children: [
          {
            // path: '/app',
            path: ROUTES.HOME,
            element: <HomePage />,
          },
          {
            // path: '/app/species',
            path: ROUTES.SPECIES,
            element: <SpeciesPublicPage />,
          },
          {
            // path: '/app/specimen',
            path: ROUTES.SPECIMEN,
            element: <SpecimensPublicPage />,
          },
          {
            // Si no encuentro ninguna de las rutas anteriores entonces renderizo 404
            // path: '/app/*',
            path: ROUTES.ELSE,
            element: <Page404 />,
          },
        ],
      },
      {
        // path: '/app/admin',
        path: ROUTES.PRIVATE,
        element: <PrivateLayout />,
        children: [
          {
            // path: '/app/admin',
            path: ROUTES.DASHBOARD,
            element: <Dashboard />,
          },
          {
            // path: '/app/admin/profile',
            path: ROUTES.PROFILE,
            element: <ProfilePage />,
          },
          {
            // path: '/app/admin/browser',
            path: ROUTES.BROWSER,
            element: <SearchPrivatePage />,
          },
          {
            // path: '/app/admin/taxonomy',
            path: ROUTES.TAXONOMY,
            element: <TaxonomyPage />,
          },
          {
            // path: '/app/admin/kingdom/detail/:id',
            path: ROUTES.KINGDOM_DETAIL,
            element: <KingdomDetail />,
          },
          {
            // path: '/app/admin/species',
            path: ROUTES.SPECIES,
            element: <SpeciesPrivatePage />,
          },
          {
            // path: '/app/admin/specimen',
            path: ROUTES.SPECIMEN,
            element: <SpecimensPrivatePage />,
          },
          {
            // Si no encuentro ninguna de las rutas anteriores entonces renderizo 404
            // path: '/app/admin/*',
            path: ROUTES.ELSE,
            element: <Page404 />,
          },
        ],
      },
      {
        // Si no encuentro ninguna de las rutas anteriores entonces renderizo 404
        // path: '/app/*',
        path: ROUTES.ELSE,
        element: <Page404 />,
      },
    ],
  },
  {
    // path: '/app/auth',
    path: ROUTES.AUTH,
    element: <AuthLayout />,
    children: [
      {
        // path: '/app/auth/register',
        path: ROUTES.REGISTER,
        element: <RegisterPage />,
      },
      {
        // path: '/app/auth/login',
        path: ROUTES.LOGIN,
        element: <LoginPage />,
      },
      {
        // path: '/app/auth/logout',
        path: ROUTES.LOGOUT,
        element: <LogoutPage />,
      },
      {
        // path: '/app/auth/email-confirmation-required',
        path: ROUTES.CONFIRM_EMAIL_REQUIRED,
        element: <EmailConfirmationRequiredPage />,
      },
      {
        // path: '/app/auth/confirm-email/:token',
        path: ROUTES.CONFIRM_EMAIL,
        // loader: contactLoader,
        element: <ConfirmEmailPage />,
      },
      {
        // Si no encuentro ninguna de las rutas anteriores entonces renderizo 404
        // path: '/app/auth/*',
        path: ROUTES.ELSE,
        element: <Page404 />,
      },
    ],
  },
  {
    // path: '/test',
    path: ROUTES.TEST,
    element: <TestPage />,
  },
  {
    // Si no encuentro ninguna de las rutas anteriores entonces renderizo 404
    // path: '/*',
    path: ROUTES.ELSE,
    element: <Page404 />,
  },
]);
