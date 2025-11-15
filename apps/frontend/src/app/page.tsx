'use client'

import { useEffect, useState } from 'react'
import {
  User,
  Profile,
  CreateUserInput,
  UpdateUserInput,
  PaginatedResponse,
} from '@falconi/shared-types'
import UsersList from '@/components/UsersList'
import UserForm from '@/components/UserForm'
import ProfileFilter from '@/components/ProfileFilter'
import SearchBar from '@/components/SearchBar'
import Pagination from '@/components/Pagination'
import ConfirmModal from '@/components/ConfirmModal'
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
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [pagination, setPagination] = useState<{
    total: number
    totalPages: number
    limit: number
  } | null>(null)
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean
    userId: string | null
    userName: string
  }>({
    isOpen: false,
    userId: null,
    userName: '',
  })
  const { showToast } = useToast()

  const itemsPerPage = 10

  useEffect(() => {
    loadProfiles()
    loadUsers()
  }, [])

  // Debounce da busca e filtros - reseta página para 1
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1)
    }, 300) // 300ms de debounce

    return () => clearTimeout(timer)
  }, [searchTerm, selectedProfileId])

  // Carregar usuários quando página ou filtros mudarem
  useEffect(() => {
    loadUsers()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, searchTerm, selectedProfileId])

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
      const filters: any = {}
      if (selectedProfileId) filters.profileId = selectedProfileId
      if (searchTerm.trim()) filters.search = searchTerm.trim()

      const paginationParams = {
        page: currentPage,
        limit: itemsPerPage,
      }

      const response = await getUsers(filters, paginationParams)

      // Verificar se é resposta paginada ou array simples
      if (Array.isArray(response)) {
        setUsers(response)
        setPagination(null)
      } else {
        const paginatedResponse = response as PaginatedResponse<User>
        setUsers(paginatedResponse.data)
        setPagination({
          total: paginatedResponse.total,
          totalPages: paginatedResponse.totalPages,
          limit: paginatedResponse.limit,
        })
      }
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

  const handleDeleteClick = (id: string, userName: string) => {
    setDeleteModal({
      isOpen: true,
      userId: id,
      userName,
    })
  }

  const handleDeleteConfirm = async () => {
    if (!deleteModal.userId) return

    try {
      await deleteUser(deleteModal.userId)
      await loadUsers()
      showToast('success', 'Usuário excluído com sucesso!')
      setDeleteModal({ isOpen: false, userId: null, userName: '' })
    } catch (err) {
      const errorMessage =
        err instanceof ApiError ? err.message : 'Erro ao excluir usuário'
      showToast('error', errorMessage)
    }
  }

  const handleDeleteCancel = () => {
    setDeleteModal({ isOpen: false, userId: null, userName: '' })
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
            <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-100 overflow-hidden">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold text-gray-800">Usuários</h2>
                <button
                  onClick={() => setEditingUser(null)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition flex items-center gap-2 shadow-sm hover:shadow-md"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Novo Usuário
                </button>
              </div>

              <div className="mb-4 space-y-4">
                <ProfileFilter
                  profiles={profiles}
                  selectedProfileId={selectedProfileId}
                  onFilterChange={setSelectedProfileId}
                />
                <SearchBar
                  value={searchTerm}
                  onChange={setSearchTerm}
                  placeholder="Buscar por nome ou email..."
                />
              </div>

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
                <>
                <UsersList
                  users={users}
                  profiles={profiles}
                  onEdit={setEditingUser}
                  onDelete={handleDeleteClick}
                  onToggleActive={handleToggleActive}
                />
                  {pagination && (
                    <Pagination
                      currentPage={currentPage}
                      totalPages={pagination.totalPages}
                      totalItems={pagination.total}
                      itemsPerPage={itemsPerPage}
                      onPageChange={setCurrentPage}
                    />
                  )}
                </>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-4 border border-gray-100">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                {editingUser ? 'Editar Usuário' : 'Novo Usuário'}
              </h2>
              <UserForm
                user={editingUser}
                profiles={profiles}
                onSubmit={
                  editingUser
                    ? (data) => handleUpdateUser(editingUser.id, data as UpdateUserInput)
                    : (data) => handleCreateUser(data as CreateUserInput)
                }
                onCancel={() => setEditingUser(null)}
                isLoading={submitting}
              />
            </div>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        title="Confirmar Exclusão"
        message={`Tem certeza que deseja excluir o usuário "${deleteModal.userName}"? Esta ação não pode ser desfeita.`}
        confirmText="Excluir"
        cancelText="Cancelar"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        variant="danger"
      />
    </main>
  )
}

