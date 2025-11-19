
import React, { useState, createContext, useContext, useEffect, useCallback, useMemo } from 'react';
import { HashRouter, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingBag, Menu as MenuIcon, X, Sparkles, Home, ChevronRight, Minus, Plus, Trash2, CreditCard, CheckCircle, Circle, CheckCircle2, Lock, Truck, Leaf, Droplet } from 'lucide-react';
import { MenuItem, CartItem, CartContextType } from './types';
import { FULL_MENU } from './data/menu';
import { saveImageToDb, getAllImagesFromDb } from './services/imageDb';
import { Logo } from './components/Logo';

// --- Image Context Setup ---
interface ImageContextType {
  images: Record<string, string>;
  saveImage: (id: string, base64: string) => Promise<void>;
}

const ImageContext = createContext<ImageContextType | undefined>(undefined);

export const useImages = () => {
  const context = useContext(ImageContext);
  if (!context) {
    throw new Error('useImages must be used within an ImageProvider');
  }
  return context;
};

const ImageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [images, setImages] = useState<Record<string, string>>({});

  useEffect(() => {
    const initImages = async () => {
      try {
        const dbImages = await getAllImagesFromDb();
        setImages(dbImages);
      } catch (e) {
        console.error("Failed to load images from DB", e);
      }
    };
    initImages();
  }, []);

  const saveImage = useCallback(async (id: string, base64: string) => {
    try {
      await saveImageToDb(id, base64);
      setImages(prev => ({ ...prev, [id]: base64 }));
    } catch (e) {
      console.error("Failed to save image", e);
    }
  }, []);

  return (
    <ImageContext.Provider value={{ images, saveImage }}>
      {children}
    </ImageContext.Provider>
  );
};

// --- Cart Context Setup ---
const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Load cart from local storage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('desidabba_cart');
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to parse saved cart", e);
      }
    }
  }, []);

  // Save cart to local storage on change
  useEffect(() => {
    localStorage.setItem('desidabba_cart', JSON.stringify(items));
  }, [items]);

  const addToCart = useCallback((newItem: CartItem) => {
    setItems(prev => {
      // For combos, we almost always want a new line item unless it's an *exact* match of components,
      // but for simplicity, we'll just always add combos as new items if they have components.
      if (newItem.components) {
         return [...prev, { ...newItem, id: `${newItem.id}-${Date.now()}` }];
      }

      const existingItem = prev.find(item => item.id === newItem.id && !item.components);
      if (existingItem) {
        return prev.map(item =>
          item.id === newItem.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...newItem, quantity: 1 }];
    });
    setIsCartOpen(true);
  }, []);

  const removeFromCart = useCallback((id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(id);
      return;
    }
    setItems(prev => prev.map(item => item.id === id ? { ...item, quantity } : item));
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setItems([]);
    setIsCartOpen(false);
  }, []);

  const cartTotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, itemCount, isCartOpen, setIsCartOpen }}>
      {children}
    </CartContext.Provider>
  );
};

// --- Shared Components ---

const Navbar = () => {
  const { setIsCartOpen, itemCount } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { path: '/', label: 'Home', icon: <Home className="w-4 h-4 mr-1" /> },
  ];

  return (
    <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-orange-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center cursor-pointer group" onClick={() => navigate('/')}>
            <Logo className="h-10 w-auto mr-2 group-hover:scale-105 transition-transform" />
            <div className="flex flex-col leading-none">
                <div className="flex">
                    <span className="text-primary font-extrabold text-xl tracking-tight group-hover:text-orange-700 transition-colors">DesiDabba</span>
                    <span className="text-secondary font-bold text-xl tracking-tight ml-0.5">US</span>
                </div>
            </div>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${location.pathname === link.path ? 'text-primary bg-orange-50' : 'text-gray-600 hover:text-primary hover:bg-orange-50/50'}`}
              >
                {link.icon}
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-gray-600 hover:text-primary transition-colors rounded-full hover:bg-orange-50"
              aria-label="Open cart"
            >
              <ShoppingBag className="w-6 h-6" />
              {itemCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-primary rounded-full">
                  {itemCount}
                </span>
              )}
            </button>

            {/* Mobile menu button */}
            <div className="md:hidden">
               <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="p-2 rounded-md text-gray-600 hover:text-primary hover:bg-orange-50 focus:outline-none"
                >
                  {isMobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
               </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-orange-100 px-2 pt-2 pb-3 space-y-1 sm:px-3 shadow-lg">
           {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center px-3 py-4 rounded-md text-base font-medium ${location.pathname === link.path ? 'text-primary bg-orange-50' : 'text-gray-700 hover:text-primary hover:bg-orange-50'}`}
              >
                {link.icon}
                <span className="ml-3">{link.label}</span>
              </Link>
            ))}
        </div>
      )}
    </nav>
  );
};

