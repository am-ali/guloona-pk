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
    <section className="py-20 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="font-serif text-4xl md:text-5xl text-foreground mb-4">
            Featured Collection
          </h2>
          <p className="font-sans text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover our signature minimalist dresses, crafted with care and designed for timeless elegance
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {products.map((product, index) => (
            <div 
              key={product.id} 
              className="group relative bg-card rounded-3xl p-6 shadow-card hover:shadow-soft transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              {/* Product Image */}
              <div className="relative overflow-hidden rounded-2xl mb-6 bg-background">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                
                {/* Heart Icon */}
                <button className="absolute top-4 right-4 p-2 bg-background/80 backdrop-blur-sm rounded-full hover:bg-primary hover:text-primary-foreground transition-colors">
                  <Heart className="w-5 h-5" />
                </button>
              </div>

              {/* Product Info */}
              <div className="text-center">
                <h3 className="font-serif text-xl text-foreground mb-2">
                  {product.name}
                </h3>
                <p className="font-sans text-sm text-muted-foreground mb-3">
                  {product.color}
                </p>
                <p className="font-sans text-lg font-medium text-foreground mb-4">
                  {product.price}
                </p>
                
                <AddToCart product={product} />
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Button 
            variant="floral" 
            size="elegant"
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