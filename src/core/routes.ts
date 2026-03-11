
export const ROUTES = {
  home: '/',
  login: '/login',
  register: '/register',
  profile: '/profile',
  post: (slug: string) => `/posts/${slug}`,

  // Admin routes
  admin: '/admin',
  adminPosts: '/admin/posts',
  adminPostNew: '/admin/posts/new',
  adminPostEdit: (id: number) => `/admin/posts/edit/${id}`,
  adminTags: '/admin/tags',
  adminComments: '/admin/comments',
  adminUsers: '/admin/users',

  // Author routes
  author: '/author',
  authorPosts: '/author/posts',
  authorPostNew: '/author/posts/new',
  authorPostEdit: (id: number) => `/author/posts/edit/${id}`,

  // Auth
  forgotPassword: '/forgot-password',
  resetPassword: '/reset-password',
  checkEmail: '/check-email',
  verifyEmail: '/verify-email/:token',
};
