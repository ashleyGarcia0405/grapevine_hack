'use client'

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../components/Navbar';
import { useSession } from "next-auth/react";
import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation'; // Updated import
import Image from 'next/image';
import { Suspense } from 'react'

export default function AddProjectContent() {
  const searchParams = useSearchParams();
  const projectType = searchParams.get('type');
  const router = useRouter();
  const [images, setImages] = useState('');
  const { data: session } = useSession();
  const [projects, setProjects] = useState([]);
  const [user, setUser] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  
  const [project, setProject] = useState({
    title: '',
    description: '',
    link: '',
    image: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProject(prev => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    fetchProjects();
  }, [session]);


  const fetchProjects = async () => {
    if (session?.user?.email) {
      try {
        const response = await fetch(`/api/user?email=${session.user.email}`);
        if (!response.ok) {
          throw new Error('Failed to fetch projects');
        }
        const data = await response.json();
        setProjects(data.projects);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!session || !session.user) {
      console.error("User not authenticated");
      return;
    }
  
    const newProject = {
      title: project.title,
      description: project.description,
      link: project.link,
      image: project.image,
    };
  
    try {
      const response = await fetch('/api/user/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: session.user.email,
          project: newProject 
        }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to update user document');
      }
  
      const updatedUser = await response.json();
      console.log('Project added successfully', updatedUser);
  
      // Update local state if necessary
      setUser(updatedUser);
  
      // Clear the form
      setProject({ title: '', description: '', link: '', image: '' });
  
    } catch (error) {
      console.error('Error updating projects:', error);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
formData.append('upload_preset',process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);
  
    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setProfileImage(data.secure_url);
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };



  return (
    <Suspense fallback={<div>Loading...</div>}>
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <div className="max-w-2xl mx-auto mt-8 bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Add {projectType} Project</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Project Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={project.title}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter project title"
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              id="description"
              name="description"
              value={project.description}
              onChange={handleChange}
              required
              rows={4}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Describe your project"
            />
          </div>
          <div>
            <label htmlFor="link" className="block text-sm font-medium text-gray-700 mb-1">Project Link</label>
            <input
              type="url"
              id="link"
              name="link"
              value={project.link}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="https://your-project-link.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Project Images</label>
            <div className="flex items-center justify-center w-full">
              <label htmlFor="images" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                </div>
                <input
                  id="images"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>
          {project.images && project.images.length > 0 && (
            <div className="grid grid-cols-3 gap-4 mt-4">
              {project.images.map((image, index) => (
                <div key={index} className="relative">
                  <Image src={image} alt={`Project image ${index + 1}`} className="w-full h-32 object-cover rounded-md" />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
          <button
            type="submit"
            className="w-full bg-purple-600 text-white px-4 py-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Add
          </button>
        </form>
      </div>
    </div>
    </Suspense>
  );
}