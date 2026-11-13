import type { Status } from '@/lib/status'

export type SampleRow = {
  id: string
  company: string
  role: string
  status: Status
  location: string
  added: string
}

export const SAMPLE_ROWS: SampleRow[] = [
  {
    id: 'northwind',
    company: 'Northwind Systems',
    role: 'Software Developer Intern',
    status: 'Interview',
    location: 'Toronto',
    added: '2026-11-03',
  },
  {
    id: 'harbour',
    company: 'Harbour Credit Union',
    role: 'Backend Co-op',
    status: 'Applied',
    location: 'Remote',
    added: '2026-10-28',
  },
  {
    id: 'lumen',
    company: 'Lumen Health',
    role: 'Full-Stack Intern',
    status: 'Offer',
    location: 'Toronto',
    added: '2026-10-21',
  },
  {
    id: 'cedar',
    company: 'Cedar Analytics',
    role: 'Data Engineering Co-op',
    status: 'Rejected',
    location: 'Waterloo',
    added: '2026-10-14',
  },
  {
    id: 'maple',
    company: 'Maple Ridge Labs',
    role: 'Platform Intern',
    status: 'Applied',
    location: 'Remote',
    added: '2026-10-07',
  },
  {
    id: 'summit',
    company: 'Summit Robotics',
    role: 'Firmware Co-op',
    status: 'Interview',
    location: 'Waterloo',
    added: '2026-09-30',
  },
  {
    id: 'riverview',
    company: 'Riverview Media',
    role: 'Frontend Intern',
    status: 'Applied',
    location: 'Toronto',
    added: '2026-09-22',
  },
]

export function cloneSampleRows(): SampleRow[] {
  return SAMPLE_ROWS.map((row) => ({ ...row }))
}

export function sampleStatusCounts(
  rows: SampleRow[],
): Record<Status, number> {
  return {
    Applied: rows.filter((row) => row.status === 'Applied').length,
    Interview: rows.filter((row) => row.status === 'Interview').length,
    Offer: rows.filter((row) => row.status === 'Offer').length,
    Rejected: rows.filter((row) => row.status === 'Rejected').length,
  }
}

export const STORY_STEPS = [
  {
    id: 'sheet',
    title: 'Sheet',
    body: 'Sortable grid with search, status filters and shareable filtered views.',
  },
  {
    id: 'board',
    title: 'Board',
    body: 'Drag applications between stages.',
  },
  {
    id: 'overview',
    title: 'Overview',
    body: 'Funnel, response rate, weekly activity and a list of applications that have gone quiet.',
  },
] as const

export type StoryStepId = (typeof STORY_STEPS)[number]['id']
