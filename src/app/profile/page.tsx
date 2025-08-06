"use client";

import React from 'react';
import { User, Mail, Calendar, Package, Settings, LogOut, Edit2, Ruler, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { useUserProfile } from '@/contexts/UserProfileContext';
import Link from 'next/link';

export default function ProfilePage() {
  const { user, signOut, isAuthenticated } = useAuth();
  const { profile, getFullName } = useUserProfile();

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center min-h-screen">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <CardTitle>Please Sign In</CardTitle>
              <CardDescription>
                You need to be signed in to view your profile.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  const getUserInitials = () => {
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name.charAt(0)}${profile.last_name.charAt(0)}`.toUpperCase();
    }
    const firstName = user.user_metadata?.first_name || '';
    const lastName = user.user_metadata?.last_name || '';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || user.email?.charAt(0).toUpperCase() || 'U';
  };

  const getUserDisplayName = () => {
    return getFullName();
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const recentOrders = [
    { id: '001', status: 'In Progress', date: '2024-01-15', item: 'Blush Minimalist Dress' },
    { id: '002', status: 'Completed', date: '2024-01-10', item: 'Sage Garden Dress' },
    { id: '003', status: 'Delivered', date: '2024-01-05', item: 'Custom Lavender Dress' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Header */}
      <section className="pt-24 pb-12 bg-hero-gradient">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <Avatar className="w-24 h-24">
              <AvatarImage src={user.user_metadata?.avatar_url} />
              <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                {getUserInitials()}
              </AvatarFallback>
            </Avatar>
            
            <div className="text-center md:text-left">
              <h1 className="font-serif text-4xl text-foreground mb-2">
                Welcome back, {getUserDisplayName()}
              </h1>
              <p className="font-sans text-muted-foreground mb-4">
                Manage your profile, orders, and preferences
              </p>
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Mail className="w-3 h-3" />
                  {user.email}
                </Badge>
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  Member since {new Date(user.created_at || '').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Profile Information */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Personal Information */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div className="flex items-center gap-2">
                    <User className="w-5 h-5 text-primary" />
                    <CardTitle>Personal Information</CardTitle>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/profile/edit">
                      <Edit2 className="w-4 h-4 mr-2" />
                      Edit
                    </Link>
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">First Name</label>
                      <p className="text-foreground">{profile?.first_name || 'Not set'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Last Name</label>
                      <p className="text-foreground">{profile?.last_name || 'Not set'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Phone</label>
                      <p className="text-foreground">{profile?.phone || 'Not set'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Location</label>
                      <p className="text-foreground">{profile?.location || 'Not set'}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Measurements */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Ruler className="w-5 h-5 text-primary" />
                    <CardTitle>Body Measurements</CardTitle>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/profile/edit">
                      <Edit2 className="w-4 h-4 mr-2" />
                      Update
                    </Link>
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">Bust</p>
                      <p className="text-lg font-medium">{profile?.bust || '--'}"</p>
                    </div>
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">Waist</p>
                      <p className="text-lg font-medium">{profile?.waist || '--'}"</p>
                    </div>
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">Hips</p>
                      <p className="text-lg font-medium">{profile?.hips || '--'}"</p>
                    </div>
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">Shoulder Width</p>
                      <p className="text-lg font-medium">{profile?.shoulder_width || '--'}"</p>
                    </div>
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">Height</p>
                      <p className="text-lg font-medium">{profile?.height || '--'}"</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Preferences */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Palette className="w-5 h-5 text-primary" />
                    <CardTitle>Style Preferences</CardTitle>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/profile/edit">
                      <Edit2 className="w-4 h-4 mr-2" />
                      Update
                    </Link>
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Preferred Colors</label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {profile?.preferred_colors?.length ? (
                        profile.preferred_colors.map((color, index) => (
                          <Badge key={index} variant="outline">{color}</Badge>
                        ))
                      ) : (
                        <p className="text-muted-foreground">No preferences set</p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Preferred Fabrics</label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {profile?.preferred_fabrics?.length ? (
                        profile.preferred_fabrics.map((fabric, index) => (
                          <Badge key={index} variant="outline">{fabric}</Badge>
                        ))
                      ) : (
                        <p className="text-muted-foreground">No preferences set</p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Style Notes</label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <p className="text-muted-foreground">No style notes set</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Orders */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Package className="w-5 h-5 text-primary" />
                    <CardTitle>Recent Orders</CardTitle>
                  </div>
                  <Button variant="outline" size="sm">
                    View All
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentOrders.map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                        <div>
                          <p className="font-medium">{order.item}</p>
                          <p className="text-sm text-muted-foreground">Order #{order.id} • {order.date}</p>
                        </div>
                        <Badge 
                          variant={
                            order.status === 'Completed' ? 'default' :
                            order.status === 'In Progress' ? 'secondary' :
                            'outline'
                          }
                        >
                          {order.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              
              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start" asChild>
                    <Link href="/custom-orders">
                      <Package className="w-4 h-4 mr-2" />
                      New Custom Order
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href="/profile/edit">
                      <Edit2 className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href="/settings">
                      <Settings className="w-4 h-4 mr-2" />
                      Settings
                    </Link>
                  </Button>
                  <Separator />
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-destructive hover:text-destructive"
                    onClick={handleSignOut}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                </CardContent>
              </Card>

              {/* Profile Completeness */}
              <Card>
                <CardHeader>
                  <CardTitle>Profile Completeness</CardTitle>
                  <CardDescription>
                    Complete your profile for better recommendations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Basic Info</span>
                      <Badge variant="default">Complete</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Measurements</span>
                      <Badge variant={profile?.bust ? "default" : "secondary"}>
                        {profile?.bust ? "Complete" : "Incomplete"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Preferences</span>
                      <Badge variant={profile?.preferred_colors?.length ? "default" : "secondary"}>
                        {profile?.preferred_colors?.length ? "Complete" : "Incomplete"}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
