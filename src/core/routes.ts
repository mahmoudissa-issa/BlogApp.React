
export const ROUTES = {
  home: '/',
  login: '/login',
  register: '/register',
  profile: '/profile',
  post: (slug: string) => `/posts/${slug}`,
  admin: '/admin',
  forgotPassword: '/forgot-password',
  resetPassword: '/reset-password',
};
