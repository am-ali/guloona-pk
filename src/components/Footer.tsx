"use client";

import { Instagram, Mail, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "@/components/ui/Logo";

const Footer = () => {
  const quickLinks = [
    { name: "Home", href: "/" },
    { name: "Shop", href: "/shop" },
    { name: "Custom Orders", href: "/custom" },
    { name: "About", href: "/about" },
    { name: "Gallery", href: "/gallery" },
    { name: "Contact", href: "/contact" }
  ];

  return (
    <footer className="bg-accent/30 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand Section */}
          <div className="text-center md:text-left">
            <div className="mx-auto md:mx-0 mb-4">
              <Logo size="lg" className="text-foreground" />
            </div>
            <p className="font-serif text-lg mb-4" style={{ color: "color-mix(in hsl, hsl(var(--primary)) 80%, black 20%)" }}>
              A Floral Fable
            </p>
            <p className="font-sans text-sm text-muted-foreground mb-6 max-w-sm">
              Where elegance meets simplicity. Crafting timeless pieces that celebrate 
              your unique beauty and femininity.
            </p>
            
            {/* Decorative Floral Element */}
            <div className="flex justify-center md:justify-start">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-primary"></div>
                <div className="w-1 h-1 rounded-full bg-secondary"></div>
                <div className="w-3 h-3 rounded-full bg-muted"></div>
                <div className="w-1 h-1 rounded-full bg-primary"></div>
                <div className="w-2 h-2 rounded-full bg-secondary"></div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="text-center">
            <h4 className="font-serif text-xl text-foreground mb-6">Quick Links</h4>
            <div className="space-y-3">
              {quickLinks.map((link) => (
                <div key={link.name}>
                  <a
                    href={link.href}
                    className="font-sans text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Newsletter & Social */}
          <div className="text-center md:text-right">
            <h4 className="font-serif text-xl text-foreground mb-6">Stay Connected</h4>
            
            {/* Newsletter Signup */}
            <div className="mb-6">
              <p className="font-sans text-sm text-muted-foreground mb-4">
                Subscribe for exclusive updates and new collections
              </p>
              <div className="flex flex-col sm:flex-row gap-2 max-w-sm mx-auto md:ml-auto">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-4 py-2 rounded-full border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <Button variant="elegant" size="sm">
                  Subscribe
                </Button>
              </div>
            </div>

            {/* Social Media */}
            <div className="flex justify-center md:justify-end space-x-4">
              <a
                href="https://instagram.com/guloona.pk"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:scale-110 transition-transform duration-300"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="mailto:hello@guloona.pk"
                className="p-3 rounded-full bg-primary text-primary-foreground hover:scale-110 transition-transform duration-300"
              >
                <Mail className="w-5 h-5" />
              </a>
              <a
                href="https://wa.me/923001234567"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-full bg-green-500 text-white hover:scale-110 transition-transform duration-300"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left">
            <p className="font-sans text-sm text-muted-foreground mb-4 md:mb-0">
              © 2024 Guloona. Made with love for timeless elegance.
            </p>
            <div className="flex space-x-6">
              <a href="/privacy" className="font-sans text-sm text-muted-foreground hover:text-primary transition-colors">
                Privacy Policy
              </a>
              <a href="/terms" className="font-sans text-sm text-muted-foreground hover:text-primary transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;