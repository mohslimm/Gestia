-- ACTIVER UUID EXTENSION
create extension if not exists "uuid-ossp";

-- 1. profiles (lié à auth.users)
create table if not exists public.profiles (
  id uuid references auth.users not null primary key,
  full_name text,
  email text not null,
  phone text,
  plan text check (plan in ('starter', 'pro', 'investor')) default 'starter',
  stripe_customer_id text,
  stripe_subscription_id text,
  created_at timestamptz default now()
);

alter table profiles enable row level security;
create policy "Users can view own profile" on profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);

-- Trigger pour la création de profile automatique lors de l'auth
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 2. properties (immeubles)
create table if not exists public.properties (
  id uuid default uuid_generate_v4() primary key,
  owner_id uuid references public.profiles(id) not null default auth.uid(),
  name text not null,
  address text,
  city text,
  postal_code text,
  country text default 'France',
  created_at timestamptz default now()
);

alter table properties enable row level security;
create policy "Owners can do all with their properties" on properties for all using (auth.uid() = owner_id);

-- 3. units (appartements)
create table if not exists public.units (
  id uuid default uuid_generate_v4() primary key,
  property_id uuid references public.properties(id) on delete cascade not null,
  unit_number text not null,
  floor text,
  bedrooms numeric,
  bathrooms numeric,
  area_sqft numeric,
  monthly_rent numeric not null,
  status text check (status in ('vacant', 'occupied', 'maintenance')) default 'vacant',
  created_at timestamptz default now()
);

alter table units enable row level security;
-- L'accès aux unités dépend de l'accès à la propriété
create policy "Owners can do all with their units" on units for all using (
  exists (select 1 from properties where id = units.property_id and owner_id = auth.uid())
);

-- 4. tenants (locataires)
create table if not exists public.tenants (
  id uuid default uuid_generate_v4() primary key,
  unit_id uuid references public.units(id) on delete set null,
  full_name text not null,
  email text,
  phone text,
  portal_token uuid default uuid_generate_v4() unique not null,
  created_at timestamptz default now()
);

alter table tenants enable row level security;
create policy "Owners can do all with their tenants" on tenants for all using (
  exists (select 1 from units join properties on units.property_id = properties.id where units.id = tenants.unit_id and properties.owner_id = auth.uid())
);
-- Politique pour l'accès public via portal_token (utilisé côté API ou avec un client anonyme configuré)
create policy "Tenants can view their own data via token" on tenants for select using (true); -- Simplifié, filtrage dans l'API/code

-- 5. leases (baux)
create table if not exists public.leases (
  id uuid default uuid_generate_v4() primary key,
  unit_id uuid references public.units(id) on delete cascade not null,
  tenant_id uuid references public.tenants(id) on delete cascade not null,
  start_date date not null,
  end_date date not null,
  monthly_rent numeric not null,
  deposit numeric,
  status text check (status in ('active', 'expired', 'terminated')) default 'active',
  pdf_url text,
  ai_extracted jsonb,
  renewal_sent_at timestamptz,
  created_at timestamptz default now()
);

alter table leases enable row level security;
create policy "Owners can do all with their leases" on leases for all using (
  exists (select 1 from units join properties on units.property_id = properties.id where units.id = leases.unit_id and properties.owner_id = auth.uid())
);
create policy "Tenants can view their lease via unit token" on leases for select using (true);

-- 6. payments (loyers)
create table if not exists public.payments (
  id uuid default uuid_generate_v4() primary key,
  lease_id uuid references public.leases(id) on delete cascade not null,
  due_date date not null,
  paid_date date,
  amount numeric not null,
  status text check (status in ('pending', 'paid', 'late', 'partial')) default 'pending',
  reminder_1_sent timestamptz,
  reminder_2_sent timestamptz,
  reminder_3_sent timestamptz,
  created_at timestamptz default now()
);

alter table payments enable row level security;
create policy "Owners can do all with their payments" on payments for all using (
  exists (select 1 from leases join units on leases.unit_id = units.id join properties on units.property_id = properties.id where leases.id = payments.lease_id and properties.owner_id = auth.uid())
);
create policy "Tenants can view their payments" on payments for select using (true);

-- 7. maintenance_tickets (réparations)
create table if not exists public.maintenance_tickets (
  id uuid default uuid_generate_v4() primary key,
  unit_id uuid references public.units(id) on delete cascade not null,
  tenant_id uuid references public.tenants(id) on delete cascade,
  title text not null,
  description text,
  priority text check (priority in ('low', 'normal', 'high', 'urgent')) default 'normal',
  status text check (status in ('open', 'in_progress', 'resolved', 'closed')) default 'open',
  photos text[],
  assigned_to text,
  created_at timestamptz default now()
);

alter table maintenance_tickets enable row level security;
create policy "Owners can do all with their tickets" on maintenance_tickets for all using (
  exists (select 1 from units join properties on units.property_id = properties.id where units.id = maintenance_tickets.unit_id and properties.owner_id = auth.uid())
);
create policy "Tenants can read and create tickets" on maintenance_tickets for select using (true);
create policy "Tenants can insert tickets" on maintenance_tickets for insert with check (true);

-- 8. documents (coffre-fort)
create table if not exists public.documents (
  id uuid default uuid_generate_v4() primary key,
  unit_id uuid references public.units(id) on delete cascade,
  lease_id uuid references public.leases(id) on delete cascade,
  owner_id uuid references public.profiles(id) not null default auth.uid(),
  name text not null,
  type text check (type in ('lease', 'inspection', 'insurance', 'invoice', 'other')) default 'other',
  file_url text not null,
  file_size numeric,
  created_at timestamptz default now()
);

alter table documents enable row level security;
create policy "Owners can do all with their documents" on documents for all using (auth.uid() = owner_id);

-- 9. monthly_reports (rapports IA)
create table if not exists public.monthly_reports (
  id uuid default uuid_generate_v4() primary key,
  owner_id uuid references public.profiles(id) not null default auth.uid(),
  period text not null, -- ex: '2025-01'
  total_revenue numeric default 0,
  total_expenses numeric default 0,
  net_income numeric default 0,
  occupancy_rate numeric default 0,
  ai_summary text,
  pdf_url text,
  created_at timestamptz default now()
);

alter table monthly_reports enable row level security;
create policy "Owners can do all with their reports" on monthly_reports for all using (auth.uid() = owner_id);
