'use client'

import { Profile } from '@falconi/shared-types'
import { UserIcon } from '../icons/Icons'

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
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <UserIcon className="h-5 w-5 text-gray-400" />
      </div>
      <select
        value={selectedProfileId}
        onChange={(e) => onFilterChange(e.target.value)}
        className={`w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 appearance-none bg-white ${
          !selectedProfileId ? 'text-gray-500' : ''
        }`}
      >
        <option value="" className="text-gray-500">Todos os perfis</option>
        {profiles.map((profile) => (
          <option key={profile.id} value={profile.id}>
            {profile.name}
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
        <svg
          className="h-5 w-5 text-gray-400"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M6 8l4 4 4-4"
          />
        </svg>
      </div>
    </div>
  )
}

