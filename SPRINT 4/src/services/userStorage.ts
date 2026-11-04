const USER_ID_KEY = 'movifacil.userId'
const ACCOUNT_TYPE_KEY = 'movifacil.accountType'

export type StoredAccountType = 'comum' | 'estudante' | 'vt'

export function getStoredUserId(): string {
  return window.localStorage.getItem(USER_ID_KEY) ?? ''
}

export function storeUserId(id: string): void {
  window.localStorage.setItem(USER_ID_KEY, id.trim())
}

export function getStoredAccountType(): StoredAccountType {
  const value = window.localStorage.getItem(ACCOUNT_TYPE_KEY)
  return value === 'estudante' || value === 'vt' ? value : 'comum'
}

export function storeAccountType(type: StoredAccountType): void {
  window.localStorage.setItem(ACCOUNT_TYPE_KEY, type)
}

export function clearStoredUserId(): void {
  window.localStorage.removeItem(USER_ID_KEY)
  window.localStorage.removeItem(ACCOUNT_TYPE_KEY)
}
