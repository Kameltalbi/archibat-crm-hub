
/**
 * Formats a price in Tunisian Dinars
 * @param price - The price to format
 * @returns Formatted price string
 */
export const formatPrice = (price: number) => {
  return new Intl.NumberFormat('fr-FR', { 
    style: 'currency', 
    currency: 'TND',
    minimumFractionDigits: 0
  }).format(price);
};

/**
 * Filters products based on selected products
 * @param products - All available products
 * @param selectedProductIds - IDs of products that are already selected
 * @returns Filtered list of products that are not selected
 */
export const filterAvailableProducts = (products: any[], selectedProductIds: string[]) => {
  return products.filter(
    product => !selectedProductIds.includes(product.id)
  );
};

/**
 * Strictly filters products by project category
 * @param products - All available products
 * @param projectCategory - The project category name
 * @returns Filtered list of products matching the project category
 */
export const filterProductsByProjectCategory = (products: any[], projectCategory: string | undefined) => {
  if (!projectCategory) return products;
  
  // Filter products that match the exact project category
  const filteredProducts = products.filter(product => {
    const productCategory = product.category || product.categories?.name || null;
    return productCategory === projectCategory;
  });
  
  return filteredProducts;
};

/**
 * Maps category names between project categories and product categories
 * for improved product filtering
 * @param projectCategory - The project category name
 * @returns Array of related product category names
 */
export const mapCategoryNames = (projectCategory: string | undefined): string[] => {
  if (!projectCategory) return [];
  
  const categoryMappings: Record<string, string[]> = {
    "Rénovation": ["Travaux", "Services", "Matériaux"],
    "Construction": ["Travaux", "Matériaux", "Services"],
    "Aménagement": ["Services", "Fournitures", "Travaux"],
    "Design": ["Services", "Études", "Conseils"],
    "Études": ["Études", "Services", "Conseils"],
    "Conseils": ["Services", "Conseils", "Études"],
    "Publicité Magazine": ["Publicité", "Publicité Magazine", "Communication"],
    "Publicité": ["Communication", "Marketing", "Publicité Magazine"],
    "Communication": ["Publicité", "Marketing", "Services", "Communication"]
  };
  
  // Return the exact category and any mapped categories
  return [
    projectCategory, 
    ...(categoryMappings[projectCategory] || [])
  ];
};
