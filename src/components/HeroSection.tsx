"use client";

import { Button } from "@/components/ui/button";
import Logo from "@/components/ui/Logo";
import { useRouter } from "next/navigation";

const HeroSection = () => {
  const router = useRouter();

  const handleExploreClick = () => {
    router.push('/shop');
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(/assets/hero-floral.jpg)` }}
      >
        <div className="absolute inset-0 bg-hero-gradient opacity-90"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <div className="animate-fade-in">
          {/* Logo */}
          <div className="mb-8">
            <Logo size="xl" className="mx-auto text-foreground" />
          </div>
          
          {/* Tagline */}
          <p className="font-serif text-xl md:text-2xl lg:text-3xl text-muted-foreground mb-2">
            A Floral Fable
          </p>
          
          <p className="font-sans text-base md:text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Where Elegance Meets Simplicity
          </p>
          
          {/* CTA Button */}
          <Button 
            variant="elegant" 
            size="elegant" 
            className="hover:scale-105 transition-transform duration-300"
            onClick={handleExploreClick}
          >
            Explore the Minimal Collection
          </Button>
        </div>
      </div>
      
      {/* Floating elements for added elegance */}
      <div className="absolute top-1/4 left-10 opacity-60 hidden md:block">
        <div className="w-4 h-4 rounded-full bg-primary"></div>
      </div>
      <div className="absolute top-1/3 right-16 opacity-50 hidden md:block">
        <div className="w-6 h-6 rounded-full bg-secondary"></div>
      </div>
      <div className="absolute bottom-1/4 left-1/4 opacity-70 hidden lg:block">
        <div className="w-3 h-3 rounded-full bg-muted"></div>
      </div>
    </section>
  );
};

export default HeroSection;