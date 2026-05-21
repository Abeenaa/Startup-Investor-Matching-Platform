export function getApiBaseUrl(): string {
  return typeof window !== 'undefined'
    ? (process.env.NEXT_PUBLIC_API_BASE_URL ?? '')
    : (process.env.NEXT_PUBLIC_API_BASE_URL ?? '')
}
