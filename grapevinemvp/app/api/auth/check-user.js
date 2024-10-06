import { connectDB } from '@/mongodb';
import User from '@/models/User';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await connectDB();
    const { email } = req.body;

    const user = await User.findOne({ email });

    res.status(200).json({ exists: !!user });
  } catch (error) {
    console.error('Error checking user existence:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}