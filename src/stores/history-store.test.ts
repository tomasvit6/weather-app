import { beforeEach, describe, expect, it } from 'vitest'

import type { SearchHistoryEntry } from '@/types'

import { useHistoryStore } from './history-store'

function createEntry(
  id: string,
  overrides?: Partial<SearchHistoryEntry>
): SearchHistoryEntry {
  return {
    id,
    location: {
      id: Number(id),
      name: `City ${id}`,
      country: 'Germany',
      countryCode: 'DE',
      latitude: 52.52,
      longitude: 13.41,
    },
    temperature: 20,
    condition: 'clearSky',
    searchedAt: '2024-01-15T14:00',
    ...overrides,
  }
}

describe('history store', () => {
  beforeEach(() => {
    useHistoryStore.setState({ entries: [] })
  })

  describe('addEntry', () => {
    it('prepends a new entry to the list', () => {
      const entry1 = createEntry('1')
      const entry2 = createEntry('2')

      useHistoryStore.getState().addEntry(entry1)
      useHistoryStore.getState().addEntry(entry2)

      const { entries } = useHistoryStore.getState()
      expect(entries[0].id).toBe('2')
      expect(entries[1].id).toBe('1')
    })

    it('deduplicates by id and moves the updated entry to the top', () => {
      const entry1 = createEntry('1', { temperature: 15 })
      const entry2 = createEntry('2')

      useHistoryStore.getState().addEntry(entry1)
      useHistoryStore.getState().addEntry(entry2)

      const updatedEntry1 = createEntry('1', { temperature: 25 })
      useHistoryStore.getState().addEntry(updatedEntry1)

      const { entries } = useHistoryStore.getState()
      expect(entries).toHaveLength(2)
      expect(entries[0].id).toBe('1')
      expect(entries[0].temperature).toBe(25)
      expect(entries[1].id).toBe('2')
    })

    it('caps at 10 entries, dropping the oldest when adding an 11th', () => {
      for (let i = 1; i <= 10; i++) {
        useHistoryStore.getState().addEntry(createEntry(String(i)))
      }
      expect(useHistoryStore.getState().entries).toHaveLength(10)

      useHistoryStore.getState().addEntry(createEntry('11'))

      const { entries } = useHistoryStore.getState()
      expect(entries).toHaveLength(10)
      expect(entries[0].id).toBe('11')
      expect(entries.find((e) => e.id === '1')).toBeUndefined()
    })
  })

  describe('removeEntry', () => {
    it('removes the entry with the given id', () => {
      useHistoryStore.getState().addEntry(createEntry('1'))
      useHistoryStore.getState().addEntry(createEntry('2'))

      useHistoryStore.getState().removeEntry('1')

      const { entries } = useHistoryStore.getState()
      expect(entries).toHaveLength(1)
      expect(entries[0].id).toBe('2')
    })

    it('does not change the list when id does not exist', () => {
      useHistoryStore.getState().addEntry(createEntry('1'))

      useHistoryStore.getState().removeEntry('nonexistent')

      expect(useHistoryStore.getState().entries).toHaveLength(1)
    })
  })

  describe('clearHistory', () => {
    it('empties the entries array', () => {
      useHistoryStore.getState().addEntry(createEntry('1'))
      useHistoryStore.getState().addEntry(createEntry('2'))

      useHistoryStore.getState().clearHistory()

      expect(useHistoryStore.getState().entries).toHaveLength(0)
    })
  })
})
