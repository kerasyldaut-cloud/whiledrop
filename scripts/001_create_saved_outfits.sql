-- Create saved_outfits table for storing user-saved outfit recommendations
create table if not exists public.saved_outfits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  outfit_name text not null,
  outfit_data jsonb not null,
  total_cost numeric not null default 0,
  created_at timestamptz not null default now()
);

-- Index for fast user-scoped lookups
create index if not exists saved_outfits_user_id_idx
  on public.saved_outfits (user_id, created_at desc);

-- Enable Row Level Security
alter table public.saved_outfits enable row level security;

-- Drop existing policies (idempotent re-run)
drop policy if exists "Users can view their own outfits" on public.saved_outfits;
drop policy if exists "Users can insert their own outfits" on public.saved_outfits;
drop policy if exists "Users can update their own outfits" on public.saved_outfits;
drop policy if exists "Users can delete their own outfits" on public.saved_outfits;

-- RLS policies: users only see/modify their own rows
create policy "Users can view their own outfits"
  on public.saved_outfits for select
  using (auth.uid() = user_id);

create policy "Users can insert their own outfits"
  on public.saved_outfits for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own outfits"
  on public.saved_outfits for update
  using (auth.uid() = user_id);

create policy "Users can delete their own outfits"
  on public.saved_outfits for delete
  using (auth.uid() = user_id);
