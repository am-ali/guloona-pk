"use client";

import React from 'react';
import { User, LogOut, Settings, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

const UserProfile = () => {
  const { user, signOut, isAuthenticated } = useAuth();
  const router = useRouter();

  if (!isAuthenticated || !user) {
    return null;
  }

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  const handleProfileClick = () => {
    router.push('/profile');
  };

  const handleOrdersClick = () => {
    // For now, just log - you can implement orders page later
    console.log('My Orders clicked - feature coming soon');
  };

  const handleSettingsClick = () => {
    // For now, just log - you can implement settings later
    console.log('Settings clicked - feature coming soon');
  };

  const getUserInitials = () => {
    const firstName = user.user_metadata?.first_name || '';
    const lastName = user.user_metadata?.last_name || '';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || user.email?.charAt(0).toUpperCase() || 'U';
  };

  const getUserDisplayName = () => {
    const firstName = user.user_metadata?.first_name || '';
    const lastName = user.user_metadata?.last_name || '';
    return firstName && lastName ? `${firstName} ${lastName}` : user.email;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.user_metadata?.avatar_url} alt={getUserDisplayName()} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {getUserInitials()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{getUserDisplayName()}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer" onClick={handleProfileClick}>
          <User className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer" onClick={handleOrdersClick}>
          <ShoppingBag className="mr-2 h-4 w-4" />
          <span>My Orders</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer" onClick={() => router.push('/settings')}>
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          className="cursor-pointer text-red-600 focus:text-red-600"
          onClick={handleSignOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sign out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserProfile;
