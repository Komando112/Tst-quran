import { ARABIC_NUMERALS } from './constants'

export function cn(...classes: (string | false | undefined)[]): string {
  return classes.filter(Boolean).join(' ')
}

export function convertToArabicNumerals(num: number): string {
  return String(num)
    .split('')
    .map((digit) => ARABIC_NUMERALS[parseInt(digit)])
    .join('')
}

export function formatTime(seconds: number): string {
  if (!seconds || seconds < 0) return '00:00'

  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = Math.floor(seconds % 60)

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }

  return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
}

export function formatPercentage(value: number, total: number): number {
  if (total === 0) return 0
  return Math.round((value / total) * 100)
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }

    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean

  return function (...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => {
        inThrottle = false
      }, limit)
    }
  }
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(text)
      return true
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = text
      document.body.appendChild(textArea)
      textArea.select()
      const success = document.execCommand('copy')
      document.body.removeChild(textArea)
      return success
    }
  } catch (error) {
    console.error('Failed to copy to clipboard:', error)
    return false
  }
}

export function shareText(title: string, text: string): boolean {
  try {
    if (navigator.share) {
      navigator.share({ title, text }).catch((err) => console.log(err))
      return true
    }
    return false
  } catch (error) {
    console.error('Failed to share:', error)
    return false
  }
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 11)
}

export function isSupported(feature: string): boolean {
  if (typeof window === 'undefined') return false

  switch (feature) {
    case 'clipboard':
      return !!navigator.clipboard || document.queryCommandSupported('copy')
    case 'share':
      return !!navigator.share
    case 'localStorage':
      return !!window.localStorage
    case 'serviceWorker':
      return 'serviceWorker' in navigator
    default:
      return false
  }
}

export function sanitizeText(text: string): string {
  const div = document.createElement('div')
  div.textContent = text
  return div.innerHTML
}

export function getRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)]
}

export function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}
