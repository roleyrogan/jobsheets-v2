import { useMutation, useQueryClient } from '@tanstack/react-query'

import {
  createApplication,
  deleteApplication,
  updateApplication,
} from '@/lib/api/applications'
import { applicationKeys } from '@/features/applications/queries'
import { useSession } from '@/features/auth/useSession'
import type { ApplicationFormValues } from '@/features/applications/schema'
import type { Application } from '@/types/index'
import type { Status } from '@/lib/status'

export function useCreateApplication() {
  const { user } = useSession()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (values: ApplicationFormValues) => {
      if (!user) throw new Error('Not signed in')
      return createApplication(user.id, values)
    },
    onSuccess: (created) => {
      if (!user) return
      const key = applicationKeys.list(user.id)
      queryClient.setQueryData<Application[]>(key, (current) =>
        current ? [created, ...current] : [created],
      )
    },
  })
}

export function useUpdateApplication() {
  const { user } = useSession()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      values,
    }: {
      id: number
      values: ApplicationFormValues
    }) => updateApplication(id, values),
    onSuccess: (updated) => {
      if (!user) return
      const key = applicationKeys.list(user.id)
      queryClient.setQueryData<Application[]>(key, (current) =>
        current?.map((row) => (row.id === updated.id ? updated : row)),
      )
    },
  })
}

export function useUpdateStatus() {
  const { user } = useSession()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: Status }) =>
      updateApplication(id, { status }),
    onMutate: async ({ id, status }) => {
      if (!user) return
      const key = applicationKeys.list(user.id)
      await queryClient.cancelQueries({ queryKey: key })
      const previous = queryClient.getQueryData<Application[]>(key)
      queryClient.setQueryData<Application[]>(key, (current) =>
        current?.map((row) => (row.id === id ? { ...row, status } : row)),
      )
      return { previous, key }
    },
    onError: (_error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(context.key, context.previous)
      }
    },
    onSettled: (_data, _error, _variables, context) => {
      if (context?.key) {
        void queryClient.invalidateQueries({ queryKey: context.key })
      }
    },
  })
}

export function useDeleteApplication() {
  const { user } = useSession()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => deleteApplication(id),
    onMutate: async (id) => {
      if (!user) return
      const key = applicationKeys.list(user.id)
      await queryClient.cancelQueries({ queryKey: key })
      const previous = queryClient.getQueryData<Application[]>(key)
      queryClient.setQueryData<Application[]>(key, (current) =>
        current?.filter((row) => row.id !== id),
      )
      return { previous, key }
    },
    onError: (_error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(context.key, context.previous)
      }
    },
    onSettled: (_data, _error, _variables, context) => {
      if (context?.key) {
        void queryClient.invalidateQueries({ queryKey: context.key })
      }
    },
  })
}
