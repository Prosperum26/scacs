import { createClient } from '@supabase/supabase-js';
import { config } from './environment';

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          name: string;
          role: 'student' | 'faculty' | 'staff';
          department: string;
          status: 'active' | 'inactive' | 'suspended';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          name: string;
          role: 'student' | 'faculty' | 'staff';
          department: string;
          status?: 'active' | 'inactive' | 'suspended';
        };
        Update: {
          name?: string;
          role?: 'student' | 'faculty' | 'staff';
          department?: string;
          status?: 'active' | 'inactive' | 'suspended';
          updated_at?: string;
        };
        Relationships: [];
      };
      access_logs: {
        Row: {
          id: string;
          user_id: string;
          user_name: string;
          gate: string;
          result: 'GRANTED' | 'DENIED';
          timestamp: string;
        };
        Insert: {
          id: string;
          user_id: string;
          user_name: string;
          gate?: string;
          result: 'GRANTED' | 'DENIED';
          timestamp?: string;
        };
        Update: never;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

const supabaseUrl = config.database.supabaseUrl;
const supabaseKey = config.database.supabaseServiceRoleKey || config.database.supabaseKey;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase configuration is missing. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY or SUPABASE_KEY.');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});
