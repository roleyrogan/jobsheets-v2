import { useSearchParams } from 'react-router'

import {
  DEFAULT_SORT,
  filtersToParams,
  parseFilters,
  type ApplicationFilters,
  type SortColumn,
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
    toggleSort: (key: SortColumn) => {
      if (filters.sort.key === key) {
        write(
          {
            ...filters,
            sort: {
              key,
              dir: filters.sort.dir === 'asc' ? 'desc' : 'asc',
            },
          },
          false,
        )
        return
      }
      write(
        {
          ...filters,
          sort: { key, dir: key === 'added' ? 'desc' : 'asc' },
        },
        false,
      )
    },
    clear: () => {
      write({ q: '', status: 'all', sort: DEFAULT_SORT }, true)
    },
  }
}
