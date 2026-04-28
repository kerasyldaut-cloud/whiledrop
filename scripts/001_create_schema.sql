-- Create profiles table linked to auth.users
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  location TEXT,
  gender TEXT DEFAULT 'men',
  age INTEGER DEFAULT 25,
  height INTEGER DEFAULT 170,
  height_unit TEXT DEFAULT 'cm',
  budget INTEGER DEFAULT 300,
  style TEXT DEFAULT 'old-money',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create saved_outfits table
CREATE TABLE IF NOT EXISTS public.saved_outfits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  outfit_name TEXT NOT NULL,
  outfit_data JSONB NOT NULL,
  total_cost INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create generated_outfits table to store AI generations
CREATE TABLE IF NOT EXISTS public.generated_outfits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  profile_snapshot JSONB NOT NULL,
  weather_data JSONB,
  photo_analysis JSONB,
  outfits JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_outfits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.generated_outfits ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles_delete_own" ON public.profiles FOR DELETE USING (auth.uid() = id);

-- Saved outfits policies
CREATE POLICY "saved_outfits_select_own" ON public.saved_outfits FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "saved_outfits_insert_own" ON public.saved_outfits FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "saved_outfits_delete_own" ON public.saved_outfits FOR DELETE USING (auth.uid() = user_id);

-- Generated outfits policies
CREATE POLICY "generated_outfits_select_own" ON public.generated_outfits FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "generated_outfits_insert_own" ON public.generated_outfits FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Trigger to auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id)
  VALUES (new.id)
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
