"use client";

import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import AddToCart from "@/components/AddToCart";
import { Heart, Filter, Grid, List } from "lucide-react";
// Import images as static paths for Next.js
const dress1 = "/assets/dress-1.jpg";
const dress2 = "/assets/dress-2.jpg";
const dress3 = "/assets/dress-3.jpg";

export default function ShopPage() {
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedOccasions, setSelectedOccasions] = useState<string[]>([]);

  const products = [
    { id: 1, name: "Blush Minimalist Dress", price: "$89", image: dress1, color: "Blush Pink", size: ["XS", "S", "M", "L"], occasion: "Casual" },
    { id: 2, name: "Sage Garden Dress", price: "$92", image: dress2, color: "Sage Green", size: ["S", "M", "L", "XL"], occasion: "Festive" },
    { id: 3, name: "Lavender Dream Dress", price: "$85", image: dress3, color: "Muted Lavender", size: ["XS", "S", "M"], occasion: "Formal" },
    { id: 4, name: "Cream Silk Dress", price: "$95", image: dress1, color: "Cream", size: ["S", "M", "L"], occasion: "Formal" },
    { id: 5, name: "Rose Petal Dress", price: "$88", image: dress2, color: "Rose", size: ["XS", "S", "M", "L", "XL"], occasion: "Casual" },
    { id: 6, name: "Mint Breeze Dress", price: "$90", image: dress3, color: "Mint", size: ["S", "M", "L"], occasion: "Festive" },
  ];

  const filters = {
    colors: ["Blush Pink", "Sage Green", "Muted Lavender", "Cream", "Rose", "Mint"],
    sizes: ["XS", "S", "M", "L", "XL"],
    occasions: ["Casual", "Festive", "Formal"]
  };

  // Filter functions
  const handleColorChange = (color: string) => {
    setSelectedColors(prev => 
      prev.includes(color) 
        ? prev.filter(c => c !== color)
        : [...prev, color]
    );
  };

  const handleSizeChange = (size: string) => {
    setSelectedSizes(prev => 
      prev.includes(size) 
        ? prev.filter(s => s !== size)
        : [...prev, size]
    );
  };

  const handleOccasionChange = (occasion: string) => {
    setSelectedOccasions(prev => 
      prev.includes(occasion) 
        ? prev.filter(o => o !== occasion)
        : [...prev, occasion]
    );
  };

  // Filter products based on selected filters
  const filteredProducts = products.filter(product => {
    const colorMatch = selectedColors.length === 0 || selectedColors.includes(product.color);
    const sizeMatch = selectedSizes.length === 0 || product.size.some(size => selectedSizes.includes(size));
    const occasionMatch = selectedOccasions.length === 0 || selectedOccasions.includes(product.occasion);
    
    return colorMatch && sizeMatch && occasionMatch;
  });

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-24 pb-12 bg-hero-gradient">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="font-serif text-5xl md:text-6xl text-foreground mb-4">
            Our Collection
          </h1>
          <p className="font-script text-2xl text-primary mb-4" style={{ color: "color-mix(in hsl, hsl(var(--primary)) 80%, black 20%)" }}>
            "Elegance blooms in every thread"
          </p>
          <p className="font-sans text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover timeless pieces crafted with love and attention to detail. Each dress tells a story of elegance and simplicity.
          </p>
        </div>
      </section>

      {/* Filters & Products */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* Sidebar Filters */}
            <div className="lg:w-64 flex-shrink-0">
              <Card className="p-6 sticky top-24">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <Filter className="w-5 h-5 text-primary" />
                    <h3 className="font-serif text-xl text-foreground">Filters</h3>
                  </div>
                  {(selectedColors.length > 0 || selectedSizes.length > 0 || selectedOccasions.length > 0) && (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => {
                        setSelectedColors([]);
                        setSelectedSizes([]);
                        setSelectedOccasions([]);
                      }}
                    >
                      Clear All
                    </Button>
                  )}
                </div>
                
                {/* Color Filter */}
                <div className="mb-6">
                  <h4 className="font-sans font-medium text-foreground mb-3">Color</h4>
                  <div className="space-y-2">
                    {filters.colors.map((color) => (
                      <label key={color} className="flex items-center space-x-2 cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="rounded border-border" 
                          checked={selectedColors.includes(color)}
                          onChange={() => handleColorChange(color)}
                        />
                        <span className="font-sans text-sm text-muted-foreground">{color}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Size Filter */}
                <div className="mb-6">
                  <h4 className="font-sans font-medium text-foreground mb-3">Size</h4>
                  <div className="flex flex-wrap gap-2">
                    {filters.sizes.map((size) => (
                      <Badge 
                        key={size} 
                        variant={selectedSizes.includes(size) ? "default" : "outline"} 
                        className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                        onClick={() => handleSizeChange(size)}
                      >
                        {size}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Occasion Filter */}
                <div className="mb-6">
                  <h4 className="font-sans font-medium text-foreground mb-3">Occasion</h4>
                  <div className="space-y-2">
                    {filters.occasions.map((occasion) => (
                      <label key={occasion} className="flex items-center space-x-2 cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="rounded border-border" 
                          checked={selectedOccasions.includes(occasion)}
                          onChange={() => handleOccasionChange(occasion)}
                        />
                        <span className="font-sans text-sm text-muted-foreground">{occasion}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </Card>
            </div>

            {/* Products Grid */}
            <div className="flex-1">
              {/* View Toggle */}
              <div className="flex justify-between items-center mb-8">
                <p className="font-sans text-muted-foreground">
                  Showing {filteredProducts.length} of {products.length} products
                </p>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon">
                    <Grid className="w-5 h-5" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <List className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* Products */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product, index) => (
                    <Card key={product.id} className="group overflow-hidden shadow-card hover:shadow-soft transition-all duration-300 animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                      <div className="relative">
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <button className="absolute top-4 right-4 p-2 bg-background/80 backdrop-blur-sm rounded-full hover:bg-primary hover:text-primary-foreground transition-colors">
                          <Heart className="w-5 h-5" />
                        </button>
                        <Badge className="absolute bottom-4 left-4 bg-background/80 backdrop-blur-sm text-foreground">
                          {product.occasion}
                        </Badge>
                      </div>
                      
                      <div className="p-6">
                        <h3 className="font-serif text-xl text-foreground mb-2">
                          {product.name}
                        </h3>
                        <p className="font-sans text-sm text-muted-foreground mb-2">
                          {product.color}
                        </p>
                        <div className="flex items-center justify-between mb-4">
                          <p className="font-sans text-lg font-medium text-foreground">
                            {product.price}
                          </p>
                          <div className="flex gap-1">
                            {product.size.slice(0, 3).map((size) => (
                              <Badge key={size} variant="secondary" className="text-xs">
                                {size}
                              </Badge>
                            ))}
                            {product.size.length > 3 && (
                              <Badge variant="secondary" className="text-xs">
                                +{product.size.length - 3}
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        <AddToCart product={product} />
                      </div>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <p className="font-sans text-lg text-muted-foreground mb-4">
                      No products match your current filters.
                    </p>
                    <Button 
                      variant="outline"
                      onClick={() => {
                        setSelectedColors([]);
                        setSelectedSizes([]);
                        setSelectedOccasions([]);
                      }}
                    >
                      Clear All Filters
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
