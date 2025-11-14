'use client'

import { Profile } from '@falconi/shared-types'

interface ProfileFilterProps {
  profiles: Profile[]
  selectedProfileId: string
  onFilterChange: (profileId: string) => void
}

export default function ProfileFilter({
  profiles,
  selectedProfileId,
  onFilterChange,
}: ProfileFilterProps) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Filtrar por Perfil
      </label>
      <select
        value={selectedProfileId}
        onChange={(e) => onFilterChange(e.target.value)}
        className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Todos os perfis</option>
        {profiles.map((profile) => (
          <option key={profile.id} value={profile.id}>
            {profile.name}
          </option>
        ))}
      </select>
    </div>
  )
}

