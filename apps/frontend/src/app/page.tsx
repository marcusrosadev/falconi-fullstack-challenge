'use client'

import { useEffect, useState } from 'react'
import {
  User,
  Profile,
  CreateUserInput,
  UpdateUserInput,
  PaginatedResponse,
  Permission,
} from '@falconi/shared-types'
import { UsersList, UserForm, ProtectedRoute } from '@/components/features'
import { ProfileFilter, SearchBar, Pagination, ConfirmModal } from '@/components/ui'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/contexts/ToastContext'
import { useRouter } from 'next/navigation'
import {
  usersApi,
  profilesApi,
  ApiError,
} from '@/services/api'
import { exportUsersToCSV, exportUsersToJSON } from '@/utils/export'
import { UsersIcon, LogoutIcon, DownloadIcon, SpinnerIcon, LockIcon } from '@/components/icons'

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
  const [sortField, setSortField] = useState<'name' | 'email' | 'profile' | 'status' | null>(null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const { user, profile, logout, hasPermission, isAuthenticated, isLoading } = useAuth()
  const { showToast } = useToast()
  const router = useRouter()

  const itemsPerPage = 10
  const canCreate = hasPermission(Permission.CREATE_USERS)
  const canEdit = hasPermission(Permission.EDIT_USERS)
  const canDelete = hasPermission(Permission.DELETE_USERS)
  const canActivate = hasPermission(Permission.ACTIVATE_USERS)
  // Editor e Admin podem exportar (ambos têm CREATE_USERS)
  const canExport = hasPermission(Permission.CREATE_USERS)

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
      const data = await profilesApi.getProfiles()
      setProfiles(data)
    } catch (err: unknown) {
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

      const response = await usersApi.getUsers(filters, paginationParams)

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
    } catch (err: unknown) {
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
      await usersApi.createUser(userData)
      await loadUsers()
      setEditingUser(null)
      showToast('success', 'Usuário criado com sucesso!')
    } catch (err: unknown) {
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
      await usersApi.updateUser(id, userData)
      await loadUsers()
      setEditingUser(null)
      showToast('success', 'Usuário atualizado com sucesso!')
    } catch (err: unknown) {
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
      await usersApi.deleteUser(deleteModal.userId)
      await loadUsers()
      showToast('success', 'Usuário excluído com sucesso!')
      setDeleteModal({ isOpen: false, userId: null, userName: '' })
    } catch (err: unknown) {
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
      await usersApi.toggleUserStatus(id, isActive)
      await loadUsers()
      showToast(
        'success',
        `Usuário ${isActive ? 'desativado' : 'ativado'} com sucesso!`,
      )
    } catch (err: unknown) {
      const errorMessage =
        err instanceof ApiError ? err.message : 'Erro ao alterar status do usuário'
      showToast('error', errorMessage)
    }
  }

  const handleSort = (field: 'name' | 'email' | 'profile' | 'status' | null) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const getSortedUsers = (): User[] => {
    if (!sortField) return users

    const sorted = [...users].sort((a, b) => {
      let aValue: string | number
      let bValue: string | number

      switch (sortField) {
        case 'name':
          aValue = `${a.firstName} ${a.lastName}`.toLowerCase()
          bValue = `${b.firstName} ${b.lastName}`.toLowerCase()
          break
        case 'email':
          aValue = a.email.toLowerCase()
          bValue = b.email.toLowerCase()
          break
        case 'profile':
          const profileA = profiles.find((p) => p.id === a.profileId)
          const profileB = profiles.find((p) => p.id === b.profileId)
          aValue = (profileA?.name || '').toLowerCase()
          bValue = (profileB?.name || '').toLowerCase()
          break
        case 'status':
          aValue = a.isActive ? 1 : 0
          bValue = b.isActive ? 1 : 0
          break
        default:
          return 0
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1
      return 0
    })

    return sorted
  }

  const handleExportCSV = () => {
    try {
      const sortedUsers = getSortedUsers()
      exportUsersToCSV(sortedUsers, profiles)
      showToast('success', 'Dados exportados para CSV com sucesso!')
    } catch (err) {
      showToast('error', 'Erro ao exportar dados para CSV')
    }
  }

  const handleExportJSON = () => {
    try {
      const sortedUsers = getSortedUsers()
      exportUsersToJSON(sortedUsers, profiles)
      showToast('success', 'Dados exportados para JSON com sucesso!')
    } catch (err) {
      showToast('error', 'Erro ao exportar dados para JSON')
    }
  }

  // Redirecionar para login se não autenticado
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <SpinnerIcon className="h-12 w-12 text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <ProtectedRoute requiredPermission={Permission.VIEW_USERS}>
      <main className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 slide-down">
          <div className="container mx-auto px-4 max-w-7xl py-4">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  <UsersIcon className="w-7 h-7 text-blue-600" />
                  Gerenciamento de Usuários
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  {user && (
                    <>
                      Logado como <span className="font-semibold">{user.firstName} {user.lastName}</span>
                      {' • '}
                      <span className="text-blue-600">{profile?.name}</span>
                    </>
                  )}
                </p>
              </div>
              <button
                onClick={logout}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                <LogoutIcon />
                Sair
              </button>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 max-w-7xl py-8">

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 fade-in">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-100 overflow-hidden scale-in">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold text-gray-800">Usuários</h2>
                <div className="flex items-center gap-2">
                  {canExport && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleExportCSV}
                        className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-3 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg font-medium text-sm transform hover:scale-105"
                        title="Exportar para CSV"
                      >
                        <DownloadIcon className="w-4 h-4" />
                        CSV
                      </button>
                      <button
                        onClick={handleExportJSON}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-3 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg font-medium text-sm transform hover:scale-105"
                        title="Exportar para JSON"
                      >
                        <DownloadIcon className="w-4 h-4" />
                        JSON
                      </button>
                    </div>
                  )}
                </div>
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
                    <SpinnerIcon className="-ml-1 mr-3 h-5 w-5 text-blue-600" />
                    <span className="text-gray-600">Carregando usuários...</span>
                  </div>
                </div>
              ) : (
                <>
                <UsersList
                  users={getSortedUsers()}
                  profiles={profiles}
                  loggedUserProfile={profile}
                  onEdit={canEdit ? setEditingUser : undefined}
                  onDelete={canDelete ? handleDeleteClick : undefined}
                  onToggleActive={canActivate ? handleToggleActive : undefined}
                  canEditPermission={canEdit}
                  canDeletePermission={canDelete}
                  canActivatePermission={canActivate}
                  sortField={sortField}
                  sortDirection={sortDirection}
                  onSort={handleSort}
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

          {canCreate || canEdit ? (
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-lg p-6 sticky top-4 border border-gray-100 slide-up">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  {editingUser ? 'Editar Usuário' : 'Novo Usuário'}
                </h2>
                <UserForm
                  user={editingUser}
                  profiles={profiles}
                  onSubmit={
                    editingUser
                      ? (data: CreateUserInput | UpdateUserInput) => handleUpdateUser(editingUser.id, data as UpdateUserInput)
                      : (data: CreateUserInput | UpdateUserInput) => handleCreateUser(data as CreateUserInput)
                  }
                  onCancel={() => setEditingUser(null)}
                  onClear={() => setEditingUser(null)}
                  isLoading={submitting}
                />
              </div>
            </div>
          ) : (
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg shadow-lg p-6 sticky top-4 border border-blue-100">
                <div className="text-center py-8">
                  <LockIcon className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Apenas Visualização
                  </h3>
                  <p className="text-sm text-gray-600">
                    Seu perfil permite apenas visualizar os usuários. Entre em contato com um administrador para mais permissões.
                  </p>
                </div>
              </div>
            </div>
          )}
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
    </ProtectedRoute>
  )
}

