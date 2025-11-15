import {
  User,
  Profile,
  CreateUserInput,
  UpdateUserInput,
  UserFilters,
  PaginationParams,
  PaginatedResponse,
  LoginInput,
  AuthResponse,
  Permission,
} from '@falconi/shared-types'

// Normalizar API_URL removendo barra final se existir
const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001').replace(/\/$/, '')

class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public response?: any,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorMessage = 'Erro desconhecido'
    let errorData: any = null

    try {
      errorData = await response.json()
      errorMessage = errorData.message || errorMessage
    } catch {
      errorMessage = `Erro ${response.status}: ${response.statusText}`
    }

    throw new ApiError(errorMessage, response.status, errorData)
  }

  // Se a resposta for 204 (No Content), retornar void
  if (response.status === 204) {
    return undefined as T
  }

  return response.json()
}

// ============ USERS API ============

export async function getUsers(
  filters?: UserFilters,
  pagination?: PaginationParams,
): Promise<User[] | PaginatedResponse<User>> {
  const params = new URLSearchParams()
  if (filters?.profileId) {
    params.append('profileId', filters.profileId)
  }
  if (filters?.search) {
    params.append('search', filters.search)
  }
  if (pagination?.page) {
    params.append('page', pagination.page.toString())
  }
  if (pagination?.limit) {
    params.append('limit', pagination.limit.toString())
  }

  const url = `${API_URL}/users${params.toString() ? `?${params.toString()}` : ''}`
  const response = await fetch(url)
  return handleResponse<User[] | PaginatedResponse<User>>(response)
}

export async function getUserById(id: string): Promise<User> {
  const response = await fetch(`${API_URL}/users/${id}`)
  return handleResponse<User>(response)
}

export async function createUser(userData: CreateUserInput): Promise<User> {
  const response = await fetch(`${API_URL}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  })
  return handleResponse<User>(response)
}

export async function updateUser(
  id: string,
  userData: UpdateUserInput,
): Promise<User> {
  const response = await fetch(`${API_URL}/users/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  })
  return handleResponse<User>(response)
}

export async function deleteUser(id: string): Promise<void> {
  const response = await fetch(`${API_URL}/users/${id}`, {
    method: 'DELETE',
  })
  return handleResponse<void>(response)
}

export async function activateUser(id: string): Promise<User> {
  const response = await fetch(`${API_URL}/users/${id}/activate`, {
    method: 'PUT',
  })
  return handleResponse<User>(response)
}

export async function deactivateUser(id: string): Promise<User> {
  const response = await fetch(`${API_URL}/users/${id}/deactivate`, {
    method: 'PUT',
  })
  return handleResponse<User>(response)
}

export async function toggleUserStatus(
  id: string,
  isActive: boolean,
): Promise<User> {
  return isActive ? deactivateUser(id) : activateUser(id)
}

// ============ AUTH API ============

export async function login(loginInput: LoginInput): Promise<AuthResponse> {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(loginInput),
  })
  return handleResponse<AuthResponse>(response)
}

// ============ PROFILES API ============

export async function getProfiles(): Promise<Profile[]> {
  const response = await fetch(`${API_URL}/profiles`)
  return handleResponse<Profile[]>(response)
}

export async function getProfileById(id: string): Promise<Profile> {
  const response = await fetch(`${API_URL}/profiles/${id}`)
  return handleResponse<Profile>(response)
}

export { ApiError }

