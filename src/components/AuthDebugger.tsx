"use client";

import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';

export function AuthDebugger() {
  const { user, isAuthenticated, session } = useAuth();
  const { state: cartState } = useCart();

  useEffect(() => {
    // Only run in development
    if (process.env.NODE_ENV !== 'development') return;

    const logAuthState = () => {
      console.group('🔐 Auth State Debug');
      console.log('User:', user?.email || 'None');
      console.log('Authenticated:', isAuthenticated);
      console.log('Session expires:', session?.expires_at ? new Date(session.expires_at * 1000) : 'None');
      console.log('Cart items:', cartState.items.length);
      console.log('Cart open:', cartState.isOpen);
      console.groupEnd();
    };

    // Log state changes
    logAuthState();

    // Set up interval to check for session expiry
    const interval = setInterval(() => {
      if (session?.expires_at) {
        const expiresAt = new Date(session.expires_at * 1000);
        const now = new Date();
        const timeUntilExpiry = expiresAt.getTime() - now.getTime();
        
        if (timeUntilExpiry < 60000 && timeUntilExpiry > 0) {
          console.warn('⚠️ Auth session expires in less than 1 minute');
        }
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [user, isAuthenticated, session, cartState]);

  // Don't render anything in production
  if (process.env.NODE_ENV !== 'development') return null;

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-2 rounded text-xs font-mono z-50">
      Auth: {isAuthenticated ? '✅' : '❌'} | Cart: {cartState.items.length}
    </div>
  );
}
