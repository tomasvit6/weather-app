'use client'

import { Loader2, Search } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useEffect, useId, useRef, useState } from 'react'

import { Input } from '@/components/ui/input'
import { useDebounce } from '@/hooks/use-debounce'
import { useGeocodingSearch } from '@/hooks/use-geocoding'
import { cn } from '@/lib/utils'
import type { Location } from '@/types'

interface SearchBarProps {
  onSelect: (location: Location) => void
}

export function SearchBar({ onSelect }: SearchBarProps) {
  const t = useTranslations('search')
  const id = useId()
  const listboxId = `${id}-listbox`
  const containerRef = useRef<HTMLDivElement>(null)

  const [query, setQuery] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)

  const debouncedQuery = useDebounce(query, 300)
  const { data: results, isLoading } = useGeocodingSearch(debouncedQuery)

  const locations = results ?? []
  const showDropdown =
    isFocused && query.length >= 2 && !isDismissed && locations.length > 0

  useEffect(() => {
    function handleMouseDown(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsDismissed(true)
      }
    }

    document.addEventListener('mousedown', handleMouseDown)
    return () => document.removeEventListener('mousedown', handleMouseDown)
  }, [])

  function selectLocation(location: Location) {
    onSelect(location)
    setQuery('')
    setIsDismissed(true)
    setHighlightedIndex(-1)
  }

  function handleKeyDown(event: React.KeyboardEvent) {
    if (!showDropdown) {
      return
    }

    switch (event.key) {
      case 'ArrowDown': {
        event.preventDefault()
        setHighlightedIndex((prev) =>
          prev < locations.length - 1 ? prev + 1 : 0
        )
        break
      }
      case 'ArrowUp': {
        event.preventDefault()
        setHighlightedIndex((prev) =>
          prev > 0 ? prev - 1 : locations.length - 1
        )
        break
      }
      case 'Enter': {
        event.preventDefault()
        if (highlightedIndex >= 0 && highlightedIndex < locations.length) {
          selectLocation(locations[highlightedIndex])
        }
        break
      }
      case 'Escape': {
        event.preventDefault()
        setIsDismissed(true)
        setHighlightedIndex(-1)
        break
      }
    }
  }

  const highlightedOptionId =
    highlightedIndex >= 0 ? `${id}-option-${highlightedIndex}` : undefined

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          role="combobox"
          aria-expanded={showDropdown}
          aria-controls={listboxId}
          aria-activedescendant={highlightedOptionId}
          aria-autocomplete="list"
          placeholder={t('placeholder')}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setIsDismissed(false)
            setHighlightedIndex(-1)
          }}
          onFocus={() => {
            setIsFocused(true)
            setIsDismissed(false)
          }}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleKeyDown}
          className="h-10 pl-10 pr-10 rounded-xl text-sm"
        />
        {isLoading && (
          <Loader2 className="absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
        )}
      </div>

      {showDropdown && (
        <ul
          id={listboxId}
          role="listbox"
          className="absolute z-50 mt-2 w-full overflow-hidden rounded-xl border bg-popover p-1 shadow-lg"
        >
          {locations.map((location, index) => (
            <li
              key={location.id}
              id={`${id}-option-${index}`}
              role="option"
              aria-selected={index === highlightedIndex}
              className={cn(
                'cursor-pointer rounded-lg px-3 py-2.5 text-sm transition-colors',
                index === highlightedIndex && 'bg-accent text-accent-foreground'
              )}
              onMouseEnter={() => setHighlightedIndex(index)}
              onMouseDown={(e) => {
                e.preventDefault()
                selectLocation(location)
              }}
            >
              <span className="font-medium">{location.name}</span>
              {location.admin1 && (
                <span className="text-muted-foreground">
                  , {location.admin1}
                </span>
              )}
              <span className="text-muted-foreground">
                , {location.country}
              </span>
            </li>
          ))}
        </ul>
      )}

      {isFocused &&
        query.length >= 2 &&
        !isDismissed &&
        debouncedQuery === query &&
        locations.length === 0 &&
        !isLoading && (
          <div className="absolute z-50 mt-2 w-full rounded-xl border bg-popover px-4 py-3 shadow-lg">
            <p className="text-sm text-muted-foreground">{t('noResults')}</p>
          </div>
        )}
    </div>
  )
}
