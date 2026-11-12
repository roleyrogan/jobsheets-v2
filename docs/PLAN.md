# JobSheets — Rewrite Plan

JobSheets is a job application tracker for students and job seekers. Users sign in, log every application, and see how their search is going: what's moving, what's stalled, and where applications drop off.

This plan covers rewriting the frontend of V2 inside this repo. The Supabase backend (auth, `applications` table, RLS, `delete-account` edge function) stays as it is. The frontend is rebuilt on the `rewrite` branch, feature by feature, and merged into `main` once it does everything the current app does.

The pre-rewrite version is tagged `v2.0`.

---

## Current state (v2.0)

### Keep (works, carries over)
- Email + password sign up / log in / log out (Supabase Auth)
- Forgot password email
- Change email, change password, delete account (edge function)
- Add, edit, delete applications; change status inline
- Fields: company, role, status, date, URL, location, notes
- Search, status filter, sort
- CSV export
- Row Level Security: users only see their own rows
- Privacy policy page

### Known issues
- `README.md` is the default Vite template; the real write-up is in `REFERENCE.md`.
- No schema, RLS policies, or migrations committed. The repo can't show what the database looks like or that RLS is on.
- `types.ts` is handwritten and can drift from the real columns. README lists a Deadline field that doesn't exist in the type.
- `date` is stored as a US-formatted string (`MM/DD/YYYY`), so it can't be sorted or used for date math reliably. `created_at` exists and is the real timestamp.
- Commit "Add Import to CSV" added export only. There is no CSV import.
- Password reset: the reset email redirects to the site root and nothing handles the `PASSWORD_RECOVERY` event, so the user lands signed in with no prompt for a new password. The in-app "change password" form requires the *current* password, which a user who forgot it doesn't have.
- Navigation uses boolean flags in `App.tsx` (`showLanding`, `showAuth`, `showPrivacy`, …). No URLs, back button doesn't work, pages can't be linked.
- Supabase calls are spread across components (`App`, `JobForm`, `EditForm`, `JobCard`, `Auth`, `AccountMenu`).
- Oversized components: `AccountMenu.tsx` (526 lines, 14 `useState`), `App.tsx` (441), `Auth.tsx` (355), `JobList.tsx` (311).
- Two UI libraries (HeroUI and shadcn/Radix) and four animation libraries (framer-motion, motion, GSAP, OGL).
- Copy-paste effect components (React Bits): Grainient, Aurora, SplitText, BlurText, SpotlightCard, AnimatedList.
- Status colours duplicated in `JobCard.tsx` and `Summary.tsx`.

---

## Phases

Each phase ends with a working app. Don't start the next phase until the current one's "Done when" list is true.

### Phase 0 — Prep
- [ ] `git tag v2.0 && git push origin v2.0`
- [ ] `git checkout -b rewrite`
- [ ] `supabase db pull` → `supabase/migrations/<timestamp>_remote_schema.sql` (needs Docker running)
- [ ] `supabase gen types typescript --linked > src/types/database.ts`
- [ ] Check the pulled migration: RLS enabled on `applications`, policies for select/insert/update/delete all scoped to `auth.uid() = user_id`. Fix in a new migration if not.
- [ ] Add `docs/PLAN.md`, `docs/ARCHITECTURE.md`, `.cursor/rules/jobsheets.mdc`
- [ ] Replace `README.md` with a short placeholder (name, one-line description, "rewrite in progress"). Delete `REFERENCE.md` once its content lives in these docs.
- [ ] Add `.env.example` with `VITE_SUPABASE_URL=` and `VITE_SUPABASE_ANON_KEY=`

**Done when:** the schema is in the repo, generated types exist, and the docs are committed.

### Phase 1 — Clean structure, same features
Rebuild the frontend following `docs/ARCHITECTURE.md`. Styling stays deliberately plain (default shadcn neutral theme, no effects) until Phase 4, so structure and look aren't changed at the same time.

Port in this order, one Cursor prompt per step:
1. Providers, router, app layout, `RequireAuth` route guard
2. Auth pages: log in, sign up, forgot password, **reset password** (fixes the recovery bug)
3. Applications: read and display the list
4. Applications: create, edit, delete, change status
5. Search, filter, sort
6. CSV export, plus **CSV import** (new: preview rows, show skipped rows with reasons, then insert)
7. Settings page: change email, change password, delete account (replaces `AccountMenu`)
8. Landing page and privacy page, plain versions
9. Delete old components, React Bits files, HeroUI, and unused animation libraries; remove them from `package.json`

**Done when:**
- Every "Keep" feature above works on the new code
- `npm run lint` and `npm run build` pass
- The only file that imports the Supabase client is in `src/lib/api/`
- No component file over ~200 lines
- Merged into `main`

### Phase 2 — Status history
The app currently overwrites `status`, so it can't know when things happened. This phase records every change.

- [ ] Migration: `application_events (id, application_id, user_id, status, created_at)` with RLS matching `applications`
- [ ] Trigger on `applications`: insert an event on create and whenever `status` changes
- [ ] Backfill: one event per existing application using its `created_at` and current status (for non-Applied rows, also an Applied event at `created_at`)
- [ ] Replace the string `date` column with `applied_on date` (backfill from `created_at`)
- [ ] Decide final stages. Proposed: Applied, OA, Interview, Offer, Rejected, Withdrawn. Update the check constraint and `src/lib/status.ts` together.
- [ ] Regenerate types
- [ ] Add CHECK constraint on `status` with the final stage list
- [ ] Add explicit `WITH CHECK (auth.uid() = user_id)` to the UPDATE policy
- [ ] Decide on a `deadline` column (add it here or drop it from the plan)

**Done when:** changing a status in the UI creates an event row, existing data is backfilled, and types are regenerated.

### Phase 3 — Views
Three views of the same data, each its own route:
- **Sheet** (`/app/sheet`): dense table, sortable columns, filters, inline status change. Default view.
- **Board** (`/app/board`): one column per stage; drag a card to change status.
- **Overview** (`/app/overview`):
  - Funnel: how many applications ever reached each stage, with conversion % between stages
  - Heatmap: applications sent per day across the season
  - Response rate and median days to first response
  - Likely ghosted: Applied/OA with no change in N days (N set by the user, default 21)

Stats are computed in pure functions in `src/lib/stats.ts` with unit tests.

**Done when:** all three views work with real data and the stats functions are tested.

### Phase 4 — Visual identity
- [ ] Write `docs/DESIGN.md` (palette, type, spacing, status colours, component rules, "don't" list)
- [ ] Restyle the app to match
- [ ] Redo the landing page last, using real screenshots of the app
- [ ] Write the real `README.md`: what it is, screenshot, features, stack, notable decisions (status-history trigger, RLS, stats), how to run locally
- [ ] New resume bullet

**Done when:** nothing visually traces back to a template, and the README is something you'd send a recruiter.

---

## Out of scope for now
- Chrome extension for one-click saving from job postings (parked; fits after Phase 2)
- OAuth sign-in (Google, GitHub)
- Sharing, teams, or multiple boards
- Email reminders
