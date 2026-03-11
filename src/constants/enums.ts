export const Roles = {
  ADMIN: 'Admin',
  AUTHOR: 'Author',
  READER: 'Reader',
} as const;

export type Roles = (typeof Roles)[keyof typeof Roles];

/** Roles that can access a dashboard (Admin or Author) */
export const DASHBOARD_ROLES: Roles[] = [Roles.ADMIN, Roles.AUTHOR];