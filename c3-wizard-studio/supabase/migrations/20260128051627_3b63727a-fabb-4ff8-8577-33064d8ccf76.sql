-- Create c3_profiles table (optimized name from c3_sec_users_profiles)
CREATE TABLE public.c3_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    username TEXT,
    first_name TEXT,
    last_name TEXT,
    phone TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create c3_employer_company_links table
CREATE TABLE public.c3_employer_company_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    company_id UUID NOT NULL REFERENCES public.c3_companies(id) ON DELETE CASCADE,
    is_primary BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id, company_id)
);

-- Create indexes
CREATE INDEX idx_c3_profiles_email ON public.c3_profiles(email);
CREATE INDEX idx_c3_profiles_username ON public.c3_profiles(username);
CREATE INDEX idx_c3_employer_company_links_user_id ON public.c3_employer_company_links(user_id);
CREATE INDEX idx_c3_employer_company_links_company_id ON public.c3_employer_company_links(company_id);

-- Enable RLS
ALTER TABLE public.c3_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.c3_employer_company_links ENABLE ROW LEVEL SECURITY;

-- RLS policies for c3_profiles
CREATE POLICY "Users can view own profile" ON public.c3_profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.c3_profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON public.c3_profiles FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update all profiles" ON public.c3_profiles FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

-- RLS policies for c3_employer_company_links
CREATE POLICY "Users can view own links" ON public.c3_employer_company_links FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all links" ON public.c3_employer_company_links FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage all links" ON public.c3_employer_company_links FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.c3_profiles (id, email, first_name, last_name)
    VALUES (
        NEW.id,
        NEW.email,
        NEW.raw_user_meta_data->>'first_name',
        NEW.raw_user_meta_data->>'last_name'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();