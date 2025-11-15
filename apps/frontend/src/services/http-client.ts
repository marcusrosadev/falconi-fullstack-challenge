// Normalizar API_URL removendo barra final se existir
const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001').replace(/\/$/, '')

export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public response?: any,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | undefined>
}

class HttpClient {
  private baseURL: string

  constructor(baseURL: string) {
    this.baseURL = baseURL
  }

  private buildURL(endpoint: string, params?: Record<string, string | number | undefined>): string {
    const url = new URL(`${this.baseURL}${endpoint}`)
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value))
        }
      })
    }

    return url.toString()
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      let errorMessage = 'Erro desconhecido'
      let errorData: any = null

      try {
        errorData = await response.json()
        errorMessage = errorData.message || errorMessage
      } catch {
        errorMessage = `Erro ${response.status}: ${response.statusText}`
      }

      throw new ApiError(errorMessage, response.status, errorData)
    }

    if (response.status === 204) {
      return undefined as T
    }

    return response.json()
  }

  async get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    const { params, ...fetchOptions } = options || {}
    const url = this.buildURL(endpoint, params)
    
    const response = await fetch(url, {
      ...fetchOptions,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...fetchOptions.headers,
      },
    })

    return this.handleResponse<T>(response)
  }

  async post<T>(endpoint: string, data?: any, options?: RequestOptions): Promise<T> {
    const { params, ...fetchOptions } = options || {}
    const url = this.buildURL(endpoint, params)
    
    const response = await fetch(url, {
      ...fetchOptions,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...fetchOptions.headers,
      },
      body: data ? JSON.stringify(data) : undefined,
    })

    return this.handleResponse<T>(response)
  }

  async put<T>(endpoint: string, data?: any, options?: RequestOptions): Promise<T> {
    const { params, ...fetchOptions } = options || {}
    const url = this.buildURL(endpoint, params)
    
    const response = await fetch(url, {
      ...fetchOptions,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...fetchOptions.headers,
      },
      body: data ? JSON.stringify(data) : undefined,
    })

    return this.handleResponse<T>(response)
  }

  async delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    const { params, ...fetchOptions } = options || {}
    const url = this.buildURL(endpoint, params)
    
    const response = await fetch(url, {
      ...fetchOptions,
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...fetchOptions.headers,
      },
    })

    return this.handleResponse<T>(response)
  }
}

export const httpClient = new HttpClient(API_URL)

