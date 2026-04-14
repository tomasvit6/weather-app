import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import type { SearchHistoryEntry } from '@/types'

interface HistoryState {
  entries: SearchHistoryEntry[]
  addEntry: (entry: SearchHistoryEntry) => void
  removeEntry: (id: string) => void
  clearHistory: () => void
}

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set) => ({
      entries: [],
      addEntry: (entry) =>
        set((state) => ({
          entries: [
            entry,
            ...state.entries.filter((e) => e.id !== entry.id),
          ].slice(0, 10),
        })),
      removeEntry: (id) =>
        set((state) => ({
          entries: state.entries.filter((e) => e.id !== id),
        })),
      clearHistory: () => set({ entries: [] }),
    }),
    {
      name: 'weather-search-history',
    }
  )
)
