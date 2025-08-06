"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { UserProfileAPI } from '@/lib/userProfileAPI';

export interface UserProfile {
  _id?: string;
  user_id?: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  location?: string;
  bust?: string;
  waist?: string;
  hips?: string;
  shoulder_width?: string;
  height?: string;
  dress_length_preference?: string;
  preferred_colors?: string[];
  preferred_fabrics?: string[];
  style_preferences?: string[];
  size_preference?: string;
  budget_range?: string;
  created_at?: Date;
  updated_at?: Date;
}

// API Configuration
const API_BASE_URL = process.env.VITE_API_URL || 'http://localhost:3001/api';

// API Helper Functions
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || `HTTP error! status: ${response.status}`);
    }
    
    return data;
  } catch (error) {
    console.error(`API request failed for ${endpoint}:`, error);
    throw error;
  }
};

const getProfileFromAPI = async (userId: string): Promise<UserProfile | null> => {
  try {
    const response = await apiRequest(`/user-profile/${userId}`);
    return response.data;
  } catch (error) {
    if (error instanceof Error && error.message.includes('404')) {
      return null; // Profile doesn't exist yet
    }
    console.error('Error fetching profile from API:', error);
    return getProfileFromLocalStorage(userId); // Fallback to localStorage
  }
};

const createProfileInAPI = async (profile: UserProfile): Promise<UserProfile | null> => {
  try {
    const response = await apiRequest('/user-profile', {
      method: 'POST',
      body: JSON.stringify(profile),
    });
    return response.data;
  } catch (error) {
    console.error('Error creating profile in API:', error);
    return saveProfileToLocalStorage(profile.user_id!, profile); // Fallback to localStorage
  }
};

