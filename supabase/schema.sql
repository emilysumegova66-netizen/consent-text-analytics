create extension if not exists pgcrypto;
create table if not exists public.tracking_projects (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  public_token uuid not null unique default gen_random_uuid(),
  created_at timestamptz not null default now()
);
create table if not exists public.text_events (
  id bigint generated always as identity primary key,
  project_token uuid not null references public.tracking_projects(public_token) on delete cascade,
  event_type text not null check (event_type in ('text_field_input')),
  field_label text not null,
  field_type text not null check (field_type in ('text', 'search', 'textarea', 'other')),
  character_count integer not null check (character_count >= 0 and character_count <= 100000),
  page_path text not null,
  occurred_at timestamptz not null default now()
);
alter table public.tracking_projects enable row level security;
alter table public.text_events enable row level security;
create policy "Owners can view their projects" on public.tracking_projects for select to authenticated using (owner_id = auth.uid());
create policy "Owners can create projects" on public.tracking_projects for insert to authenticated with check (owner_id = auth.uid());
create policy "Owners can delete their projects" on public.tracking_projects for delete to authenticated using (owner_id = auth.uid());
create policy "Owners can view events for their projects" on public.text_events for select to authenticated using (exists (select 1 from public.tracking_projects p where p.public_token = text_events.project_token and p.owner_id = auth.uid()));
create policy "Visitors can submit minimal analytics" on public.text_events for insert to anon with check (event_type = 'text_field_input' and character_count between 0 and 100000 and exists (select 1 from public.tracking_projects p where p.public_token = text_events.project_token));
grant select, insert, delete on public.tracking_projects to authenticated;
grant select on public.text_events to authenticated;
grant insert on public.text_events to anon;
grant usage, select on sequence public.text_events_id_seq to authenticated, anon;