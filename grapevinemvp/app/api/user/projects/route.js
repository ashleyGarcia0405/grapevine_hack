import { NextResponse } from 'next/server';
import { connectDB } from '@/mongodb';
import User from '@/models/User';
import { ObjectId } from 'mongodb';

export async function POST(request) {
  try {
    await connectDB();
    const { email, project } = await request.json();

    const newProject = {
      ...project,
      _id: new ObjectId()
    };

    const updatedUser = await User.findOneAndUpdate(
      { email: email },
      { $push: { projects: newProject } },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Error adding project:', error);
    return NextResponse.json({ error: 'Failed to add project' }, { status: 500 });
  }
}