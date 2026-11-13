import { useEffect, useRef } from 'react'
import { XIcon } from 'lucide-react'

import { useApplicationFilters } from '@/features/applications/useApplicationFilters'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

type SearchInputProps = {
  id?: string
}

export function SearchInput({ id = 'applications-search' }: SearchInputProps) {
  const { filters, setQuery } = useApplicationFilters()
  const searchRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== '/' || event.metaKey || event.ctrlKey || event.altKey) {
        return
      }
      const target = event.target
      if (
        target instanceof HTMLElement &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable)
      ) {
        return
      }
      event.preventDefault()
      searchRef.current?.focus()
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  return (
    <div className="relative min-w-0 flex-1">
      <Label htmlFor={id} className="sr-only">
        Search applications
      </Label>
      <Input
        ref={searchRef}
        id={id}
        type="search"
        placeholder="Search company, role, location, notes"
        value={filters.q}
        onChange={(event) => setQuery(event.target.value)}
        className="pr-8"
      />
      {filters.q !== '' ? (
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          className="absolute top-1/2 right-1.5 -translate-y-1/2"
          aria-label="Clear search"
          onClick={() => setQuery('')}
        >
          <XIcon />
        </Button>
      ) : null}
    </div>
  )
}
