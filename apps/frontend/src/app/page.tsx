'use client'

import { useEffect, useState } from 'react'
import { User, Profile, CreateUserInput, UpdateUserInput } from '@falconi/shared-types'
import UsersList from '@/components/UsersList'
import UserForm from '@/components/UserForm'
import ProfileFilter from '@/components/ProfileFilter'
import { useToast } from '@/contexts/ToastContext'
import {
  getUsers,
  getProfiles,
  createUser,
  updateUser,
  deleteUser,
  toggleUserStatus,
  ApiError,
} from '@/services/api'

export default function Home() {
  const [users, setUsers] = useState<User[]>([])
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [selectedProfileId, setSelectedProfileId] = useState<string>('')
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const { showToast } = useToast()

  useEffect(() => {
    loadProfiles()
    loadUsers()
  }, [])

  useEffect(() => {
    loadUsers()
  }, [selectedProfileId])

  const loadProfiles = async () => {
    try {
      const data = await getProfiles()
      setProfiles(data)
    } catch (err) {
      const errorMessage =
        err instanceof ApiError
          ? err.message
          : 'Erro ao carregar perfis. Verifique se o backend está rodando.'
      showToast('error', errorMessage)
    }
  }

  const loadUsers = async () => {
    try {
      setLoading(true)
      const filters = selectedProfileId ? { profileId: selectedProfileId } : undefined
      const data = await getUsers(filters)
      setUsers(data)
    } catch (err) {
      const errorMessage =
        err instanceof ApiError
          ? err.message
          : 'Erro ao carregar usuários. Verifique se o backend está rodando.'
      showToast('error', errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateUser = async (userData: CreateUserInput) => {
    try {
      setSubmitting(true)
      await createUser(userData)
      await loadUsers()
      setEditingUser(null)
      showToast('success', 'Usuário criado com sucesso!')
    } catch (err) {
      const errorMessage =
        err instanceof ApiError ? err.message : 'Erro ao criar usuário'
      showToast('error', errorMessage)
    } finally {
      setSubmitting(false)
    }
  }

  const handleUpdateUser = async (id: string, userData: UpdateUserInput) => {
    try {
      setSubmitting(true)
      await updateUser(id, userData)
      await loadUsers()
      setEditingUser(null)
      showToast('success', 'Usuário atualizado com sucesso!')
    } catch (err) {
      const errorMessage =
        err instanceof ApiError ? err.message : 'Erro ao atualizar usuário'
      showToast('error', errorMessage)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteUser = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este usuário?')) return

    try {
      await deleteUser(id)
      await loadUsers()
      showToast('success', 'Usuário excluído com sucesso!')
    } catch (err) {
      const errorMessage =
        err instanceof ApiError ? err.message : 'Erro ao excluir usuário'
      showToast('error', errorMessage)
    }
  }

  const handleToggleActive = async (id: string, isActive: boolean) => {
    try {
      await toggleUserStatus(id, isActive)
      await loadUsers()
      showToast(
        'success',
        `Usuário ${isActive ? 'desativado' : 'ativado'} com sucesso!`,
      )
    } catch (err) {
      const errorMessage =
        err instanceof ApiError ? err.message : 'Erro ao alterar status do usuário'
      showToast('error', errorMessage)
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Gerenciamento de Usuários
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold text-gray-800">Usuários</h2>
                <button
                  onClick={() => setEditingUser(null)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition"
                >
                  + Novo Usuário
                </button>
              </div>

              <ProfileFilter
                profiles={profiles}
                selectedProfileId={selectedProfileId}
                onFilterChange={setSelectedProfileId}
              />

              {loading ? (
                <div className="text-center py-8">
                  <div className="inline-flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-600"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    <span className="text-gray-600">Carregando usuários...</span>
                  </div>
                </div>
              ) : (
                <UsersList
                  users={users}
                  profiles={profiles}
                  onEdit={setEditingUser}
                  onDelete={handleDeleteUser}
                  onToggleActive={handleToggleActive}
                />
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                {editingUser ? 'Editar Usuário' : 'Novo Usuário'}
              </h2>
              <UserForm
                user={editingUser}
                profiles={profiles}
                onSubmit={editingUser
                  ? (data) => handleUpdateUser(editingUser.id, data)
                  : handleCreateUser}
                onCancel={() => setEditingUser(null)}
                isLoading={submitting}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

