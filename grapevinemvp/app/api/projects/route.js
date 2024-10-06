import { NextResponse } from 'next/server';
import { connectDB } from '@/mongodb';
import User from '@/models/User';

export async function POST(req) {
  try {
    await connectDB();
    const { email } = req.session.user; // Assuming you have session middleware
    const projectData = await req.json();

    const user = await User.findOneAndUpdate(
      { email },
      { $push: { [projectData.type === 'current' ? 'currentProjects' : 'pastProjects']: projectData } },
      { new: true }
    );

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Project added successfully' });
  } catch (error) {
    console.error('Error adding project:', error);
    return NextResponse.json({ error: 'Failed to add project' }, { status: 500 });
  }
}