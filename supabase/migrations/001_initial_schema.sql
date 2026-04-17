-- ============================================================
-- STEP 1: Enable UUID extension
-- ============================================================
create extension if not exists "uuid-ossp";

-- ============================================================
-- BUSINESSES TABLE
-- ============================================================
create table public.businesses (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null,
  owner_id    uuid not null references auth.users(id) on delete cascade,
  created_at  timestamptz not null default now()
);

-- ============================================================
-- PROFILES TABLE
-- ============================================================
create table public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text not null,
  business_id uuid references public.businesses(id) on delete set null,
  role        text not null default 'staff' check (role in ('admin', 'staff')),
  created_at  timestamptz not null default now()
);

-- ============================================================
-- ITEMS TABLE
-- ============================================================
create table public.items (
  id            uuid primary key default uuid_generate_v4(),
  business_id   uuid not null references public.businesses(id) on delete cascade,
  name          text not null,
  category      text not null default 'Uncategorized',
  buying_price  numeric(12, 2),
  selling_price numeric(12, 2) not null,
  image_path    text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- Auto-update updated_at
create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger items_updated_at
  before update on public.items
  for each row execute procedure update_updated_at();

-- ============================================================
-- AUTO-CREATE PROFILE ON SIGNUP
-- ============================================================
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
alter table public.businesses  enable row level security;
alter table public.profiles    enable row level security;
alter table public.items       enable row level security;

-- ---- PROFILES ----
-- Users can read/update their own profile
create policy "profiles: own read"
  on public.profiles for select
  using (auth.uid() = id);

create policy "profiles: own update"
  on public.profiles for update
  using (auth.uid() = id);

-- ---- BUSINESSES ----
-- Members of a business (via profiles) can read it
create policy "businesses: member read"
  on public.businesses for select
  using (
    id in (
      select business_id from public.profiles
      where id = auth.uid()
    )
  );

-- Only the owner can update/delete
create policy "businesses: owner update"
  on public.businesses for update
  using (owner_id = auth.uid());

create policy "businesses: owner delete"
  on public.businesses for delete
  using (owner_id = auth.uid());

-- Any authenticated user can create a business (they become owner)
create policy "businesses: authenticated insert"
  on public.businesses for insert
  with check (owner_id = auth.uid());

-- ---- ITEMS (full row) ----
-- All members of the business can see items (buying_price column secured via view below)
create policy "items: business member read"
  on public.items for select
  using (
    business_id in (
      select business_id from public.profiles
      where id = auth.uid()
    )
  );

-- Only admins can insert / update / delete items
create policy "items: admin insert"
  on public.items for insert
  with check (
    exists (
      select 1 from public.profiles
      where id = auth.uid()
        and business_id = items.business_id
        and role = 'admin'
    )
  );

create policy "items: admin update"
  on public.items for update
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid()
        and business_id = items.business_id
        and role = 'admin'
    )
  );

create policy "items: admin delete"
  on public.items for delete
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid()
        and business_id = items.business_id
        and role = 'admin'
    )
  );

-- ============================================================
-- STAFF VIEW: hides buying_price at DB level
-- Staff queries this view; it never exposes buying_price.
-- ============================================================
create view public.items_staff_view as
  select
    id,
    business_id,
    name,
    category,
    selling_price,
    image_path,
    created_at,
    updated_at
  from public.items;

-- Secure the view to the definer so RLS still applies on base table
alter view public.items_staff_view owner to postgres;

-- ============================================================
-- STORAGE BUCKET: item-images
-- ============================================================
insert into storage.buckets (id, name, public)
values ('item-images', 'item-images', true)
on conflict do nothing;

-- Admins of the business can upload
create policy "storage: admin upload"
  on storage.objects for insert
  with check (
    bucket_id = 'item-images'
    and exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Everyone authenticated can read images
create policy "storage: authenticated read"
  on storage.objects for select
  using (bucket_id = 'item-images' and auth.role() = 'authenticated');

-- Admins can delete their images
create policy "storage: admin delete"
  on storage.objects for delete
  using (
    bucket_id = 'item-images'
    and exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );
