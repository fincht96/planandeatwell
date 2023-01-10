export interface Ingredient {
  id?: number;
  name: string;
  pricePerUnit: number;
  productId: number;
  categoryId: number;
  supermarketId: number;
  baseValue: number;
  unit: string;
}
