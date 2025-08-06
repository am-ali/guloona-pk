"use client";

import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import UploadModal from "@/components/UploadModal";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Instagram, Upload, Heart, Camera, User, Calendar, Hash } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface GalleryPost {
  _id: string;
  user_id: string;
  username: string;
  user_email: string;
  image_url: string;
  caption: string;
  hashtags: string[];
  likes: number;
  liked_by: string[];
  created_at: string;
}

const Gallery = () => {
  const { user, isAuthenticated, openAuthModal } = useAuth();
  const { toast } = useToast();
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [posts, setPosts] = useState<GalleryPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/gallery');
      if (response.ok) {
        const data = await response.json();
        setPosts(data.posts || []);
      } else {
        console.error('Failed to fetch posts');
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleUploadClick = () => {
    if (!isAuthenticated) {
      toast({
        title: "Sign In Required",
        description: "Please sign in to upload photos to the gallery.",
        variant: "destructive",
      });
      openAuthModal();
      return;
    }
    setIsUploadModalOpen(true);
  };

  const handleLike = async (postId: string) => {
    if (!isAuthenticated) {
      toast({
        title: "Sign In Required",
        description: "Please sign in to like photos.",
        variant: "destructive",
      });
      openAuthModal();
      return;
    }

    try {
      const response = await fetch('/api/gallery/like', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          post_id: postId,
          user_id: user?.id,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setPosts(prevPosts => 
          prevPosts.map(post => 
            post._id === postId 
              ? { ...post, likes: data.post.likes, liked_by: data.post.liked_by }
              : post
          )
        );
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      toast({
        title: "Error",
        description: "Failed to update like. Please try again.",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
    });
  };

  const hasUserLiked = (post: GalleryPost) => {
    return user?.id && post.liked_by.includes(user.id);
  };

  const filteredPosts = posts.filter(post => 
    post.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.caption.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.hashtags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Mock gallery data for fallback if no posts are available
  const mockGalleryImages = [
    { id: 1, username: "@sarah_blooms", image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600&h=600&fit=crop&crop=face", likes: 24, hashtags: ["#GuloonaAttires", "#MinimalistFashion"] },
    { id: 2, username: "@emma_florals", image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&h=600&fit=crop&crop=face", likes: 31, hashtags: ["#GuloonaAttires", "#ElegantStyle"] },
    { id: 3, username: "@lily_gardens", image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&h=600&fit=crop&crop=face", likes: 18, hashtags: ["#GuloonaAttires", "#CustomDress"] },
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
              <div 
                className="border-2 border-dashed border-border rounded-lg p-8 hover:border-primary transition-colors cursor-pointer"
                onClick={handleUploadClick}
              >
                <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="font-sans text-muted-foreground mb-2">
                  Click here to upload your photo
                </p>
                <p className="font-sans text-xs text-muted-foreground">
                  {isAuthenticated ? "Add captions and hashtags to your upload" : "Sign in required to upload"}
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
                placeholder="Search by username, caption, or hashtag..." 
                className="w-80"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setSearchTerm("#GuloonaAttires")}
              >
                #GuloonaAttires
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setSearchTerm("#MinimalistFashion")}
              >
                #MinimalistFashion
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setSearchTerm("#ElegantStyle")}
              >
                #ElegantStyle
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Loading gallery...</p>
            </div>
          ) : (
            <>
              {/* Real Posts from Database */}
              {filteredPosts.length > 0 && (
                <div className="mb-16">
                  <h3 className="font-serif text-2xl text-foreground mb-8 text-center">
                    Community Uploads
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredPosts.map((post, index) => (
                      <Card key={post._id} className="group overflow-hidden shadow-card hover:shadow-soft transition-all duration-300 animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                        <div className="relative aspect-square">
                          <img 
                            src={post.image_url} 
                            alt={`Photo by ${post.username}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          
                          {/* Overlay */}
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <div className="text-center text-white p-4">
                              <User className="w-8 h-8 mx-auto mb-2" />
                              <p className="font-medium">{post.username}</p>
                              {post.caption && (
                                <p className="text-sm mt-2 opacity-90">{post.caption}</p>
                              )}
                            </div>
                          </div>
                          
                          {/* Heart Icon */}
                          <button 
                            className={`absolute top-4 right-4 p-2 backdrop-blur-sm rounded-full transition-all opacity-0 group-hover:opacity-100 ${
                              hasUserLiked(post) 
                                ? 'bg-red-500 text-white' 
                                : 'bg-background/80 hover:bg-primary hover:text-primary-foreground'
                            }`}
                            onClick={() => handleLike(post._id)}
                          >
                            <Heart className={`w-5 h-5 ${hasUserLiked(post) ? 'fill-current' : ''}`} />
                          </button>
                        </div>
                        
                        <div className="p-6">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4 text-muted-foreground" />
                              <p className="font-medium text-foreground">{post.username}</p>
                            </div>
                            <div className="flex items-center gap-4 text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Heart className="w-4 h-4" />
                                <span className="text-sm">{post.likes}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                <span className="text-sm">{formatDate(post.created_at)}</span>
                              </div>
                            </div>
                          </div>
                          
                          {post.caption && (
                            <p className="text-sm text-muted-foreground mb-3">{post.caption}</p>
                          )}
                          
                          <div className="flex flex-wrap gap-2">
                            {post.hashtags.map((tag, tagIndex) => (
                              <Badge key={tagIndex} variant="secondary" className="text-xs">
                                <Hash className="w-3 h-3 mr-1" />
                                {tag.replace('#', '')}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Mock Gallery Data */}
              <div>
                <h3 className="font-serif text-2xl text-foreground mb-8 text-center">
                  Featured Gallery
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {mockGalleryImages.map((item, index) => (
                    <Card key={item.id} className="group overflow-hidden shadow-card hover:shadow-soft transition-all duration-300 animate-fade-in" style={{ animationDelay: `${(filteredPosts.length + index) * 100}ms` }}>
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
                            <Badge key={tagIndex} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Upload Modal */}
      <UploadModal 
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUploadSuccess={() => {
          fetchPosts(); // Refresh posts after successful upload
          setIsUploadModalOpen(false);
        }}
      />

      <Footer />
    </div>
  );
};

export default Gallery;
