"use client";

import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Instagram, Mail, MessageCircle, Phone, MapPin, Clock, CheckCircle, AlertCircle } from "lucide-react";
import emailjs from '@emailjs/browser';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.subject || !formData.message) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // EmailJS configuration using environment variables
      const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!;
      const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID_1!; // Using template 1 for contact form
      const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!;

      // Initialize EmailJS (this is important!)
      emailjs.init(publicKey);

      // Send email via EmailJS
      const result = await emailjs.send(
        serviceId,
        templateId,
        {
          from_name: `${formData.firstName} ${formData.lastName}`,
          from_email: formData.email,
          phone: formData.phone || 'Not provided',
          subject: formData.subject,
          message: formData.message,
          to_email: 'mf3579753@gmail.com'
        }
      );

      console.log('Email sent successfully:', result);
      setSubmitStatus('success');
      
      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      console.error('Detailed error:', error);
      
      // More specific error handling
      if (error && typeof error === 'object' && 'text' in error) {
        console.error('EmailJS error text:', (error as any).text);
      }
      
      // Fallback to mailto if EmailJS fails
      const subject = encodeURIComponent(`Contact Form: ${formData.subject}`);
      const body = encodeURIComponent(
        `Name: ${formData.firstName} ${formData.lastName}\n` +
        `Email: ${formData.email}\n` +
        `Phone: ${formData.phone}\n` +
        `Subject: ${formData.subject}\n\n` +
        `Message:\n${formData.message}`
      );
      
      window.open(`mailto:mf3579753@gmail.com?subject=${subject}&body=${body}`, '_blank');
      setSubmitStatus('success');
      
      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactMethods = [
    {
      icon: Instagram,
      title: "Instagram DM",
      description: "Quick responses via Instagram messages",
      action: "Message Us",
      link: "https://instagram.com/guloona.pk",
      color: "bg-gradient-to-r from-purple-500 to-pink-500"
    },
    {
      icon: MessageCircle,
      title: "WhatsApp",
      description: "Chat with us directly for instant support",
      action: "Chat Now",
      link: "https://wa.me/923369660214",
      color: "bg-green-500"
    },
    {
      icon: Mail,
      title: "Email",
      description: "For detailed inquiries and custom orders",
      action: "Send Email",
      link: "mailto:mf3579753@gmail.com",
      color: "bg-primary"
    }
  ];

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-24 pb-12 bg-hero-gradient text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="font-serif text-5xl md:text-6xl text-foreground mb-6">
            Get in Touch
          </h1>
          <p className="font-script text-2xl text-primary mb-4" style={{ color: "color-mix(in hsl, hsl(var(--primary)) 80%, black 20%)" }}>
            We'd love to hear from you
          </p>
          <p className="font-sans text-lg text-muted-foreground max-w-2xl mx-auto">
            Whether you have questions about our collection, need help with sizing, or want to create a custom piece, we're here to help make your Guloona experience beautiful.
          </p>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-16 bg-background">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {contactMethods.map((method, index) => (
              <Card key={index} className="p-8 text-center shadow-card hover:shadow-soft transition-all duration-300 animate-fade-in" style={{ animationDelay: `${index * 200}ms` }}>
                <div className={`w-16 h-16 ${method.color} rounded-full flex items-center justify-center mx-auto mb-6`}>
                  <method.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-serif text-xl text-foreground mb-3">{method.title}</h3>
                <p className="font-sans text-muted-foreground mb-6">{method.description}</p>
                <a 
                  href={method.link}
                  target={method.link.startsWith('http') ? '_blank' : undefined}
                  rel={method.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className={`inline-flex items-center justify-center ${method.color} text-white px-6 py-3 rounded-full font-medium hover:scale-105 transition-transform duration-300`}
                >
                  {method.action}
                </a>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-16 bg-muted/20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Contact Form */}
            <Card className="p-8 md:p-12 shadow-soft">
              <h2 className="font-serif text-3xl text-foreground mb-8">Send us a Message</h2>
              
              {/* Success/Error Messages */}
              {submitStatus === 'success' && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <p className="text-green-800 font-medium">Message sent successfully! We'll get back to you within 24 hours.</p>
                </div>
              )}
              
              {submitStatus === 'error' && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  <p className="text-red-800 font-medium">Failed to send message. Please try again or contact us directly.</p>
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName" className="font-sans font-medium">First Name *</Label>
                    <Input 
                      id="firstName" 
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder="Your first name" 
                      className="mt-2"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName" className="font-sans font-medium">Last Name *</Label>
                    <Input 
                      id="lastName" 
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder="Your last name" 
                      className="mt-2"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email" className="font-sans font-medium">Email Address *</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="your@email.com" 
                    className="mt-2"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="phone" className="font-sans font-medium">Phone Number</Label>
                  <Input 
                    id="phone" 
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+92 300 1234567" 
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="subject" className="font-sans font-medium">Subject *</Label>
                  <Input 
                    id="subject" 
                    value={formData.subject}
                    onChange={handleInputChange}
                    placeholder="How can we help you?" 
                    className="mt-2"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="message" className="font-sans font-medium">Message *</Label>
                  <Textarea 
                    id="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Tell us about your inquiry, custom order request, or any questions you have..."
                    className="mt-2 min-h-[120px]"
                    required
                  />
                </div>

                <Button 
                  type="submit"
                  variant="elegant" 
                  size="elegant" 
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </Button>
                
                <p className="font-sans text-sm text-muted-foreground text-center">
                  We typically respond within 24 hours.
                </p>
              </form>
            </Card>

            {/* Business Info */}
            <div className="space-y-8">
              <Card className="p-8 shadow-card">
                <h3 className="font-serif text-2xl text-foreground mb-6">Business Hours</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium text-foreground">Monday - Friday</p>
                      <p className="text-sm text-muted-foreground">9:00 AM - 6:00 PM PKT</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium text-foreground">Saturday</p>
                      <p className="text-sm text-muted-foreground">10:00 AM - 4:00 PM PKT</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-muted-foreground">Sunday</p>
                      <p className="text-sm text-muted-foreground">Closed</p>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-8 shadow-card">
                <h3 className="font-serif text-2xl text-foreground mb-6">Location & Shipping</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-primary mt-1" />
                    <div>
                      <p className="font-medium text-foreground">Based in Rawalpindi, Pakistan</p>
                      <p className="text-sm text-muted-foreground">We ship countrywide with careful packaging and tracking</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-primary mt-1" />
                    <div>
                      <p className="font-medium text-foreground">Customer Support</p>
                      <p className="text-sm text-muted-foreground">Available during business hours via WhatsApp and Instagram</p>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-8 shadow-card bg-primary/5 border-primary/20">
                <h3 className="font-serif text-2xl text-foreground mb-4">Quick Questions?</h3>
                <p className="font-sans text-muted-foreground mb-6">
                  For fastest response, reach out to us on Instagram or WhatsApp. We're always happy to help with sizing, styling, or custom order questions!
                </p>
                <div className="flex gap-4">
                  <a 
                    href="https://instagram.com/guloona.pk"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-center py-3 rounded-full font-medium hover:scale-105 transition-transform duration-300"
                  >
                    Instagram
                  </a>
                  <a 
                    href="https://wa.me/923001234567"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-green-500 text-white text-center py-3 rounded-full font-medium hover:scale-105 transition-transform duration-300"
                  >
                    WhatsApp
                  </a>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
