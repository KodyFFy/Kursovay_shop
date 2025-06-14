
export interface User {
  id: string;
  email: string;
  username: string;
  isAdmin: boolean;
  createdAt: Date;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  parentId?: string;
  parent?: Category;
  children?: Category[];
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  imageUrl?: string;
  categoryId: string;
  category?: Category;
  isFeatured: boolean;
  isActive: boolean;
  isSold: boolean;
  createdAt: Date;
}

export interface Order {
  id: string;
  userId: string;
  productId: string;
  amount: number;
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  paymentMethod: string;
  licenseKey?: string;
  createdAt: Date;
  user?: User;
  product?: Product;
}

export interface AuthUser {
  id: string;
  email: string;
  username: string;
  isAdmin: boolean;
}
