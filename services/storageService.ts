const PREFIX = 'quran_app_'

export const storageService = {
  set(key: string, value: any) {
    try {
      const serialized = JSON.stringify(value)
      localStorage.setItem(PREFIX + key, serialized)
    } catch (error) {
      console.error(`Failed to save ${key} to localStorage:`, error)
    }
  },

  get<T = any>(key: string, defaultValue?: T): T | undefined {
    try {
      const item = localStorage.getItem(PREFIX + key)
      if (!item) return defaultValue
      return JSON.parse(item) as T
    } catch (error) {
      console.error(`Failed to read ${key} from localStorage:`, error)
      return defaultValue
    }
  },

  remove(key: string) {
    try {
      localStorage.removeItem(PREFIX + key)
    } catch (error) {
      console.error(`Failed to remove ${key} from localStorage:`, error)
    }
  },

  clear() {
    try {
      const keys = Object.keys(localStorage)
      keys.forEach((key) => {
        if (key.startsWith(PREFIX)) {
          localStorage.removeItem(key)
        }
      })
    } catch (error) {
      console.error('Failed to clear localStorage:', error)
    }
  },

  getAllKeys(): string[] {
    try {
      const keys: string[] = []
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key && key.startsWith(PREFIX)) {
          keys.push(key.substring(PREFIX.length))
        }
      }
      return keys
    } catch (error) {
      console.error('Failed to get localStorage keys:', error)
      return []
    }
  },
}
