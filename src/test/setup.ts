import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock localStorage with proper implementation
const localStorageMock = (() => {
  let store: Record<string, string> = {}
  
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value.toString()
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key]
    }),
    clear: vi.fn(() => {
      store = {}
    }),
  }
})()

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

// Mock sessionStorage
const sessionStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}

Object.defineProperty(window, 'sessionStorage', {
  value: sessionStorageMock,
})

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// Mock twin.macro theme function
vi.mock('twin.macro', () => ({
  theme: vi.fn((path: any) => {
    const mockTheme: Record<string, any> = {
      colors: {
        red: { 500: '#ef4444' },
        blue: { 500: '#3b82f6' },
        green: { 500: '#10b981' },
        gray: { 500: '#6b7280' },
      },
      height: {
        4: '1rem',
        8: '2rem',
        12: '3rem',
      },
    }
    
    // Handle different parameter types
    if (typeof path === 'string') {
      const keys = path.split('.')
      let result = mockTheme
      for (const key of keys) {
        result = result?.[key]
      }
      return result || {}
    }
    
    // Handle template literal calls like theme`colors`
    if (Array.isArray(path) && path.length > 0) {
      const pathStr = path[0]
      return mockTheme[pathStr] || {}
    }
    
    return mockTheme
  }),
}))