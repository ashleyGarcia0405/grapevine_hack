import { NextResponse } from 'next/server';
import { connectDB } from '@/mongodb';
import { matchServices } from "../../services/matchServices";

export async function GET() {
  try {
    await connectDB();
    const matches = await matchServices();
    return NextResponse.json(matches);
  } catch (error) {
    console.error('Error in match API:', error);
    return NextResponse.json({ error: 'An error occurred while matching users' }, { status: 500 });
  }
}