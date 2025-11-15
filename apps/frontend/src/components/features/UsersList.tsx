'use client'

import { User, Profile } from '@falconi/shared-types'
import IconButton from '../ui/IconButton'
import { EditIcon, DeleteIcon, ActivateIcon, DeactivateIcon, SortAscIcon, SortDescIcon } from '../icons/Icons'
import { canEditUser, canToggleUserStatus } from '@/utils/permissions'

type SortField = 'name' | 'email' | 'profile' | 'status' | null
type SortDirection = 'asc' | 'desc'

interface UsersListProps {
  users: User[]
  profiles: Profile[]
  loggedUserProfile: Profile | null
  onEdit?: (user: User) => void
  onDelete?: (id: string, userName: string) => void
  onToggleActive?: (id: string, isActive: boolean) => void
  canEditPermission?: boolean
  canDeletePermission?: boolean
  canActivatePermission?: boolean
  sortField?: SortField
  sortDirection?: SortDirection
  onSort?: (field: SortField) => void
}

export default function UsersList({
  users,
  profiles,
  loggedUserProfile,
  onEdit,
  onDelete,
  onToggleActive,
  canEditPermission = false,
  canDeletePermission = false,
  canActivatePermission = false,
  sortField = null,
  sortDirection = 'asc',
  onSort,
}: UsersListProps) {
  const getProfileName = (profileId: string) => {
    const profile = profiles.find((p) => p.id === profileId)
    return profile?.name || 'N/A'
  }

  const getProfile = (profileId: string): Profile | null => {
    return profiles.find((p) => p.id === profileId) || null
  }

  const handleSort = (field: SortField) => {
    if (onSort) {
      onSort(field)
    }
  }

  const SortButton = ({ field, label }: { field: SortField; label: string }) => {
    const isActive = sortField === field
    const isAsc = isActive && sortDirection === 'asc'
    const isDesc = isActive && sortDirection === 'desc'

    return (
      <button
        onClick={() => handleSort(field)}
        className="flex items-center gap-2 hover:text-blue-600 transition-colors group cursor-pointer"
        title={isAsc ? 'Ordenar Z-A' : isDesc ? 'Remover ordenação' : 'Ordenar A-Z'}
      >
        <span className="font-medium">{label}</span>
        <div className="flex flex-col items-center justify-center h-4">
          <span className={`${isAsc ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'}`}>
            <SortAscIcon className="w-3.5 h-3.5" />
          </span>
          <span className={`${isDesc ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'} -mt-1.5`}>
            <SortDescIcon className="w-3.5 h-3.5" />
          </span>
        </div>
      </button>
    )
  }

  if (users.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Nenhum usuário encontrado
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="overflow-x-auto -mx-6 px-6">
        <table className="w-full divide-y divide-gray-200 table-auto">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider min-w-[150px]">
                <SortButton field="name" label="Nome" />
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider min-w-[200px]">
                <SortButton field="email" label="Email" />
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider min-w-[120px]">
                <SortButton field="profile" label="Perfil" />
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider min-w-[100px]">
                <SortButton field="status" label="Status" />
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider min-w-[120px]">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user, index) => {
              const fullName = `${user.firstName} ${user.lastName}`
              return (
                <tr 
                  key={user.id} 
                  className="hover:bg-gray-50 transition-all duration-200 fade-in"
                  style={{ animationDelay: `${index * 0.03}s` }}
                >
                  <td className="px-4 py-4">
                    <div className="text-sm font-medium text-gray-900 break-words">
                      {fullName}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-sm text-gray-600 break-words max-w-[200px] truncate" title={user.email}>
                      {user.email}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-sm text-gray-600 break-words">
                      {getProfileName(user.profileId)}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {user.isActive ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center space-x-1 flex-wrap gap-1">
                      {(() => {
                        const userProfile = getProfile(user.profileId)
                        const canEdit = canEditUser(
                          loggedUserProfile,
                          user,
                          userProfile,
                          canEditPermission && !!onEdit,
                        )
                        const canToggle = canToggleUserStatus(
                          loggedUserProfile,
                          userProfile,
                          canActivatePermission && !!onToggleActive,
                        )
                        const canDelete = canDeletePermission && !!onDelete

                        if (!canEdit && !canDelete && !canToggle) {
                          return (
                            <span className="text-xs text-gray-400">Apenas visualização</span>
                          )
                        }

                        return (
                          <>
                            {canEdit && onEdit && (
                              <IconButton
                                icon={<EditIcon />}
                                onClick={() => onEdit(user)}
                                tooltip="Editar usuário"
                                variant="edit"
                              />
                            )}
                            {canToggle && onToggleActive && (
                              <IconButton
                                icon={
                                  user.isActive ? <DeactivateIcon /> : <ActivateIcon />
                                }
                                onClick={() => onToggleActive(user.id, user.isActive)}
                                tooltip={user.isActive ? 'Desativar usuário' : 'Ativar usuário'}
                                variant={user.isActive ? 'deactivate' : 'activate'}
                              />
                            )}
                            {canDelete && onDelete && (
                              <IconButton
                                icon={<DeleteIcon />}
                                onClick={() => onDelete(user.id, fullName)}
                                tooltip="Excluir usuário"
                                variant="delete"
                              />
                            )}
                          </>
                        )
                      })()}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

