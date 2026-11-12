import { useEffect, useRef } from 'react'
import { XIcon } from 'lucide-react'

import type { Status } from '@/lib/status'
import type { SortKey } from '@/lib/applicationFilters'
import { useApplicationFilters } from '@/features/applications/useApplicationFilters'
import { StatusFilterToggles } from '@/features/applications/StatusFilterToggles'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

type ApplicationsToolbarProps = {
  total: number
  counts: Record<Status, number>
}

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'newest', label: 'Newest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'company', label: 'Company A–Z' },
  { value: 'status', label: 'Status' },
]

export function ApplicationsToolbar({
  total,
  counts,
}: ApplicationsToolbarProps) {
  const { filters, setQuery, setStatus, setSort } = useApplicationFilters()
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
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="relative min-w-0 flex-1">
          <Label htmlFor="applications-search" className="sr-only">
            Search applications
          </Label>
          <Input
            ref={searchRef}
            id="applications-search"
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

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="applications-sort">Sort</Label>
          <Select
            value={filters.sort}
            onValueChange={(value) => {
              if (
                value === 'newest' ||
                value === 'oldest' ||
                value === 'company' ||
                value === 'status'
              ) {
                setSort(value)
              }
            }}
          >
            <SelectTrigger id="applications-sort" className="w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <StatusFilterToggles
        total={total}
        counts={counts}
        selected={filters.status}
        onSelect={setStatus}
      />
    </div>
  )
}