const CartDrawer = () => {
  const { isCartOpen, setIsCartOpen, items, updateQuantity, removeFromCart, cartTotal } = useCart();
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => setIsCartOpen(false)} />
      <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex">
        <div className="w-screen max-w-md transform transition-transform ease-in-out duration-500 sm:duration-700 bg-white shadow-2xl flex flex-col h-full">
          
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-6 sm:px-6 border-b border-orange-100 bg-orange-50/50">
            <h2 className="text-lg font-bold text-gray-900 flex items-center">
              <ShoppingBag className="w-5 h-5 mr-2 text-primary" />
              Your Order
            </h2>
            <button onClick={() => setIsCartOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Items List */}
          <div className="flex-1 py-6 overflow-y-auto px-4 sm:px-6 no-scrollbar bg-white">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500 space-y-4">
                <div className="p-6 bg-orange-50 rounded-full">
                    <ShoppingBag className="w-12 h-12 text-orange-200" />
                </div>
                <p className="text-lg font-medium">Your cart is empty</p>
                <button
                  onClick={() => { setIsCartOpen(false); navigate('/'); }}
                  className="mt-6 px-8 py-3 bg-primary text-white rounded-full font-bold hover:bg-orange-700 transition-colors shadow-md"
                >
                  Start Your Order
                </button>
              </div>
            ) : (
              <ul className="divide-y divide-gray-100">
                {items.map((item) => (
                  <li key={item.id} className="py-6 flex flex-col">
                    <div className="flex w-full">
                        <div className="flex-shrink-0 w-20 h-20 border border-orange-100 rounded-lg overflow-hidden shadow-sm">
                        <img src={item.imageUrl} alt={item.name} className="w-full h-full object-center object-cover" />
                        </div>
                        <div className="ml-4 flex-1 flex flex-col">
                        <div>
                            <div className="flex justify-between text-base font-bold text-gray-900">
                            <h3 className="line-clamp-2 mr-2">{item.name}</h3>
                            <p className="text-primary">${(item.price * item.quantity).toFixed(2)}</p>
                            </div>
                            <p className="mt-1 text-xs text-gray-500 uppercase tracking-wide">{item.category}</p>
                        </div>
                        <div className="flex-1 flex items-end justify-between text-sm mt-3">
                            <div className="flex items-center border border-gray-200 rounded-full bg-gray-50">
                            <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1.5 text-gray-500 hover:text-primary transition-colors">
                                <Minus className="w-4 h-4" />
                            </button>
                            <span className="px-3 font-semibold text-gray-900 min-w-[2rem] text-center">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1.5 text-gray-500 hover:text-primary transition-colors">
                                <Plus className="w-4 h-4" />
                            </button>
                            </div>
                            <button onClick={() => removeFromCart(item.id)} type="button" className="font-medium text-red-400 hover:text-red-600 p-2 transition-colors">
                            <Trash2 className="w-5 h-5" />
                            </button>
                        </div>
                        </div>
                    </div>
                    {/* Show components if it's a meal */}
                    {item.components && (
                        <div className="mt-3 ml-24 bg-orange-50/50 p-3 rounded-lg text-xs text-gray-600">
                            <p className="font-bold mb-1 text-gray-700">Includes:</p>
                            <ul className="list-disc list-inside space-y-0.5">
                                {item.components.map(comp => (
                                    <li key={comp.id} className="line-clamp-1">{comp.name}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Footer / Checkout */}
          {items.length > 0 && (
            <div className="border-t border-orange-100 py-6 px-4 sm:px-6 bg-orange-50/80">
              <div className="flex justify-between text-base font-medium text-gray-900 mb-4">
                <p>Subtotal</p>
                <p className="font-bold">${cartTotal.toFixed(2)}</p>
              </div>
              <button
                 onClick={() => {
                   setIsCartOpen(false);
                   navigate('/checkout');
                 }}
                 className="w-full flex justify-center items-center px-6 py-4 border border-transparent rounded-full shadow-lg text-lg font-bold text-white bg-primary hover:bg-orange-700 transition-all active:scale-[0.98]"
              >
                Proceed to Checkout <ChevronRight className="ml-2 w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// --- Pages ---

const HomePage = () => {
  const navigate = useNavigate();
  const { images: generatedImages } = useImages();

  // Configuration for the "Every Dabba Includes" section
  // We map the generic names to specific Menu Items IDs to fetch their photos
  const includedItems = useMemo(() => [
    { label: 'Roti', id: 'b1' },
    { label: 'Dal', id: 'c1' },
    { label: 'Rasam', id: 's1' },
    { label: 'Curd', id: 's2' },
    { label: 'Sweet', id: 'd1' },
    { label: 'Curry', id: 'c3' }, // Veg Curry
    { label: 'Fry', id: 'st1' },  // Veg Fry
  ], []);

  return (
    <div className="flex flex-col min-h-screen bg-orange-50">
      {/* Hero Section */}
      <section className="relative bg-secondary py-24 md:py-32 px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center overflow-hidden min-h-[80vh] justify-center">
        <div className="absolute inset-0 bg-black/60 z-0"></div>
        <div className="absolute inset-0 overflow-hidden opacity-40 z-[-1]">
            {/* Use a more specifically Indian food spread background */}
            <img src="https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=1920&q=80" alt="Indian Food Spread" className="w-full h-full object-cover scale-105 blur-[2px]" />
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto">
          <span className="text-primary font-bold tracking-wider uppercase text-sm mb-4 block animate-[fadeInDown_1s_ease-out]">Authentic Indian Flavors</span>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-white tracking-tight mb-8 leading-tight">
            Your Daily <span className="text-primary">Desi Dabba</span>.
          </h1>
          <p className="text-xl text-gray-200 mb-12 max-w-2xl mx-auto leading-relaxed">
            Homestyle Indian meals. Complete Thalis with rice, roti, dal, curries and dessert for one unbeatable price.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                  onClick={() => navigate('/menu?type=veg')}
                  className="px-8 py-4 bg-green-600 text-white rounded-full font-bold text-lg hover:bg-green-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center"
              >
                  Order Veg Dabba <span className="ml-2 bg-white/20 px-2 py-0.5 rounded-full text-sm">$7.99</span>
              </button>
              <button
                  onClick={() => navigate('/menu?type=non-veg')}
                  className="px-8 py-4 bg-primary text-white rounded-full font-bold text-lg hover:bg-orange-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center"
              >
                  Order Non-Veg Dabba <span className="ml-2 bg-white/20 px-2 py-0.5 rounded-full text-sm">$8.99</span>
              </button>
          </div>
        </div>
      </section>

      {/* Features / USP Section */}
      <section className="relative z-20 -mt-20 px-4 sm:px-6 lg:px-8 pb-12">
        <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* USP 1: Avocado Oil - Green Theme (Left) */}
                <div className="flex flex-col items-center text-center bg-white rounded-2xl shadow-lg border-b-4 border-green-500 p-8 hover:-translate-y-1 transition-all duration-300">
                    <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-4 shadow-inner">
                        <Droplet className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">100% Pure Avocado Oil</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">We cook exclusively with <strong className="text-green-700">Chosen Foods™</strong> Avocado Oil for a healthier, lighter taste.</p>
                </div>

                {/* USP 2: Free Delivery - Orange Theme (Center) */}
                <div className="flex flex-col items-center text-center bg-white rounded-2xl shadow-lg border-b-4 border-orange-500 p-8 hover:-translate-y-1 transition-all duration-300">
                    <div className="w-16 h-16 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center mb-4 shadow-inner">
                        <Truck className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Free Delivery</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">Authentic Indian meals delivered to your specific pickup point at no extra cost.</p>
                </div>

                {/* USP 3: Eco Trays - Emerald/Teal Theme (Right) */}
                <div className="flex flex-col items-center text-center bg-white rounded-2xl shadow-lg border-b-4 border-emerald-600 p-8 hover:-translate-y-1 transition-all duration-300">
                    <div className="w-16 h-16 bg-emerald-50 text-emerald-700 rounded-full flex items-center justify-center mb-4 shadow-inner">
                        <Leaf className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Eco-Friendly Trays</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">Served in 100% compostable, microwaveable fiber trays. Certified PFAS-Free and BPA-Free.</p>
                </div>
            </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-16 pt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h2 className="text-3xl font-extrabold text-gray-900 mb-12">Every Dabba Includes</h2>
               <div className="flex flex-wrap justify-center gap-8 md:gap-10">
                    {includedItems.map((item) => {
                        const menuItem = FULL_MENU.find(m => m.id === item.id);
                        const imgSrc = generatedImages[item.id] || menuItem?.imageUrl;
                        
                        return (
                            <div key={item.label} className="flex flex-col items-center group">
                                <div className="w-24 h-24 md:w-28 md:h-28 rounded-full border-4 border-amber-200 shadow-md overflow-hidden mb-3 transition-transform duration-300 group-hover:scale-110 group-hover:border-amber-400 bg-white">
                                    {imgSrc && (
                                        <img src={imgSrc} alt={item.label} className="w-full h-full object-cover" />
                                    )}
                                </div>
                                <div className="px-4 py-1 rounded-full font-bold text-base bg-amber-100 text-amber-900 shadow-sm">
                                    {item.label}
                                </div>
                            </div>
                        );
                    })}
               </div>
               <p className="text-gray-500 mt-10 text-lg">Just choose your rice and we'll pack the rest!</p>
          </div>
      </section>
    </div>
  );
};

type MealType = 'veg' | 'non-veg';

const MenuPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { images: generatedImages } = useImages();
  
  const [mealType, setMealType] = useState<MealType | null>(null);
  const [riceSelection, setRiceSelection] = useState<MenuItem | null>(null);

  useEffect(() => {
      const params = new URLSearchParams(location.search);
      const type = params.get('type');

      if (type === 'veg' || type === 'non-veg') {
          setMealType(type);
      }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  // Filtered data using useMemo for efficiency
  const riceOptions = useMemo(() => FULL_MENU.filter(item => item.dealType === 'rice-option'), []);
  
  const standardItems = useMemo(() => {
      if (!mealType) return [];
      return FULL_MENU.filter(item => {
          if (item.dealType === 'standard-all') return true;
          if (mealType === 'veg' && item.dealType === 'standard-veg') return true;
          if (mealType === 'non-veg' && item.dealType === 'standard-non-veg') return true;
          return false;
      });
  }, [mealType]);

  const handleRiceSelect = (item: MenuItem) => {
      if (riceSelection?.id === item.id) {
          setRiceSelection(null); // Unselect if already selected
      } else {
          setRiceSelection(item);
      }
  };

  const handleAddToCart = () => {
      if (!mealType || !riceSelection) return;

      const price = mealType === 'veg' ? 7.99 : 8.99;
      const allComponents = [...standardItems, riceSelection];

      const comboItem: CartItem = {
          id: `meal-${Date.now()}`,
          name: `${mealType === 'veg' ? 'Vegetarian' : 'Non-Veg'} Dabba`,
          description: `Complete meal with ${riceSelection.name}`,
          price: price,
          category: 'Meal Deal',
          imageUrl: generatedImages[riceSelection.id] || (mealType === 'veg' 
            ? 'https://images.unsplash.com/photo-1514517220017-8ce97a34a7b6?auto=format&fit=crop&w=600&q=80'
            : 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80'),
          tags: [mealType, 'combo', 'thali', 'dabba'],
          quantity: 1,
          components: allComponents
      };

      addToCart(comboItem);
      navigate('/');
  };

  const resetBuilder = () => {
      setMealType(null);
      setRiceSelection(null);
      navigate('/menu');
  };

  // 1. Initial Selection State (Choose Veg/Non-Veg)
  if (!mealType) {
      return (
          <div className="min-h-screen py-20 px-4 flex flex-col items-center justify-center bg-orange-50">
              <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">Build Your Dabba</h1>
              <p className="text-xl text-gray-600 mb-12 text-center max-w-md">Choose your meal preference to begin.</p>
              
              <div className="grid sm:grid-cols-2 gap-8 w-full max-w-4xl">
                  <button 
                      onClick={() => setMealType('veg')}
                      className="group relative overflow-hidden rounded-3xl bg-white shadow-xl hover:shadow-2xl transition-all p-8 text-left border-2 border-transparent hover:border-green-500 flex flex-col h-72"
                  >
                      <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-transparent opacity-50"></div>
                      <div className="relative z-10 flex-1">
                          <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                              <Circle className="w-6 h-6 text-green-600 fill-current" />
                          </div>
                          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Veg Dabba</h2>
                          <p className="text-gray-600 mb-4">Pure vegetarian curries & sides.</p>
                      </div>
                      <div className="relative z-10 flex justify-between items-center">
                          <span className="text-3xl font-extrabold text-green-600">$7.99</span>
                          <span className="flex items-center font-bold text-green-700 group-hover:translate-x-2 transition-transform">
                              Select <ChevronRight className="ml-1" />
                          </span>
                      </div>
                  </button>

                  <button 
                      onClick={() => setMealType('non-veg')}
                      className="group relative overflow-hidden rounded-3xl bg-white shadow-xl hover:shadow-2xl transition-all p-8 text-left border-2 border-transparent hover:border-primary flex flex-col h-72"
                  >
                       <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-transparent opacity-50"></div>
                      <div className="relative z-10 flex-1">
                          <div className="bg-red-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                              <Circle className="w-6 h-6 text-red-600 fill-current" />
                          </div>
                          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Non-Veg Dabba</h2>
                          <p className="text-gray-600 mb-4">Includes chicken curry & fry.</p>
                      </div>
                      <div className="relative z-10 flex justify-between items-center">
                          <span className="text-3xl font-extrabold text-primary">$8.99</span>
                           <span className="flex items-center font-bold text-primary group-hover:translate-x-2 transition-transform">
                              Select <ChevronRight className="ml-1" />
                          </span>
                      </div>
                  </button>
              </div>
          </div>
      );
  }

  // 2. Builder View
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen pb-32">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 bg-white p-4 rounded-2xl shadow-sm border border-orange-100 sticky top-20 z-30 gap-4">
            <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center">
                    {mealType === 'veg' ? <Circle className="w-5 h-5 text-green-600 fill-current mr-2" /> : <Circle className="w-5 h-5 text-red-600 fill-current mr-2" />}
                    {mealType === 'veg' ? 'Vegetarian' : 'Non-Veg'} Dabba
                </h1>
                <p className="text-primary font-extrabold text-lg mt-1">${mealType === 'veg' ? '7.99' : '8.99'}</p>
            </div>
            <div className="flex gap-4 items-center flex-wrap">
                <button onClick={resetBuilder} className="text-sm text-gray-500 hover:text-gray-700 underline">
                    Change Type
                </button>
            </div>
        </div>

        <div className="space-y-6">
            {/* Step 1: Rice Selection (Interactive) */}
            <section className="bg-white rounded-3xl shadow-md border-2 border-primary/20 overflow-hidden">
                <div className={`px-6 py-4 border-b border-orange-50 flex justify-between items-center ${riceSelection ? 'bg-green-50' : 'bg-orange-50'}`}>
                    <h2 className="text-xl font-bold text-gray-800 flex items-center">
                        1. Choose Your Rice
                    </h2>
                    {riceSelection ? (
                         <span className="flex items-center text-green-600 text-sm font-medium bg-white/60 px-3 py-1 rounded-full">
                             <CheckCircle2 className="w-4 h-4 mr-1" /> Selected
                         </span>
                    ) : (
                        <span className="text-orange-600 text-sm font-medium animate-pulse">
                            Required
                        </span>
                    )}
                </div>
                <div className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {riceOptions.map(item => (
                        <div 
                            key={item.id} 
                            onClick={() => handleRiceSelect(item)}
                            className={`relative flex flex-col p-4 rounded-xl border-2 cursor-pointer transition-all ${riceSelection?.id === item.id ? 'border-primary bg-orange-50/80 shadow-md scale-[1.02]' : 'border-gray-100 hover:border-orange-300 hover:bg-orange-50/30'}`}
                        >
                            <div className="flex-1">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-lg text-gray-900">{item.name}</h3>
                                    {riceSelection?.id === item.id && <CheckCircle className="w-6 h-6 text-primary fill-white" />}
                                </div>
                                <p className="text-sm text-gray-600 line-clamp-3">{item.description}</p>
                            </div>
                             <div className="mt-4 h-32 rounded-lg overflow-hidden relative bg-gray-100">
                                <img src={generatedImages[item.id] || item.imageUrl} alt={item.name} className="w-full h-full object-cover transition-all duration-500" />
                                {generatedImages[item.id] && (
                                    <div className="absolute bottom-1 right-1 bg-purple-600/80 backdrop-blur-sm text-white text-[10px] px-1.5 py-0.5 rounded-md flex items-center">
                                        <Sparkles className="w-3 h-3 mr-1" /> AI
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

             {/* Step 2: Standard Items (Read-only list) */}
            <section className="bg-gray-50 rounded-3xl border border-gray-200 overflow-hidden opacity-90">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-100 flex items-center">
                    <Lock className="w-4 h-4 text-gray-500 mr-2" />
                    <h2 className="text-lg font-bold text-gray-700">
                        2. Included In Your Dabba
                    </h2>
                </div>
                <div className="p-4 sm:p-6">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {standardItems.map(item => (
                            <div key={item.id} className="flex flex-col p-3 bg-white rounded-xl border border-gray-200 shadow-sm">
                                <div className="mb-3">
                                    <p className="font-bold text-gray-900 line-clamp-1">{item.name}</p>
                                    <p className="text-xs text-gray-500 capitalize">{item.category}</p>
                                </div>
                                <div className="mt-auto h-32 w-full rounded-lg overflow-hidden bg-gray-100 relative">
                                     <img src={generatedImages[item.id] || item.imageUrl} alt={item.name} className="w-full h-full object-cover transition-transform hover:scale-105 duration-500" />
                                      {generatedImages[item.id] && (
                                        <div className="absolute bottom-1 right-1 bg-purple-600/80 backdrop-blur-sm text-white text-[10px] px-1.5 py-0.5 rounded-md flex items-center z-10">
                                            <Sparkles className="w-3 h-3 mr-1" /> AI
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>

        {/* Completion Bar */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-orange-100 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-40">
            <div className="max-w-4xl mx-auto flex items-center justify-between">
                <div>
                    <p className="text-sm text-gray-500">Total</p>
                    <p className="text-2xl font-extrabold text-gray-900">${mealType === 'veg' ? '7.99' : '8.99'}</p>
                </div>
                <button
                    disabled={!riceSelection}
                    onClick={handleAddToCart}
                    className={`px-8 py-4 rounded-full font-bold text-lg flex items-center transition-all ${riceSelection ? 'bg-primary text-white hover:bg-orange-700 shadow-lg scale-105' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                    >
                        {riceSelection ? 'Add to Order' : 'Choose Rice to Continue'}
                        {riceSelection && <Plus className="ml-2 w-5 h-5" />}
                </button>
            </div>
        </div>
    </div>
  );
};

const CheckoutPage = () => {
    const { items, cartTotal, clearCart } = useCart();
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [confirmedDate, setConfirmedDate] = useState('');

    const TAX_RATE = 0.0825; // Austin, TX Sales Tax
    const taxAmount = cartTotal * TAX_RATE;
    const finalTotal = cartTotal + taxAmount;
    
    const minDate = useMemo(() => {
        const now = new Date();
        const centralTimeFormatter = new Intl.DateTimeFormat('en-US', {
            timeZone: 'America/Chicago',
            hour: 'numeric',
            hour12: false,
        });
        const centralHour = parseInt(centralTimeFormatter.format(now), 10);

        // Cutoff time is 10 AM Central Time.
        if (centralHour >= 10) {
            now.setDate(now.getDate() + 1);
        }
        return now.toISOString().split('T')[0];
    }, []);

    const [deliveryDate, setDeliveryDate] = useState(minDate);


    const pickupLocations = [
      { id: 'p1', name: '13929 Center Lake Dr, Austin, TX 78753 (TCS, Wipro, Cognizant, Qualcomm)' },
      { id: 'p2', name: '507 E Howard Ln, Austin, TX 78753 (Infosys)' },
      { id: 'p3', name: '600 Center Ridge Dr, Austin, TX 78753 (Capgemini)' },
      { id: 'p4', name: '13201 McCallen Pass, Austin, TX 78753 (General Motors)' },
    ];

    useEffect(() => {
        if (items.length === 0 && !isSuccess) {
            navigate('/');
        }
    }, [items, navigate, isSuccess]);

    const handleMockPayment = (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);
        setConfirmedDate(deliveryDate);
        setTimeout(() => {
            setIsProcessing(false);
            setIsSuccess(true);
            clearCart();
        }, 2500);
    };

    if (isSuccess) {
        const formattedDate = new Date(confirmedDate + 'T12:00:00Z').toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        return (
            <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 text-center bg-orange-50">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-8 text-green-600 shadow-sm animate-[bounce_1s_ease-in-out]">
                    <CheckCircle className="w-14 h-14" />
                </div>
                <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Namaste! Order Confirmed.</h1>
                <p className="text-xl text-gray-600 mb-12 max-w-lg leading-relaxed">
                    Your Desi Dabba is being prepared with care. It will be ready for pickup on <span className="font-bold text-primary">{formattedDate} by 12:00 PM Central Time</span>.
                </p>
                <button
                    onClick={() => navigate('/')}
                    className="px-10 py-4 bg-primary text-white rounded-full font-bold text-lg hover:bg-orange-700 transition-all shadow-lg hover:shadow-xl active:scale-95"
                >
                    Return Home
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-10 flex items-center">
                <CreditCard className="w-8 h-8 mr-3 text-primary" />
                Secure Checkout
            </h1>
            
            <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
                {/* Checkout Form */}
                <section className="lg:col-span-7 bg-white p-8 rounded-3xl shadow-sm border border-orange-100 mb-8 lg:mb-0">
                     <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                         <span className="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm">1</span>
                         Pickup Details
                     </h2>
                     <form onSubmit={handleMockPayment} className="space-y-5">
                        <div className="grid grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">First Name</label>
                                <input required type="text" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Last Name</label>
                                <input required type="text" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
                            <input required type="email" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all" />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number <span className="text-xs text-gray-500 font-medium">(Optional)</span></label>
                            <input type="tel" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all" />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Pickup Point</label>
                            <select required defaultValue="" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all appearance-none">
                                <option value="" disabled>Select a location...</option>
                                {pickupLocations.map(loc => (
                                    <option key={loc.id} value={loc.id}>{loc.name}</option>
                                ))}
                            </select>
                        </div>
                        
                        <div>
                            <label htmlFor="deliveryDate" className="block text-sm font-bold text-gray-700 mb-2">Pickup Date</label>
                            <input
                                required
                                type="date"
                                id="deliveryDate"
                                value={deliveryDate}
                                onChange={(e) => setDeliveryDate(e.target.value)}
                                min={minDate}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                            />
                            <p className="text-xs text-gray-500 mt-2 px-1">
                                Order by <span className="font-bold">10 AM Central Time</span> for same-day pickup. Your order will be ready at the pickup point by <span className="font-bold">12:00 PM Central Time</span>.
                            </p>
                        </div>

                        <h2 className="text-xl font-bold text-gray-900 pt-6 mt-6 border-t border-gray-100 mb-6 flex items-center">
                             <span className="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm">2</span>
                             Payment Method
                        </h2>
                        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex items-start mb-6">
                            <CreditCard className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0 mt-0.5" />
                            <span className="text-sm text-blue-800 font-medium leading-relaxed">Demo Mode: No real payment is processed. You can enter any dummy data.</span>
                        </div>
                         <input 
                           required 
                           type="text" 
                           placeholder="Card number" 
                           pattern="[0-9\s]+"
                           className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all mb-4" 
                        />
                        <div className="grid grid-cols-2 gap-5">
                            <input required type="text" placeholder="MM/YY" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all" />
                            <input required type="text" placeholder="CVC" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all" />
                        </div>

                        <button
                            type="submit"
                            disabled={isProcessing}
                            className={`w-full mt-10 flex justify-center items-center px-6 py-4 border border-transparent rounded-full shadow-lg text-xl font-bold text-white bg-primary hover:bg-orange-700 transition-all ${isProcessing ? 'opacity-80 cursor-wait' : 'active:scale-[0.98]'}`}
                        >
                            {isProcessing ? (
                                <><Sparkles className="animate-spin mr-2 h-5 w-5" /> Processing...</>
                            ) : (
                                <>Pay ${finalTotal.toFixed(2)}</>
                            )}
                        </button>
                     </form>
                </section>

                {/* Order Summary */}
                <section className="lg:col-span-5 bg-white p-8 rounded-3xl shadow-sm border border-orange-100 sticky top-28">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
                    <ul className="divide-y divide-gray-100 mb-6 max-h-[40vh] overflow-y-auto pr-2">
                        {items.map(item => (
                            <li key={item.id} className="py-5 flex flex-col">
                                <div className="flex">
                                    <div className="w-20 h-20 rounded-xl overflow-hidden border border-gray-100 flex-shrink-0">
                                        <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="ml-4 flex-1">
                                        <div className="flex justify-between text-base font-bold text-gray-900 mb-1">
                                            <h3 className="line-clamp-2">{item.quantity}x {item.name}</h3>
                                            <p className="ml-2">${(item.price * item.quantity).toFixed(2)}</p>
                                        </div>
                                        <p className="text-xs font-medium text-primary uppercase tracking-wider">{item.category}</p>
                                    </div>
                                </div>
                                {item.components && (
                                    <div className="mt-2 ml-24 text-xs text-gray-500">
                                        <ul className="list-disc list-inside">
                                            {item.components.map(comp => (
                                                <li key={comp.id} className="line-clamp-1">{comp.name}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                    <div className="space-y-3 border-t-2 border-dashed border-gray-200 pt-6">
                        <div className="flex justify-between text-gray-600">
                            <p>Subtotal</p>
                            <p className="font-medium">${cartTotal.toFixed(2)}</p>
                        </div>
                        <div className="flex justify-between text-gray-600">
                            <p>Sales Tax (8.25%)</p>
                            <p className="font-medium">${taxAmount.toFixed(2)}</p>
                        </div>
                        <div className="flex justify-between text-2xl font-extrabold text-gray-900 pt-4 border-t border-gray-200 mt-6">
                            <p>Total</p>
                            <p className="text-primary">${finalTotal.toFixed(2)}</p>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

const Footer = () => (
    <footer className="bg-secondary text-gray-400 py-16 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-10">
            <div className="col-span-1 md:col-span-2">
                <div className="flex items-center mb-4">
                     <Logo className="h-8 w-auto mr-2 text-white" />
                     <span className="text-primary font-extrabold text-2xl tracking-tight">DesiDabba</span>
                     <span className="text-white font-bold text-2xl tracking-tight ml-0.5">US</span>
                </div>
                <p className="mt-2 text-base leading-relaxed max-w-md text-gray-300">
                    Bringing the authentic taste of India to your doorstep with our curated Desi Dabbas.
                </p>
            </div>
             <div>
                <h3 className="text-white font-bold text-lg mb-6">Quick Links</h3>
                <ul className="space-y-4 text-base">
                    <li><Link to="/" className="hover:text-primary transition-colors">Home</Link></li>
                    <li><Link to="/menu?type=veg" className="hover:text-primary transition-colors">Veg Dabba</Link></li>
                    <li><Link to="/menu?type=non-veg" className="hover:text-primary transition-colors">Non-Veg Dabba</Link></li>
                </ul>
            </div>
            <div>
                 <h3 className="text-white font-bold text-lg mb-6">Contact Us</h3>
                 <p className="text-base mb-2">support@desidabba.us.demo</p>
                 <p className="text-base">+1 (555) 987-6543</p>
            </div>
        </div>
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 pt-8 border-t border-gray-700/50 text-sm text-center">
            © {new Date().getFullYear()} DesiDabba US Demo.
        </div>
    </footer>
);

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const App = () => {
  return (
    <ImageProvider>
        <CartProvider>
        <HashRouter>
            <ScrollToTop />
            <div className="flex flex-col min-h-screen bg-orange-50/30 font-sans">
            <Navbar />
            <CartDrawer />
            <main className="flex-grow">
                <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/menu" element={<MenuPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                </Routes>
            </main>
            <Footer />
            </div>
        </HashRouter>
        </CartProvider>
    </ImageProvider>
  );
};

export default App;
