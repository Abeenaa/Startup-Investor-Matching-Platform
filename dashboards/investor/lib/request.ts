const API = process.env.NEXT_PUBLIC_API_BASE_URL || ''



export function getApiBaseUrl(): string {
  if (typeof window !== 'undefined') return API
  return process.env.NEXT_PUBLIC_API_BASE_URL || API
}
