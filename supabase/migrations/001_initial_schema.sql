-- Generations table
create table if not exists public.generations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  input_text text,
  input_url text,
  platforms text[] not null default '{}',
  generated_results jsonb not null default '{}',
  created_at timestamptz not null default now()
);

-- Indexes
create index if not exists idx_generations_user_created
  on public.generations (user_id, created_at desc);

create index if not exists idx_generations_rate_limit
  on public.generations (user_id, created_at);

-- Enable RLS
alter table public.generations enable row level security;

-- RLS Policies
create policy "Users can view their own generations"
  on public.generations for select
  using (auth.uid() = user_id);

create policy "Users can insert their own generations"
  on public.generations for insert
  with check (auth.uid() = user_id);

create policy "Users can delete their own generations"
  on public.generations for delete
  using (auth.uid() = user_id);
