
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useSalesForm } from "./sales/form/useSalesForm";
import { formatPrice } from "./sales/product-select/utils";
import { ProjectSalesFormProps } from "./sales/form/types";
import ClientField from "./sales/form/ClientField";
import LabelField from "./sales/form/LabelField";
import DatePickerField from "./sales/DatePickerField";
import { ProductField } from "./sales/form/ProductField";
import AmountField from "./sales/form/AmountField";
import RemarksField from "./sales/form/RemarksField";
import FormActions from "./sales/form/FormActions";

const ProjectSalesForm = ({ 
  projectId, 
  projectName,
  projectCategory,
  clientId,
  clients = [],
  onSaleAdded, 
  onCancel 
}: ProjectSalesFormProps) => {
  const {
    form,
    isSubmitting,
    onSubmit
  } = useSalesForm(projectId, projectCategory, clientId, onSaleAdded);

  return (
    <div className="space-y-4">
      {projectName && (
        <div className="mb-4">
          <p className="text-sm font-medium text-muted-foreground">
            Projet: <span className="font-semibold text-foreground">{projectName}</span>
            {projectCategory && ` - Catégorie: ${projectCategory}`}
          </p>
        </div>
      )}
      
      <div className="grid gap-4">
        {/* Client */}
        <ClientField 
          form={form}
          clients={clients} 
        />

        {/* Libellé */}
        <LabelField 
          form={form}
        />

        {/* Date */}
        <DatePickerField 
          form={form}
          name="date"
          label="Date de vente *"
        />

        {/* Product */}
        <ProductField 
          form={form}
          projectCategory={projectCategory}
        />

        {/* Amount */}
        <AmountField 
          form={form}
        />

        {/* Remarks */}
        <RemarksField 
          form={form}
        />
      </div>

      <FormActions 
        onCancel={onCancel}
        onSave={form.handleSubmit(onSubmit)}
        isLoading={isSubmitting}
      />
    </div>
  );
};

export default ProjectSalesForm;
