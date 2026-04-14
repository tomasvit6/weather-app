import { screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { renderWithProviders, userEvent } from '@/__tests__/test-utils'
import { useHistoryStore } from '@/stores/history-store'
import type { SearchHistoryEntry } from '@/types'

import { SearchHistory } from './search-history'

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
    searchedAt: new Date().toISOString(),
    ...overrides,
  }
}

describe('SearchHistory', () => {
  const onSelect = vi.fn()

  beforeEach(() => {
    onSelect.mockClear()
    useHistoryStore.setState({ entries: [] })
  })

  it('renders empty state message when history is empty', () => {
    renderWithProviders(<SearchHistory onSelect={onSelect} />)
    expect(screen.getByText('No recent searches')).toBeInTheDocument()
  })

  it('does not show clear button when there are no entries', () => {
    renderWithProviders(<SearchHistory onSelect={onSelect} />)
    expect(screen.queryByText('Clear history')).not.toBeInTheDocument()
  })

  it('renders each entry with location name, country, and rounded temperature', () => {
    useHistoryStore.setState({
      entries: [
        createEntry('1', {
          location: {
            id: 1,
            name: 'Berlin',
            country: 'Germany',
            countryCode: 'DE',
            latitude: 52.52,
            longitude: 13.41,
          },
          temperature: 15.7,
        }),
        createEntry('2', {
          location: {
            id: 2,
            name: 'Paris',
            country: 'France',
            countryCode: 'FR',
            latitude: 48.86,
            longitude: 2.35,
          },
          temperature: 22.3,
        }),
      ],
    })

    renderWithProviders(<SearchHistory onSelect={onSelect} />)

    expect(screen.getByText('Berlin, Germany')).toBeInTheDocument()
    expect(screen.getByText('Paris, France')).toBeInTheDocument()
    expect(screen.getByText(/16°C/)).toBeInTheDocument()
    expect(screen.getByText(/22°C/)).toBeInTheDocument()
  })

  it('shows clear button when entries exist', () => {
    useHistoryStore.setState({ entries: [createEntry('1')] })
    renderWithProviders(<SearchHistory onSelect={onSelect} />)
    expect(screen.getByText('Clear history')).toBeInTheDocument()
  })

  it('calls onSelect with the entry location when clicking an entry', async () => {
    const entry = createEntry('1', {
      location: {
        id: 1,
        name: 'Berlin',
        country: 'Germany',
        countryCode: 'DE',
        latitude: 52.52,
        longitude: 13.41,
      },
    })
    useHistoryStore.setState({ entries: [entry] })
    const user = userEvent.setup()

    renderWithProviders(<SearchHistory onSelect={onSelect} />)
    await user.click(screen.getByText('Berlin, Germany'))

    expect(onSelect).toHaveBeenCalledWith(entry.location)
  })

  it('removes entry from store when clicking the remove button', async () => {
    const entry = createEntry('1', {
      location: {
        id: 1,
        name: 'Berlin',
        country: 'Germany',
        countryCode: 'DE',
        latitude: 52.52,
        longitude: 13.41,
      },
    })
    useHistoryStore.setState({ entries: [entry] })
    const user = userEvent.setup()

    renderWithProviders(<SearchHistory onSelect={onSelect} />)
    await user.click(screen.getByLabelText('Remove Berlin from history'))

    expect(useHistoryStore.getState().entries).toHaveLength(0)
  })

  it('clears all entries when clicking "Clear history"', async () => {
    useHistoryStore.setState({
      entries: [createEntry('1'), createEntry('2')],
    })
    const user = userEvent.setup()

    renderWithProviders(<SearchHistory onSelect={onSelect} />)
    await user.click(screen.getByText('Clear history'))

    expect(useHistoryStore.getState().entries).toHaveLength(0)
  })

  it('remove buttons have accessible aria-label with location name', () => {
    useHistoryStore.setState({
      entries: [
        createEntry('1', {
          location: {
            id: 1,
            name: 'Berlin',
            country: 'Germany',
            countryCode: 'DE',
            latitude: 52.52,
            longitude: 13.41,
          },
        }),
      ],
    })

    renderWithProviders(<SearchHistory onSelect={onSelect} />)
    expect(
      screen.getByLabelText('Remove Berlin from history')
    ).toBeInTheDocument()
  })
})
