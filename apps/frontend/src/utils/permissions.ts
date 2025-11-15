import { User, Profile, Permission } from '@falconi/shared-types'

/**
 * Verifica se o usuário logado pode editar um usuário específico
 * Editor não pode editar Administradores
 */
export function canEditUser(
  loggedUserProfile: Profile | null,
  targetUser: User,
  targetUserProfile: Profile | null,
  hasEditPermission: boolean,
): boolean {
  if (!hasEditPermission) return false
  if (!loggedUserProfile || !targetUserProfile) return false

  if (loggedUserProfile.name === 'Editor' && targetUserProfile.name === 'Administrador') {
    return false
  }

  return true
}

/**
 * Verifica se o usuário logado pode ativar/desativar um usuário específico
 * Editor só pode ativar/desativar Visitantes
 */
export function canToggleUserStatus(
  loggedUserProfile: Profile | null,
  targetUserProfile: Profile | null,
  hasActivatePermission: boolean,
): boolean {
  if (!hasActivatePermission) return false
  if (!loggedUserProfile || !targetUserProfile) return false

  if (loggedUserProfile.name === 'Editor') {
    return targetUserProfile.name === 'Visitante'
  }

  return true
}

