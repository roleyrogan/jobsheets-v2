/** Shared Motion easing — matches CSS `--ease`. App routes only; never import from landing. */
export const ease = [0.2, 0, 0, 1] as const

export const layoutTransition = {
  duration: 0.2,
  ease,
} as const

export const enterTransition = {
  duration: 0.16,
  ease,
} as const

export const exitTransition = {
  duration: 0.18,
  ease,
} as const

export const revealTransition = {
  duration: 0.4,
  ease,
} as const
