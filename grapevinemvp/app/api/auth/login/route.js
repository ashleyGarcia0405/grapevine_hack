import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from '../[...nextauth]/route';
import User from '@/models/User'; // Adjust this import based on your project structure
import bcrypt from 'bcryptjs';
import { connectDB } from '@/mongodb'; // Adjust this import based on your project structure


export async function POST(request) {
    const body = await request.json();
    const { email, password } = body;

    try {
        const result = await validateUser(email, password);

        if (result.success) {
            // If login is successful, you might want to create a session here
            // For now, we'll just return the success message and user data
            return NextResponse.json({ success: true, message: result.message, user: result.user });
        } else {
            // If login failed, return the error message
            return NextResponse.json({ success: false, message: result.message }, { status: 401 });
        }
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json({ success: false, message: 'An error occurred during login' }, { status: 500 });
    }
}

async function validateUser(email, password) {
    try {
        await connectDB(); // Make sure this function exists and works

        const user = await User.findOne({ email }).select('+password');
        console.log('User found:', user ? 'Yes' : 'No'); // Add this log

        if (!user) {
            return { success: false, message: "User not found" };
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        console.log('Password valid:', isValidPassword); // Add this log

        if (!isValidPassword) {
            return { success: false, message: "Invalid password" };
        }

        return { success: true, message: "Login successful", user: { id: user._id, email: user.email, name: user.name } };
    } catch (error) {
        console.error('Error validating user:', error);
        return { success: false, message: "An error occurred during login" };
    }
}