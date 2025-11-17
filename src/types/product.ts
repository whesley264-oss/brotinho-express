export type ProductCategory = 'pizza' | 'drink' | 'combo' | 'promo';

export interface Addon {
  id: string;
  name: {
    pt: string;
    en: string;
    es: string;
  };
  price: number;
}

export interface Product {
  id: string;
  name: {
    pt: string;
    en: string;
    es: string;
  };
  description: {
    pt: string;
    en: string;
    es: string;
  };
  price: number;
  originalPrice?: number;
  image: string;
  category: ProductCategory;
  hasAddons?: boolean;
  items?: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  addons?: Addon[];
  totalPrice: number;
}
