"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Save, User, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useUserProfile } from "@/contexts/UserProfileContext";
import Link from "next/link";

const ProfileEdit = () => {
  const router = useRouter();
  const { toast } = useToast();
  const { user, isAuthenticated, loading } = useAuth();
  const { profile, updateProfile, getFullName } = useUserProfile();
  
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    location: '',
    bust: '',
    waist: '',
    hips: '',
    shoulder_width: '',
    height: '',
    dress_length_preference: '',
    preferred_colors: [] as string[],
    preferred_fabrics: [] as string[],
    style_preferences: [] as string[],
    size_preference: '',
    budget_range: ''
  });

  const [saving, setSaving] = useState(false);

  // Pre-populate form with existing profile data
  useEffect(() => {
    if (profile) {
      setFormData({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        phone: profile.phone || '',
        location: profile.location || '',
        bust: profile.bust || '',
        waist: profile.waist || '',
        hips: profile.hips || '',
        shoulder_width: profile.shoulder_width || '',
        height: profile.height || '',
        dress_length_preference: profile.dress_length_preference || '',
        preferred_colors: profile.preferred_colors || [],
        preferred_fabrics: profile.preferred_fabrics || [],
        style_preferences: profile.style_preferences || [],
        size_preference: profile.size_preference || '',
        budget_range: profile.budget_range || ''
      });
    }
  }, [profile]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayFieldToggle = (field: 'preferred_colors' | 'preferred_fabrics' | 'style_preferences', value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }));
  };

  const handleSave = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to save your profile.",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    
    try {
      const success = await updateProfile(formData);
      
      if (success) {
        toast({
          title: "Profile Updated",
          description: "Your profile has been saved successfully!",
        });
        router.push('/profile');
      } else {
        toast({
          title: "Update Failed",
          description: "There was an error updating your profile. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Update Failed",
        description: "There was an error updating your profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Redirect if not authenticated
  if (!isAuthenticated) {
    router.push('/');
    return null;
  }

  const colorOptions = ['Blush Pink', 'Sage Green', 'Soft Lavender', 'Cream', 'Dusty Rose', 'Mint', 'Champagne', 'Powder Blue'];
  const fabricOptions = ['Silk', 'Cotton', 'Chiffon', 'Crepe', 'Linen', 'Satin', 'Georgette', 'Tulle'];
  const styleOptions = ['Minimalist', 'Romantic', 'Modern', 'Classic', 'Bohemian', 'Elegant', 'Vintage', 'Contemporary'];

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Header */}
      <section className="pt-24 pb-8 bg-hero-gradient">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center gap-4 mb-6">
            <Link href="/profile">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Profile
              </Button>
            </Link>
          </div>
          
          <h1 className="font-serif text-4xl md:text-5xl text-foreground mb-4">
            Edit Profile
          </h1>
          <p className="font-sans text-lg text-muted-foreground">
            Update your information and preferences to get the best custom dress experience.
          </p>
        </div>
      </section>

      {/* Edit Form */}
      <section className="py-16 bg-background">
        <div className="max-w-4xl mx-auto px-4">
          <Card className="p-8 md:p-12 shadow-soft">
            <div className="space-y-8">
              {/* Personal Information */}
              <div>
                <h2 className="font-serif text-2xl text-foreground mb-6">Personal Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="first_name" className="font-sans font-medium">First Name</Label>
                    <Input 
                      id="first_name"
                      value={formData.first_name}
                      onChange={(e) => handleInputChange('first_name', e.target.value)}
                      placeholder="Your first name"
                      className="mt-2"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="last_name" className="font-sans font-medium">Last Name</Label>
                    <Input 
                      id="last_name"
                      value={formData.last_name}
                      onChange={(e) => handleInputChange('last_name', e.target.value)}
                      placeholder="Your last name"
                      className="mt-2"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="phone" className="font-sans font-medium">Phone Number</Label>
                    <Input 
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="+92 300 1234567"
                      className="mt-2"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="location" className="font-sans font-medium">Location</Label>
                    <Input 
                      id="location"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      placeholder="Your city"
                      className="mt-2"
                    />
                  </div>
                </div>
              </div>

              {/* Measurements */}
              <div>
                <h2 className="font-serif text-2xl text-foreground mb-6">Measurements</h2>
                <p className="font-sans text-sm text-muted-foreground mb-6">
                  Provide your measurements in inches for the best fit.
                </p>
                
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div>
                    <Label htmlFor="bust" className="font-sans font-medium">Bust</Label>
                    <Input 
                      id="bust"
                      value={formData.bust}
                      onChange={(e) => handleInputChange('bust', e.target.value)}
                      placeholder="32"
                      className="mt-2"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="waist" className="font-sans font-medium">Waist</Label>
                    <Input 
                      id="waist"
                      value={formData.waist}
                      onChange={(e) => handleInputChange('waist', e.target.value)}
                      placeholder="26"
                      className="mt-2"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="hips" className="font-sans font-medium">Hips</Label>
                    <Input 
                      id="hips"
                      value={formData.hips}
                      onChange={(e) => handleInputChange('hips', e.target.value)}
                      placeholder="36"
                      className="mt-2"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="shoulder_width" className="font-sans font-medium">Shoulder Width</Label>
                    <Input 
                      id="shoulder_width"
                      value={formData.shoulder_width}
                      onChange={(e) => handleInputChange('shoulder_width', e.target.value)}
                      placeholder="14"
                      className="mt-2"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="height" className="font-sans font-medium">Height</Label>
                    <Input 
                      id="height"
                      value={formData.height}
                      onChange={(e) => handleInputChange('height', e.target.value)}
                      placeholder="65"
                      className="mt-2"
                    />
                  </div>
                </div>
              </div>

              {/* Preferences */}
              <div>
                <h2 className="font-serif text-2xl text-foreground mb-6">Style Preferences</h2>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="dress_length_preference" className="font-sans font-medium">Preferred Dress Length</Label>
                      <Select value={formData.dress_length_preference} onValueChange={(value) => handleInputChange('dress_length_preference', value)}>
                        <SelectTrigger className="mt-2">
                          <SelectValue placeholder="Select length preference" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="mini">Mini (Above Knee)</SelectItem>
                          <SelectItem value="knee">Knee Length</SelectItem>
                          <SelectItem value="midi">Midi (Below Knee)</SelectItem>
                          <SelectItem value="maxi">Maxi (Ankle Length)</SelectItem>
                          <SelectItem value="floor">Floor Length</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="size_preference" className="font-sans font-medium">Size Preference</Label>
                      <Select value={formData.size_preference} onValueChange={(value) => handleInputChange('size_preference', value)}>
                        <SelectTrigger className="mt-2">
                          <SelectValue placeholder="Select size preference" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="xs">Extra Small</SelectItem>
                          <SelectItem value="s">Small</SelectItem>
                          <SelectItem value="m">Medium</SelectItem>
                          <SelectItem value="l">Large</SelectItem>
                          <SelectItem value="xl">Extra Large</SelectItem>
                          <SelectItem value="custom">Custom Fit</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label className="font-sans font-medium">Preferred Colors</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {colorOptions.map((color) => (
                        <Badge
                          key={color}
                          variant={formData.preferred_colors.includes(color) ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => handleArrayFieldToggle('preferred_colors', color)}
                        >
                          {color}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="font-sans font-medium">Preferred Fabrics</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {fabricOptions.map((fabric) => (
                        <Badge
                          key={fabric}
                          variant={formData.preferred_fabrics.includes(fabric) ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => handleArrayFieldToggle('preferred_fabrics', fabric)}
                        >
                          {fabric}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="font-sans font-medium">Style Preferences</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {styleOptions.map((style) => (
                        <Badge
                          key={style}
                          variant={formData.style_preferences.includes(style) ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => handleArrayFieldToggle('style_preferences', style)}
                        >
                          {style}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="budget_range" className="font-sans font-medium">Budget Range</Label>
                    <Select value={formData.budget_range} onValueChange={(value) => handleInputChange('budget_range', value)}>
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select your budget range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0-5000 PKR">0 - 5,000 PKR</SelectItem>
                        <SelectItem value="5000-10000 PKR">5,000 - 10,000 PKR</SelectItem>
                        <SelectItem value="10000-20000 PKR">10,000 - 20,000 PKR</SelectItem>
                        <SelectItem value="20000-50000 PKR">20,000 - 50,000 PKR</SelectItem>
                        <SelectItem value="50000+ PKR">50,000+ PKR</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="pt-6 border-t border-border">
                <div className="flex flex-col sm:flex-row gap-4 justify-between">
                  <div className="text-xs text-muted-foreground flex items-center">
                    <Shield className="w-3 h-3 mr-1" />
                    Your information is saved securely and will help us create the perfect dress for you.
                  </div>
                  
                  <div className="flex gap-3">
                    <Link href="/profile">
                      <Button variant="outline">
                        Cancel
                      </Button>
                    </Link>
                    
                    <Button 
                      onClick={handleSave}
                      variant="elegant"
                      disabled={saving}
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {saving ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ProfileEdit;
