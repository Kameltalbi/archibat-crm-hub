import { useState } from "react";
import * as XLSX from "xlsx";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { Client } from "@/lib/supabase";
import { clientService } from "@/services/clientService";
import { FileSpreadsheet, Upload, AlertCircle } from "lucide-react";

interface ImportClientsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClientsImported: () => void;
}

interface ImportedClient {
  name: string;
  email?: string;
  phone?: string;
  address?: string;
}

const ImportClientsModal = ({ open, onOpenChange, onClientsImported }: ImportClientsModalProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<ImportedClient[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<"upload" | "preview" | "importing">("upload");
  const [errors, setErrors] = useState<string[]>([]);
  const { toast } = useToast();

  const resetState = () => {
    setFile(null);
    setParsedData([]);
    setStep("upload");
    setErrors([]);
    setIsLoading(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      readExcelFile(selectedFile);
    }
  };

  const readExcelFile = (file: File) => {
    setIsLoading(true);
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json<ImportedClient>(worksheet);
        
        const newErrors: string[] = [];
        
        // Validation des données
        const validData = jsonData.filter((row, index) => {
          if (!row.name) {
            newErrors.push(`Ligne ${index + 2}: Nom manquant`);
            return false;
          }
          return true;
        });
        
        setParsedData(validData);
        setErrors(newErrors);
        setStep("preview");
        setIsLoading(false);
      } catch (error) {
        console.error("Erreur lors de la lecture du fichier:", error);
        toast({
          variant: "destructive",
          title: "Erreur de fichier",
          description: "Le fichier n'a pas pu être lu. Vérifiez qu'il s'agit d'un fichier Excel valide."
        });
        setIsLoading(false);
      }
    };
    
    reader.onerror = () => {
      toast({
        variant: "destructive",
        title: "Erreur de fichier",
        description: "Le fichier n'a pas pu être lu."
      });
      setIsLoading(false);
    };
    
    reader.readAsArrayBuffer(file);
  };

  const handleImport = async () => {
    if (parsedData.length === 0) return;
    
    setStep("importing");
    setIsLoading(true);
    
    try {
      // Transformation des données pour l'importation
      const clientsToImport = parsedData.map(client => ({
        name: client.name,
        email: client.email || null,
        phone: client.phone || null,
        address: client.address || null,
        // Add null values for all the required fields from the Client type
        vat_code: null,
        contact1_name: null,
        contact1_position: null, 
        contact1_email: null,
        contact1_phone: null,
        contact2_name: null,
        contact2_position: null,
        contact2_email: null,
        contact2_phone: null
      }));
      
      // Insertion des clients par lot
      for (const client of clientsToImport) {
        await clientService.createClient(client);
      }
      
      toast({
        title: "Importation réussie",
        description: `${clientsToImport.length} clients ont été importés avec succès.`
      });
      
      // Fermeture du modal et rafraîchissement de la liste
      onOpenChange(false);
      onClientsImported();
      resetState();
    } catch (error) {
      console.error("Erreur lors de l'importation:", error);
      toast({
        variant: "destructive",
        title: "Erreur d'importation",
        description: "Une erreur s'est produite lors de l'importation des clients. Veuillez réessayer."
      });
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onOpenChange(false);
      resetState();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Importer des clients</DialogTitle>
          <DialogDescription>
            Importez vos clients à partir d'un fichier Excel
          </DialogDescription>
        </DialogHeader>

        {step === "upload" && (
          <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg">
            <FileSpreadsheet className="w-12 h-12 mb-4 text-muted-foreground" />
            <p className="mb-4 text-center text-sm text-muted-foreground">
              Le fichier doit contenir les colonnes suivantes: name (obligatoire), email, phone, address
            </p>
            <input
              id="file-upload"
              type="file"
              className="block w-full text-sm text-slate-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-primary file:text-primary-foreground
                hover:file:bg-primary/90 cursor-pointer"
              accept=".xlsx,.xls"
              onChange={handleFileChange}
              disabled={isLoading}
            />
          </div>
        )}

        {step === "preview" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p>
                <span className="font-semibold">{file?.name}</span>
                <span className="text-muted-foreground ml-2">
                  ({parsedData.length} clients)
                </span>
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setStep("upload")}
              >
                Changer de fichier
              </Button>
            </div>

            {errors.length > 0 && (
              <div className="bg-destructive/10 p-3 rounded-md border border-destructive/20 text-sm">
                <div className="flex items-center gap-2 font-semibold text-destructive mb-2">
                  <AlertCircle className="h-4 w-4" />
                  <span>Erreurs de validation ({errors.length})</span>
                </div>
                <ul className="list-disc pl-5 text-destructive/80 space-y-1 max-h-24 overflow-y-auto">
                  {errors.map((error, i) => (
                    <li key={i}>{error}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="border rounded-md max-h-64 overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted">
                  <tr>
                    <th className="py-2 px-3 text-left font-medium">Nom</th>
                    <th className="py-2 px-3 text-left font-medium">Email</th>
                    <th className="py-2 px-3 text-left font-medium">Téléphone</th>
                    <th className="py-2 px-3 text-left font-medium">Adresse</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {parsedData.slice(0, 5).map((client, index) => (
                    <tr key={index}>
                      <td className="py-2 px-3">{client.name}</td>
                      <td className="py-2 px-3">{client.email || '-'}</td>
                      <td className="py-2 px-3">{client.phone || '-'}</td>
                      <td className="py-2 px-3">{client.address || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {parsedData.length > 5 && (
                <div className="p-2 text-center text-muted-foreground text-xs">
                  + {parsedData.length - 5} autres clients
                </div>
              )}
            </div>
          </div>
        )}

        <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            Annuler
          </Button>
          {step === "preview" && (
            <Button onClick={handleImport} disabled={isLoading}>
              {isLoading ? "Importation en cours..." : "Importer les clients"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ImportClientsModal;
