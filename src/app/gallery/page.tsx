"use client";

import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Instagram, Upload, Heart, Camera } from "lucide-react";

const Gallery = () => {
  // Mock gallery data - in a real app this would come from an API
  const galleryImages = [
    { id: 1, username: "@sarah_blooms", image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600&h=600&fit=crop&crop=face", likes: 24, hashtags: ["#GuloonaAttires", "#MinimalistFashion"] },
    { id: 2, username: "@emma_florals", image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&h=600&fit=crop&crop=face", likes: 31, hashtags: ["#GuloonaAttires", "#ElegantStyle"] },
    { id: 3, username: "@lily_gardens", image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&h=600&fit=crop&crop=face", likes: 18, hashtags: ["#GuloonaAttires", "#CustomDress"] },
    { id: 4, username: "@rose_petals", image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=600&h=600&fit=crop&crop=face", likes: 42, hashtags: ["#GuloonaAttires", "#FloralFashion"] },
    { id: 5, username: "@violet_dreams", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=600&fit=crop&crop=face", likes: 28, hashtags: ["#GuloonaAttires", "#Minimalist"] },
    { id: 6, username: "@daisy_fields", image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&h=600&fit=crop&crop=face", likes: 35, hashtags: ["#GuloonaAttires", "#TimelessStyle"] },
    { id: 7, username: "@jasmine_path", image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&h=600&fit=crop&crop=face", likes: 26, hashtags: ["#GuloonaAttires", "#SoftFemininity"] },
    { id: 8, username: "@orchid_bloom", image: "https://images.unsplash.com/photo-1521577352947-9bb58764b69a?w=600&h=600&fit=crop&crop=face", likes: 39, hashtags: ["#GuloonaAttires", "#ElegantWear"] },
    { id: 9, username: "@tulip_spring", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&h=600&fit=crop&crop=face", likes: 22, hashtags: ["#GuloonaAttires", "#SimpleElegance"] },
  ];

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-24 pb-12 bg-hero-gradient text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="font-serif text-5xl md:text-6xl text-foreground mb-6">
            Gallery
          </h1>
          <p className="font-script text-2xl text-primary mb-4" style={{ color: "color-mix(in hsl, hsl(var(--primary)) 80%, black 20%)" }}>
            #GuloonaAttires
          </p>
          <p className="font-sans text-lg text-muted-foreground max-w-2xl mx-auto">
            A beautiful collection of moments shared by our amazing community. Each photo tells a story of elegance, confidence, and timeless beauty.
          </p>
        </div>
      </section>

      {/* Upload Section */}
      <section className="py-16 bg-background">
        <div className="max-w-4xl mx-auto px-4">
          <Card className="p-8 md:p-12 shadow-soft text-center">
            <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Camera className="w-10 h-10 text-primary" />
            </div>
            <h2 className="font-serif text-3xl text-foreground mb-4">
              Share Your Guloona Moment
            </h2>
            <p className="font-sans text-muted-foreground mb-8 max-w-2xl mx-auto">
              We'd love to see how you style your Guloona pieces! Share your photos with us and become part of our beautiful gallery.
            </p>
            
            <div className="space-y-6">
              {/* Upload Area */}
              <div className="border-2 border-dashed border-border rounded-lg p-8 hover:border-primary transition-colors">
                <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="font-sans text-muted-foreground mb-2">
                  Drag & drop your photo here, or click to browse
                </p>
                <p className="font-sans text-xs text-muted-foreground">
                  Support JPG, PNG files up to 5MB
                </p>
              </div>
              
              {/* Social Media Instructions */}
              <div className="bg-muted/30 rounded-lg p-6">
                <h3 className="font-serif text-xl text-foreground mb-4">Or share on social media:</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-center gap-2 text-muted-foreground">
                    <span className="font-sans">1. Post your photo on Instagram</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-muted-foreground">
                    <span className="font-sans">2. Tag us</span>
                    <span className="font-medium text-primary">@guloona.pk</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-muted-foreground">
                    <span className="font-sans">3. Use hashtag</span>
                    <span className="font-medium text-primary">#GuloonaAttires</span>
                  </div>
                </div>
                <Button variant="elegant" className="mt-6">
                  <Instagram className="w-5 h-5 mr-2" />
                  Follow @guloona.pk
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Filter/Search Bar */}
      <section className="py-8 bg-muted/20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-4">
              <Input 
                placeholder="Search by username or hashtag..." 
                className="w-80"
              />
              <Button variant="outline">Search</Button>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm">#GuloonaAttires</Button>
              <Button variant="ghost" size="sm">#MinimalistFashion</Button>
              <Button variant="ghost" size="sm">#ElegantStyle</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {galleryImages.map((item, index) => (
              <Card key={item.id} className="group overflow-hidden shadow-card hover:shadow-soft transition-all duration-300 animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="relative aspect-square">
                  <img 
                    src={item.image} 
                    alt={`Photo by ${item.username}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="text-center text-white">
                      <Instagram className="w-8 h-8 mx-auto mb-2" />
                      <p className="font-medium">{item.username}</p>
                    </div>
                  </div>
                  
                  {/* Heart Icon */}
                  <button className="absolute top-4 right-4 p-2 bg-background/80 backdrop-blur-sm rounded-full hover:bg-primary hover:text-primary-foreground transition-colors opacity-0 group-hover:opacity-100">
                    <Heart className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <p className="font-medium text-foreground">{item.username}</p>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Heart className="w-4 h-4" />
                      <span className="text-sm">{item.likes}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {item.hashtags.map((tag, tagIndex) => (
                      <span key={tagIndex} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>
          
          {/* Load More Button */}
          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              Load More Photos
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Gallery;
