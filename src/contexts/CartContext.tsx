"use client";

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

export interface CartItem {
  id: number;
  name: string;
  price: string;
  priceNumber: number;
  image: string;
  color: string;
  size: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: Omit<CartItem, 'quantity'> }
  | { type: 'REMOVE_ITEM'; payload: { id: number; size: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { id: number; size: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'TOGGLE_CART' }
  | { type: 'OPEN_CART' }
  | { type: 'CLOSE_CART' }
  | { type: 'LOAD_CART'; payload: CartItem[] };

const initialState: CartState = {
  items: [],
  isOpen: false,
};

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItemIndex = state.items.findIndex(
        item => item.id === action.payload.id && item.size === action.payload.size
      );

      if (existingItemIndex > -1) {
        // Item already exists, update quantity
        const updatedItems = [...state.items];
        updatedItems[existingItemIndex].quantity += 1;
        return { ...state, items: updatedItems };
      } else {
        // New item, add to cart
        const newItem: CartItem = { ...action.payload, quantity: 1 };
        return { ...state, items: [...state.items, newItem] };
      }
    }

    case 'REMOVE_ITEM': {
      const filteredItems = state.items.filter(
        item => !(item.id === action.payload.id && item.size === action.payload.size)
      );
      return { ...state, items: filteredItems };
    }

    case 'UPDATE_QUANTITY': {
      if (action.payload.quantity <= 0) {
        return cartReducer(state, { 
          type: 'REMOVE_ITEM', 
          payload: { id: action.payload.id, size: action.payload.size } 
        });
      }

      const updatedItems = state.items.map(item =>
        item.id === action.payload.id && item.size === action.payload.size
          ? { ...item, quantity: action.payload.quantity }
          : item
      );
      return { ...state, items: updatedItems };
    }

    case 'CLEAR_CART':
      return { ...state, items: [] };

    case 'TOGGLE_CART':
      return { ...state, isOpen: !state.isOpen };

    case 'OPEN_CART':
      return { ...state, isOpen: true };

    case 'CLOSE_CART':
      return { ...state, isOpen: false };

    case 'LOAD_CART':
      return { ...state, items: action.payload };

    default:
      return state;
  }
};

interface CartContextType {
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: number, size: string) => void;
  updateQuantity: (id: number, size: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  getItemCount: () => number;
  getTotalPrice: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const { isAuthenticated, user, openAuthModal } = useAuth();

  // Load cart from Supabase when user signs in
  useEffect(() => {
    if (isAuthenticated && user) {
      loadCartFromDatabase();
    } else {
      // Clear cart when user signs out
      dispatch({ type: 'CLEAR_CART' });
    }
  }, [isAuthenticated, user]);

  const loadCartFromDatabase = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('carts')
        .select('*')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error loading cart:', error);
        return;
      }

      const cartItems: CartItem[] = data.map(item => ({
        id: item.product_id,
        name: item.product_name,
        price: item.product_price,
        priceNumber: item.product_price_number,
        image: item.product_image,
        color: item.product_color,
        size: item.size,
        quantity: item.quantity,
      }));

      dispatch({ type: 'LOAD_CART', payload: cartItems });
    } catch (error) {
      console.error('Error loading cart:', error);
    }
  };

  const syncCartToDatabase = async (item: CartItem, action: 'add' | 'update' | 'remove') => {
    if (!user) return;

    try {
      if (action === 'remove') {
        const { error } = await supabase
          .from('carts')
          .delete()
          .eq('user_id', user.id)
          .eq('product_id', item.id)
          .eq('size', item.size);
        
        if (error) {
          console.error('Cart delete error:', error);
          // Don't throw error to prevent auth disruption
        }
      } else {
        const { error } = await supabase
          .from('carts')
          .upsert({
            user_id: user.id,
            product_id: item.id,
            product_name: item.name,
            product_price: item.price,
            product_price_number: item.priceNumber,
            product_image: item.image,
            product_color: item.color,
            size: item.size,
            quantity: item.quantity,
          });
          
        if (error) {
          console.error('Cart upsert error:', error);
          // Don't throw error to prevent auth disruption
        }
      }
    } catch (error) {
      console.error('Error syncing cart:', error);
      // Silently fail to prevent auth state corruption
    }
  };

  const addItem = (item: Omit<CartItem, 'quantity'>) => {
    if (!isAuthenticated) {
      openAuthModal();
      return;
    }

    dispatch({ type: 'ADD_ITEM', payload: item });
    
    // Sync to database
    const newItem: CartItem = { ...item, quantity: 1 };
    syncCartToDatabase(newItem, 'add');
  };

  const removeItem = (id: number, size: string) => {
    if (!isAuthenticated) {
      openAuthModal();
      return;
    }

    const existingItem = state.items.find(item => item.id === id && item.size === size);
    if (existingItem) {
      syncCartToDatabase(existingItem, 'remove');
    }

    dispatch({ type: 'REMOVE_ITEM', payload: { id, size } });
  };

  const updateQuantity = (id: number, size: string, quantity: number) => {
    if (!isAuthenticated) {
      openAuthModal();
      return;
    }

    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, size, quantity } });

    // Sync to database
    const existingItem = state.items.find(item => item.id === id && item.size === size);
    if (existingItem) {
      const updatedItem = { ...existingItem, quantity };
      if (quantity > 0) {
        syncCartToDatabase(updatedItem, 'update');
      } else {
        syncCartToDatabase(updatedItem, 'remove');
      }
    }
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const toggleCart = () => {
    console.log('Cart: Toggle cart clicked', { isAuthenticated: !!user, itemCount: state.items.length });
    dispatch({ type: 'TOGGLE_CART' });
  };

  const openCart = () => {
    dispatch({ type: 'OPEN_CART' });
  };

  const closeCart = () => {
    dispatch({ type: 'CLOSE_CART' });
  };

  const getItemCount = () => {
    return state.items.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return state.items.reduce((total, item) => total + (item.priceNumber * item.quantity), 0);
  };

  const value: CartContextType = {
    state,
    dispatch,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    toggleCart,
    openCart,
    closeCart,
    getItemCount,
    getTotalPrice,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
