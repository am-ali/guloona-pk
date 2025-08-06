import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Heart, Users, Globe, Leaf } from "lucide-react";

export default function AboutPage() {
  const values = [
    {
      icon: Heart,
      title: "Custom-made with Care",
      description: "Every piece is crafted individually with attention to detail and love for the craft."
    },
    {
      icon: Leaf,
      title: "Sustainability-minded",
      description: "We believe in creating beautiful pieces that are kind to our planet and future generations."
    },
    {
      icon: Globe,
      title: "Global Shipping",
      description: "Bringing Guloona's elegance to women around the world with careful packaging and delivery."
    },
    {
      icon: Users,
      title: "Community Focused",
      description: "Building a community of women who celebrate their unique beauty and support each other."
    }
  ];

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-hero-gradient text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="font-serif text-5xl md:text-6xl text-foreground mb-6">
            Our Story
          </h1>
          <p className="font-script text-2xl text-primary mb-6" style={{ color: "color-mix(in hsl, hsl(var(--primary)) 80%, black 20%)" }}>
            A journey that bloomed in 2021
          </p>
        </div>
      </section>

      {/* Brand Story */}
      <section className="py-16 bg-background">
        <div className="max-w-4xl mx-auto px-4">
          <Card className="p-8 md:p-12 shadow-soft text-center">
            <div className="prose prose-lg mx-auto">
              <p className="font-serif text-xl text-foreground leading-relaxed mb-6">
                Guloona bloomed in 2021, rooted in soft femininity and the timeless beauty of simplicity.
              </p>
              
              <p className="font-sans text-muted-foreground leading-relaxed mb-6">
                Like a delicate flower that finds its way through concrete, Guloona emerged from a vision to create clothing that celebrates the unique beauty of every woman. Our name, meaning "little flower" in Urdu, reflects our belief that beauty lies in the gentle, the graceful, and the authentically feminine.
              </p>
              
              <p className="font-sans text-muted-foreground leading-relaxed mb-6">
                Founded with a passion for minimalist design and a deep appreciation for craftsmanship, we began our journey in a small studio, sketching dreams on paper and bringing them to life through fabric and thread. Each piece tells a story – not just of fashion, but of the woman who wears it.
              </p>
              
              <p className="font-sans text-muted-foreground leading-relaxed">
                Today, Guloona continues to grow, just like the flowers that inspire us. We remain committed to creating pieces that make you feel beautiful, confident, and uniquely yourself. Because in a world of fast fashion, we choose to slow down and celebrate the artistry of thoughtful design.
              </p>
            </div>
          </Card>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-muted/20">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="font-serif text-4xl text-foreground mb-4">Meet Our Team</h2>
          <p className="font-sans text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
            The passionate individuals behind every Guloona creation
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Team members would go here - using placeholder for now */}
            <Card className="p-6 shadow-card hover:shadow-soft transition-all duration-300">
              <div className="w-32 h-32 bg-primary/20 rounded-full mx-auto mb-6 flex items-center justify-center">
                <Heart className="w-12 h-12 text-primary" />
              </div>
              <h3 className="font-serif text-xl text-foreground mb-2">Founder & Designer</h3>
              <p className="font-sans text-muted-foreground">
                Bringing vision to life through timeless designs and attention to detail.
              </p>
            </Card>
            
            <Card className="p-6 shadow-card hover:shadow-soft transition-all duration-300">
              <div className="w-32 h-32 bg-secondary/20 rounded-full mx-auto mb-6 flex items-center justify-center">
                <Users className="w-12 h-12 text-secondary" />
              </div>
              <h3 className="font-serif text-xl text-foreground mb-2">Artisan Team</h3>
              <p className="font-sans text-muted-foreground">
                Skilled craftspeople who pour their expertise into every stitch and seam.
              </p>
            </Card>
            
            <Card className="p-6 shadow-card hover:shadow-soft transition-all duration-300">
              <div className="w-32 h-32 bg-accent/20 rounded-full mx-auto mb-6 flex items-center justify-center">
                <Globe className="w-12 h-12 text-accent" />
              </div>
              <h3 className="font-serif text-xl text-foreground mb-2">Community Relations</h3>
              <p className="font-sans text-muted-foreground">
                Connecting with our beautiful community and ensuring every customer feels special.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Brand Values */}
      <section className="py-16 bg-background">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl text-foreground mb-4">Our Values</h2>
            <p className="font-sans text-lg text-muted-foreground max-w-2xl mx-auto">
              The principles that guide everything we do at Guloona
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="p-8 shadow-card hover:shadow-soft transition-all duration-300 animate-fade-in" style={{ animationDelay: `${index * 200}ms` }}>
                <div className="flex items-start space-x-6">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
                      <value.icon className="w-8 h-8 text-primary" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-serif text-xl text-foreground mb-3">{value.title}</h3>
                    <p className="font-sans text-muted-foreground leading-relaxed">{value.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-primary/10">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="font-serif text-4xl text-foreground mb-6">
            Join Our Story
          </h2>
          <p className="font-sans text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Be part of the Guloona community. Follow our journey, share your moments, and let's celebrate the beauty of femininity together.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="https://instagram.com/guloona.pk" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-full font-medium hover:scale-105 transition-transform duration-300"
            >
              Follow Our Journey
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
