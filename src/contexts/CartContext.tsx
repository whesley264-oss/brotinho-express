import React, { createContext, useContext, useState } from 'react';
import { CartItem, Product, Addon } from '@/types/product';

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, addons?: Addon[]) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  totalPrice: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = (product: Product, addons: Addon[] = []) => {
    const addonsPrice = addons.reduce((sum, addon) => sum + addon.price, 0);
    const totalPrice = product.price + addonsPrice;

    setItems(prev => {
      const existingIndex = prev.findIndex(
        item => item.product.id === product.id && 
        JSON.stringify(item.addons) === JSON.stringify(addons)
      );

      if (existingIndex >= 0) {
        const newItems = [...prev];
        newItems[existingIndex] = {
          ...newItems[existingIndex],
          quantity: newItems[existingIndex].quantity + 1,
          totalPrice: totalPrice * (newItems[existingIndex].quantity + 1)
        };
        return newItems;
      }

      return [...prev, { product, quantity: 1, addons, totalPrice }];
    });
  };

  const removeItem = (productId: string) => {
    setItems(prev => prev.filter(item => item.product.id !== productId));
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalPrice = items.reduce((sum, item) => sum + item.totalPrice, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, clearCart, totalPrice, itemCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};
