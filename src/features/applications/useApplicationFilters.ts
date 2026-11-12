import { useSearchParams } from 'react-router'

import {
  filtersToParams,
  parseFilters,
  type ApplicationFilters,
  type SortKey,
} from '@/lib/applicationFilters'
import type { Status } from '@/lib/status'

export function useApplicationFilters() {
  const [searchParams, setSearchParams] = useSearchParams()
  const filters = parseFilters(searchParams)

  function write(next: ApplicationFilters, replace: boolean) {
    setSearchParams(filtersToParams(next), { replace })
  }

  return {
    filters,
    setQuery: (q: string) => {
      write({ ...filters, q }, true)
    },
    setStatus: (status: Status | 'all') => {
      write({ ...filters, status }, false)
    },
    setSort: (sort: SortKey) => {
      write({ ...filters, sort }, false)
    },
    clear: () => {
      write({ q: '', status: 'all', sort: 'newest' }, true)
    },
  }
}
