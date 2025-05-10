
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';

// Importer le client Supabase comme ceci:
// import { supabase } from "@/lib/supabase";

const SUPABASE_URL = "https://wcpeseyhecsbydcmdmjj.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndjcGVzZXloZWNzYnlkY21kbWpqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY4ODcyNzUsImV4cCI6MjA2MjQ2MzI3NX0.fZ4GaZayHbaWnxIQGZGUkPcZg5V2fwGzrZZE-abSXnE";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_KEY);

// Types pour les entités basées sur les tables Supabase
export interface Category {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface Client {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  name: string;
  client_id: string | null;
  description: string | null;
  start_date: string | null;
  end_date: string | null;
  status: 'En cours' | 'Planifié' | 'Terminé' | 'Suspendu';
  category: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProjectProduct {
  id: string;
  project_id: string;
  product_id: string;
  quantity: number;
  price_at_time: number;
  created_at: string;
}
