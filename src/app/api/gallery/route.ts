import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongoose';
import GalleryPost from '@/lib/models/GalleryPost';

// GET - Fetch all gallery posts
export async function GET() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await connectToDatabase();
    console.log('✅ Connected to MongoDB');

    console.log('🔍 Fetching gallery posts...');
    const posts = await GalleryPost.find({})
      .sort({ created_at: -1 })
      .limit(50)
      .lean(); // Use lean() for better performance
    
    console.log(`✅ Found ${posts.length} gallery posts`);

    return NextResponse.json({ 
      success: true, 
      posts: posts,
      count: posts.length 
    });
  } catch (error) {
    console.error('❌ Error fetching gallery posts:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch gallery posts',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// POST - Create new gallery post
export async function POST(request: NextRequest) {
  try {
    console.log('🔄 Connecting to MongoDB for POST...');
    await connectToDatabase();
    console.log('✅ Connected to MongoDB');
    
    const body = await request.json();
    const { user_id, username, user_email, image_url, caption, hashtags } = body;
    
    console.log('📝 Creating gallery post for user:', username);
    
    // Validate required fields
    if (!user_id || !username || !user_email || !image_url) {
      console.log('❌ Missing required fields');
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Process hashtags (remove # and convert to lowercase)
    const processedHashtags = hashtags ? 
      hashtags.map((tag: string) => tag.replace(/^#/, '').toLowerCase().trim()).filter((tag: string) => tag.length > 0) : 
      [];
    
    const newPost = new GalleryPost({
      user_id,
      username,
      user_email,
      image_url,
      caption: caption || '',
      hashtags: processedHashtags,
    });
    
    console.log('💾 Saving gallery post...');
    const savedPost = await newPost.save();
    console.log('✅ Gallery post saved successfully');
    
    return NextResponse.json({ 
      success: true,
      post: savedPost 
    }, { status: 201 });
  } catch (error) {
    console.error('❌ Error creating gallery post:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to create gallery post',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
