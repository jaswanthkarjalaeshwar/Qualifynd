/*
  # Create demo data for Qualifynd

  1. New Demo Company
    - Creates a demo company with ID '00000000-0000-0000-0000-000000000001'
    - Sets up basic company information for demo purposes

  2. Demo User Setup
    - Ensures the demo company exists for profile creation
    - Provides foundation for demo user authentication

  3. Security
    - Uses existing RLS policies
    - No additional security changes needed
*/

-- Create demo company if it doesn't exist
INSERT INTO companies (
  id,
  name,
  description,
  industry,
  size,
  location,
  website
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Qualifynd Demo Company',
  'A demonstration company for showcasing Qualifynd''s recruitment platform capabilities.',
  'Technology',
  '50-200 employees',
  'San Francisco, CA',
  'https://demo.qualifynd.com'
) ON CONFLICT (id) DO NOTHING;

-- Create some demo jobs for the demo company
INSERT INTO jobs (
  id,
  company_id,
  title,
  department,
  location,
  job_type,
  status,
  description,
  responsibilities,
  qualifications,
  benefits,
  keywords,
  experience_level,
  salary_min,
  salary_max,
  currency,
  remote_allowed
) VALUES 
(
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000001',
  'Senior Software Engineer',
  'Engineering',
  'San Francisco, CA',
  'full-time',
  'active',
  'We are looking for a Senior Software Engineer to join our growing team. You will be responsible for designing, developing, and maintaining high-quality software solutions.',
  ARRAY['Design and develop scalable web applications', 'Collaborate with cross-functional teams', 'Mentor junior developers', 'Participate in code reviews'],
  ARRAY['5+ years of software development experience', 'Proficiency in React, Node.js, and TypeScript', 'Experience with cloud platforms (AWS, GCP)', 'Strong problem-solving skills'],
  ARRAY['Competitive salary', 'Health insurance', 'Flexible work arrangements', '401(k) matching'],
  ARRAY['React', 'Node.js', 'TypeScript', 'AWS', 'Software Engineering'],
  'Senior',
  120000,
  180000,
  'USD',
  true
),
(
  '00000000-0000-0000-0000-000000000002',
  '00000000-0000-0000-0000-000000000001',
  'Product Manager',
  'Product',
  'San Francisco, CA',
  'full-time',
  'active',
  'Join our product team to drive the vision and strategy for our recruitment platform. You will work closely with engineering, design, and business teams.',
  ARRAY['Define product roadmap and strategy', 'Gather and analyze user requirements', 'Coordinate with engineering teams', 'Monitor product metrics'],
  ARRAY['3+ years of product management experience', 'Experience with B2B SaaS products', 'Strong analytical skills', 'Excellent communication skills'],
  ARRAY['Competitive salary', 'Equity package', 'Health insurance', 'Professional development budget'],
  ARRAY['Product Management', 'SaaS', 'Analytics', 'Strategy'],
  'Mid-level',
  100000,
  140000,
  'USD',
  false
) ON CONFLICT (id) DO NOTHING;