'use client'

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Navbar from '../components/Navbar';

export default function Matches() {
  const [matches, setMatches] = useState([]);
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
      setMatches(matchData);
    } catch (error) {
      console.error('Error fetching matches:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading matches...</div>;
  }

  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        {/* <h1 className="text-3xl font-bold mb-6">Your Matches</h1> */}
        {matches.map((group, index) => (
          <div key={index} className="mb-8 p-4 bg-white rounded-lg shadow">
            <h2 className="text-2xl font-semibold mb-4">Suggestion {index + 1}</h2>
            {group.map((user, userIndex) => (
              <div key={userIndex} className="mb-2">
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-gray-600">{user.projectInterest}</p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}