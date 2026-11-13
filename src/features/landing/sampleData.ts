import type { Status } from '@/lib/status'
import type { FunnelStats, SummaryStats } from '@/lib/stats'

export type SampleRow = {
  company: string
  role: string
  status: Status
  location: string
  added: string
}

export const SAMPLE_ROWS: SampleRow[] = [
  {
    company: 'Northwind Systems',
    role: 'Software Developer Intern',
    status: 'Interview',
    location: 'Toronto',
    added: '2026-11-03',
  },
  {
    company: 'Harbour Credit Union',
    role: 'Backend Co-op',
    status: 'Applied',
    location: 'Remote',
    added: '2026-10-28',
  },
  {
    company: 'Lumen Health',
    role: 'Full-Stack Intern',
    status: 'Offer',
    location: 'Toronto',
    added: '2026-10-21',
  },
  {
    company: 'Cedar Analytics',
    role: 'Data Engineering Co-op',
    status: 'Rejected',
    location: 'Waterloo',
    added: '2026-10-14',
  },
  {
    company: 'Maple Ridge Labs',
    role: 'Platform Intern',
    status: 'Applied',
    location: 'Remote',
    added: '2026-10-07',
  },
  {
    company: 'Summit Robotics',
    role: 'Firmware Co-op',
    status: 'Interview',
    location: 'Waterloo',
    added: '2026-09-30',
  },
  {
    company: 'Riverview Media',
    role: 'Frontend Intern',
    status: 'Applied',
    location: 'Toronto',
    added: '2026-09-22',
  },
  {
    company: 'Oakdale Insurance',
    role: 'SRE Intern',
    status: 'Rejected',
    location: 'Remote',
    added: '2026-09-15',
  },
]

export const SAMPLE_SUMMARY: SummaryStats = {
  total: 48,
  active: 31,
  offers: 2,
  thisWeek: 5,
  lastWeek: 3,
}

export const SAMPLE_FUNNEL: FunnelStats = {
  applied: 48,
  interview: 9,
  offer: 2,
  appliedToInterview: (9 / 48) * 100,
  interviewToOffer: (2 / 9) * 100,
}

export function sampleStatusCounts(): Record<Status, number> {
  return {
    Applied: SAMPLE_ROWS.filter((row) => row.status === 'Applied').length,
    Interview: SAMPLE_ROWS.filter((row) => row.status === 'Interview').length,
    Offer: SAMPLE_ROWS.filter((row) => row.status === 'Offer').length,
    Rejected: SAMPLE_ROWS.filter((row) => row.status === 'Rejected').length,
  }
}
