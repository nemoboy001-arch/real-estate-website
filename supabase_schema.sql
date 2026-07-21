-- Vertex Realty Supabase Database Schema
-- Run this script in the Supabase SQL Editor to configure tables, triggers, and Row Level Security.

-- 1. Create Profiles Table
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text not null,
  phone text,
  role text not null default 'agent',
  verified boolean not null default false,
  is_admin boolean not null default false,
  created_at timestamp with time zone default now()
);

-- Enable RLS on Profiles
alter table public.profiles enable row level security;

-- 2. Create Listings Table
create table if not exists public.listings (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  price numeric not null,
  category text not null check (category in ('residential', 'luxury', 'rental', 'commercial')),
  listing_type text not null check (listing_type in ('sale', 'lease')),
  beds integer,
  baths integer,
  sqft integer not null,
  address text not null,
  city text not null,
  zip text not null,
  images text[] not null default '{}',
  posted_by uuid references public.profiles(id) on delete cascade not null,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamp with time zone default now()
);

-- Enable RLS on Listings
alter table public.listings enable row level security;

-- 3. Trigger to Auto-create Profile on Sign-up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, phone, role, verified, is_admin)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'phone', ''),
    'agent',
    false,
    false
  );
  return new;
end;
$$ language plpgsql security definer;

-- Recreate trigger
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 4. Helper Function to Check Admin Privilege Without Recursion
create or replace function public.is_admin()
returns boolean as $$
begin
  return coalesce(
    (select is_admin from public.profiles where id = auth.uid()),
    false
  );
end;
$$ language plpgsql security definer;

-- 5. Row Level Security Policies for Profiles

-- Allow public read access to all profiles (to show agent bios on listing detail pages)
create policy "Allow public read access on profiles"
on public.profiles for select
using (true);

-- Allow users to update their own profile (restricted to non-sensitive fields check)
create policy "Allow users to update own profile"
on public.profiles for update
using (auth.uid() = id)
with check (
  auth.uid() = id 
  and verified = (select verified from public.profiles where id = auth.uid())
  and is_admin = (select is_admin from public.profiles where id = auth.uid())
);

-- Allow admins full control over all profiles (updating verified status or role)
create policy "Allow admins to manage all profiles"
on public.profiles for all
using (public.is_admin());

-- 6. Row Level Security Policies for Listings

-- Allow anyone to read approved listings, or users to read their own pending/rejected listings
create policy "Allow users to read listings"
on public.listings for select
using (
  status = 'approved' 
  or auth.uid() = posted_by 
  or public.is_admin()
);

-- Allow verified users to submit new listings
create policy "Allow verified users to insert listings"
on public.listings for insert
with check (
  auth.uid() = posted_by 
  and (select verified from public.profiles where id = auth.uid()) = true
);

-- Allow users to update their own listings (but forces status to reset to 'pending' unless they are admins)
create policy "Allow owners to update own listings"
on public.listings for update
using (auth.uid() = posted_by or public.is_admin())
with check (
  public.is_admin() 
  or (auth.uid() = posted_by and status = 'pending')
);

-- Allow users or admins to delete listings
create policy "Allow owners to delete listings"
on public.listings for delete
using (auth.uid() = posted_by or public.is_admin());
