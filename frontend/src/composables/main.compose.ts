import { useTheme } from 'vuetify'

export const isDarkMode = (): boolean => useTheme().current.value.dark

export function getApiBase(): string {
  const envUrl = (import.meta as any).env?.VITE_API_URL?.trim()
  if (envUrl) {
    return envUrl.replace(/\/+$/, '')
  }

  if ((import.meta as any).env?.DEV) {
    return '/api'
  }

  throw new Error('VITE_API_URL is not defined. Set the public backend URL for production deployments.')
}

export async function safeFetchJson(url: string) {
  const res = await fetch(url)
  const contentType = res.headers.get('content-type') || ''
  if (!res.ok || !contentType.includes('application/json')) {
    const text = await res.text()
    if (text.trim().startsWith('<')) {
      throw new Error(`Received HTML response instead of JSON from ${url}. Check the frontend API configuration.`)
    }
    throw new Error(`HTTP ${res.status}: ${text.slice(0, 100)}`)
  }
  return res.json()
}
