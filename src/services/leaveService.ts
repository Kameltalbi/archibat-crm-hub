
import { supabase } from "@/lib/supabase";

export interface Employee {
  id: string;
  name: string;
  email: string;
  leave_balance: number;
  created_at: string;
  updated_at: string;
}

export interface LeaveRequest {
  id: string;
  employee_id: string;
  start_date: string;
  end_date: string;
  days_requested: number;
  reason: string | null;
  status: "pending" | "approved" | "rejected";
  created_at: string;
  updated_at: string;
}

export const leaveService = {
  // Employés
  async createEmployee(employee: Omit<Employee, "id" | "created_at" | "updated_at">): Promise<Employee | null> {
    const { data, error } = await supabase
      .from("employees")
      .insert(employee)
      .select()
      .single();
      
    if (error) {
      console.error("Erreur lors de la création de l'employé:", error);
      return null;
    }
    
    return data;
  },
  
  async getEmployeeById(id: string): Promise<Employee | null> {
    const { data, error } = await supabase
      .from("employees")
      .select("*")
      .eq("id", id)
      .maybeSingle();
      
    if (error) {
      console.error("Erreur lors de la récupération de l'employé:", error);
      return null;
    }
    
    return data;
  },
  
  async getAllEmployees(): Promise<Employee[]> {
    const { data, error } = await supabase
      .from("employees")
      .select("*")
      .order("name");
      
    if (error) {
      console.error("Erreur lors de la récupération des employés:", error);
      return [];
    }
    
    return data || [];
  },
  
  async updateEmployee(id: string, updates: Partial<Employee>): Promise<boolean> {
    const { error } = await supabase
      .from("employees")
      .update(updates)
      .eq("id", id);
      
    if (error) {
      console.error("Erreur lors de la mise à jour de l'employé:", error);
      return false;
    }
    
    return true;
  },
  
  async deleteEmployee(id: string): Promise<boolean> {
    const { error } = await supabase
      .from("employees")
      .delete()
      .eq("id", id);
      
    if (error) {
      console.error("Erreur lors de la suppression de l'employé:", error);
      return false;
    }
    
    return true;
  },
  
  // Demandes de congés
  async createLeaveRequest(leaveRequest: Omit<LeaveRequest, "id" | "created_at" | "updated_at" | "status">): Promise<LeaveRequest | null> {
    const { data, error } = await supabase
      .from("leave_requests")
      .insert({ ...leaveRequest, status: "pending" })
      .select()
      .single();
      
    if (error) {
      console.error("Erreur lors de la création de la demande de congé:", error);
      return null;
    }
    
    return data;
  },
  
  async getLeaveRequestById(id: string): Promise<LeaveRequest | null> {
    const { data, error } = await supabase
      .from("leave_requests")
      .select("*")
      .eq("id", id)
      .maybeSingle();
      
    if (error) {
      console.error("Erreur lors de la récupération de la demande de congé:", error);
      return null;
    }
    
    return data;
  },
  
  async getLeaveRequestsByEmployeeId(employeeId: string): Promise<LeaveRequest[]> {
    const { data, error } = await supabase
      .from("leave_requests")
      .select("*")
      .eq("employee_id", employeeId)
      .order("created_at", { ascending: false });
      
    if (error) {
      console.error("Erreur lors de la récupération des demandes de congé:", error);
      return [];
    }
    
    return data || [];
  },
  
  async getAllLeaveRequests(): Promise<LeaveRequest[]> {
    const { data, error } = await supabase
      .from("leave_requests")
      .select("*, employees(name, email)")
      .order("created_at", { ascending: false });
      
    if (error) {
      console.error("Erreur lors de la récupération des demandes de congé:", error);
      return [];
    }
    
    return data || [];
  },
  
  async updateLeaveRequestStatus(id: string, status: "approved" | "rejected"): Promise<boolean> {
    const { error } = await supabase
      .from("leave_requests")
      .update({ status })
      .eq("id", id);
      
    if (error) {
      console.error("Erreur lors de la mise à jour du statut de la demande:", error);
      return false;
    }
    
    return true;
  },
  
  async deleteLeaveRequest(id: string): Promise<boolean> {
    const { error } = await supabase
      .from("leave_requests")
      .delete()
      .eq("id", id);
      
    if (error) {
      console.error("Erreur lors de la suppression de la demande de congé:", error);
      return false;
    }
    
    return true;
  },
  
  // Vérifier si l'utilisateur courant est un employé
  async getCurrentEmployee(): Promise<Employee | null> {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) return null;
    
    const userId = session.user.id;
    
    const { data, error } = await supabase
      .from("employees")
      .select("*")
      .eq("id", userId)
      .maybeSingle();
      
    if (error || !data) {
      console.error("Erreur ou employé non trouvé:", error);
      return null;
    }
    
    return data;
  }
};
