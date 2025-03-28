import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { StoreApi, UseBoundStore } from 'zustand'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Creates selectors for a Zustand store to improve performance
 * by allowing components to subscribe only to specific parts of the state
 */
export function createSelectors<T extends object, U>(
  store: UseBoundStore<StoreApi<T>>
) {
  type StateSelector<K extends keyof T> = (state: T) => T[K]

  const useStore = store as any

  useStore.use = {}

  // For each key in the store, create a selector
  for (const key of Object.keys(store()) as Array<keyof T>) {
    useStore.use[key] = () => useStore((state: T) => state[key])
  }

  return useStore as typeof useStore & {
    use: { [K in keyof T]: () => T[K] }
  }
}
