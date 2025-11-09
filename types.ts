
export enum FoodCategory {
    RICE = 'Rice Specials',
    BREADS = 'Breads',
    CURRIES = 'Curries',
    SIDES = 'Sides & Starters',
    DESSERTS = 'Desserts'
  }
  
  export type DealType = 'rice-option' | 'standard-all' | 'standard-veg' | 'standard-non-veg';

  export interface MenuItem {
    id: string;
    name: string;
    description: string;
    price: number;
    category: FoodCategory | 'Meal Deal';
    imageUrl: string;
    tags: string[]; // For AI matching (e.g., "spicy", "vegetarian", "gluten-free", "non-veg")
    popular?: boolean;
    dealType?: DealType;
  }
  
  export interface CartItem extends MenuItem {
    quantity: number;
    components?: MenuItem[]; // For combo meals
  }
  
  export interface CartContextType {
    items: CartItem[];
    addToCart: (item: CartItem) => void;
    removeFromCart: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
    cartTotal: number;
    itemCount: number;
    isCartOpen: boolean;
    setIsCartOpen: (isOpen: boolean) => void;
  }

  // AI related types
  export interface AISearchResult {
    itemIds: string[];
    reasoning: string;
  }
