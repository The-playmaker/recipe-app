import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Recipe = {
  id: string;
  name: string;
  category: string;
  image_url: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  time_minutes: number;
  ingredients: string[];
  instructions: string[];
  description: string;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
};

export type Category = {
  id: string;
  name: string;
  icon: string; // f.eks. 'Wine', 'Coffee', 'Sparkles', 'TrendingUp'
  color: string;
  created_at: string;
};