// ROUTE NAMES

export const ROUTES = {
  ROOT: '',
  APP: '/app',
  // App pública
  PUBLIC: '',
  HOME: '',
  // App privada
  PRIVATE: 'admin',
  DASHBOARD: '',
  BROWSER: 'browser',
  TAXONOMY: 'taxonomy',
  // Common routes
  KINGDOM_LIST: 'kingdom',
  KINGDOM_DETAIL: 'kingdom/detail/:id',
  // FAMILY: "family",
  // GENUS: "genus",
  SPECIES: 'species',
  SPECIMEN: 'specimen',

  // Auth
  AUTH: '/app/auth',
  REGISTER: 'register',
  LOGIN: 'login',
  LOGOUT: 'logout',
  PROFILE: 'profile',
  CONFIRM_EMAIL_REQUIRED: 'email-confirmation-required',
  CONFIRM_EMAIL: 'confirm-email/:token',

  // 404 Error
  ELSE: '*',

  // Test
  TEST: '/test',
};
