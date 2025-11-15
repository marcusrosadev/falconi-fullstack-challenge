import type { Metadata } from 'next'
import './globals.css'
import { ToastProvider } from '@/contexts/ToastContext'
import { AuthProvider } from '@/contexts/AuthContext'
import ToastContainer from '@/components/ToastContainer'

export const metadata: Metadata = {
  title: 'Falconi - Gerenciamento de Usuários',
  description: 'Sistema de gerenciamento de usuários e perfis',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body>
        <ToastProvider>
          <AuthProvider>
            {children}
            <ToastContainer />
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  )
}

