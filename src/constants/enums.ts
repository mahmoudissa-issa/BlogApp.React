export const UserRole = {
  ADMIN: 'Admin',
  USER: 'User',
  MODERATOR: 'Moderator'
} as const;

export type UserRole = typeof UserRole[keyof typeof UserRole];