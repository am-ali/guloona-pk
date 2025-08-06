"use client";

import { useState } from "react";
import { X, Mail, Lock, User, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";

const AuthModal = () => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { signIn, signUp, isAuthModalOpen, closeAuthModal } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (mode === 'signin') {
        console.log('AuthModal: Attempting sign in');
        const { error } = await signIn(formData.email, formData.password);
        if (error) {
          console.error('AuthModal: Sign in failed:', error.message);
          setError(error.message);
        } else {
          console.log('AuthModal: Sign in successful, closing modal');
          closeAuthModal();
          setFormData({ email: '', password: '', firstName: '', lastName: '', phone: '' });
        }
      } else {
        const { error } = await signUp(
          formData.email, 
          formData.password, 
          formData.firstName, 
          formData.lastName
        );
        if (error) {
          setError(error.message);
        } else {
          setError(null);
          setMode('signin');
          alert('Check your email for the confirmation link!');
        }
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setMode(mode === 'signin' ? 'signup' : 'signin');
    setError(null);
    setFormData({ email: '', password: '', firstName: '', lastName: '', phone: '' });
  };

  if (!isAuthModalOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-50 transition-opacity"
        onClick={closeAuthModal}
      />
      
      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-background shadow-2xl z-50 rounded-2xl p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-serif text-2xl text-foreground">
              {mode === 'signin' ? 'Welcome Back' : 'Join Guloona'}
            </h2>
            <p className="text-muted-foreground text-sm">
              {mode === 'signin' 
                ? 'Sign in to access your cart and favorites' 
                : 'Create an account to start shopping'
              }
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={closeAuthModal}
            className="hover:bg-accent"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName" className="text-sm font-medium">First Name</Label>
                <div className="relative mt-1">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="John"
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="lastName" className="text-sm font-medium">Last Name</Label>
                <div className="relative mt-1">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Doe"
                    className="pl-10"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          <div>
            <Label htmlFor="email" className="text-sm font-medium">Email</Label>
            <div className="relative mt-1">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="your@email.com"
                className="pl-10"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="password" className="text-sm font-medium">Password</Label>
            <div className="relative mt-1">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="••••••••"
                className="pl-10"
                required
                minLength={6}
              />
            </div>
          </div>

          <Button 
            type="submit" 
            variant="elegant" 
            size="elegant" 
            className="w-full mt-6"
            disabled={loading}
          >
            {loading 
              ? (mode === 'signin' ? 'Signing In...' : 'Creating Account...') 
              : (mode === 'signin' ? 'Sign In' : 'Create Account')
            }
          </Button>
        </form>

        {/* Toggle Mode */}
        <div className="text-center mt-6">
          <p className="text-sm text-muted-foreground">
            {mode === 'signin' ? "Don't have an account? " : "Already have an account? "}
            <button 
              type="button"
              onClick={toggleMode}
              className="text-primary font-medium hover:underline"
            >
              {mode === 'signin' ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>
      </div>
    </>
  );
};

export default AuthModal;
