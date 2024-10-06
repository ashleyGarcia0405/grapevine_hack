import { NextResponse } from 'next/server';
import { connectDB } from '@/mongodb';
import User from '@/models/User';

export async function GET(request, { params }) {
  const { id } = params;

  try {
    await connectDB();
    const user = await User.findById(id).select('-password');
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}