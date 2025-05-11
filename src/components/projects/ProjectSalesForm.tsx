
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useSalesForm } from "./sales/form/useSalesForm";
import { formatPrice } from "./sales/product-select/utils";
import { ProjectSalesFormProps } from "./sales/form/types";
import ClientField from "./sales/form/ClientField";
import LabelField from "./sales/form/LabelField";
import DatePickerField from "./sales/DatePickerField";
import ProductField from "./sales/form/ProductField";
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
    formData,
    isLoading,
    availableProducts,
    filteredCategory,
    handleChange,
    handleSave,
  } = useSalesForm(projectId, projectCategory, clientId, onSaleAdded);

  return (
    <div className="space-y-4">
      {projectName && (
        <div className="mb-4">
          <p className="text-sm font-medium text-muted-foreground">
            Projet: <span className="font-semibold text-foreground">{projectName}</span>
            {projectCategory && ` - Catégorie: ${projectCategory}`}
            {filteredCategory && ` - Produits filtrés par: ${filteredCategory}`}
          </p>
        </div>
      )}
      
      <div className="grid gap-4">
        {/* Client */}
        <ClientField 
          value={formData.clientId} 
          onChange={(value) => handleChange("clientId", value)} 
          clients={clients} 
        />

        {/* Libellé */}
        <LabelField 
          value={formData.label}
          onChange={(value) => handleChange("label", value)}
        />

        {/* Date */}
        <DatePickerField 
          date={formData.date} 
          onDateChange={(date) => handleChange("date", date || new Date())}
          label="Date de vente *"
        />

        {/* Product */}
        <ProductField 
          value={formData.productId}
          onChange={(value) => handleChange("productId", value)}
          products={availableProducts}
          isLoading={isLoading}
        />

        {/* Amount */}
        <AmountField 
          value={formData.amount}
          onChange={(value) => handleChange("amount", value)}
        />

        {/* Remarks */}
        <RemarksField 
          value={formData.remarks}
          onChange={(value) => handleChange("remarks", value)}
        />
      </div>

      <FormActions 
        onCancel={onCancel}
        onSave={handleSave}
        isLoading={isLoading}
      />
    </div>
  );
};

export default ProjectSalesForm;