const updateProfileInAPI = async (userId: string, profileData: Partial<UserProfile>): Promise<UserProfile | null> => {
  try {
    const response = await apiRequest(`/user-profile/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
    return response.data;
  } catch (error) {
    console.error('Error updating profile in API:', error);
    // Fallback to localStorage
    const existing = getProfileFromLocalStorage(userId);
    if (existing) {
      const updated = { ...existing, ...profileData, updated_at: new Date() };
      return saveProfileToLocalStorage(userId, updated);
    }
    return null;
  }
};

// Local storage fallback functions
const getProfileFromLocalStorage = (userId: string): UserProfile | null => {
  try {
    const stored = localStorage.getItem(`user_profile_${userId}`);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return null;
  }
};

const saveProfileToLocalStorage = (userId: string, profile: UserProfile): UserProfile => {
  try {
    localStorage.setItem(`user_profile_${userId}`, JSON.stringify(profile));
    return profile;
  } catch (error) {
    console.error('Error saving to localStorage:', error);
    return profile;
  }
};

export interface UserProfile {
  _id?: string;
  user_id?: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  location?: string;
  bust?: string;
  waist?: string;
  hips?: string;
  shoulder_width?: string;
  height?: string;
  dress_length_preference?: string;
  preferred_colors?: string[];
  preferred_fabrics?: string[];
  style_preferences?: string[];
  size_preference?: string;
  budget_range?: string;
  created_at?: Date;
  updated_at?: Date;
}

interface UserProfileContextType {
  profile: UserProfile | null;
  loading: boolean;
  updateProfile: (profileData: Partial<UserProfile>) => Promise<boolean>;
  refreshProfile: () => Promise<void>;
  getFullName: () => string;
  saveCustomOrderDataToProfile: (orderData: any) => Promise<boolean>;
}

const UserProfileContext = createContext<UserProfileContextType | undefined>(undefined);

export const UserProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const { user, isAuthenticated } = useAuth();

  const fetchProfile = async () => {
    if (!user || !isAuthenticated) {
      setProfile(null);
      return;
    }

    setLoading(true);
    try {
      // Use localStorage for profile storage in this demo
      const existingProfile = getProfileFromLocalStorage(user.id);
      
      if (existingProfile) {
        setProfile(existingProfile);
      } else {
        // Create a new profile if none exists
        const newProfile: UserProfile = {
          user_id: user.id,
          first_name: user.user_metadata?.first_name || '',
          last_name: user.user_metadata?.last_name || '',
          created_at: new Date(),
          updated_at: new Date(),
        };
        
        saveProfileToLocalStorage(user.id, newProfile);
        setProfile(newProfile);
      }
    } catch (error) {
      console.error('Error in fetchProfile:', error);
      // Fallback to basic profile from auth data
      const fallbackProfile: UserProfile = {
        user_id: user.id,
        first_name: user.user_metadata?.first_name || '',
        last_name: user.user_metadata?.last_name || '',
        created_at: new Date(),
        updated_at: new Date(),
      };
      setProfile(fallbackProfile);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (profileData: Partial<UserProfile>): Promise<boolean> => {
    if (!user || !isAuthenticated) return false;

    try {
      // Update local state and localStorage
      const updatedProfile = {
        ...profile,
        ...profileData,
        user_id: user.id,
        updated_at: new Date(),
      } as UserProfile;
      
      setProfile(updatedProfile);
      saveProfileToLocalStorage(user.id, updatedProfile);
      return true;
    } catch (error) {
      console.error('Error in updateProfile:', error);
      return false;
    }
  };

  const refreshProfile = async () => {
    await fetchProfile();
  };

  const getFullName = (): string => {
    if (!profile) return 'User';
    const firstName = profile.first_name || '';
    const lastName = profile.last_name || '';
    return `${firstName} ${lastName}`.trim() || 'User';
  };

  const saveCustomOrderDataToProfile = async (orderData: any): Promise<boolean> => {
    if (!user || !isAuthenticated) return false;

    try {
      // Extract profile-relevant data from custom order
      const profileUpdates: Partial<UserProfile> = {};
      
      // Update name if not set
      if (orderData.name && (!profile?.first_name || !profile?.last_name)) {
        const nameParts = orderData.name.trim().split(' ');
        if (nameParts.length >= 2) {
          profileUpdates.first_name = nameParts[0];
          profileUpdates.last_name = nameParts.slice(1).join(' ');
        } else if (nameParts.length === 1) {
          profileUpdates.first_name = nameParts[0];
        }
      }

      // Update contact info if not set
      if (orderData.phone && !profile?.phone) {
        profileUpdates.phone = orderData.phone;
      }
      if (orderData.location && !profile?.location) {
        profileUpdates.location = orderData.location;
      }

      // Update measurements if not set
      if (orderData.bust && !profile?.bust) {
        profileUpdates.bust = orderData.bust;
      }
      if (orderData.waist && !profile?.waist) {
        profileUpdates.waist = orderData.waist;
      }
      if (orderData.hips && !profile?.hips) {
        profileUpdates.hips = orderData.hips;
      }

      // Update fabric preference if not set
      if (orderData.fabric && (!profile?.preferred_fabrics || profile.preferred_fabrics.length === 0)) {
        profileUpdates.preferred_fabrics = [orderData.fabric];
      } else if (orderData.fabric && profile?.preferred_fabrics && !profile.preferred_fabrics.includes(orderData.fabric)) {
        profileUpdates.preferred_fabrics = [...profile.preferred_fabrics, orderData.fabric];
      }

      // Update budget range if not set
      if (orderData.budget && !profile?.budget_range) {
        profileUpdates.budget_range = orderData.budget;
      }

      // Only update if there are changes to make
      if (Object.keys(profileUpdates).length > 0) {
        return await updateProfile(profileUpdates);
      }

      return true;
    } catch (error) {
      console.error('Error saving custom order data to profile:', error);
      return false;
    }
  };

  useEffect(() => {
    if (user && isAuthenticated) {
      fetchProfile();
    } else {
      setProfile(null);
    }
  }, [user, isAuthenticated]);

  return (
    <UserProfileContext.Provider value={{
      profile,
      loading,
      updateProfile,
      refreshProfile,
      getFullName,
      saveCustomOrderDataToProfile,
    }}>
      {children}
    </UserProfileContext.Provider>
  );
};

export const useUserProfile = () => {
  const context = useContext(UserProfileContext);
  if (context === undefined) {
    throw new Error('useUserProfile must be used within a UserProfileProvider');
  }
  return context;
};
