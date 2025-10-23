import type { Role } from "../types/auth";


export const canAccessAdmin= (role?:Role) => role ==='Admin';

export const canWritePosts= (role?:Role) => role==='Author';