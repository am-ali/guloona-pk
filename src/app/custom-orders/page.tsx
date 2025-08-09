"use client";

import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Scissors, Heart, Sparkles, User, Shield } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useUserProfile } from "@/contexts/UserProfileContext";
import emailjs from '@emailjs/browser';

const CustomOrders = () => {
  const { toast } = useToast();
  const { user, isAuthenticated, loading, openAuthModal } = useAuth();
  const { profile, getFullName, saveCustomOrderDataToProfile } = useUserProfile();
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    occasion: '',
    fabric: '',
    bust: '',
    waist: '',
    hips: '',
    shoulder_width: '',
    height: '',
    notes: '',
    budget: ''
  });

  // Auto-fill user data when authenticated
  useEffect(() => {
    if (user && isAuthenticated && profile) {
      setFormData(prev => ({
        ...prev,
        name: getFullName() || prev.name,
        email: user.email || prev.email,
        phone: profile.phone || prev.phone,
        location: profile.location || prev.location,
        bust: profile.bust || prev.bust,
        waist: profile.waist || prev.waist,
        hips: profile.hips || prev.hips,
        shoulder_width: profile.shoulder_width || prev.shoulder_width,
        height: profile.height || prev.height,
        // Auto-select preferred fabric if only one is selected
        fabric: profile.preferred_fabrics?.length === 1 ? profile.preferred_fabrics[0] : prev.fabric,
        // Auto-populate budget from range
        budget: profile.budget_range ? profile.budget_range.replace('PKR', '').trim() : prev.budget,
      }));
    } else if (user && isAuthenticated && !profile) {
      // Fallback to auth data if no profile yet
      const firstName = user.user_metadata?.first_name || '';
      const lastName = user.user_metadata?.last_name || '';
      const fullName = `${firstName} ${lastName}`.trim();
      
      setFormData(prev => ({
        ...prev,
        name: fullName || prev.name,
        email: user.email || prev.email
      }));
    }
  }, [user, isAuthenticated, profile, getFullName]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    
    if (selectedFiles.length === 0) return;
    
    const validFiles = selectedFiles.filter(file => {
      const isValidType = file.type.startsWith('image/');
      const isValidSize = file.size <= 2 * 1024 * 1024; // 2MB per file
      
      if (!isValidType) {
        toast({
          title: "Invalid File Type",
          description: `${file.name} is not an image file.`,
          variant: "destructive",
        });
        return false;
      }
      
      if (!isValidSize) {
        toast({
          title: "File Too Large",
          description: `${file.name} is larger than 2MB. Please select a smaller image.`,
          variant: "destructive",
        });
        return false;
      }
      
      return true;
    });

    if (validFiles.length > 0) {
      const currentFiles = files.length;
      const newFiles = validFiles.slice(0, 3 - currentFiles); // Only add up to max 3 total
      
      if (newFiles.length < validFiles.length) {
        toast({
          title: "Too Many Files",
          description: `Only ${newFiles.length} files added. Maximum 3 files allowed.`,
        });
      }
      
      setFiles(prev => [...prev, ...newFiles]);
      
      if (newFiles.length > 0) {
        toast({
          title: "Files Added",
          description: `${newFiles.length} photo(s) selected successfully.`,
        });
      }
    }
    
    // Reset the input so the same file can be selected again if needed
    e.target.value = '';
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const resizeImage = (file: File, maxWidth: number = 600, quality: number = 0.5): Promise<string> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        try {
          // Calculate new dimensions
          let { width, height } = img;
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
          
          canvas.width = width;
          canvas.height = height;
          
          // Draw and compress
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
            resolve(compressedDataUrl);
          } else {
            reject(new Error('Canvas context not available'));
          }
        } catch (error) {
          reject(error);
        }
      };
      
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(file);
    });
  };

  const convertFilesToBase64 = async (files: File[]): Promise<string[]> => {
    const results: string[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        console.log(`Processing file ${i + 1}:`, file.name, `(${(file.size / 1024 / 1024).toFixed(2)}MB)`);
        
        // Resize and compress the image
        const compressedDataUrl = await resizeImage(file, 600, 0.5); // Smaller size, lower quality
        
        console.log(`Compressed file ${i + 1}:`, `${(compressedDataUrl.length / 1024).toFixed(2)}KB`);
        results.push(compressedDataUrl);
        
      } catch (error) {
        console.error(`Error processing file ${file.name}:`, error);
        
        // Fallback to original file conversion with smaller size
        try {
          const fallbackDataUrl = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
          });
          
          // If fallback is also too large, skip this file
          if (fallbackDataUrl.length > 500000) { // 500KB limit for fallback
            console.warn(`Skipping ${file.name} - too large even for fallback`);
            continue;
          }
          
          results.push(fallbackDataUrl);
        } catch (fallbackError) {
          console.error(`Fallback failed for ${file.name}:`, fallbackError);
          // Skip this file entirely
        }
      }
    }
    
    return results;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check authentication first
    if (!isAuthenticated) {
      toast({
        title: "Sign In Required",
        description: "Please sign in to your account to place a custom order.",
        variant: "destructive",
      });
      openAuthModal();
      return;
    }
    
    setLoadingSubmit(true);

    // Basic validation
    if (!formData.name || !formData.email || !formData.occasion) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields (Name, Email, and Occasion).",
        variant: "destructive",
      });
      setLoadingSubmit(false);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address to receive order confirmation.",
        variant: "destructive",
      });
      setLoadingSubmit(false);
      return;
    }

    try {
      // Convert files to base64 if any
      let attachments = '';
      let base64Files: string[] = [];
      if (files.length > 0) {
        toast({
          title: "Processing Images",
          description: `Compressing ${files.length} photo(s)...`,
        });
        
        try {
          base64Files = await convertFilesToBase64(files);
          
          if (base64Files.length === 0) {
            toast({
              title: "No Images Processed",
              description: "All images were too large to include. Order will be sent without photos.",
            });
            attachments = 'Images were too large to include - customer will send separately';
          } else {
            // Check total size to prevent 413 error
            const totalSize = base64Files.join('').length;
            console.log('Total base64 size:', totalSize, 'characters', `(${(totalSize / 1024).toFixed(2)}KB)`);
            
            if (totalSize > 800000) { // 800KB limit
              toast({
                title: "Images Too Large",
                description: "Some images may be too large. Reducing quality further...",
              });
              
              // Try with even smaller images
              const smallerFiles = await Promise.all(
                files.map(file => resizeImage(file, 400, 0.3).catch(() => null))
              );
              
              const validSmaller = smallerFiles.filter(Boolean) as string[];
              const smallerTotalSize = validSmaller.join('').length;
              
              if (smallerTotalSize > 800000) {
                toast({
                  title: "Images Still Too Large",
                  description: "Order will be sent without photos. Please email images separately.",
                  variant: "destructive",
                });
                attachments = 'Images were too large to include in email - customer will send separately';
                base64Files = []; // Clear base64Files so no photos are sent
              } else {
                attachments = validSmaller.map((file, index) => 
                  `Photo ${index + 1} attached (${(file.length / 1024).toFixed(1)}KB)`
                ).join(', ');
                base64Files = validSmaller; // Use the smaller files
              }
            } else {
              attachments = base64Files.map((file, index) => 
                `Photo ${index + 1} attached (${(file.length / 1024).toFixed(1)}KB)`
              ).join(', ');
            }
          }
        } catch (imageError) {
          console.error('Error processing images:', imageError);
          toast({
            title: "Image Processing Error",
            description: "Failed to process images. Order will be sent without photos.",
          });
          attachments = 'Image processing failed - customer has photos to send separately';
          base64Files = [];
        }
      }

      // Prepare template parameters for business order request
      const businessTemplateParams: Record<string, any> = {
        is_order_request: true,
        is_order_confirmation: false,
        customer_name: formData.name,
        customer_email: formData.email,
        customer_phone: formData.phone || 'Not provided',
        customer_location: formData.location || 'Not provided',
        occasion: formData.occasion,
        fabric_preference: formData.fabric || 'Not specified',
        measurements: `Bust: ${formData.bust || 'N/A'}, Waist: ${formData.waist || 'N/A'}, Hips: ${formData.hips || 'N/A'}, Shoulder Width: ${formData.shoulder_width || 'N/A'}, Height: ${formData.height || 'N/A'}`,
        special_notes: formData.notes || 'No special notes',
        budget_range: formData.budget || 'Not specified',
        order_date: new Date().toLocaleDateString(),
        inspiration_photos: base64Files.length > 0 ? `${base64Files.length} inspiration photo(s) attached below` : 'No inspiration photos uploaded',
        photo_count: files.length,
        to_email: 'mf3579753@gmail.com',
        title: 'New Custom Order Request',
        // Add user account information for tracking
        user_id: user?.id || 'N/A',
        account_created: user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'
      };

      // Add photos as embedded images in the email content
      if (base64Files.length > 0) {
        base64Files.forEach((file, index) => {
          businessTemplateParams[`photo_${index + 1}`] = `<img src="${file}" style="max-width: 300px; height: auto; margin: 10px 0; border: 1px solid #ddd;" alt="Inspiration Photo ${index + 1}">`;
        });
      }

      console.log('Sending business email with params:', { 
        ...businessTemplateParams, 
        photo_1: base64Files.length > 0 ? '[IMAGE DATA]' : undefined,
        photo_2: base64Files.length > 1 ? '[IMAGE DATA]' : undefined,
        photo_3: base64Files.length > 2 ? '[IMAGE DATA]' : undefined
      });

      // Send email to business
      const businessResult = await emailjs.send(
        'service_7nyhtwa', // Your service ID
        'template_zhhu4ze', // Your unified template ID
        {
          ...businessTemplateParams,
          // Explicitly set business email as recipient
          email_to: 'mf3579753@gmail.com',
          reply_to: formData.email // Customer email for replies
        },
        '_B6C941BwUkezMBxg' // Your public key
      );

      console.log('Business email sent successfully:', businessResult);

      // Update status
      toast({
        title: "Business Email Sent",
        description: "Sending confirmation email to customer...",
      });

      // Prepare template parameters for customer confirmation
      const customerTemplateParams = {
        is_order_request: false,
        is_order_confirmation: true,
        customer_name: formData.name,
        customer_email: formData.email,
        occasion: formData.occasion,
        fabric_preference: formData.fabric || 'Not specified',
        budget_range: formData.budget || 'Not specified',
        order_date: new Date().toLocaleDateString(),
        special_notes: formData.notes && formData.notes.trim() !== '' ? formData.notes : 'None provided',
        measurements: `Bust: ${formData.bust || 'N/A'}, Waist: ${formData.waist || 'N/A'}, Hips: ${formData.hips || 'N/A'}, Shoulder Width: ${formData.shoulder_width || 'N/A'}, Height: ${formData.height || 'N/A'}`,
        photo_count: files.length,
        to_email: formData.email, // Send to customer's email
        // Don't include photos in customer confirmation to reduce size
        inspiration_photos: files.length > 0 ? `${files.length} inspiration photo(s) received` : 'No photos uploaded',
        title: 'Custom Order Confirmation',
        // Add order tracking information
        order_id: `CO-${Date.now()}-${user?.id?.slice(-6)}` // Simple order ID format
      };

      console.log('Sending customer email with params:', customerTemplateParams);

      // Send confirmation email to customer
      try {
        // For customer email, we need to use a different approach to ensure it goes to the customer
        const customerResult = await emailjs.send(
          'service_7nyhtwa', // Same service ID
          'template_zhhu4ze', // Same unified template ID
          {
            ...customerTemplateParams,
            // Explicitly set the recipient email
            reply_to: formData.email,
            email_to: formData.email
          },
          '_B6C941BwUkezMBxg' // Same public key
        );
        console.log('Customer email sent successfully:', customerResult);
      } catch (customerEmailError) {
        console.error('Error sending customer confirmation:', customerEmailError);
        // Don't fail the whole process if customer email fails
        toast({
          title: "Order Submitted Successfully!",
          description: "Your order was received, but we couldn't send a confirmation email. We'll contact you directly within 24 hours.",
        });
        return;
      }

      toast({
        title: "Order Submitted Successfully!",
        description: "We've received your custom order request and sent you a confirmation email. We'll get back to you within 24 hours with a detailed quote.",
      });

      // Save order data to user profile for future use
      try {
        await saveCustomOrderDataToProfile(formData);
        console.log('Order data saved to profile');
      } catch (profileError) {
        console.error('Error saving order data to profile:', profileError);
        // Don't fail the main process if profile saving fails
      }

      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        location: '',
        occasion: '',
        fabric: '',
        bust: '',
        waist: '',
        hips: '',
        shoulder_width: '',
        height: '',
        notes: '',
        budget: ''
      });
      setFiles([]);

    } catch (error) {
      console.error('Error sending custom order:', error);
      
      // More specific error handling
      let errorMessage = "There was an issue submitting your order. Please try again or contact us directly at mf3579753@gmail.com";
      let errorTitle = "Error Sending Order";
      
      if (error instanceof Error) {
        console.error('Error details:', error.message);
        
        if (error.message.includes('Invalid email')) {
          errorTitle = "Email Error";
          errorMessage = "Please check your email address and try again.";
        } else if (error.message.includes('template') || error.message.includes('Template')) {
          errorTitle = "Configuration Error";
          errorMessage = "Email template configuration issue. Please contact support.";
        } else if (error.message.includes('service') || error.message.includes('Service')) {
          errorTitle = "Service Error";  
          errorMessage = "Email service temporarily unavailable. Please try again in a few minutes.";
        } else if (error.message.includes('401') || error.message.includes('403')) {
          errorTitle = "Authentication Error";
          errorMessage = "Email service authentication failed. Please contact support.";
        } else if (error.message.includes('413') || error.message.includes('Payload Too Large')) {
          errorTitle = "File Size Error";
          errorMessage = "Images are too large for email. Please select smaller images or fewer files.";
        } else if (error.message.includes('network') || error.message.includes('Network')) {
          errorTitle = "Network Error";
          errorMessage = "Please check your internet connection and try again.";
        }
      }
      
      toast({
        title: errorTitle,
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoadingSubmit(false);
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

  // Show sign-in prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen">
        <Navigation />
        
        {/* Hero Section */}
        <section className="pt-24 pb-8 lg:pb-12 bg-hero-gradient text-center">
          <div className="max-w-4xl mx-auto px-4">
            <h1 className="font-serif text-4xl lg:text-5xl xl:text-6xl text-foreground mb-4 lg:mb-6">
              Custom Orders
            </h1>
            <p className="font-script text-xl lg:text-2xl text-primary mb-3 lg:mb-4" style={{ color: "color-mix(in hsl, hsl(var(--primary)) 80%, black 20%)" }}>
              "Every flower is unique - so are you"
            </p>
            <p className="font-sans text-sm lg:text-lg text-muted-foreground max-w-2xl mx-auto">
              Let us create something just for you. Share your vision, and we'll bring it to life with our signature touch of elegance and simplicity.
            </p>
          </div>
        </section>

        {/* Sign In Required Section */}
        <section className="py-16 bg-background">
          <div className="max-w-2xl mx-auto px-4 text-center">
            <Card className="p-8 md:p-12 shadow-soft">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="w-10 h-10 text-primary" />
              </div>
              
              <h2 className="font-serif text-3xl text-foreground mb-4">
                Account Required
              </h2>
              
              <p className="font-sans text-muted-foreground mb-6 text-lg">
                To place a custom order and ensure we can track your request properly, please sign in to your account or create one.
              </p>
              
              <div className="space-y-4">
                <Button 
                  onClick={openAuthModal}
                  variant="elegant" 
                  size="elegant" 
                  className="min-w-48"
                >
                  <User className="w-4 h-4 mr-2" />
                  Sign In / Create Account
                </Button>
                
                <p className="font-sans text-sm text-muted-foreground">
                  Already have an account? Your information will be automatically filled in.
                </p>
              </div>
              
              {/* Benefits of having an account */}
              <div className="mt-8 pt-6 border-t border-border">
                <h3 className="font-serif text-xl text-foreground mb-4">Why Create an Account?</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <p className="font-sans text-sm text-muted-foreground">Track your custom order status</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <p className="font-sans text-sm text-muted-foreground">Save your measurements for future orders</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <p className="font-sans text-sm text-muted-foreground">Auto-filled contact information</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <p className="font-sans text-sm text-muted-foreground">Receive order updates via email</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </section>

        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-24 pb-12 bg-hero-gradient text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="font-serif text-5xl md:text-6xl text-foreground mb-6">
            Custom Orders
          </h1>
          <p className="font-script text-2xl text-primary mb-4" style={{ color: "color-mix(in hsl, hsl(var(--primary)) 80%, black 20%)" }}>
            "Every flower is unique - so are you"
          </p>
          <p className="font-sans text-lg text-muted-foreground max-w-2xl mx-auto">
            Let us create something just for you. Share your vision, and we'll bring it to life with our signature touch of elegance and simplicity.
          </p>
        </div>
      </section>

      {/* Process Steps */}
      <section className="py-8 lg:py-16 bg-background">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="font-serif text-2xl lg:text-4xl text-center text-foreground mb-8 lg:mb-12">How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            <Card className="text-center p-6 lg:p-8 shadow-card hover:shadow-soft transition-all duration-300">
              <div className="w-16 h-16 lg:w-20 lg:h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-6 lg:mb-8">
                <Heart className="w-8 h-8 lg:w-10 lg:h-10 text-primary-foreground" />
              </div>
              <h3 className="font-serif text-lg lg:text-xl text-foreground mb-4 lg:mb-6">1. Share Your Vision</h3>
              <p className="font-sans text-sm lg:text-base text-muted-foreground leading-relaxed">
                Tell us about your dream dress. Share inspiration photos, describe your style, and let us know the occasion.
              </p>
            </Card>

            <Card className="text-center p-6 lg:p-8 shadow-card hover:shadow-soft transition-all duration-300">
              <div className="w-16 h-16 lg:w-20 lg:h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6 lg:mb-8">
                <Scissors className="w-8 h-8 lg:w-10 lg:h-10 text-foreground" />
              </div>
              <h3 className="font-serif text-lg lg:text-xl text-foreground mb-4 lg:mb-6">2. We Design & Create</h3>
              <p className="font-sans text-sm lg:text-base text-muted-foreground leading-relaxed">
                Our skilled artisans will carefully craft your unique piece with attention to every detail and finish.
              </p>
            </Card>

            <Card className="text-center p-6 lg:p-8 shadow-card hover:shadow-soft transition-all duration-300">
              <div className="w-16 h-16 lg:w-20 lg:h-20 bg-accent rounded-full flex items-center justify-center mx-auto mb-6 lg:mb-8">
                <Sparkles className="w-8 h-8 lg:w-10 lg:h-10 text-foreground" />
              </div>
              <h3 className="font-serif text-lg lg:text-xl text-foreground mb-4 lg:mb-6">3. Receive Your Masterpiece</h3>
              <p className="font-sans text-sm lg:text-base text-muted-foreground leading-relaxed">
                Your custom creation will be delivered with care, ready to make you feel beautiful and confident.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Custom Order Form */}
      <section className="py-8 lg:py-16 bg-muted/20">
        <div className="max-w-4xl mx-auto px-4">
          <Card className="p-4 lg:p-8 xl:p-12 shadow-soft">
            <h2 className="font-serif text-2xl lg:text-4xl text-center text-foreground mb-6 lg:mb-8">
              Start Your Custom Order
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6 lg:space-y-8">
              {/* Personal Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                <div>
                  <Label htmlFor="name" className="font-sans font-medium text-sm lg:text-base">
                    Full Name *
                    <span className="text-xs text-muted-foreground ml-2">(from your account)</span>
                  </Label>
                  <Input 
                    id="name" 
                    placeholder="Your full name" 
                    className="mt-1.5 lg:mt-2 bg-muted/50"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    You can edit this if needed
                  </p>
                </div>
                <div>
                  <Label htmlFor="email" className="font-sans font-medium text-sm lg:text-base">
                    Email Address *
                    <span className="text-xs text-muted-foreground ml-2">(from your account)</span>
                  </Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="your@email.com" 
                    className="mt-1.5 lg:mt-2 bg-muted/50"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Order confirmations will be sent here
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                <div>
                  <Label htmlFor="phone" className="font-sans font-medium text-sm lg:text-base">Phone Number</Label>
                  <Input 
                    id="phone" 
                    placeholder="+92 300 1234567" 
                    className="mt-1.5 lg:mt-2"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="location" className="font-sans font-medium text-sm lg:text-base">Location/City</Label>
                  <Input 
                    id="location" 
                    placeholder="Your city" 
                    className="mt-1.5 lg:mt-2"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                  />
                </div>
              </div>

              {/* Dress Specifications */}
              <div className="space-y-4 lg:space-y-6">
                <h3 className="font-serif text-xl lg:text-2xl text-foreground">Dress Details</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                  <div>
                    <Label htmlFor="occasion" className="font-sans font-medium text-sm lg:text-base">Occasion *</Label>
                    <Select value={formData.occasion} onValueChange={(value) => handleInputChange('occasion', value)}>
                      <SelectTrigger className="mt-1.5 lg:mt-2">
                        <SelectValue placeholder="Select occasion" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="casual">Casual</SelectItem>
                        <SelectItem value="formal">Formal</SelectItem>
                        <SelectItem value="wedding">Wedding</SelectItem>
                        <SelectItem value="festive">Festive</SelectItem>
                        <SelectItem value="party">Party</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="fabric" className="font-sans font-medium text-sm lg:text-base">Fabric Preference</Label>
                    <Select value={formData.fabric} onValueChange={(value) => handleInputChange('fabric', value)}>
                      <SelectTrigger className="mt-1.5 lg:mt-2">
                        <SelectValue placeholder="Select fabric" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="silk">Silk</SelectItem>
                        <SelectItem value="cotton">Cotton</SelectItem>
                        <SelectItem value="chiffon">Chiffon</SelectItem>
                        <SelectItem value="crepe">Crepe</SelectItem>
                        <SelectItem value="linen">Linen</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Measurements */}
              <div className="space-y-4 lg:space-y-6">
                <h3 className="font-serif text-xl lg:text-2xl text-foreground">Measurements</h3>
                <p className="font-sans text-xs lg:text-sm text-muted-foreground">
                  Please provide your measurements in inches. We'll also schedule a fitting call to ensure perfect fit.
                </p>
                
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3 lg:gap-4">
                  <div>
                    <Label htmlFor="bust" className="font-sans font-medium text-sm lg:text-base">Bust</Label>
                    <Input 
                      id="bust" 
                      placeholder="32" 
                      className="mt-1.5 lg:mt-2"
                      value={formData.bust}
                      onChange={(e) => handleInputChange('bust', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="waist" className="font-sans font-medium text-sm lg:text-base">Waist</Label>
                    <Input 
                      id="waist" 
                      placeholder="26" 
                      className="mt-1.5 lg:mt-2"
                      value={formData.waist}
                      onChange={(e) => handleInputChange('waist', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="hips" className="font-sans font-medium text-sm lg:text-base">Hips</Label>
                    <Input 
                      id="hips" 
                      placeholder="36" 
                      className="mt-1.5 lg:mt-2"
                      value={formData.hips}
                      onChange={(e) => handleInputChange('hips', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="shoulder_width" className="font-sans font-medium text-sm lg:text-base">Shoulder Width</Label>
                    <Input 
                      id="shoulder_width" 
                      placeholder="14" 
                      className="mt-1.5 lg:mt-2"
                      value={formData.shoulder_width}
                      onChange={(e) => handleInputChange('shoulder_width', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="height" className="font-sans font-medium text-sm lg:text-base">Height</Label>
                    <Input 
                      id="height" 
                      placeholder="65" 
                      className="mt-1.5 lg:mt-2"
                      value={formData.height}
                      onChange={(e) => handleInputChange('height', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Inspiration Upload */}
              <div>
                <Label htmlFor="inspiration" className="font-sans font-medium text-sm lg:text-base">
                  Inspiration Photos ({files.length}/3)
                </Label>
                <div 
                  className="mt-1.5 lg:mt-2 border-2 border-dashed border-border rounded-lg p-4 lg:p-8 text-center hover:border-primary transition-colors cursor-pointer"
                  onClick={() => document.getElementById('file-input')?.click()}
                >
                  <Upload className="w-8 h-8 lg:w-12 lg:h-12 text-muted-foreground mx-auto mb-3 lg:mb-4" />
                  <p className="font-sans text-sm lg:text-base text-muted-foreground mb-1 lg:mb-2">
                    Drag & drop your inspiration photos here, or click to browse
                  </p>
                  <p className="font-sans text-xs text-muted-foreground">
                    Support JPG, PNG files up to 2MB each (Max 3 files for email compatibility)
                  </p>
                  <input
                    id="file-input"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>

                {/* File Preview */}
                {files.length > 0 && (
                  <div className="mt-3 lg:mt-4 space-y-2">
                    <p className="font-sans text-sm font-medium">Selected Files:</p>
                    {files.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-muted p-2 rounded text-sm">
                        <span className="font-sans truncate">{file.name}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(index)}
                          className="text-red-500 hover:text-red-700 text-xs"
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Special Notes */}
              <div>
                <Label htmlFor="notes" className="font-sans font-medium text-sm lg:text-base">Special Notes & Details</Label>
                <Textarea 
                  id="notes"
                  placeholder="Tell us about your vision, preferred colors, specific details, or any special requests..."
                  className="mt-1.5 lg:mt-2 min-h-[100px] lg:min-h-[120px]"
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                />
              </div>

              {/* Budget Range */}
              <div>
                <Label htmlFor="budget" className="font-sans font-medium text-sm lg:text-base">Budget Range</Label>
                <Select value={formData.budget} onValueChange={(value) => handleInputChange('budget', value)}>
                  <SelectTrigger className="mt-1.5 lg:mt-2">
                    <SelectValue placeholder="Select your budget range" />
                  </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0-5000">0 - 5,000 PKR</SelectItem>
                      <SelectItem value="5000-10000">5,000 - 10,000 PKR</SelectItem>
                      <SelectItem value="10000-20000">10,000 - 20,000 PKR</SelectItem>
                      <SelectItem value="20000-50000">20,000 - 50,000 PKR</SelectItem>
                      <SelectItem value="50000+">50,000+ PKR</SelectItem>
                    </SelectContent>
                </Select>
              </div>

              {/* Submit Button */}
              <div className="text-center pt-4 lg:pt-6">
                <Button 
                  type="submit" 
                  variant="elegant" 
                  size="elegant" 
                  className="w-full sm:w-auto sm:min-w-48"
                  disabled={loadingSubmit}
                >
                  {loadingSubmit ? 'Submitting...' : 'Submit Custom Order'}
                </Button>
                <p className="font-sans text-xs lg:text-sm text-muted-foreground mt-3 lg:mt-4">
                  We'll get back to you within 24 hours with a detailed quote and timeline.
                </p>
                
                {/* Account info */}
                <div className="mt-3 lg:mt-4 p-2 lg:p-3 bg-primary/5 rounded-lg">
                  <p className="text-xs text-muted-foreground">
                    <Shield className="w-3 h-3 inline mr-1" />
                    Signed in as {user?.email} • Order tracking will be available in your account
                  </p>
                </div>
              </div>
            </form>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CustomOrders;
