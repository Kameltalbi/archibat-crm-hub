
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
