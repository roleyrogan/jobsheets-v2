begin;
create extension if not exists pgtap with schema extensions;

select plan(12);

insert into auth.users (id, email)
values
  ('11111111-1111-1111-1111-111111111111', 'user-a@test.com'),
  ('22222222-2222-2222-2222-222222222222', 'user-b@test.com');

-- As user A
set local role authenticated;
set local request.jwt.claims to
  '{"sub":"11111111-1111-1111-1111-111111111111","role":"authenticated"}';

insert into public.applications (company, role, status, user_id)
values (
  'Acme',
  'Engineer',
  'Applied',
  '11111111-1111-1111-1111-111111111111'
);

select results_eq(
  $$
    select e.status, e.timing_known
    from public.application_events e
    join public.applications a on a.id = e.application_id
    where a.company = 'Acme'
    order by e.id
  $$,
  $$ values ('Applied'::text, true) $$,
  'insert Applied creates one Applied event with timing_known true'
);

insert into public.applications (company, role, status, user_id)
values (
  'Beta',
  'Intern',
  'Interview',
  '11111111-1111-1111-1111-111111111111'
);

select results_eq(
  $$
    select e.status, e.timing_known
    from public.application_events e
    join public.applications a on a.id = e.application_id
    where a.company = 'Beta'
    order by e.id
  $$,
  $$ values
    ('Applied'::text, true),
    ('Interview'::text, false)
  $$,
  'insert Interview creates Applied known + Interview unknown'
);

update public.applications
set status = 'Offer'
where company = 'Acme';

select results_eq(
  $$
    select e.status, e.timing_known
    from public.application_events e
    join public.applications a on a.id = e.application_id
    where a.company = 'Acme'
    order by e.id
  $$,
  $$ values
    ('Applied'::text, true),
    ('Offer'::text, true)
  $$,
  'status update appends one Offer event with timing_known true'
);

create temporary table _event_counts (
  label text primary key,
  n bigint not null
) on commit drop;

insert into _event_counts (label, n)
select 'acme_before_notes', count(*)
from public.application_events e
join public.applications a on a.id = e.application_id
where a.company = 'Acme';

update public.applications
set notes = 'hello'
where company = 'Acme';

select is(
  (
    select count(*)
    from public.application_events e
    join public.applications a on a.id = e.application_id
    where a.company = 'Acme'
  ),
  (select n from _event_counts where label = 'acme_before_notes'),
  'updating notes creates no events'
);

insert into _event_counts (label, n)
select 'acme_before_same_status', count(*)
from public.application_events e
join public.applications a on a.id = e.application_id
where a.company = 'Acme';

update public.applications
set status = 'Offer'
where company = 'Acme';

select is(
  (
    select count(*)
    from public.application_events e
    join public.applications a on a.id = e.application_id
    where a.company = 'Acme'
  ),
  (select n from _event_counts where label = 'acme_before_same_status'),
  'setting status to the same value creates no events'
);

select throws_ok(
  $$
    insert into public.applications (company, role, status, user_id)
    values (
      'Nope',
      'X',
      'Banana',
      '11111111-1111-1111-1111-111111111111'
    )
  $$,
  '23514',
  null,
  'status Banana is rejected by CHECK'
);

select throws_ok(
  $$
    insert into public.application_events (
      application_id,
      user_id,
      status
    )
    values (
      (select id from public.applications where company = 'Acme' limit 1),
      '11111111-1111-1111-1111-111111111111',
      'Rejected'
    )
  $$,
  '42501',
  null,
  'authenticated cannot insert into application_events'
);

insert into _event_counts (label, n)
select 'beta_id', id
from public.applications
where company = 'Beta'
limit 1;

delete from public.applications
where company = 'Beta';

select is(
  (
    select count(*)::bigint
    from public.application_events
    where application_id = (select n from _event_counts where label = 'beta_id')
  ),
  0::bigint,
  'deleting an application deletes its events'
);

-- As user B
set local request.jwt.claims to
  '{"sub":"22222222-2222-2222-2222-222222222222","role":"authenticated"}';

select is_empty(
  $$ select 1 from public.applications where company = 'Acme' $$,
  'user B cannot select user A applications'
);

select is_empty(
  $$
    select 1
    from public.application_events
    where user_id = '11111111-1111-1111-1111-111111111111'
  $$,
  'user B cannot select user A events'
);

select is(
  (select count(*)::int from public.applications),
  0,
  'user B sees zero applications'
);

select is(
  (select count(*)::int from public.application_events),
  0,
  'user B sees zero events'
);

select * from finish();
rollback;
