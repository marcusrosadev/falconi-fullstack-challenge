import {
  User,
  CreateUserInput,
  UpdateUserInput,
  UserFilters,
  PaginationParams,
  PaginatedResponse,
} from '@falconi/shared-types'
import { httpClient } from '../http-client'

export const usersApi = {
  async getUsers(
    filters?: UserFilters,
    pagination?: PaginationParams,
  ): Promise<User[] | PaginatedResponse<User>> {
    const params: Record<string, string | number | undefined> = {}
    
    if (filters?.profileId) {
      params.profileId = filters.profileId
    }
    if (filters?.search) {
      params.search = filters.search
    }
    if (pagination?.page) {
      params.page = pagination.page
    }
    if (pagination?.limit) {
      params.limit = pagination.limit
    }

    return httpClient.get<User[] | PaginatedResponse<User>>('/users', { params })
  },

  async getUserById(id: string): Promise<User> {
    return httpClient.get<User>(`/users/${id}`)
  },

  async createUser(userData: CreateUserInput): Promise<User> {
    return httpClient.post<User>('/users', userData)
  },

  async updateUser(id: string, userData: UpdateUserInput): Promise<User> {
    return httpClient.put<User>(`/users/${id}`, userData)
  },

  async deleteUser(id: string): Promise<void> {
    return httpClient.delete<void>(`/users/${id}`)
  },

  async activateUser(id: string): Promise<User> {
    return httpClient.put<User>(`/users/${id}/activate`)
  },

  async deactivateUser(id: string): Promise<User> {
    return httpClient.put<User>(`/users/${id}/deactivate`)
  },

  async toggleUserStatus(id: string, isActive: boolean): Promise<User> {
    return isActive ? this.deactivateUser(id) : this.activateUser(id)
  },
}

