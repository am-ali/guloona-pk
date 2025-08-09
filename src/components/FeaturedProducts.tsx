"use client";

import { Button } from "@/components/ui/button";
import { Heart, ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";
import AddToCart from "@/components/AddToCart";

const FeaturedProducts = () => {
  const router = useRouter();

  const handleViewAllClick = () => {
    router.push('/shop');
  };

  const products = [
    {
      id: 1,
      name: "Blush Minimalist Dress",
      price: "$89",
      image: "/assets/dress-1.jpg",
      color: "Blush Pink",
      size: ["XS", "S", "M", "L"]
    },
    {
      id: 2,
      name: "Sage Garden Dress",
      price: "$92",
      image: "/assets/dress-2.jpg",
      color: "Sage Green",
      size: ["S", "M", "L", "XL"]
    },
    {
      id: 3,
      name: "Lavender Dream Dress",
      price: "$85",
      image: "/assets/dress-3.jpg",
      color: "Muted Lavender",
      size: ["XS", "S", "M"]
    }
  ];

  return (
    <section className="py-12 lg:py-20 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-8 lg:mb-16 animate-fade-in">
          <h2 className="font-serif text-3xl lg:text-4xl xl:text-5xl text-foreground mb-4">
            Featured Collection
          </h2>
          <p className="font-sans text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover our signature minimalist dresses, crafted with care and designed for timeless elegance
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-8 mb-8 lg:mb-12">
          {products.map((product, index) => (
            <div 
              key={product.id} 
              className="group relative bg-card rounded-2xl lg:rounded-3xl p-2 lg:p-6 shadow-card hover:shadow-soft transition-all duration-300 animate-fade-in flex flex-col"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              {/* Product Image */}
              <div className="relative overflow-hidden rounded-xl lg:rounded-2xl mb-3 lg:mb-6 bg-background">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-40 sm:h-48 lg:h-80 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                
                {/* Heart Icon */}
                <button className="absolute top-2 right-2 lg:top-4 lg:right-4 p-1.5 lg:p-2 bg-background/80 backdrop-blur-sm rounded-full hover:bg-primary hover:text-primary-foreground transition-colors flex items-center justify-center">
                  <Heart className="w-4 h-4 lg:w-5 lg:h-5" />
                </button>
              </div>

              {/* Product Info */}
              <div className="text-center flex flex-col flex-1">
                <h3 className="font-serif text-sm lg:text-xl text-foreground mb-1 lg:mb-2">
                  {product.name}
                </h3>
                <p className="font-sans text-xs lg:text-sm text-muted-foreground mb-1 lg:mb-3">
                  {product.color}
                </p>
                <p className="font-sans text-sm lg:text-lg font-medium text-foreground mb-2 lg:mb-4">
                  {product.price}
                </p>
                
                <div className="mt-auto">
                  <AddToCart product={product} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Button 
            variant="elegant" 
            size="elegant"
            className="w-full sm:w-auto"
            onClick={handleViewAllClick}
          >
            View All Collection
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;