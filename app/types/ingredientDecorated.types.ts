// containts added unitQuantity and price properties
export interface IngredientDecorated {
  id: number;
  name: string;
  price: number;
  pricePerUnit: number;
  unitQuantity: number;
  categoryName: string;
  scalarQuantity: number;
  unit: string;
}
