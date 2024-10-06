import { NextResponse } from 'next/server';
import { connectDB } from '@/mongodb';
import User from '@/models/User';
import { ObjectId } from 'mongodb';
// import { useState, useEffect } from 'react';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const currentUserEmail = searchParams.get('currentUserEmail');

    // Case 1: Fetch a specific user by email
    if (email) {
      const user = await User.findOne({ email }).select('-password');
      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }
      return NextResponse.json(user);
    }

    // Case 2: Fetch all users except the current user
    if (currentUserEmail) {
      const users = await User.find({ email: { $ne: currentUserEmail } }).select('-password');
      return NextResponse.json(users);
    }

    // Case 3: Fetch all users if no email or currentUserEmail is provided
    const allUsers = await User.find().select('-password');
    return NextResponse.json(allUsers);

  } catch (error) {
    console.error('Error fetching user(s):', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}


export async function PUT(request) {
  try {
    await connectDB();
    const data = await request.json();
    const { email, project, ...updateData } = data;

    let updateOperation;
    if (project) {
      // Adding a new project
      updateOperation = {
        $push: { projects: { ...project, _id: new ObjectId() } }
      };
    } else if (Object.keys(updateData).length > 0) {
      // General user update
      updateOperation = { $set: updateData };
    } else {
      return NextResponse.json({ error: 'No update data provided' }, { status: 400 });
    }

    const updatedUser = await User.findOneAndUpdate(
      { email: email },
      updateOperation,
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}