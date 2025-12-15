import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Todo {
  id: string;
  user_id: string;
  title: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High';
  completed: boolean;
  due_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface TimetableEntry {
  id: string;
  user_id: string;
  day: string;
  subject: string;
  start_time: string;
  end_time: string;
  location: string;
  color: string;
  created_at: string;
}

export interface Note {
  id: string;
  user_id: string;
  title: string;
  content: string;
  category: string;
  created_at: string;
  updated_at: string;
}
