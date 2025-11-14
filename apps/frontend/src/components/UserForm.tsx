'use client'

import { useState, useEffect } from 'react'
import { User, Profile, CreateUserInput, UpdateUserInput } from '@falconi/shared-types'

interface UserFormProps {
  user: User | null
  profiles: Profile[]
  onSubmit: (data: CreateUserInput | UpdateUserInput) => void
  onCancel: () => void
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

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nome <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.firstName}
          onChange={(e) => handleChange('firstName', e.target.value)}
          onBlur={() => handleBlur('firstName')}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
            errors.firstName && touched.firstName
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:ring-blue-500'
          }`}
        />
        {errors.firstName && touched.firstName && (
          <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Sobrenome <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.lastName}
          onChange={(e) => handleChange('lastName', e.target.value)}
          onBlur={() => handleBlur('lastName')}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
            errors.lastName && touched.lastName
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:ring-blue-500'
          }`}
        />
        {errors.lastName && touched.lastName && (
          <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => handleChange('email', e.target.value)}
          onBlur={() => handleBlur('email')}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
            errors.email && touched.email
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:ring-blue-500'
          }`}
        />
        {errors.email && touched.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Perfil <span className="text-red-500">*</span>
        </label>
        <select
          value={formData.profileId}
          onChange={(e) => handleChange('profileId', e.target.value)}
          onBlur={() => handleBlur('profileId')}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
            errors.profileId && touched.profileId
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:ring-blue-500'
          }`}
        >
          <option value="">Selecione um perfil</option>
          {profiles.map((profile) => (
            <option key={profile.id} value={profile.id}>
              {profile.name}
            </option>
          ))}
        </select>
        {errors.profileId && touched.profileId && (
          <p className="mt-1 text-sm text-red-600">{errors.profileId}</p>
        )}
      </div>

      <div className="flex space-x-2 pt-4">
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white px-4 py-2 rounded-md transition flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
              {user ? 'Atualizando...' : 'Criando...'}
            </>
          ) : (
            user ? 'Atualizar' : 'Criar'
          )}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="flex-1 bg-gray-300 hover:bg-gray-400 disabled:bg-gray-200 disabled:cursor-not-allowed text-gray-800 px-4 py-2 rounded-md transition"
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}

