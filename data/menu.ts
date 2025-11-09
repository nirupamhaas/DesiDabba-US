
import { MenuItem, FoodCategory } from '../types';

export const FULL_MENU: MenuItem[] = [
  {
    id: 'r1',
    name: 'Bagara Rice / Pulav',
    description: 'Aromatic basmati rice cooked with whole spices, mint, and coriander.',
    price: 8.99,
    category: FoodCategory.RICE,
    imageUrl: 'https://loremflickr.com/600/400/biryani,rice?random=1',
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
    imageUrl: 'https://loremflickr.com/600/400/white,rice?random=2',
    tags: ['rice', 'vegetarian', 'vegan', 'plain', 'gluten-free', 'staple'],
    dealType: 'rice-option'
  },
  {
    id: 'b1',
    name: 'Roti',
    description: 'Whole wheat flatbread baked in a traditional clay oven.',
    price: 2.49,
    category: FoodCategory.BREADS,
    imageUrl: 'https://loremflickr.com/600/400/roti,chapati?random=3',
    tags: ['bread', 'vegetarian', 'vegan', 'healthy', 'tandoori'],
    dealType: 'standard-all'
  },
  {
    id: 'c1',
    name: 'Dal',
    description: 'Yellow lentils tempered with ghee, cumin, garlic, and red chilies.',
    price: 9.99,
    category: FoodCategory.CURRIES,
    imageUrl: 'https://loremflickr.com/600/400/dal,tadka?random=4',
    tags: ['lentils', 'vegetarian', 'protein', 'gluten-free', 'mild', 'comfort food'],
    dealType: 'standard-all'
  },
  {
    id: 's1',
    name: 'Rasam',
    description: 'A spicy, tangy, and warming thin soup.',
    price: 5.99,
    category: FoodCategory.SIDES,
    imageUrl: 'https://loremflickr.com/600/400/rasam,soup?random=5',
    tags: ['soup', 'vegetarian', 'vegan', 'spicy', 'tangy', 'healthy', 'gluten-free'],
    dealType: 'standard-all'
  },
  {
    id: 's2',
    name: 'Curd',
    description: 'Thick, creamy homemade plain yogurt.',
    price: 3.49,
    category: FoodCategory.SIDES,
    imageUrl: 'https://loremflickr.com/600/400/yogurt,curd?random=6',
    tags: ['yogurt', 'vegetarian', 'cooling', 'side', 'gluten-free'],
    dealType: 'standard-all'
  },
  {
    id: 'd1',
    name: 'Sweet',
    description: 'Chef\'s special dessert of the day (e.g., Gulab Jamun).',
    price: 5.99,
    category: FoodCategory.DESSERTS,
    imageUrl: 'https://loremflickr.com/600/400/gulabjamun,indian,sweet?random=7',
    tags: ['dessert', 'sweet', 'vegetarian', 'indulgent'],
    dealType: 'standard-all'
  },
  {
    id: 'st1',
    name: 'Veg Fry',
    description: 'Assorted vegetables dry-fried with aromatic spices.',
    price: 8.99,
    category: FoodCategory.SIDES,
    imageUrl: 'https://loremflickr.com/600/400/vegetable,fry,indian?random=8',
    tags: ['starter', 'vegetarian', 'vegan', 'crispy', 'spicy'],
    dealType: 'standard-veg'
  },
  {
    id: 'c3',
    name: 'Veg Curry',
    description: 'Seasonal vegetables simmered in a rich, spiced gravy.',
    price: 12.99,
    category: FoodCategory.CURRIES,
    imageUrl: 'https://loremflickr.com/600/400/vegetable,curry,indian?random=9',
    tags: ['vegetables', 'vegetarian', 'mild', 'creamy', 'gravy', 'gluten-free'],
    dealType: 'standard-veg'
  },
  {
    id: 'st2',
    name: 'Non Veg Fry',
    description: 'Spicy, crispy deep-fried chicken starter.',
    price: 13.99,
    category: FoodCategory.SIDES,
    imageUrl: 'https://loremflickr.com/600/400/chicken,fry,indian?random=10',
    tags: ['starter', 'chicken', 'non-veg', 'spicy', 'crispy', 'popular'],
    dealType: 'standard-non-veg'
  },
  {
    id: 'c2',
    name: 'Non Veg Curry',
    description: 'Spicy, rich Andhra style chicken gravy.',
    price: 14.99,
    category: FoodCategory.CURRIES,
    imageUrl: 'https://loremflickr.com/600/400/chicken,curry,indian?random=11',
    tags: ['chicken', 'non-veg', 'spicy', 'gravy', 'gluten-free'],
    dealType: 'standard-non-veg'
  }
];
