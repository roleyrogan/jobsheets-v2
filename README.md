# JobSheets V2

## Overview
JobSheets is a full stack job application tracker built for students and job seekers to manage their applications across devices. Users create an account, log in, and track every application in one place with real-time data stored in a PostgreSQL database.

V1 was built with vanilla HTML, CSS, and JavaScript using localStorage. V2 is a complete rebuild with React, TypeScript, Tailwind CSS, and Supabase.

---

## Tech Stack
- **React** — component based UI
- **TypeScript** — type safety and better developer experience
- **Tailwind CSS** — utility first styling
- **Supabase** — PostgreSQL database and authentication
- **Vite** — build tool and development server
- **Vercel** — deployment

---

## Features
- User authentication — sign up, log in, log out
- Add job applications with the following fields:
  - Company name (required)
  - Role (required)
  - Status — Applied, Interview, Offer, Rejected (required)
  - Application URL (optional)
  - Location (optional)
  - Deadline (optional)
  - Notes (optional)
  - Date added — auto stamped
- Delete applications
- Edit application status
- Filter applications by status
- Summary counts — Total, Applied, Interview, Offer, Rejected
- Data persists in Supabase PostgreSQL database
- Each user only sees their own applications (Row Level Security)
- Fully responsive

---

## Color Palette
All colors come from a dark purple ramp:

| Name | Hex | Usage |
|------|-----|-------|
| Deep Black | `#10002B` | Page background |
| Dark Purple | `#240046` | Card and form backgrounds |
| Mid Purple | `#3C096C` | Borders and separators |
| Purple | `#5A189A` | Subtle accents |
| Medium Purple | `#7B2CBF` | Buttons and interactive elements |
| Light Purple | `#9D4EDD` | Button hover states |
| Lavender | `#C77DFF` | Secondary text and labels |
| Pale Lavender | `#E0AAFF` | Primary text |

Status badge colors (off palette for clarity):

| Status | Background | Text |
|--------|------------|------|
| Applied | `#1a3a5c` | `#60a5fa` (blue) |
| Interview | `#3a2a00` | `#fbbf24` (amber) |
| Offer | `#0a3a1a` | `#34d399` (green) |
| Rejected | `#3a0a0a` | `#f87171` (red) |

---

## Typography
- **Primary font:** Inter or Work Sans — clean, modern, readable
- **Monospace accents:** JetBrains Mono or Fira Code — for status badges and dates
- Font sizes follow Tailwind defaults

---

## Design Principles
- Clean and minimal — no unnecessary elements
- Dark mode only
- Purple as the primary accent throughout
- Status badges are the only off-palette colors — they need to be immediately scannable
- Cards use subtle borders and slightly lighter backgrounds to lift off the page background
- Consistent border radius throughout — rounded-xl for cards, rounded-lg for inputs, rounded-full for badges

---

## Component Structure