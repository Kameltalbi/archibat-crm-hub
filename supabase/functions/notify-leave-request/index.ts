
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Types pour les requêtes
interface LeaveRequestNotification {
  type: "new" | "status_change";
  employeeName: string;
  employeeEmail: string;
  startDate: string;
  endDate: string;
  daysRequested: number;
  status?: "approved" | "rejected";
}

const handler = async (req: Request): Promise<Response> => {
  // Gérer les requêtes CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, employeeName, employeeEmail, startDate, endDate, daysRequested, status } = await req.json() as LeaveRequestNotification;

    // Créer le contenu de l'email en fonction du type de notification
    let emailSubject = "";
    let emailContent = "";
    let toEmail = "";

    if (type === "new") {
      // Notification à l'administrateur pour une nouvelle demande
      emailSubject = `Nouvelle demande de congé de ${employeeName}`;
      emailContent = `
        <h2>Nouvelle demande de congé</h2>
        <p><strong>Employé:</strong> ${employeeName} (${employeeEmail})</p>
        <p><strong>Date de début:</strong> ${startDate}</p>
        <p><strong>Date de fin:</strong> ${endDate}</p>
        <p><strong>Jours demandés:</strong> ${daysRequested}</p>
        <p>Veuillez vous connecter au système pour approuver ou rejeter cette demande.</p>
      `;
      toEmail = "kameltalbi.tn@gmail.com"; // Email de l'administrateur
    } else if (type === "status_change" && status) {
      // Notification à l'employé du changement de statut
      emailSubject = `Votre demande de congé a été ${status === "approved" ? "approuvée" : "rejetée"}`;
      emailContent = `
        <h2>Statut de votre demande de congé</h2>
        <p>Votre demande de congé du ${startDate} au ${endDate} a été <strong>${status === "approved" ? "approuvée" : "rejetée"}</strong>.</p>
        ${status === "approved" ? "<p>Nous vous souhaitons de bonnes vacances !</p>" : ""}
      `;
      toEmail = employeeEmail; // Email de l'employé
    }

    // Simuler l'envoi d'email
    console.log("Simulation d'envoi d'email:");
    console.log("À:", toEmail);
    console.log("Sujet:", emailSubject);
    console.log("Contenu:", emailContent);

    // Retourner une réponse réussie
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Notification envoyée avec succès" 
      }),
      { 
        status: 200,
        headers: { 
          "Content-Type": "application/json",
          ...corsHeaders
        }
      }
    );

  } catch (error) {
    console.error("Erreur dans la fonction notify-leave-request:", error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        status: 500,
        headers: { 
          "Content-Type": "application/json",
          ...corsHeaders
        }
      }
    );
  }
};

serve(handler);
