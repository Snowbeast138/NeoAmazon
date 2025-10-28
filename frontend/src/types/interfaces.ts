export interface IProduct {
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  attributes: Record<string, unknown>;
  createdAt: string;
}
