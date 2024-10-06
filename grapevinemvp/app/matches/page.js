'use client'

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Navbar from '../components/Navbar';
import UserCard from '../components/UserCard';

export default function Matches() {
  const [matches, setMatches] = useState({});
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();

  useEffect(() => {
    if (session) {
      fetchMatches();
    }
  }, [session]);

  const fetchMatches = async () => {
    try {
      const response = await fetch('/api/match');
      if (!response.ok) {
        throw new Error('Failed to fetch matches');
      }
      const matchData = await response.json();
      setMatches(matchData); // Update to set matches as an object
    } catch (error) {
      console.error('Error fetching matches:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading matches...</div>;
  }

  // Get the current user's matches based on their session
  const currentUserMatches = matches[session.user.id] || []; // Assuming session.user.id contains the current user's ID

  return (
    <div>
      <Navbar />
      <div className="mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Your Matches</h1>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {currentUserMatches.map((user, userIndex) => (
            <UserCard key={userIndex} user={user} />
          ))}
        </div>
      </div>
    </div>
  );
}