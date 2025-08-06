import { Instagram, Heart } from "lucide-react";

const CustomerSpotlight = () => {
  // Mock customer photos - in a real app these would come from an API
  const customerPhotos = [
    { id: 1, username: "@sarah_blooms", image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=400&fit=crop&crop=face" },
    { id: 2, username: "@emma_florals", image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face" },
    { id: 3, username: "@lily_gardens", image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop&crop=face" },
    { id: 4, username: "@rose_petals", image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face" },
    { id: 5, username: "@violet_dreams", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face" },
    { id: 6, username: "@daisy_fields", image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=400&fit=crop&crop=face" }
  ];

  return (
    <section className="py-20 px-4 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Heart className="w-6 h-6 text-primary" />
            <h2 className="font-serif text-4xl md:text-5xl text-foreground">
              Shared by You
            </h2>
            <Heart className="w-6 h-6 text-primary" />
          </div>
          <p className="font-script text-2xl text-primary mb-2" style={{ color: "color-mix(in hsl, hsl(var(--primary)) 80%, black 20%)" }}>
            #GuloonaAttires
          </p>
          <p className="font-sans text-lg text-muted-foreground max-w-2xl mx-auto">
            Our beautiful community wearing Guloona with grace and elegance
          </p>
        </div>

        {/* Customer Photos Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
          {customerPhotos.map((photo, index) => (
            <div 
              key={photo.id}
              className="group relative aspect-square rounded-2xl overflow-hidden shadow-card hover:shadow-soft transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <img 
                src={photo.image} 
                alt={`Customer ${photo.username}`}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div className="text-center text-white">
                  <Instagram className="w-6 h-6 mx-auto mb-2" />
                  <p className="text-sm font-medium">{photo.username}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center bg-card rounded-3xl p-8 shadow-card">
          <h3 className="font-serif text-2xl md:text-3xl text-foreground mb-4">
            Share Your Guloona Moment
          </h3>
          <p className="font-sans text-muted-foreground mb-6 max-w-lg mx-auto">
            Tag us <span className="font-medium text-primary">@guloona.pk</span> and use 
            <span className="font-medium text-primary"> #GuloonaAttires</span> to be featured
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="https://instagram.com/guloona.pk" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-medium hover:scale-105 transition-transform duration-300"
            >
              <Instagram className="w-5 h-5" />
              Follow @guloona.pk
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CustomerSpotlight;