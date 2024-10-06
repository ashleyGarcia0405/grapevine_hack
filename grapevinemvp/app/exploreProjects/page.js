"use client";
import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';

const ExploreProjects = () => {
  const [projects, setProjects] = useState([]);
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user?.email) {
      fetchProjects();
    }
  }, [session]);

  const fetchProjects = async () => {
    try {
      const response = await fetch(`/api/user?currentUserEmail=${encodeURIComponent(session.user.email)}`);
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      const users = await response.json();
      const allProjects = users.flatMap(user => 
        user.projects.map(project => ({ ...project, userName: user.name, userId: user._id }))
      );
      const populatedProjects = allProjects.filter(hasContent);
      setProjects(populatedProjects);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const hasContent = (project) => {
    return project.title && (project.description || (project.images && project.images.length > 0));
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <p className="text-3xl font-bold mb-8 text-left text-purple-800">Explore Projects</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <Link href={`/profile/${project.userId}?tab=projects`} key={index}>
              <div className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transition-transform duration-300 hover:scale-105">
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-2 text-purple-700">{project.title}</h2>
                  <p className="text-sm text-gray-500 mb-4">by @{project.userName}</p>
                  {project.description && (
                    <p className="text-gray-600 mb-4 line-clamp-3">{project.description}</p>
                  )}
                  {project.link && (
                    <a 
                      href={project.link} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-purple-600 hover:text-purple-800 inline-block mb-4"
                      onClick={(e) => e.stopPropagation()}
                    >
                      View Project
                    </a>
                  )}
                  {project.images && project.images.length > 0 && (
                    <div className="grid grid-cols-2 gap-2">
                      {project.images.slice(0, 4).map((image, imageIndex) => (
                        <div key={imageIndex} className="relative aspect-square">
                          <Image 
                            src={image}
                            alt={`Project image ${imageIndex + 1}`} 
                            layout="fill"
                            objectFit="cover"
                            className="rounded-md"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ExploreProjects;