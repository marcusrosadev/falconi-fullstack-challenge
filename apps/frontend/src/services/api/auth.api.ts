import { LoginInput, AuthResponse } from '@falconi/shared-types'
import { httpClient } from '../http-client'

export const authApi = {
  async login(loginInput: LoginInput): Promise<AuthResponse> {
    return httpClient.post<AuthResponse>('/auth/login', loginInput)
  },
}

