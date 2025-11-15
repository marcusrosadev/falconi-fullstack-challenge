'use client'

import { useState, useEffect } from 'react'
import { User, Profile, CreateUserInput, UpdateUserInput } from '@falconi/shared-types'
import { UserIcon, EmailIcon, UsersIcon, ChevronDownIcon, SpinnerIcon, CloseIcon } from '../icons/Icons'

interface UserFormProps {
  user: User | null
  profiles: Profile[]
  onSubmit: (data: CreateUserInput | UpdateUserInput) => void
  onCancel: () => void
  onClear?: () => void
  isLoading?: boolean
}

interface FormErrors {
  firstName?: string
  lastName?: string
  email?: string
  profileId?: string
}

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export default function UserForm({
  user,
  profiles,
  onSubmit,
  onCancel,
  onClear,
  isLoading = false,
}: UserFormProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    profileId: '',
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        profileId: user.profileId,
      })
    } else {
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        profileId: profiles[0]?.id || '',
      })
    }
    setErrors({})
    setTouched({})
  }, [user, profiles])

  const validateField = (name: string, value: string): string | undefined => {
    switch (name) {
      case 'firstName':
        if (!value.trim()) return 'Nome é obrigatório'
        if (value.trim().length < 2) return 'Nome deve ter pelo menos 2 caracteres'
        break
      case 'lastName':
        if (!value.trim()) return 'Sobrenome é obrigatório'
        if (value.trim().length < 2) return 'Sobrenome deve ter pelo menos 2 caracteres'
        break
      case 'email':
        if (!value.trim()) return 'Email é obrigatório'
        if (!validateEmail(value)) return 'Email inválido'
        break
      case 'profileId':
        if (!value) return 'Selecione um perfil'
        break
    }
    return undefined
  }

  const handleBlur = (field: string) => {
    setTouched({ ...touched, [field]: true })
    const error = validateField(field, formData[field as keyof typeof formData])
    setErrors({ ...errors, [field]: error })
  }

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value })
    // Limpar erro do campo quando o usuário começar a digitar
    if (errors[field as keyof FormErrors] && touched[field]) {
      const error = validateField(field, value)
      setErrors({ ...errors, [field]: error })
    }
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}
    let isValid = true

    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key as keyof typeof formData])
      if (error) {
        newErrors[key as keyof FormErrors] = error
        isValid = false
      }
    })

    setErrors(newErrors)
    Object.keys(formData).forEach((key) => {
      setTouched((prev) => ({ ...prev, [key]: true }))
    })

    return isValid
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit(formData)
    }
  }

  const handleClear = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      profileId: profiles[0]?.id || '',
    })
    setErrors({})
    setTouched({})
    if (onClear) {
      onClear()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-1">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Nome <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <UserIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={formData.firstName}
            onChange={(e) => handleChange('firstName', e.target.value)}
            onBlur={() => handleBlur('firstName')}
            placeholder="Digite o nome"
            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition placeholder:text-gray-400 text-gray-900 ${
              errors.firstName && touched.firstName
                ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
            }`}
          />
        </div>
        {errors.firstName && touched.firstName && (
          <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
            <CloseIcon className="w-4 h-4" />
            {errors.firstName}
          </p>
        )}
      </div>

      <div className="space-y-1">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Sobrenome <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <UserIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={formData.lastName}
            onChange={(e) => handleChange('lastName', e.target.value)}
            onBlur={() => handleBlur('lastName')}
            placeholder="Digite o sobrenome"
            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition placeholder:text-gray-400 text-gray-900 ${
              errors.lastName && touched.lastName
                ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
            }`}
          />
        </div>
        {errors.lastName && touched.lastName && (
          <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
            <CloseIcon className="w-4 h-4" />
            {errors.lastName}
          </p>
        )}
      </div>

      <div className="space-y-1">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Email <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <EmailIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            onBlur={() => handleBlur('email')}
            placeholder="exemplo@email.com"
            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition placeholder:text-gray-400 text-gray-900 ${
              errors.email && touched.email
                ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
            }`}
          />
        </div>
        {errors.email && touched.email && (
          <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
            <CloseIcon className="w-4 h-4" />
            {errors.email}
          </p>
        )}
      </div>

      <div className="space-y-1">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Perfil <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <UsersIcon className="h-5 w-5 text-gray-400" />
          </div>
          <select
            value={formData.profileId}
            onChange={(e) => handleChange('profileId', e.target.value)}
            onBlur={() => handleBlur('profileId')}
            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition text-gray-900 appearance-none bg-white ${
              errors.profileId && touched.profileId
                ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
            } ${!formData.profileId ? 'text-gray-400' : ''}`}
          >
            <option value="" disabled className="text-gray-400">
              Selecione um perfil
            </option>
            {profiles.map((profile) => (
              <option key={profile.id} value={profile.id}>
                {profile.name}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <ChevronDownIcon className="h-5 w-5 text-gray-400" />
          </div>
        </div>
        {errors.profileId && touched.profileId && (
          <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
            <CloseIcon className="w-4 h-4" />
            {errors.profileId}
          </p>
        )}
      </div>

      <div className="flex space-x-3 pt-6 border-t border-gray-200">
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-blue-400 disabled:to-purple-400 disabled:cursor-not-allowed text-white px-4 py-3 rounded-lg transition shadow-md hover:shadow-lg font-semibold flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <SpinnerIcon className="h-5 w-5 text-white" />
              {user ? 'Atualizando...' : 'Criando...'}
            </>
          ) : (
            <>
              {user ? 'Atualizar' : 'Criar'}
            </>
          )}
        </button>
        <button
          type="button"
          onClick={handleClear}
          disabled={isLoading}
          className="px-4 py-3 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:cursor-not-allowed text-gray-700 rounded-lg transition font-medium border border-gray-300 flex items-center gap-2"
        >
          Limpar
        </button>
      </div>
    </form>
  )
}

