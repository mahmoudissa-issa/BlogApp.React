
export type Role='Reader' | 'Author' | 'Admin';

export interface AuthUser {
  id: string;
  username: string;
  email: string;
  role: Role;
  avatarUrl?: string;
}

export interface AuthResponse {
    userId:number;
    userName:string;
    email:string;
    role:Role;
    token:string;
}