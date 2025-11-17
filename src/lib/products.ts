import { Product, Addon } from '@/types/product';

export const addons: Addon[] = [
  {
    id: 'extra-cheese',
    name: { pt: 'Queijo Extra', en: 'Extra Cheese', es: 'Queso Extra' },
    price: 3.00
  },
  {
    id: 'olives',
    name: { pt: 'Azeitonas', en: 'Olives', es: 'Aceitunas' },
    price: 2.00
  },
  {
    id: 'egg',
    name: { pt: 'Ovo', en: 'Egg', es: 'Huevo' },
    price: 2.50
  },
  {
    id: 'corn',
    name: { pt: 'Milho', en: 'Corn', es: 'Maíz' },
    price: 2.00
  },
  {
    id: 'tomato',
    name: { pt: 'Tomate', en: 'Tomato', es: 'Tomate' },
    price: 1.50
  },
  {
    id: 'onion',
    name: { pt: 'Cebola', en: 'Onion', es: 'Cebolla' },
    price: 1.50
  },
  {
    id: 'oregano',
    name: { pt: 'Orégano Extra', en: 'Extra Oregano', es: 'Orégano Extra' },
    price: 0.50
  }
];

export const products: Product[] = [
  // Pizzas
  {
    id: 'pizza-mussarela',
    name: { pt: 'Brotinho de Mussarela', en: 'Mozzarella Mini Pizza', es: 'Mini Pizza de Mozzarella' },
    description: { 
      pt: 'Molho de tomate, mussarela de primeira qualidade e orégano',
      en: 'Tomato sauce, premium mozzarella and oregano',
      es: 'Salsa de tomate, mozzarella de primera calidad y orégano'
    },
    price: 15.90,
    image: '/pizzas/mussarela.jpg',
    category: 'pizza',
    hasAddons: true
  },
  {
    id: 'pizza-calabresa',
    name: { pt: 'Brotinho de Calabresa', en: 'Pepperoni Mini Pizza', es: 'Mini Pizza de Calabresa' },
    description: { 
      pt: 'Molho de tomate, calabresa especial, cebola e mussarela',
      en: 'Tomato sauce, special pepperoni, onion and mozzarella',
      es: 'Salsa de tomate, calabresa especial, cebolla y mozzarella'
    },
    price: 17.90,
    image: '/pizzas/calabresa.jpg',
    category: 'pizza',
    hasAddons: true
  },
  {
    id: 'pizza-mista',
    name: { pt: 'Brotinho Mista', en: 'Ham & Cheese Mini Pizza', es: 'Mini Pizza Mixta' },
    description: { 
      pt: 'Molho de tomate, presunto, mussarela e orégano',
      en: 'Tomato sauce, ham, mozzarella and oregano',
      es: 'Salsa de tomate, jamón, mozzarella y orégano'
    },
    price: 16.90,
    image: '/pizzas/mista.jpg',
    category: 'pizza',
    hasAddons: true
  },
  {
    id: 'pizza-milho',
    name: { pt: 'Brotinho de Milho', en: 'Corn Mini Pizza', es: 'Mini Pizza de Maíz' },
    description: { 
      pt: 'Molho de tomate, milho verde, mussarela e orégano',
      en: 'Tomato sauce, sweet corn, mozzarella and oregano',
      es: 'Salsa de tomate, maíz, mozzarella y orégano'
    },
    price: 16.90,
    image: '/pizzas/milho.jpg',
    category: 'pizza',
    hasAddons: true
  },
  // Bebidas
  {
    id: 'drink-coca',
    name: { pt: 'Coca-Cola 250ml', en: 'Coca-Cola 250ml', es: 'Coca-Cola 250ml' },
    description: { 
      pt: 'Refrigerante gelado',
      en: 'Cold soda',
      es: 'Refresco frío'
    },
    price: 4.50,
    image: '/drinks/coca.jpg',
    category: 'drink'
  },
  {
    id: 'drink-guarana',
    name: { pt: 'Guaraná 250ml', en: 'Guaraná 250ml', es: 'Guaraná 250ml' },
    description: { 
      pt: 'Refrigerante gelado',
      en: 'Cold soda',
      es: 'Refresco frío'
    },
    price: 4.00,
    image: '/drinks/guarana.jpg',
    category: 'drink'
  },
  {
    id: 'drink-fanta',
    name: { pt: 'Fanta Laranja 250ml', en: 'Fanta Orange 250ml', es: 'Fanta Naranja 250ml' },
    description: { 
      pt: 'Refrigerante gelado',
      en: 'Cold soda',
      es: 'Refresco frío'
    },
    price: 4.00,
    image: '/drinks/fanta.jpg',
    category: 'drink'
  },
  {
    id: 'drink-water',
    name: { pt: 'Água Mineral 500ml', en: 'Mineral Water 500ml', es: 'Agua Mineral 500ml' },
    description: { 
      pt: 'Água mineral gelada',
      en: 'Cold mineral water',
      es: 'Agua mineral fría'
    },
    price: 3.00,
    image: '/drinks/water.jpg',
    category: 'drink'
  },
  {
    id: 'drink-lemon',
    name: { pt: 'Refrigerante Limão 250ml', en: 'Lemon Soda 250ml', es: 'Refresco de Limón 250ml' },
    description: { 
      pt: 'Refrigerante gelado sabor limão',
      en: 'Cold lemon flavored soda',
      es: 'Refresco frío sabor limón'
    },
    price: 4.00,
    image: '/drinks/lemon.jpg',
    category: 'drink'
  },
  // Combos
  {
    id: 'combo-1',
    name: { pt: 'Combo Duplo', en: 'Double Combo', es: 'Combo Doble' },
    description: { 
      pt: '2 Brotinhos + 2 Refrigerantes 250ml',
      en: '2 Mini Pizzas + 2 Sodas 250ml',
      es: '2 Mini Pizzas + 2 Refrescos 250ml'
    },
    price: 35.00,
    originalPrice: 40.00,
    image: '/combos/combo1.jpg',
    category: 'combo',
    items: ['2 Brotinhos', '2 Bebidas 250ml']
  },
  {
    id: 'combo-2',
    name: { pt: 'Combo Família', en: 'Family Combo', es: 'Combo Familiar' },
    description: { 
      pt: '4 Brotinhos + 4 Refrigerantes 250ml',
      en: '4 Mini Pizzas + 4 Sodas 250ml',
      es: '4 Mini Pizzas + 4 Refrescos 250ml'
    },
    price: 65.00,
    originalPrice: 75.00,
    image: '/combos/combo2.jpg',
    category: 'combo',
    items: ['4 Brotinhos', '4 Bebidas 250ml']
  },
  // Promoções
  {
    id: 'promo-1',
    name: { pt: 'Promoção Especial', en: 'Special Deal', es: 'Oferta Especial' },
    description: { 
      pt: '3 Brotinhos de Mussarela por um preço especial!',
      en: '3 Mozzarella Mini Pizzas for a special price!',
      es: '¡3 Mini Pizzas de Mozzarella a precio especial!'
    },
    price: 39.90,
    originalPrice: 47.70,
    image: '/promos/promo1.jpg',
    category: 'promo'
  },
  {
    id: 'promo-2',
    name: { pt: 'Terça da Pizza', en: 'Pizza Tuesday', es: 'Martes de Pizza' },
    description: { 
      pt: 'Qualquer brotinho + bebida por apenas R$ 18,90!',
      en: 'Any mini pizza + drink for only R$ 18.90!',
      es: '¡Cualquier mini pizza + bebida por solo R$ 18,90!'
    },
    price: 18.90,
    originalPrice: 22.40,
    image: '/promos/promo2.jpg',
    category: 'promo'
  }
];
