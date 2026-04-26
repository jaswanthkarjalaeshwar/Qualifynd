/*
  # Initial Schema for Qualifynd Platform

  1. New Tables
    - `profiles` - User profiles with role-based access
    - `companies` - Company information
    - `jobs` - Job postings with full details
    - `applications` - Job applications from candidates
    - `comments` - Comments on applications
    - `analytics_events` - Track user interactions for analytics
    - `settings` - User and company settings

  2. Security
    - Enable RLS on all tables
    - Add policies for role-based access control
    - Secure data access based on user roles and company membership
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
CREATE TYPE user_role AS ENUM ('recruiter', 'hiring_manager', 'admin', 'candidate');
CREATE TYPE job_status AS ENUM ('draft', 'active', 'closed', 'archived');
CREATE TYPE job_type AS ENUM ('full-time', 'part-time', 'contract', 'internship');
CREATE TYPE application_status AS ENUM ('applied', 'screening', 'interview', 'final', 'hired', 'rejected');
CREATE TYPE application_bucket AS ENUM ('yes', 'maybe', 'no', 'pending');

-- Companies table
CREATE TABLE IF NOT EXISTS companies (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  logo_url text,
  website text,
  description text,
  industry text,
  size text,
  location text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Profiles table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  company_id uuid REFERENCES companies(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  avatar_url text,
  role user_role NOT NULL DEFAULT 'recruiter',
  department text,
  phone text,
  timezone text DEFAULT 'UTC',
  is_active boolean DEFAULT true,
  last_login timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Jobs table
CREATE TABLE IF NOT EXISTS jobs (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id uuid REFERENCES companies(id) ON DELETE CASCADE NOT NULL,
  created_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  title text NOT NULL,
  department text NOT NULL,
  location text NOT NULL,
  job_type job_type NOT NULL DEFAULT 'full-time',
  status job_status NOT NULL DEFAULT 'draft',
  description text NOT NULL,
  responsibilities text[] DEFAULT '{}',
  qualifications text[] DEFAULT '{}',
  benefits text[] DEFAULT '{}',
  keywords text[] DEFAULT '{}',
  experience_level text,
  salary_min integer,
  salary_max integer,
  currency text DEFAULT 'USD',
  remote_allowed boolean DEFAULT false,
  application_deadline timestamptz,
  external_job_id text,
  application_count integer DEFAULT 0,
  view_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Applications table
CREATE TABLE IF NOT EXISTS applications (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id uuid REFERENCES jobs(id) ON DELETE CASCADE NOT NULL,
  candidate_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  email text NOT NULL,
  phone text,
  resume_url text,
  cover_letter text,
  custom_answers jsonb DEFAULT '{}',
  automatic_score integer DEFAULT 0,
  manual_score integer DEFAULT 0,
  overall_score integer DEFAULT 0,
  bucket application_bucket DEFAULT 'pending',
  status application_status DEFAULT 'applied',
  source text,
  referrer text,
  linkedin_url text,
  portfolio_url text,
  years_experience integer,
  current_salary integer,
  expected_salary integer,
  notice_period text,
  willing_to_relocate boolean DEFAULT false,
  visa_required boolean DEFAULT false,
  applied_at timestamptz DEFAULT now(),
  last_updated timestamptz DEFAULT now(),
  reviewed_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  reviewed_at timestamptz
);

-- Comments table
CREATE TABLE IF NOT EXISTS comments (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_id uuid REFERENCES applications(id) ON DELETE CASCADE NOT NULL,
  author_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  content text NOT NULL,
  is_private boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Analytics events table
CREATE TABLE IF NOT EXISTS analytics_events (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  company_id uuid REFERENCES companies(id) ON DELETE CASCADE,
  event_type text NOT NULL,
  event_data jsonb DEFAULT '{}',
  page_url text,
  user_agent text,
  ip_address inet,
  created_at timestamptz DEFAULT now()
);

-- Settings table
CREATE TABLE IF NOT EXISTS settings (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  company_id uuid REFERENCES companies(id) ON DELETE CASCADE,
  setting_key text NOT NULL,
  setting_value jsonb NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, setting_key),
  UNIQUE(company_id, setting_key)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_company_id ON profiles(company_id);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_jobs_company_id ON jobs(company_id);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);
CREATE INDEX IF NOT EXISTS idx_jobs_created_by ON jobs(created_by);
CREATE INDEX IF NOT EXISTS idx_applications_job_id ON applications(job_id);
CREATE INDEX IF NOT EXISTS idx_applications_candidate_id ON applications(candidate_id);
CREATE INDEX IF NOT EXISTS idx_applications_bucket ON applications(bucket);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
CREATE INDEX IF NOT EXISTS idx_comments_application_id ON comments(application_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_company_id ON analytics_events(company_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at ON analytics_events(created_at);

-- Enable Row Level Security
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for companies
CREATE POLICY "Users can view their company" ON companies
  FOR SELECT USING (
    id IN (
      SELECT company_id FROM profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Admins can update their company" ON companies
  FOR UPDATE USING (
    id IN (
      SELECT company_id FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for profiles
CREATE POLICY "Users can view profiles in their company" ON profiles
  FOR SELECT USING (
    company_id IN (
      SELECT company_id FROM profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (id = auth.uid());

-- RLS Policies for jobs
CREATE POLICY "Users can view jobs in their company" ON jobs
  FOR SELECT USING (
    company_id IN (
      SELECT company_id FROM profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Recruiters and admins can create jobs" ON jobs
  FOR INSERT WITH CHECK (
    company_id IN (
      SELECT company_id FROM profiles 
      WHERE id = auth.uid() AND role IN ('recruiter', 'admin')
    )
  );

CREATE POLICY "Recruiters and admins can update jobs" ON jobs
  FOR UPDATE USING (
    company_id IN (
      SELECT company_id FROM profiles 
      WHERE id = auth.uid() AND role IN ('recruiter', 'admin')
    )
  );

-- RLS Policies for applications
CREATE POLICY "Users can view applications for their company jobs" ON applications
  FOR SELECT USING (
    job_id IN (
      SELECT j.id FROM jobs j
      JOIN profiles p ON p.company_id = j.company_id
      WHERE p.id = auth.uid()
    )
  );

CREATE POLICY "Candidates can view their own applications" ON applications
  FOR SELECT USING (candidate_id = auth.uid());

CREATE POLICY "Anyone can create applications" ON applications
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Recruiters can update applications" ON applications
  FOR UPDATE USING (
    job_id IN (
      SELECT j.id FROM jobs j
      JOIN profiles p ON p.company_id = j.company_id
      WHERE p.id = auth.uid() AND p.role IN ('recruiter', 'hiring_manager', 'admin')
    )
  );

-- RLS Policies for comments
CREATE POLICY "Users can view comments on applications they can access" ON comments
  FOR SELECT USING (
    application_id IN (
      SELECT a.id FROM applications a
      JOIN jobs j ON j.id = a.job_id
      JOIN profiles p ON p.company_id = j.company_id
      WHERE p.id = auth.uid()
    )
  );

CREATE POLICY "Users can create comments on accessible applications" ON comments
  FOR INSERT WITH CHECK (
    application_id IN (
      SELECT a.id FROM applications a
      JOIN jobs j ON j.id = a.job_id
      JOIN profiles p ON p.company_id = j.company_id
      WHERE p.id = auth.uid()
    )
  );

-- RLS Policies for analytics_events
CREATE POLICY "Users can view analytics for their company" ON analytics_events
  FOR SELECT USING (
    company_id IN (
      SELECT company_id FROM profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can create analytics events" ON analytics_events
  FOR INSERT WITH CHECK (
    company_id IN (
      SELECT company_id FROM profiles WHERE id = auth.uid()
    )
  );

-- RLS Policies for settings
CREATE POLICY "Users can view their own settings" ON settings
  FOR SELECT USING (
    user_id = auth.uid() OR 
    company_id IN (
      SELECT company_id FROM profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can manage their own settings" ON settings
  FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Admins can manage company settings" ON settings
  FOR ALL USING (
    company_id IN (
      SELECT company_id FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Functions for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON companies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_jobs_updated_at BEFORE UPDATE ON jobs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_applications_updated_at BEFORE UPDATE ON applications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON comments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();