import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Database {
  public: {
    Tables: {
      companies: {
        Row: {
          id: string;
          name: string;
          logo_url: string | null;
          website: string | null;
          description: string | null;
          industry: string | null;
          size: string | null;
          location: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          logo_url?: string | null;
          website?: string | null;
          description?: string | null;
          industry?: string | null;
          size?: string | null;
          location?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          logo_url?: string | null;
          website?: string | null;
          description?: string | null;
          industry?: string | null;
          size?: string | null;
          location?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      profiles: {
        Row: {
          id: string;
          company_id: string | null;
          email: string;
          full_name: string;
          avatar_url: string | null;
          role: 'recruiter' | 'hiring_manager' | 'admin' | 'candidate';
          department: string | null;
          phone: string | null;
          timezone: string | null;
          is_active: boolean | null;
          last_login: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          company_id?: string | null;
          email: string;
          full_name: string;
          avatar_url?: string | null;
          role?: 'recruiter' | 'hiring_manager' | 'admin' | 'candidate';
          department?: string | null;
          phone?: string | null;
          timezone?: string | null;
          is_active?: boolean | null;
          last_login?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          company_id?: string | null;
          email?: string;
          full_name?: string;
          avatar_url?: string | null;
          role?: 'recruiter' | 'hiring_manager' | 'admin' | 'candidate';
          department?: string | null;
          phone?: string | null;
          timezone?: string | null;
          is_active?: boolean | null;
          last_login?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      jobs: {
        Row: {
          id: string;
          company_id: string;
          created_by: string | null;
          title: string;
          department: string;
          location: string;
          job_type: 'full-time' | 'part-time' | 'contract' | 'internship';
          status: 'draft' | 'active' | 'closed' | 'archived';
          description: string;
          responsibilities: string[];
          qualifications: string[];
          benefits: string[];
          keywords: string[];
          experience_level: string | null;
          salary_min: number | null;
          salary_max: number | null;
          currency: string | null;
          remote_allowed: boolean | null;
          application_deadline: string | null;
          external_job_id: string | null;
          application_count: number | null;
          view_count: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          company_id: string;
          created_by?: string | null;
          title: string;
          department: string;
          location: string;
          job_type?: 'full-time' | 'part-time' | 'contract' | 'internship';
          status?: 'draft' | 'active' | 'closed' | 'archived';
          description: string;
          responsibilities?: string[];
          qualifications?: string[];
          benefits?: string[];
          keywords?: string[];
          experience_level?: string | null;
          salary_min?: number | null;
          salary_max?: number | null;
          currency?: string | null;
          remote_allowed?: boolean | null;
          application_deadline?: string | null;
          external_job_id?: string | null;
          application_count?: number | null;
          view_count?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          company_id?: string;
          created_by?: string | null;
          title?: string;
          department?: string;
          location?: string;
          job_type?: 'full-time' | 'part-time' | 'contract' | 'internship';
          status?: 'draft' | 'active' | 'closed' | 'archived';
          description?: string;
          responsibilities?: string[];
          qualifications?: string[];
          benefits?: string[];
          keywords?: string[];
          experience_level?: string | null;
          salary_min?: number | null;
          salary_max?: number | null;
          currency?: string | null;
          remote_allowed?: boolean | null;
          application_deadline?: string | null;
          external_job_id?: string | null;
          application_count?: number | null;
          view_count?: number | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      applications: {
        Row: {
          id: string;
          job_id: string;
          candidate_id: string | null;
          full_name: string;
          email: string;
          phone: string | null;
          resume_url: string | null;
          cover_letter: string | null;
          custom_answers: any;
          automatic_score: number | null;
          manual_score: number | null;
          overall_score: number | null;
          bucket: 'yes' | 'maybe' | 'no' | 'pending';
          status: 'applied' | 'screening' | 'interview' | 'final' | 'hired' | 'rejected';
          source: string | null;
          referrer: string | null;
          linkedin_url: string | null;
          portfolio_url: string | null;
          years_experience: number | null;
          current_salary: number | null;
          expected_salary: number | null;
          notice_period: string | null;
          willing_to_relocate: boolean | null;
          visa_required: boolean | null;
          applied_at: string;
          last_updated: string;
          reviewed_by: string | null;
          reviewed_at: string | null;
        };
        Insert: {
          id?: string;
          job_id: string;
          candidate_id?: string | null;
          full_name: string;
          email: string;
          phone?: string | null;
          resume_url?: string | null;
          cover_letter?: string | null;
          custom_answers?: any;
          automatic_score?: number | null;
          manual_score?: number | null;
          overall_score?: number | null;
          bucket?: 'yes' | 'maybe' | 'no' | 'pending';
          status?: 'applied' | 'screening' | 'interview' | 'final' | 'hired' | 'rejected';
          source?: string | null;
          referrer?: string | null;
          linkedin_url?: string | null;
          portfolio_url?: string | null;
          years_experience?: number | null;
          current_salary?: number | null;
          expected_salary?: number | null;
          notice_period?: string | null;
          willing_to_relocate?: boolean | null;
          visa_required?: boolean | null;
          applied_at?: string;
          last_updated?: string;
          reviewed_by?: string | null;
          reviewed_at?: string | null;
        };
        Update: {
          id?: string;
          job_id?: string;
          candidate_id?: string | null;
          full_name?: string;
          email?: string;
          phone?: string | null;
          resume_url?: string | null;
          cover_letter?: string | null;
          custom_answers?: any;
          automatic_score?: number | null;
          manual_score?: number | null;
          overall_score?: number | null;
          bucket?: 'yes' | 'maybe' | 'no' | 'pending';
          status?: 'applied' | 'screening' | 'interview' | 'final' | 'hired' | 'rejected';
          source?: string | null;
          referrer?: string | null;
          linkedin_url?: string | null;
          portfolio_url?: string | null;
          years_experience?: number | null;
          current_salary?: number | null;
          expected_salary?: number | null;
          notice_period?: string | null;
          willing_to_relocate?: boolean | null;
          visa_required?: boolean | null;
          applied_at?: string;
          last_updated?: string;
          reviewed_by?: string | null;
          reviewed_at?: string | null;
        };
      };
      comments: {
        Row: {
          id: string;
          application_id: string;
          author_id: string;
          content: string;
          is_private: boolean | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          application_id: string;
          author_id: string;
          content: string;
          is_private?: boolean | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          application_id?: string;
          author_id?: string;
          content?: string;
          is_private?: boolean | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      analytics_events: {
        Row: {
          id: string;
          user_id: string | null;
          company_id: string | null;
          event_type: string;
          event_data: any;
          page_url: string | null;
          user_agent: string | null;
          ip_address: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          company_id?: string | null;
          event_type: string;
          event_data?: any;
          page_url?: string | null;
          user_agent?: string | null;
          ip_address?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          company_id?: string | null;
          event_type?: string;
          event_data?: any;
          page_url?: string | null;
          user_agent?: string | null;
          ip_address?: string | null;
          created_at?: string;
        };
      };
      settings: {
        Row: {
          id: string;
          user_id: string | null;
          company_id: string | null;
          setting_key: string;
          setting_value: any;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          company_id?: string | null;
          setting_key: string;
          setting_value: any;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          company_id?: string | null;
          setting_key?: string;
          setting_value?: any;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}