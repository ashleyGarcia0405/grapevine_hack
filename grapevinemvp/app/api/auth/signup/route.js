import { connectDB } from '@/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Now you can use cloudinary.uploader.upload() or other Cloudinary functions

export async function POST(request) {
  try {
    await connectDB();

    
    
    const body = await request.json();
    const { name, email, password, profileImage, bio, location, website, skills, education, socialLinks, projects, interests, events} = body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return new Response(JSON.stringify({ error: 'User already exists' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      profileImage, // This is now the Cloudinary URL
      bio,
      location,
      website,
      skills,
      education,
      socialLinks,
      projects,
      interests,
      events
    });
    
    await newUser.save();
    
    return new Response(JSON.stringify({ message: 'User created successfully' }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Signup error:', error);
    return new Response(JSON.stringify({ error: 'Error creating user' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}