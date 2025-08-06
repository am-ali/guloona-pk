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
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

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
    const response = await fetch(`/api/user-profile/${userId}`);
    if (response.status === 404) {
      return null; // Profile doesn't exist yet
    }
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error('Error fetching profile from API:', error);
    return getProfileFromLocalStorage(userId); // Fallback to localStorage
  }
};

const createProfileInAPI = async (profile: UserProfile): Promise<UserProfile | null> => {
  try {
    const response = await fetch('/api/user-profile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profile),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    if (data.success) {
      // Also save to localStorage as backup
      saveProfileToLocalStorage(profile.user_id!, data.data);
      return data.data;
    }
    return null;
  } catch (error) {
    console.error('Error creating profile in API:', error);
    return saveProfileToLocalStorage(profile.user_id!, profile); // Fallback to localStorage
  }
};

const updateProfileInAPI = async (userId: string, profileData: Partial<UserProfile>): Promise<UserProfile | null> => {
  try {
    const response = await fetch(`/api/user-profile/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profileData),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    if (data.success) {
      // Also save to localStorage as backup
      saveProfileToLocalStorage(userId, data.data);
      return data.data;
    }
    return null;
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
      console.log('🔍 Fetching profile for user:', user.id);
      
      // Try to fetch from MongoDB API first
      let existingProfile = await getProfileFromAPI(user.id);
      
      if (existingProfile) {
        console.log('✅ Profile found in MongoDB');
        setProfile(existingProfile);
      } else {
        console.log('❌ Profile not found in MongoDB, checking localStorage...');
        // Check localStorage as fallback
        existingProfile = getProfileFromLocalStorage(user.id);
        
        if (existingProfile) {
          console.log('✅ Profile found in localStorage, syncing to MongoDB...');
          // Sync localStorage profile to MongoDB
          const syncedProfile = await createProfileInAPI(existingProfile);
          setProfile(syncedProfile || existingProfile);
        } else {
          console.log('📝 Creating new profile...');
          // Create a new profile if none exists
          const newProfile: UserProfile = {
            user_id: user.id,
            first_name: user.user_metadata?.first_name || '',
            last_name: user.user_metadata?.last_name || '',
            created_at: new Date(),
            updated_at: new Date(),
          };
          
          const createdProfile = await createProfileInAPI(newProfile);
          setProfile(createdProfile || newProfile);
        }
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
      saveProfileToLocalStorage(user.id, fallbackProfile);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (profileData: Partial<UserProfile>): Promise<boolean> => {
    if (!user || !isAuthenticated) return false;

    try {
      console.log('📝 Updating profile for user:', user.id);
      
      // Try to update in MongoDB first
      const updatedProfile = await updateProfileInAPI(user.id, profileData);
      
      if (updatedProfile) {
        console.log('✅ Profile updated in MongoDB');
        setProfile(updatedProfile);
        return true;
      } else {
        console.log('⚠️ Failed to update in MongoDB, falling back to localStorage');
        // Fallback to localStorage update
        const currentProfile = profile || getProfileFromLocalStorage(user.id);
        const updated = {
          ...currentProfile,
          ...profileData,
          user_id: user.id,
          updated_at: new Date(),
        } as UserProfile;
        
        setProfile(updated);
        saveProfileToLocalStorage(user.id, updated);
        return true;
      }
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
