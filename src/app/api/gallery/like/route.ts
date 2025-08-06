import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongoose';
import GalleryPost from '@/lib/models/GalleryPost';

// POST - Toggle like on a gallery post
export async function POST(request: NextRequest) {
  try {
    console.log('🔄 Connecting to MongoDB for like...');
    await connectToDatabase();
    console.log('✅ Connected to MongoDB');
    
    const body = await request.json();
    const { post_id, user_id } = body;
    
    if (!post_id || !user_id) {
      return NextResponse.json(
        { error: 'Missing post_id or user_id' },
        { status: 400 }
      );
    }
    
    console.log(`👍 Toggling like for post ${post_id} by user ${user_id}`);
    
    const post = await GalleryPost.findById(post_id);
    
    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }
    
    const hasLiked = post.liked_by.includes(user_id);
    
    if (hasLiked) {
      // Unlike the post
      post.liked_by = post.liked_by.filter((id: string) => id !== user_id);
      post.likes = Math.max(0, post.likes - 1);
      console.log('💔 Removed like');
    } else {
      // Like the post
      post.liked_by.push(user_id);
      post.likes += 1;
      console.log('❤️ Added like');
    }
    
    post.updated_at = new Date();
    const updatedPost = await post.save();
    console.log('✅ Like updated successfully');
    
    return NextResponse.json({ 
      success: true,
      post: updatedPost, 
      liked: !hasLiked 
    }, { status: 200 });
    
  } catch (error) {
    console.error('❌ Error toggling like:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to toggle like',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
