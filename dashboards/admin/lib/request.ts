const API = process.env.NEXT_PUBLIC_API_BASE_URL || ''



export function getApiBaseUrl(): string {
  // Use the public env var on the client
  if (typeof window !== 'undefined') return API
  // Use the private env var on the server (SSR / route handlers)
  return process.env.NEXT_PUBLIC_API_BASE_URL || API
}
