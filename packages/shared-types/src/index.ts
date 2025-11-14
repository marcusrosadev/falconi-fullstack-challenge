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
}

// DTOs para Profile (mantidos para compatibilidade)
export interface CreateProfileDto {
  name: string;
}

export interface UpdateProfileDto {
  name?: string;
}

