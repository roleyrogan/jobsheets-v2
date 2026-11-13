import type { QueryClient } from '@tanstack/react-query'

import { applicationKeys } from '@/features/applications/queries'

export function invalidateApplicationEvents(
  queryClient: QueryClient,
  userId: string,
): void {
  void queryClient.invalidateQueries({
    queryKey: applicationKeys.events(userId),
  })
}
