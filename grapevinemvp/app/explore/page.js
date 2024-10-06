"use client";
import React, { useState, useEffect } from 'react';
import SearchBar from '../components/SearchBar';
import Filters from '../components/Filters';
import Navbar from '../components/Navbar';
import UserCard from '../components/UserCard';
import { useSession } from 'next-auth/react';

const ExplorePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({});
  const [users, setUsers] = useState([]);
  const { data: session } = useSession();
  const [matchingInProgress, setMatchingInProgress] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [session]);

  const runMatching = async () => {
    setMatchingInProgress(true);
    try {
      const response = await fetch('/api/match');
      if (!response.ok) {
        throw new Error('Matching failed');
      }
      const matches = await response.json();
        console.log('Matches:', matches);

        // Redirect to matches page
      router.push('/matches');
    } catch (error) {
      console.error('Error running matching:', error);
    } finally {
      setMatchingInProgress(false);
    }
  };

  const fetchUsers = async () => {
    if (session?.user?.email) {
      try {
        const response = await fetch(`/api/user?currentUserEmail=${encodeURIComponent(session.user.email)}`);
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    }
  };

  const handleSearch = (results) => {
    setUsers(results);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    // Implement filtering logic here
  };

  return (
    <div className="explore-page mx-2 ">
      <Navbar />
      <div className="explore-page mx-4">
        <h1>Explore Projects</h1>
        <SearchBar onSearch={handleSearch} />
        <div className="flex justify-right my-8">
          <button
            onClick={runMatching}
            disabled={matchingInProgress}
            className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
          >
            {matchingInProgress ? 'Matching...' : 'Run Matching'}
          </button>
        </div>
        <Filters onChange={handleFilterChange} />
        <div className="user-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {users.map(user => (
            <UserCard key={user._id} user={user} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExplorePage;