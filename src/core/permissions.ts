import type { Role } from "../types/auth";
import { Roles } from "../constants/enums";

/** Full admin access (Users, Tags, Comments) */
export const isAdmin = (role?: Role) => role === Roles.ADMIN;

/** Can manage posts (Admin + Author) */
export const canManagePosts = (role?: Role) =>
  role === Roles.ADMIN || role === Roles.AUTHOR;

/** Can create custom tags (Admin only) */
export const canCreateTags = (role?: Role) => role === Roles.ADMIN;

/** Returns the dashboard base path for the given role */
export const getDashboardPath = (role?: Role) =>
  role === Roles.ADMIN ? '/admin' : '/author';