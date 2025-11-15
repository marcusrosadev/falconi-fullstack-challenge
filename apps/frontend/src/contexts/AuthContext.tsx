'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { User, Profile, Permission, AuthResponse } from '@falconi/shared-types'
import { login as apiLogin, ApiError } from '@/services/api'
import { useToast } from './ToastContext'

interface AuthContextType {
  user: User | null
  profile: Profile | null
  permissions: Permission[]
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string) => Promise<void>
  logout: () => void
  hasPermission: (permission: Permission) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { showToast } = useToast()

  // Mapeamento de permissões por perfil (deve corresponder ao backend)
  const getPermissionsForProfile = (profileName: string): Permission[] => {
    const profilePermissions: Record<string, Permission[]> = {
      'Administrador': [
        Permission.VIEW_USERS,
        Permission.CREATE_USERS,
        Permission.EDIT_USERS,
        Permission.DELETE_USERS,
        Permission.ACTIVATE_USERS,
        Permission.VIEW_PROFILES,
        Permission.MANAGE_PROFILES,
      ],
      'Editor': [
        Permission.VIEW_USERS,
        Permission.CREATE_USERS,
        Permission.EDIT_USERS, // Pode editar, mas não admins
        Permission.ACTIVATE_USERS, // Pode ativar/desativar apenas visitantes
      ],
      'Visitante': [
        Permission.VIEW_USERS,
      ],
    }
    return profilePermissions[profileName] || []
  }

  useEffect(() => {
    // Verificar se há dados salvos no localStorage
    const savedAuth = localStorage.getItem('auth')
    if (savedAuth) {
      try {
        const authData: AuthResponse = JSON.parse(savedAuth)
        setUser(authData.user)
        setProfile(authData.profile)
        setPermissions(getPermissionsForProfile(authData.profile.name))
      } catch (error) {
        localStorage.removeItem('auth')
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string) => {
    try {
      setIsLoading(true)
      const authResponse = await apiLogin({ email })
      setUser(authResponse.user)
      setProfile(authResponse.profile)
      const userPermissions = getPermissionsForProfile(authResponse.profile.name)
      setPermissions(userPermissions)
      
      // Salvar no localStorage
      localStorage.setItem('auth', JSON.stringify(authResponse))
      
      showToast('success', `Bem-vindo, ${authResponse.user.firstName}!`)
    } catch (err) {
      const errorMessage =
        err instanceof ApiError
          ? err.message
          : 'Erro ao fazer login. Verifique se o backend está rodando.'
      showToast('error', errorMessage)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    setProfile(null)
    setPermissions([])
    localStorage.removeItem('auth')
    showToast('success', 'Logout realizado com sucesso!')
  }

  const hasPermission = (permission: Permission): boolean => {
    return permissions.includes(permission)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        permissions,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        hasPermission,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

