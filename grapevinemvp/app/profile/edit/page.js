'use client'

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Navbar from "../../components/Navbar";

export default function EditProfile() {
  const { data: session, status } = useSession();
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (session?.user?.email) {
      fetchUserData(session.user.email);
    }
  }, [session]);

  const fetchUserData = async (email) => {
    try {
      const response = await fetch(`/api/user?email=${email}`);
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        console.error('Failed to fetch user data');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser(prevUser => ({ ...prevUser, [name]: value }));
  };

  const handleArrayChange = (e, index, field) => {
    const { value } = e.target;
    setUser(prevUser => {
      const newArray = [...prevUser[field]];
      newArray[index] = value;
      return { ...prevUser, [field]: newArray };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/user', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
      });
      if (!response.ok) {
        throw new Error('Failed to update profile');
      }
      const updatedUser = await response.json();
      console.log('Profile updated successfully:', updatedUser);
      router.push('/profile');
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  if (status === 'loading' || !user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Navbar />
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto mt-8 p-4">
        <h1 className="text-2xl font-bold mb-4">Edit Profile</h1>
        
        <div className="mb-4">
          <label className="block mb-2">Name</label>
          <input
            type="text"
            name="name"
            value={user.name || ''}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2">Bio</label>
          <textarea
            name="bio"
            value={user.bio || ''}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            rows="4"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2">Interests</label>
          {user.interests && user.interests.map((interest, index) => (
            <input
              key={index}
              type="text"
              value={interest}
              onChange={(e) => handleArrayChange(e, index, 'interests')}
              className="w-full p-2 border rounded mb-2"
            />
          ))}
          <button type="button" onClick={() => setUser(prev => ({ ...prev, interests: [...prev.interests, ''] }))}>
            Add Interest
          </button>
        </div>

        <div className="mb-4">
          <label className="block mb-2">Skills</label>
          {user.skills && user.skills.map((skill, index) => (
            <input
              key={index}
              type="text"
              value={skill}
              onChange={(e) => handleArrayChange(e, index, 'skills')}
              className="w-full p-2 border rounded mb-2"
            />
          ))}
          <button type="button" onClick={() => setUser(prev => ({ ...prev, skills: [...prev.skills, ''] }))}>
            Add Skill
          </button>
        </div>

        <div className="mb-4">
          <label className="block mb-2">School</label>
          <input
            type="text"
            name="education"
            value={user.education || ''}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2">Email</label>
          <input
            type="email"
            name="email"
            value={user.email || ''}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2">Location</label>
          <input
            type="text"
            name="location"
            value={user.location || ''}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2">LinkedIn</label>
          <input
            type="url"
            name="linkedin"
            value={user.linkedin || ''}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />

        </div>
        <div className="mb-4">
            <label className="block mb-2">GitHub</label>
            <input
                type="url"
                name="github"
                value={user.github || ''}
                onChange={handleChange}
                className="w-full p-2 border rounded"
            />
        </div>

        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Save Changes
        </button>
      </form>
    </div>
  );
}