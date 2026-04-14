import { screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { renderWithProviders, userEvent } from '@/__tests__/test-utils'
import type { Location } from '@/types'

import { SearchBar } from './search-bar'

const mockLocations: Location[] = [
  {
    id: 1,
    name: 'Berlin',
    country: 'Germany',
    countryCode: 'DE',
    admin1: 'Berlin',
    latitude: 52.52,
    longitude: 13.41,
  },
  {
    id: 2,
    name: 'Bern',
    country: 'Switzerland',
    countryCode: 'CH',
    admin1: 'Bern',
    latitude: 46.95,
    longitude: 7.45,
  },
]

let mockGeocodingReturn = {
  data: undefined as Location[] | undefined,
  isLoading: false,
}

vi.mock('@/hooks/use-geocoding', () => ({
  useGeocodingSearch: () => mockGeocodingReturn,
}))

vi.mock('@/hooks/use-debounce', () => ({
  useDebounce: <T,>(value: T) => value,
}))

describe('SearchBar', () => {
  const onSelect = vi.fn()

  beforeEach(() => {
    onSelect.mockClear()
    mockGeocodingReturn = { data: undefined, isLoading: false }
  })

  it('renders input with search placeholder text', () => {
    renderWithProviders(<SearchBar onSelect={onSelect} />)
    expect(
      screen.getByPlaceholderText('Search for a location...')
    ).toBeInTheDocument()
  })

  it('has role="combobox" on the input', () => {
    renderWithProviders(<SearchBar onSelect={onSelect} />)
    expect(screen.getByRole('combobox')).toBeInTheDocument()
  })

  it('has aria-expanded false when dropdown is closed', () => {
    renderWithProviders(<SearchBar onSelect={onSelect} />)
    expect(screen.getByRole('combobox')).toHaveAttribute(
      'aria-expanded',
      'false'
    )
  })

  it('shows autocomplete dropdown when typing 2+ characters and results exist', async () => {
    mockGeocodingReturn = { data: mockLocations, isLoading: false }
    const user = userEvent.setup()

    renderWithProviders(<SearchBar onSelect={onSelect} />)
    const input = screen.getByRole('combobox')

    await user.click(input)
    await user.type(input, 'Be')

    expect(screen.getByRole('listbox')).toBeInTheDocument()
    expect(screen.getAllByRole('option')).toHaveLength(2)
    expect(screen.getByRole('combobox')).toHaveAttribute(
      'aria-expanded',
      'true'
    )
  })

  it('does not show dropdown when query is less than 2 characters', async () => {
    mockGeocodingReturn = { data: mockLocations, isLoading: false }
    const user = userEvent.setup()

    renderWithProviders(<SearchBar onSelect={onSelect} />)
    await user.type(screen.getByRole('combobox'), 'B')

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })

  it('calls onSelect when clicking a dropdown item', async () => {
    mockGeocodingReturn = { data: mockLocations, isLoading: false }
    const user = userEvent.setup()

    renderWithProviders(<SearchBar onSelect={onSelect} />)
    const input = screen.getByRole('combobox')

    await user.click(input)
    await user.type(input, 'Be')

    const options = screen.getAllByRole('option')
    await user.click(options[0])

    expect(onSelect).toHaveBeenCalledWith(mockLocations[0])
  })

  it('calls onSelect when pressing Enter on a highlighted item', async () => {
    mockGeocodingReturn = { data: mockLocations, isLoading: false }
    const user = userEvent.setup()

    renderWithProviders(<SearchBar onSelect={onSelect} />)
    const input = screen.getByRole('combobox')

    await user.click(input)
    await user.type(input, 'Be')
    await user.keyboard('{ArrowDown}')
    await user.keyboard('{Enter}')

    expect(onSelect).toHaveBeenCalledWith(mockLocations[0])
  })

  it('navigates through items with ArrowDown and ArrowUp', async () => {
    mockGeocodingReturn = { data: mockLocations, isLoading: false }
    const user = userEvent.setup()

    renderWithProviders(<SearchBar onSelect={onSelect} />)
    const input = screen.getByRole('combobox')

    await user.click(input)
    await user.type(input, 'Be')

    await user.keyboard('{ArrowDown}')
    expect(screen.getAllByRole('option')[0]).toHaveAttribute(
      'aria-selected',
      'true'
    )

    await user.keyboard('{ArrowDown}')
    expect(screen.getAllByRole('option')[1]).toHaveAttribute(
      'aria-selected',
      'true'
    )
    expect(screen.getAllByRole('option')[0]).toHaveAttribute(
      'aria-selected',
      'false'
    )

    await user.keyboard('{ArrowUp}')
    expect(screen.getAllByRole('option')[0]).toHaveAttribute(
      'aria-selected',
      'true'
    )
  })

  it('closes the dropdown when pressing Escape', async () => {
    mockGeocodingReturn = { data: mockLocations, isLoading: false }
    const user = userEvent.setup()

    renderWithProviders(<SearchBar onSelect={onSelect} />)
    const input = screen.getByRole('combobox')

    await user.click(input)
    await user.type(input, 'Be')
    expect(screen.getByRole('listbox')).toBeInTheDocument()

    await user.keyboard('{Escape}')
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })

  it('shows "no results" message when query returns empty results', async () => {
    mockGeocodingReturn = { data: [], isLoading: false }
    const user = userEvent.setup()

    renderWithProviders(<SearchBar onSelect={onSelect} />)
    const input = screen.getByRole('combobox')

    await user.click(input)
    await user.type(input, 'Xyz')

    expect(screen.getByText('No locations found')).toBeInTheDocument()
  })

  it('shows loading indicator while geocoding is in flight', async () => {
    mockGeocodingReturn = { data: undefined, isLoading: true }
    const user = userEvent.setup()

    const { container } = renderWithProviders(<SearchBar onSelect={onSelect} />)
    await user.type(screen.getByRole('combobox'), 'Be')

    expect(container.querySelector('.lucide-loader-circle')).toBeInTheDocument()
  })

  it('clears input after selecting a location', async () => {
    mockGeocodingReturn = { data: mockLocations, isLoading: false }
    const user = userEvent.setup()

    renderWithProviders(<SearchBar onSelect={onSelect} />)
    const input = screen.getByRole('combobox')

    await user.click(input)
    await user.type(input, 'Be')
    await user.click(screen.getAllByRole('option')[0])

    expect(input).toHaveValue('')
  })
})
