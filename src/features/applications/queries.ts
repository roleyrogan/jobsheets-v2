import { useQuery } from '@tanstack/react-query'

import { listApplications } from '@/lib/api/applications'
import { useSession } from '@/features/auth/useSession'

export const applicationKeys = {
  all: ['applications'] as const,
  list: (userId: string) => ['applications', 'list', userId] as const,
}

export function useApplications() {
  const { user } = useSession()
  const userId = user?.id

  return useQuery({
    queryKey: applicationKeys.list(userId ?? ''),
    queryFn: () => {
      if (!userId) {
        throw new Error('Not signed in')
      }
      return listApplications(userId)
    },
    enabled: Boolean(userId),
  })
}
