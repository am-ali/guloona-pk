

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export class UserProfileAPI {
  private static baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

  static async getProfile(userId: string): Promise<ApiResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/user-profile/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userId}`, // In production, use proper auth tokens
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error('Error fetching profile:', error);
      return { success: false, error: 'Failed to fetch profile' };
    }
  }

  static async createProfile(profileData: any): Promise<ApiResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/user-profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${profileData.user_id}`,
        },
        body: JSON.stringify(profileData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error('Error creating profile:', error);
      return { success: false, error: 'Failed to create profile' };
    }
  }

  static async updateProfile(userId: string, profileData: any): Promise<ApiResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/user-profile/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userId}`,
        },
        body: JSON.stringify(profileData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error('Error updating profile:', error);
      return { success: false, error: 'Failed to update profile' };
    }
  }
}

// Mock implementation for development - replace with actual API calls in production
export class MockUserProfileAPI {
  private static profiles: Map<string, any> = new Map();

  static async getProfile(userId: string): Promise<ApiResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const profile = this.profiles.get(userId);
    if (profile) {
      return { success: true, data: profile };
    } else {
      return { success: false, error: 'Profile not found' };
    }
  }

  static async createProfile(profileData: any): Promise<ApiResponse> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const profile = {
      _id: Math.random().toString(36).substr(2, 9),
      ...profileData,
      created_at: new Date(),
      updated_at: new Date(),
    };
    
    this.profiles.set(profileData.user_id, profile);
    return { success: true, data: profile };
  }

  static async updateProfile(userId: string, profileData: any): Promise<ApiResponse> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const existingProfile = this.profiles.get(userId);
    const updatedProfile = {
      ...existingProfile,
      ...profileData,
      updated_at: new Date(),
    };
    
    this.profiles.set(userId, updatedProfile);
    return { success: true, data: updatedProfile };
  }
}
