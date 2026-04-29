'use client'

import { useState, useEffect, useCallback } from 'react'
import { storageService } from '@/services/storageService'

export function useLocalStorage<T = any>(
  key: string,
  initialValue?: T
): [T | undefined, (value: T | ((val?: T) => T)) => void, () => void] {
  const [value, setValue] = useState<T | undefined>(() => {
    try {
      return storageService.get<T>(key, initialValue)
    } catch (error) {
      console.error(`Failed to read ${key} from localStorage:`, error)
      return initialValue
    }
  })

  const setStorageValue = useCallback(
    (newValue: T | ((val?: T) => T)) => {
      try {
        const valueToStore = newValue instanceof Function ? newValue(value) : newValue
        setValue(valueToStore)
        storageService.set(key, valueToStore)
      } catch (error) {
        console.error(`Failed to save ${key} to localStorage:`, error)
      }
    },
    [key, value]
  )

  const removeValue = useCallback(() => {
    try {
      setValue(undefined)
      storageService.remove(key)
    } catch (error) {
      console.error(`Failed to remove ${key} from localStorage:`, error)
    }
  }, [key])

  return [value, setStorageValue, removeValue]
}
