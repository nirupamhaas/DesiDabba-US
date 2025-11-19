
import { MenuItem, FoodCategory } from '../types';

export const FULL_MENU: MenuItem[] = [
  {
    id: 'r1',
    name: 'Bagara Rice / Pulav',
    description: 'Aromatic basmati rice cooked with whole spices, mint, and coriander.',
    price: 8.99,
    category: FoodCategory.RICE,
    imageUrl: 'https://images.unsplash.com/photo-1645177628172-a94c1f96e6db?auto=format&fit=crop&w=600&q=80',
    tags: ['rice', 'vegetarian', 'mild', 'aromatic', 'gluten-free'],
    popular: true,
    dealType: 'rice-option'
  },
  {
    id: 'r2',
    name: 'Steamed White Rice',
    description: 'Fluffy, perfectly steamed premium sona masoori rice.',
    price: 4.99,
    category: FoodCategory.RICE,
    imageUrl: 'https://images.unsplash.com/photo-1516684732162-798a0062be99?auto=format&fit=crop&w=600&q=80',
    tags: ['rice', 'vegetarian', 'vegan', 'plain', 'gluten-free', 'staple'],
    dealType: 'rice-option'
  },
  {
    id: 'b1',
    name: 'Roti',
    description: 'Whole wheat flatbread baked in a traditional clay oven.',
    price: 2.49,
    category: FoodCategory.BREADS,
    imageUrl: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=600&q=80',
    tags: ['bread', 'vegetarian', 'vegan', 'healthy', 'tandoori'],
    dealType: 'standard-all'
  },
  {
    id: 'c1',
    name: 'Dal',
    description: 'Yellow lentils tempered with ghee, cumin, garlic, and red chilies.',
    price: 9.99,
    category: FoodCategory.CURRIES,
    imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80',
    tags: ['lentils', 'vegetarian', 'protein', 'gluten-free', 'mild', 'comfort food'],
    dealType: 'standard-all'
  },
  {
    id: 's1',
    name: 'Rasam',
    description: 'A spicy, tangy, and warming thin soup.',
    price: 5.99,
    category: FoodCategory.SIDES,
    imageUrl: 'https://images.unsplash.com/photo-1547592166-23acbe276819?auto=format&fit=crop&w=600&q=80',
    tags: ['soup', 'vegetarian', 'vegan', 'spicy', 'tangy', 'healthy', 'gluten-free'],
    dealType: 'standard-all'
  },
  {
    id: 's2',
    name: 'Curd',
    description: 'Thick, creamy homemade plain yogurt.',
    price: 3.49,
    category: FoodCategory.SIDES,
    imageUrl: 'https://images.unsplash.com/photo-1571212515416-f785636cb286?auto=format&fit=crop&w=600&q=80',
    tags: ['yogurt', 'vegetarian', 'cooling', 'side', 'gluten-free'],
    dealType: 'standard-all'
  },
  {
    id: 'd1',
    name: 'Sweet',
    description: 'Chef\'s special dessert of the day (e.g., Gulab Jamun).',
    price: 5.99,
    category: FoodCategory.DESSERTS,
    imageUrl: 'https://images.unsplash.com/photo-1593701461250-d71b2228f859?auto=format&fit=crop&w=600&q=80',
    tags: ['dessert', 'sweet', 'vegetarian', 'indulgent'],
    dealType: 'standard-all'
  },
  {
    id: 'st1',
    name: 'Veg Fry',
    description: 'Assorted vegetables dry-fried with aromatic spices.',
    price: 8.99,
    category: FoodCategory.SIDES,
    imageUrl: 'https://images.unsplash.com/photo-1605333396915-476615d762a9?auto=format&fit=crop&w=600&q=80',
    tags: ['starter', 'vegetarian', 'vegan', 'crispy', 'spicy'],
    dealType: 'standard-veg'
  },
  {
    id: 'c3',
    name: 'Veg Curry',
    description: 'Seasonal vegetables simmered in a rich, spiced gravy.',
    price: 12.99,
    category: FoodCategory.CURRIES,
    imageUrl: 'https://images.unsplash.com/photo-1585937421612-70a008356f36?auto=format&fit=crop&w=600&q=80',
    tags: ['vegetables', 'vegetarian', 'mild', 'creamy', 'gravy', 'gluten-free'],
    dealType: 'standard-veg'
  },
  {
    id: 'st2',
    name: 'Non Veg Fry',
    description: 'Spicy, crispy deep-fried chicken starter.',
    price: 13.99,
    category: FoodCategory.SIDES,
    imageUrl: 'https://images.unsplash.com/photo-1567529684892-09290a1b2d05?auto=format&fit=crop&w=600&q=80',
    tags: ['starter', 'chicken', 'non-veg', 'spicy', 'crispy', 'popular'],
    dealType: 'standard-non-veg'
  },
  {
    id: 'c2',
    name: 'Non Veg Curry',
    description: 'Spicy, rich Andhra style chicken gravy.',
    price: 14.99,
    category: FoodCategory.CURRIES,
    imageUrl: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=600&q=80',
    tags: ['chicken', 'non-veg', 'spicy', 'gravy', 'gluten-free'],
    dealType: 'standard-non-veg'
  }
];
