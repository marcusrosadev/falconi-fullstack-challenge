import { User, Profile } from '@falconi/shared-types'

/**
 * Converte array de usuários para CSV
 */
export function exportToCSV(users: User[], profiles: Profile[]): string {
  const headers = ['Nome', 'Sobrenome', 'Email', 'Perfil', 'Status']
  const rows = users.map((user) => {
    const profile = profiles.find((p) => p.id === user.profileId)
    return [
      user.firstName,
      user.lastName,
      user.email,
      profile?.name || 'N/A',
      user.isActive ? 'Ativo' : 'Inativo',
    ]
  })

  const csvContent = [
    headers.join(','),
    ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
  ].join('\n')

  return csvContent
}

/**
 * Converte array de usuários para JSON
 */
export function exportToJSON(users: User[], profiles: Profile[]): string {
  const data = users.map((user) => {
    const profile = profiles.find((p) => p.id === user.profileId)
    return {
      nome: user.firstName,
      sobrenome: user.lastName,
      email: user.email,
      perfil: profile?.name || 'N/A',
      status: user.isActive ? 'Ativo' : 'Inativo',
      id: user.id,
    }
  })

  return JSON.stringify(data, null, 2)
}

/**
 * Faz download de um arquivo
 */
export function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * Exporta usuários para CSV
 */
export function exportUsersToCSV(users: User[], profiles: Profile[]) {
  const csv = exportToCSV(users, profiles)
  const timestamp = new Date().toISOString().split('T')[0]
  downloadFile(csv, `usuarios_${timestamp}.csv`, 'text/csv;charset=utf-8;')
}

/**
 * Exporta usuários para JSON
 */
export function exportUsersToJSON(users: User[], profiles: Profile[]) {
  const json = exportToJSON(users, profiles)
  const timestamp = new Date().toISOString().split('T')[0]
  downloadFile(json, `usuarios_${timestamp}.json`, 'application/json')
}

