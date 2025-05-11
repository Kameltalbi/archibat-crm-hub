
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { SaleFormData } from './types';
import { supabase } from '@/lib/supabase';

export const useSalesForm = (
  projectId: string,
  clientId?: string,
  onSaleAdded?: () => void
) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Define the form schema with validation rules
  const formSchema = z.object({
    clientId: z.string().optional(),
    date: z.date(),
    amount: z.string().min(1, { message: "Le montant est requis" }),
    productId: z.string().optional(),
    label: z.string().min(1, { message: "Le libellé est requis" }),
    remarks: z.string().optional(),
  });

  // Initialize the form with react-hook-form
  const form = useForm<SaleFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      clientId: clientId || '',
      date: new Date(),
      amount: '',
      productId: '',
      label: '',
      remarks: '',
    },
  });

  const onSubmit = async (data: SaleFormData) => {
    setIsSubmitting(true);
    try {
      // Récupérer les informations du produit sélectionné si disponible
      let productName = null;
      let category = 'Non catégorisé';

      if (data.productId) {
        const { data: productData } = await supabase
          .from('products')
          .select('name, category_id')
          .eq('id', data.productId)
          .single();

        if (productData) {
          productName = productData.name;
          
          // Récupérer la catégorie
          if (productData.category_id) {
            const { data: categoryData } = await supabase
              .from('categories')
              .select('name')
              .eq('id', productData.category_id)
              .single();
            
            if (categoryData) {
              category = categoryData.name;
            }
          }
        }
      }

      // Insérer la vente avec les informations reliées
      const { error } = await supabase
        .from('project_sales')
        .insert({
          project_id: projectId,
          label: data.label,
          amount: parseFloat(data.amount.replace(',', '.')),
          date: data.date.toISOString(),
          client_name: data.clientId ? await getClientName(data.clientId) : null,
          product_name: productName,
          category: category,
          remarks: data.remarks || null
        });

      if (error) throw error;

      // Réinitialiser le formulaire et notifier le succès
      form.reset();
      if (onSaleAdded) onSaleAdded();
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la vente:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper function to get client name from ID
  const getClientName = async (clientId: string): Promise<string | null> => {
    const { data } = await supabase
      .from('clients')
      .select('name')
      .eq('id', clientId)
      .single();
    
    return data ? data.name : null;
  };

  return {
    form,
    onSubmit,
    isSubmitting
  };
};
