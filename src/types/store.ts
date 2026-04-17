export type CakeCardItem = {
  id: number;
  slug: string;
  name: string;
  description: string;
  imageUrl: string;
  weightGrams: number;
  price: number;
};

export type CartItem = {
  cakeId: number;
  name: string;
  imageUrl: string;
  price: number;
  weightGrams: number;
  quantity: number;
};

