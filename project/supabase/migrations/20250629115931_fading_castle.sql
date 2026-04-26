/*
  # Create demo user and setup

  1. New Tables
    - No new tables needed
  
  2. Demo Data
    - Create demo company
    - Create demo user profile
  
  3. Security
    - Ensure RLS policies allow demo user access
*/

-- Create demo company
INSERT INTO companies (id, name, description, industry, size, location)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Demo Company',
  'A demonstration company for testing Qualifynd features',
  'Technology',
  '50-200 employees',
  'San Francisco, CA'
) ON CONFLICT (id) DO NOTHING;

-- Note: The actual auth user will be created through Supabase Auth
-- This migration just ensures the company exists for the demo profile