export type Application = {
    id: string
    user_id: string
    company: string
    role: string
    status: 'Applied' | 'Interview' | 'Offer' | 'Rejected'
    date: string
    application_url?: string
    location?: string
    deadline?: string
    notes?: string
  }