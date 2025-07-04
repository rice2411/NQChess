const ROUTES = {
  ANONYMOUS: {
    LOGIN: '/login',
    REGISTER: '/register',
    FORGOT_PASSWORD: '/forgot-password',
    RESET_PASSWORD: '/reset-password',
  },
  AUTHENTICATED: {
    HOME: '/',
    PROFILE: '/profile',
    SETTINGS: '/settings',
    ADMIN: '/admin',
  },
};

export default ROUTES;

export const ROUTES_ANONYMOUS = ROUTES.ANONYMOUS;
export const ROUTES_AUTHENTICATED = ROUTES.AUTHENTICATED;