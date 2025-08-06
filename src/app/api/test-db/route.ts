import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongoose';

export async function GET() {
  try {
    console.log('🔄 Testing MongoDB connection...');
    
    const mongoose = await connectToDatabase();
    
    console.log('✅ MongoDB connection test successful');
    console.log('Connection state:', mongoose.connection.readyState);
    console.log('Database name:', mongoose.connection.name);
    console.log('Host:', mongoose.connection.host);
    
    return NextResponse.json({
      success: true,
      message: 'MongoDB connection successful',
      connectionState: mongoose.connection.readyState,
      database: mongoose.connection.name,
      host: mongoose.connection.host,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ MongoDB connection test failed:', error);
    
    return NextResponse.json({
      success: false,
      error: 'MongoDB connection failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
