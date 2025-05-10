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
  // Added fields for client contacts
  vat_code?: string | null;
  contact1_name?: string | null;
  contact1_position?: string | null;
  contact1_email?: string | null;
  contact1_phone?: string | null;
  contact2_name?: string | null;
  contact2_position?: string | null;
  contact2_email?: string | null;
  contact2_phone?: string | null;
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

export type ProjectStatus = 'En cours' | 'Planifié' | 'Terminé' | 'Suspendu';

export interface Project {
  id: string;
  name: string;
  client_id: string | null;
  description: string | null;
  start_date: string | null;
  end_date: string | null;
  status: ProjectStatus | null;
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

// Nouvelles interfaces pour les utilisateurs, rôles et permissions
export type AppRole = 'admin' | 'collaborateur' | 'lecture_seule';

export interface UserRole {
  id: string;
  user_id: string;
  role: AppRole;
  created_at: string;
}

export interface RolePermission {
  id: string;
  role: AppRole;
  module_id: string;
  can_access: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserWithRole {
  id: string;
  name: string;
  email: string;
  role: AppRole;
  status: "active" | "pending";
}
