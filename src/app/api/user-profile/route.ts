import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongoose';
import UserProfile from '@/lib/models/UserProfile';

// POST - Create new user profile
export async function POST(request: NextRequest) {
  try {
    console.log('🔄 Connecting to MongoDB for profile creation...');
    await connectToDatabase();
    console.log('✅ Connected to MongoDB');

    const body = await request.json();
    const { user_id, ...profileData } = body;
    
    if (!user_id) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    console.log(`👤 Creating profile for user: ${user_id}`);
    
    // Check if profile already exists
    const existingProfile = await UserProfile.findOne({ user_id });
    if (existingProfile) {
      console.log('⚠️ Profile already exists, updating instead');
      const updatedProfile = await UserProfile.findOneAndUpdate(
        { user_id },
        { $set: { ...profileData, updated_at: new Date() } },
        { new: true, lean: true }
      );
      
      return NextResponse.json({ 
        success: true, 
        data: updatedProfile,
        message: 'Profile updated (already existed)' 
      });
    }

    // Create new profile
    const newProfile = new UserProfile({
      user_id,
      ...profileData,
    });

    const savedProfile = await newProfile.save();
    console.log('✅ Profile created successfully');

    return NextResponse.json({ 
      success: true, 
      data: savedProfile.toObject(),
      message: 'Profile created successfully' 
    }, { status: 201 });
  } catch (error) {
    console.error('❌ Error creating user profile:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create user profile',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// GET - List all profiles (admin/debugging purposes)
export async function GET() {
  try {
    console.log('🔄 Connecting to MongoDB for profiles list...');
    await connectToDatabase();
    console.log('✅ Connected to MongoDB');

    console.log('📋 Fetching all user profiles...');
    const profiles = await UserProfile.find({})
      .select('-__v') // Exclude version field
      .sort({ created_at: -1 })
      .lean();

    console.log(`✅ Found ${profiles.length} user profiles`);
    return NextResponse.json({ 
      success: true, 
      data: profiles,
      count: profiles.length 
    });
  } catch (error) {
    console.error('❌ Error fetching user profiles:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch user profiles',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
