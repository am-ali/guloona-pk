"use client";

import { X, Plus, Minus, ShoppingBag, Trash2, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";

const CartDrawer = () => {
  const { state, closeCart, updateQuantity, removeItem, getItemCount, getTotalPrice } = useCart();
  const { isAuthenticated, openAuthModal } = useAuth();

  if (!state.isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-50 transition-opacity"
        onClick={closeCart}
      />
      
      {/* Cart Drawer */}
      <div className="fixed top-0 right-0 h-full w-full max-w-md bg-background shadow-2xl z-50 transform transition-transform flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-6 h-6 text-primary" />
            <h2 className="font-serif text-2xl text-foreground">Your Cart</h2>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={closeCart}
            className="hover:bg-accent"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {state.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag className="w-16 h-16 text-muted-foreground mb-4" />
              <h3 className="font-serif text-xl text-foreground mb-2">Your cart is empty</h3>
              <p className="text-muted-foreground mb-6">Add some beautiful pieces to get started</p>
              
              {!isAuthenticated && (
                <div className="mb-4">
                  <p className="text-sm text-muted-foreground mb-3">Sign in to save your cart and checkout</p>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      openAuthModal();
                      closeCart();
                    }}
                    className="mb-3"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Sign In
                  </Button>
                </div>
              )}
              
              <Button variant="elegant" onClick={closeCart}>
                Continue Shopping
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {state.items.map((item) => (
                <div key={`${item.id}-${item.size}`} className="flex gap-4 p-4 bg-card rounded-lg">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground text-sm">{item.name}</h4>
                    <p className="text-xs text-muted-foreground">Color: {item.color}</p>
                    <p className="text-xs text-muted-foreground">Size: {item.size}</p>
                    <p className="text-sm font-medium text-primary mt-1">{item.price}</p>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    {/* Remove button */}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(item.id, item.size)}
                      className="h-6 w-6 hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                        className="h-7 w-7"
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      
                      <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                      
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                        className="h-7 w-7"
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {state.items.length > 0 && (
          <div className="border-t border-border p-6 space-y-4">
            <div className="flex justify-between items-center">
              <span className="font-serif text-lg text-foreground">Total</span>
              <span className="font-serif text-xl text-primary font-bold">
                ${getTotalPrice().toFixed(2)}
              </span>
            </div>
            
            <div className="space-y-3">
              <Button variant="elegant" size="elegant" className="w-full">
                Checkout ({getItemCount()} {getItemCount() === 1 ? 'item' : 'items'})
              </Button>
              
              <Button variant="outline" className="w-full" onClick={closeCart}>
                Continue Shopping
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
