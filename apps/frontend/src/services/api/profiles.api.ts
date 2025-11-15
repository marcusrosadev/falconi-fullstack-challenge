import { Profile } from '@falconi/shared-types'
import { httpClient } from '../http-client'

export const profilesApi = {
  async getProfiles(): Promise<Profile[]> {
    return httpClient.get<Profile[]>('/profiles')
  },

  async getProfileById(id: string): Promise<Profile> {
    return httpClient.get<Profile>(`/profiles/${id}`)
  },
}

