"use client";

import { useState } from "react";
import { Menu, X, Heart, ShoppingBag, User, Sun, Moon, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "@/components/ui/Logo";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import UserProfile from "@/components/UserProfile";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { toggleCart, getItemCount } = useCart();
  const { isAuthenticated, openAuthModal } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const itemCount = getItemCount();

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Shop", href: "/shop" },
    { name: "Custom Orders", href: "/custom-orders" },
    { name: "About", href: "/about" },
    { name: "Gallery", href: "/gallery" },
    { name: "Contact", href: "/contact" }
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="w-full px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 lg:h-16">
          {/* Logo - Left aligned */}
          <div className="flex items-center flex-shrink-0">
            <Link href="/">
              <Logo size="md" className="text-foreground scale-90 lg:scale-100" />
            </Link>
          </div>

          {/* Desktop Navigation - Center */}
          <div className="hidden md:block flex-1 mx-8">
            <div className="flex items-center justify-center space-x-6 lg:space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="font-sans text-sm font-medium text-foreground hover:text-primary transition-colors duration-200 relative group"
                >
                  {item.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
                </Link>
              ))}
            </div>
          </div>

          {/* Right Side Icons - Right aligned */}
          <div className="flex items-center space-x-2 lg:space-x-4 flex-shrink-0">
            <button 
              onClick={toggleTheme}
              className="p-1.5 lg:p-2 rounded-full hover:bg-accent transition-colors flex items-center justify-center"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 lg:w-5 lg:h-5 text-foreground" /> : <Moon className="w-4 h-4 lg:w-5 lg:h-5 text-foreground" />}
            </button>

            <Link href="/settings" className="p-1.5 lg:p-2 rounded-full hover:bg-accent transition-colors flex items-center justify-center">
              <Settings className="w-4 h-4 lg:w-5 lg:h-5 text-foreground" />
            </Link>

            <button className="p-1.5 lg:p-2 rounded-full hover:bg-accent transition-colors flex items-center justify-center">
              <Heart className="w-4 h-4 lg:w-5 lg:h-5 text-foreground" />
            </button>
            
            {/* Cart Icon with Badge */}
            <button 
              onClick={toggleCart}
              className="relative p-1.5 lg:p-2 rounded-full hover:bg-accent transition-colors flex items-center justify-center"
            >
              <ShoppingBag className="w-4 h-4 lg:w-5 lg:h-5 text-foreground" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-4 w-4 lg:h-5 lg:w-5 flex items-center justify-center font-medium text-[10px] lg:text-xs">
                  {itemCount > 99 ? '99+' : itemCount}
                </span>
              )}
            </button>

            {/* User Profile / Sign In */}
            {isAuthenticated ? (
              <UserProfile />
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={openAuthModal}
                className="hidden md:flex items-center space-x-2"
              >
                <User className="w-3 h-3 lg:w-4 lg:h-4" />
                <span className="text-xs lg:text-sm">Sign In</span>
              </Button>
            )}

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-background border-t border-border">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block px-3 py-2 rounded-md text-sm font-medium text-foreground hover:text-primary hover:bg-accent transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              
              {/* Mobile Sign In / Profile */}
              {!isAuthenticated && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    openAuthModal();
                    setIsMenuOpen(false);
                  }}
                  className="mx-3 mt-2 w-full justify-start text-sm"
                >
                  <User className="w-4 h-4 mr-2" />
                  Sign In
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;