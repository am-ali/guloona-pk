"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';

const AuthTest = () => {
  const { user, isAuthenticated, signOut } = useAuth();

  const testConnection = async () => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    console.log('Environment Variables:', {
      NEXT_PUBLIC_SUPABASE_URL: supabaseUrl ? 'Set' : 'Missing',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: supabaseKey ? 'Set' : 'Missing'
    });
    
    console.log('Auth State:', {
      isAuthenticated,
      user: user ? {
        id: user.id,
        email: user.email,
        created_at: user.created_at
      } : 'No user'
    });
  };

  return (
    <Card className="w-full max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle>Auth Debug</CardTitle>
        <CardDescription>Test authentication status</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <strong>Status:</strong> {isAuthenticated ? 'Signed In' : 'Signed Out'}
        </div>
        {user && (
          <div>
            <strong>User:</strong> {user.email}
          </div>
        )}
        <div className="space-y-2">
          <Button onClick={testConnection} variant="outline" className="w-full">
            Test Connection
          </Button>
          {isAuthenticated && (
            <Button onClick={signOut} variant="destructive" className="w-full">
              Sign Out
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AuthTest;
