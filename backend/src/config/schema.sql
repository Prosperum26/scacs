create table if not exists public.users (
  id text primary key,
  name text not null,
  role text not null check (role in ('student', 'faculty', 'staff')),
  department text not null,
  status text not null default 'active' check (status in ('active', 'inactive', 'suspended')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.access_logs (
  id text primary key,
  user_id text not null,
  user_name text not null,
  gate text not null default 'Main Gate A',
  result text not null check (result in ('GRANTED', 'DENIED')),
  timestamp timestamptz not null default now()
);

create index if not exists idx_access_logs_timestamp on public.access_logs (timestamp desc);
create index if not exists idx_access_logs_user_id on public.access_logs (user_id);

-- Optional seed data for local testing:
-- insert into public.users (id, name, role, department, status)
-- values
--   ('SV2026001', 'Linh Tran', 'student', 'Computer Science', 'active'),
--   ('SV2026042', 'Minh Nguyen', 'student', 'Business', 'active'),
--   ('FC1108', 'Dr. An Pham', 'faculty', 'Engineering', 'active'),
--   ('ST3302', 'Bao Le', 'staff', 'Library', 'suspended')
-- on conflict (id) do nothing;
