// Entity: Profile
export interface Profile {
  id: string;
  name: string;
}

// Entity: User
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  isActive: boolean;
  profileId: string; // referência para Profile
}

// DTOs para User
export interface CreateUserInput {
  firstName: string;
  lastName: string;
  email: string;
  profileId: string;
}

export interface UpdateUserInput {
  firstName?: string;
  lastName?: string;
  email?: string;
  profileId?: string;
  isActive?: boolean;
}

// Filters para User
export interface UserFilters {
  profileId?: string;
  search?: string; // Busca por nome ou email
}

// Paginação
export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// DTOs para Profile (mantidos para compatibilidade)
export interface CreateProfileDto {
  name: string;
}

export interface UpdateProfileDto {
  name?: string;
}

// Autenticação
export interface LoginInput {
  email: string;
  password?: string; // Opcional para simplicidade (in-memory)
}

export interface AuthResponse {
  user: User;
  profile: Profile;
  token?: string; // Para futuras implementações com JWT
}

// Permissões por perfil
export enum Permission {
  VIEW_USERS = 'VIEW_USERS',
  CREATE_USERS = 'CREATE_USERS',
  EDIT_USERS = 'EDIT_USERS',
  DELETE_USERS = 'DELETE_USERS',
  ACTIVATE_USERS = 'ACTIVATE_USERS',
  VIEW_PROFILES = 'VIEW_PROFILES',
  MANAGE_PROFILES = 'MANAGE_PROFILES',
}

export interface ProfilePermissions {
  profileName: string;
  permissions: Permission[];
}

