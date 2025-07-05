const ROUTES = {
  ANONYMOUS: {
    LOGIN: '/login',
  },
  DEFAULT: {
    HOME: '/',
  },
  ADMIN: {
    DASHBOARD: '/dashboard',
    STUDENTS: 'students',
    CLASSES: 'classes',
    ATTENDANCE: 'attendance',
    TUITION: 'tuition',
    POSTS: 'posts',
    REPORTS: 'reports',
    SETTINGS: 'settings',
    ACCOUNT: 'account',
    LOGOUT: '/logout',
  },
};

export default ROUTES;

export const ROUTES_ANONYMOUS = ROUTES.ANONYMOUS;
export const ROUTE_DEFAULT = ROUTES.DEFAULT;
export const ROUTES_ADMIN = ROUTES.ADMIN;
