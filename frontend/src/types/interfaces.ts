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

export interface ICartItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface ICart {
  userId: string;
  items: ICartItem[];
  total: number;
}
