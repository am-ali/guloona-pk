import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import UserProfile from '@/lib/models/UserProfile';

// GET - Fetch user profile by user_id
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    console.log('🔄 Connecting to MongoDB for profile fetch...');
    await connectDB();
    console.log('✅ Connected to MongoDB');

    const { userId } = await params;
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    console.log(`🔍 Fetching profile for user: ${userId}`);
    const profile = await UserProfile.findOne({ user_id: userId }).lean();
    
    if (!profile) {
      console.log('❌ Profile not found');
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      );
    }

    console.log('✅ Profile found');
    return NextResponse.json({ 
      success: true, 
      data: profile 
    });
  } catch (error) {
    console.error('❌ Error fetching user profile:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch user profile',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// PUT - Update user profile
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    console.log('🔄 Connecting to MongoDB for profile update...');
    await connectDB();
    console.log('✅ Connected to MongoDB');

    const { userId } = await params;
    const body = await request.json();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    console.log(`📝 Updating profile for user: ${userId}`);
    
    // Remove user_id from update data to prevent conflicts
    const { user_id, _id, ...updateData } = body;
    updateData.updated_at = new Date();

    const updatedProfile = await UserProfile.findOneAndUpdate(
      { user_id: userId },
      { $set: updateData },
      { 
        new: true, 
        upsert: true, // Create if doesn't exist
        lean: true 
      }
    );

    console.log('✅ Profile updated successfully');
    return NextResponse.json({ 
      success: true, 
      data: updatedProfile 
    });
  } catch (error) {
    console.error('❌ Error updating user profile:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update user profile',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// DELETE - Delete user profile
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    console.log('🔄 Connecting to MongoDB for profile deletion...');
    await connectDB();
    console.log('✅ Connected to MongoDB');

    const { userId } = await params;
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    console.log(`🗑️ Deleting profile for user: ${userId}`);
    const result = await UserProfile.deleteOne({ user_id: userId });
    
    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      );
    }

    console.log('✅ Profile deleted successfully');
    return NextResponse.json({ 
      success: true, 
      message: 'Profile deleted successfully' 
    });
  } catch (error) {
    console.error('❌ Error deleting user profile:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to delete user profile',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
