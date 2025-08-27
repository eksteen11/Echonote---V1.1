import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string;
          avatar_url?: string;
          company?: string;
          role: 'admin' | 'user' | 'viewer';
          subscription_tier: 'free' | 'starter' | 'professional' | 'enterprise';
          subscription_status: 'active' | 'cancelled' | 'past_due';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          name: string;
          avatar_url?: string;
          company?: string;
          role?: 'admin' | 'user' | 'viewer';
          subscription_tier?: 'free' | 'starter' | 'professional' | 'enterprise';
          subscription_status?: 'active' | 'cancelled' | 'past_due';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string;
          avatar_url?: string;
          company?: string;
          role?: 'admin' | 'user' | 'viewer';
          subscription_tier?: 'free' | 'starter' | 'professional' | 'enterprise';
          subscription_status?: 'active' | 'cancelled' | 'past_due';
          updated_at?: string;
        };
      };
      meetings: {
        Row: {
          id: string;
          title: string;
          description?: string;
          start_time: string;
          end_time?: string;
          duration: number;
          participants: string[];
          platform: 'zoom' | 'teams' | 'meet' | 'webex' | 'other';
          status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
          recording_url?: string;
          transcript_url?: string;
          summary?: string;
          tags: string[];
          user_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string;
          start_time: string;
          end_time?: string;
          duration: number;
          participants: string[];
          platform: 'zoom' | 'teams' | 'meet' | 'webex' | 'other';
          status?: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
          recording_url?: string;
          transcript_url?: string;
          summary?: string;
          tags?: string[];
          user_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          start_time?: string;
          end_time?: string;
          duration?: number;
          participants?: string[];
          platform?: 'zoom' | 'teams' | 'meet' | 'webex' | 'other';
          status?: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
          recording_url?: string;
          transcript_url?: string;
          summary?: string;
          tags?: string[];
          updated_at?: string;
        };
      };
      action_items: {
        Row: {
          id: string;
          meeting_id: string;
          description: string;
          assignee: string;
          due_date?: string;
          priority: 'low' | 'medium' | 'high' | 'urgent';
          status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
          user_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          meeting_id: string;
          description: string;
          assignee: string;
          due_date?: string;
          priority?: 'low' | 'medium' | 'high' | 'urgent';
          status?: 'pending' | 'in-progress' | 'completed' | 'cancelled';
          user_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          meeting_id?: string;
          description?: string;
          assignee?: string;
          due_date?: string;
          priority?: 'low' | 'medium' | 'high' | 'urgent';
          status?: 'pending' | 'in-progress' | 'completed' | 'cancelled';
          updated_at?: string;
        };
      };
      transcripts: {
        Row: {
          id: string;
          meeting_id: string;
          segments: any[];
          confidence: number;
          language: string;
          user_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          meeting_id: string;
          segments: any[];
          confidence: number;
          language: string;
          user_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          meeting_id?: string;
          segments?: any[];
          confidence?: number;
          language?: string;
        };
      };
      summaries: {
        Row: {
          id: string;
          meeting_id: string;
          content: string;
          key_points: string[];
          sentiment: 'positive' | 'neutral' | 'negative';
          topics: string[];
          ai_generated: boolean;
          user_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          meeting_id: string;
          content: string;
          key_points: string[];
          sentiment: 'positive' | 'neutral' | 'negative';
          topics: string[];
          ai_generated: boolean;
          user_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          meeting_id?: string;
          content?: string;
          key_points?: string[];
          sentiment?: 'positive' | 'neutral' | 'negative';
          topics?: string[];
          ai_generated?: boolean;
        };
      };
      subscriptions: {
        Row: {
          id: string;
          user_id: string;
          tier: 'free' | 'starter' | 'professional' | 'enterprise';
          status: 'active' | 'cancelled' | 'past_due';
          current_period_start: string;
          current_period_end: string;
          cancel_at_period_end: boolean;
          payment_method_id?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          tier: 'free' | 'starter' | 'professional' | 'enterprise';
          status?: 'active' | 'cancelled' | 'past_due';
          current_period_start: string;
          current_period_end: string;
          cancel_at_period_end?: boolean;
          payment_method_id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          tier?: 'free' | 'starter' | 'professional' | 'enterprise';
          status?: 'active' | 'cancelled' | 'past_due';
          current_period_start?: string;
          current_period_end?: string;
          cancel_at_period_end?: boolean;
          payment_method_id?: string;
          updated_at?: string;
        };
      };
    };
  };
}

export type User = Database['public']['Tables']['users']['Row'];
export type Meeting = Database['public']['Tables']['meetings']['Row'];
export type ActionItem = Database['public']['Tables']['action_items']['Row'];
export type Transcript = Database['public']['Tables']['transcripts']['Row'];
export type Summary = Database['public']['Tables']['summaries']['Row'];
export type Subscription = Database['public']['Tables']['subscriptions']['Row'];
