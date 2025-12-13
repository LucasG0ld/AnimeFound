
-- AnimeFound Database Schema
-- Based on: @docs/05_DATABASE_SCHEMA_AND_RLS.md

-- 1. PROFILES (Users extensions)
create table public.profiles (
  id uuid references auth.users not null primary key,
  username text unique,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. ANIMES (Master Catalog)
create table public.animes (
  id uuid default gen_random_uuid() primary key,
  mal_id int unique not null,
  title_en text not null,
  image_url text,
  type text, -- TV, Movie, OVA
  year int,
  total_episodes int,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. LIBRARY ITEMS (User's Watchlist)
create type public.watch_status as enum ('WATCHING', 'COMPLETED', 'PLAN_TO_WATCH', 'DROPPED');

create table public.library_items (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) not null,
  anime_id uuid references public.animes(id) not null,
  status public.watch_status not null default 'PLAN_TO_WATCH',
  rating float check (rating >= 0 and rating <= 5),
  comment text,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, anime_id)
);

-- 4. GROUPS
create table public.groups (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  owner_id uuid references public.profiles(id) not null,
  invite_code text unique not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. GROUP MEMBERS
create table public.group_members (
  group_id uuid references public.groups(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  role text default 'MEMBER', -- ADMIN, MEMBER
  joined_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (group_id, user_id)
);

-- RLS POLICIES --
alter table public.profiles enable row level security;
alter table public.animes enable row level security;
alter table public.library_items enable row level security;
alter table public.groups enable row level security;
alter table public.group_members enable row level security;

-- Profiles: Public Read, Update Own
create policy "Public profiles are viewable by everyone." on public.profiles for select using (true);
create policy "Users can insert their own profile." on public.profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile." on public.profiles for update using (auth.uid() = id);

-- Animes: Public Read, Authenticated Insert
create policy "Animes are viewable by everyone." on public.animes for select using (true);
create policy "Authenticated users can insert new animes." on public.animes for insert with check (auth.role() = 'authenticated');

-- Library: Read Public (for now), Insert/Update/Delete Own
create policy "Library items are viewable by everyone." on public.library_items for select using (true);
create policy "Users can insert their own library items." on public.library_items for insert with check (auth.uid() = user_id);
create policy "Users can update their own library items." on public.library_items for update using (auth.uid() = user_id);
create policy "Users can delete their own library items." on public.library_items for delete using (auth.uid() = user_id);

-- Groups: Members Read, Owner Update
create policy "Groups are viewable by members." on public.groups for select using (
  exists (
    select 1 from public.group_members where group_id = groups.id and user_id = auth.uid()
  )
);
create policy "Owners can update groups." on public.groups for update using (auth.uid() = owner_id);
create policy "Authenticated users can create groups." on public.groups for insert with check (auth.role() = 'authenticated');

-- Group Members: Members Read, Admins/Owners Manage (simplified for initial setup)
create policy "Group members are viewable by group members." on public.group_members for select using (
  exists (
    select 1 from public.group_members as gm where gm.group_id = group_members.group_id and gm.user_id = auth.uid()
  )
);
-- Allow users to join (insert themselves) if they have the code (logic handled in app, RLS allows insert own)
create policy "Users can join groups." on public.group_members for insert with check (auth.uid() = user_id);

-- Triggers for Updated At
create or replace function public.handle_updated_at() returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger handle_updated_at before update on public.library_items
  for each row execute procedure public.handle_updated_at();

-- Trigger for New User Profile creation
create or replace function public.handle_new_user() returns trigger as $$
begin
  insert into public.profiles (id, username, avatar_url)
  values (new.id, new.raw_user_meta_data->>'username', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
