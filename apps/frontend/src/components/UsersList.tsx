'use client'

import { User, Profile } from '@falconi/shared-types'
import IconButton from './IconButton'
import { EditIcon, DeleteIcon, ActivateIcon, DeactivateIcon } from './Icons'

interface UsersListProps {
  users: User[]
  profiles: Profile[]
  onEdit: (user: User) => void
  onDelete: (id: string, userName: string) => void
  onToggleActive: (id: string, isActive: boolean) => void
}

export default function UsersList({
  users,
  profiles,
  onEdit,
  onDelete,
  onToggleActive,
}: UsersListProps) {
  const getProfileName = (profileId: string) => {
    const profile = profiles.find((p) => p.id === profileId)
    return profile?.name || 'N/A'
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
                Nome
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider min-w-[200px]">
                Email
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider min-w-[120px]">
                Perfil
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider min-w-[100px]">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider min-w-[120px]">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => {
              const fullName = `${user.firstName} ${user.lastName}`
              return (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
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
                      <IconButton
                        icon={<EditIcon />}
                        onClick={() => onEdit(user)}
                        tooltip="Editar usuário"
                        variant="edit"
                      />
                      <IconButton
                        icon={
                          user.isActive ? <DeactivateIcon /> : <ActivateIcon />
                        }
                        onClick={() => onToggleActive(user.id, user.isActive)}
                        tooltip={user.isActive ? 'Desativar usuário' : 'Ativar usuário'}
                        variant={user.isActive ? 'deactivate' : 'activate'}
                      />
                      <IconButton
                        icon={<DeleteIcon />}
                        onClick={() => onDelete(user.id, fullName)}
                        tooltip="Excluir usuário"
                        variant="delete"
                      />
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

