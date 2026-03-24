-- 20260324_initial_schema.sql
-- Initial schema for Industrial Integrity Terminal

-- 1. Users table (Sync with Auth)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
  display_name TEXT,
  email TEXT UNIQUE,
  photo_url TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Personnel table (Employees)
CREATE TABLE IF NOT EXISTS public.personnel (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  department TEXT NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'on_leave')),
  email TEXT,
  phone TEXT,
  joined_at DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Blockchain Ledger (Audit Log)
CREATE TABLE IF NOT EXISTS public.ledger (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  performed_by UUID REFERENCES public.users(id),
  metadata JSONB DEFAULT '{}'::jsonb,
  hash TEXT,
  previous_hash TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Row Level Security (RLS)

-- Users: Only owner or admin can read/write
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own profile"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Admins can read all profiles"
  ON public.users FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can update all profiles"
  ON public.users FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));

-- Personnel: Only authenticated users can read, only admins can write
ALTER TABLE public.personnel ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read personnel"
  ON public.personnel FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage personnel"
  ON public.personnel FOR ALL
  USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));

-- Ledger: Only authenticated users can read, system/admins can write
ALTER TABLE public.ledger ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read ledger"
  ON public.ledger FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage ledger"
  ON public.ledger FOR ALL
  USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));

-- 5. Functions & Triggers (Auto-sync user on auth.signup)
-- This function should be run as a Superuser in Supabase SQL Editor
/*
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, display_name, email, photo_url, role)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.email,
    new.raw_user_meta_data->>'avatar_url',
    'user'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
*/
