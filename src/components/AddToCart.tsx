"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { ShoppingBag, Check } from "lucide-react";

interface Product {
  id: number;
  name: string;
  price: string;
  image: string;
  color: string;
  size?: string[];
}

interface AddToCartProps {
  product: Product;
  className?: string;
}

const AddToCart = ({ product, className = "" }: AddToCartProps) => {
  const { addItem, openCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [isAdded, setIsAdded] = useState(false);

  // Convert price string to number (remove $ and convert)
  const priceNumber = parseFloat(product.price.replace('$', ''));

  const handleAddToCart = () => {
    if (product.size && product.size.length > 0 && !selectedSize) {
      alert('Please select a size');
      return;
    }

    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      priceNumber: priceNumber,
      image: product.image,
      color: product.color,
      size: selectedSize || 'One Size',
    });

    // Only open cart and show success if user is authenticated
    if (isAuthenticated) {
      setIsAdded(true);
      
      // Reset the "added" state after 2 seconds
      setTimeout(() => setIsAdded(false), 2000);
      
      // Open cart drawer
      openCart();
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Size Selection */}
      {product.size && product.size.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Size
          </label>
          <div className="flex gap-2 flex-wrap">
            {product.size.map((size) => (
              <Badge
                key={size}
                variant={selectedSize === size ? "default" : "outline"}
                className={`cursor-pointer px-3 py-1 transition-colors ${
                  selectedSize === size 
                    ? "bg-primary text-primary-foreground" 
                    : "hover:bg-primary/10"
                }`}
                onClick={() => setSelectedSize(size)}
              >
                {size}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Add to Cart Button */}
      <Button
        variant="elegant"
        size="elegant"
        onClick={handleAddToCart}
        className={`w-full transition-all duration-300 ${
          isAdded ? "bg-green-500 hover:bg-green-600" : ""
        }`}
        disabled={isAdded}
      >
        {isAdded ? (
          <>
            <Check className="w-5 h-5 mr-2" />
            Added to Cart!
          </>
        ) : (
          <>
            <ShoppingBag className="w-5 h-5 mr-2" />
            Add to Cart
          </>
        )}
      </Button>
    </div>
  );
};

export default AddToCart;
