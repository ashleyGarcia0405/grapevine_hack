'use client'

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from "../components/Navbar";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle, faTools, faBriefcase, faGraduationCap, faProjectDiagram } from '@fortawesome/free-solid-svg-icons';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

export default function Profile() {
    const { data: session, status } = useSession();
    const [user, setUser] = useState(null);
    const router = useRouter();
  
    useEffect(() => {
        console.log("Session:", session);
        if (session?.user?.email) {
          fetchUserData(session.user.email);
        }
      }, [session]);
  
      const fetchUserData = async (email) => {
        console.log("Fetching user data for email:", email);
        try {
          const response = await fetch(`/api/user?email=${email}`);
          console.log("API response status:", response.status);
          if (response.ok) {
            const userData = await response.json();
            console.log("Fetched user data:", userData);
            setUser(userData);
          } else {
            console.error('Failed to fetch user data');
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      };

  

    if (status === 'loading') {
        return <div>Loading...</div>;
    }

    const handleAddProject = () => {
        router.push('/add-project');
    };


    if (!user) {
        return <div>Loading user data...</div>;
    }


    const isOwnProfile = session?.user?.email === user.email;

    return (
        <main className="container mx-auto px-4 bg-gray-100 min-h-screen">
            <Navbar />
            <div className="bg-gray-100 rounded-lg overflow-hidden my-8">
                <div className="p-4 sticky top-0 z-10">
                    <div className="flex items-center">
                        <img 
                            src={user.profileImage || '/images/default-avatar.png'}
                            alt={user.name} 
                            className="w-20 h-20 rounded-full border-4 border-white mr-4"
                        />
                        <div>
                            <h1 className="text-2xl font-bold text-black">{user.name}</h1>
                            <p className="text-black opacity-75">{user.bio}</p>
                        </div>
                    </div>
                    {isOwnProfile ? (
                        <Link href="/profile/edit" className="absolute top-4 right-4 text-purple-600 px-4 py-2 rounded-full hover:bg-purple-100 transition duration-300">
                            edit
                        </Link>
                    ) : (
                        <button className="absolute top-4 right-4 bg-white text-purple-600 px-4 py-2 rounded-full hover:bg-purple-100 transition duration-300">
                            {/* connect */}
                        </button>
                    )}
                </div>
                
                <Tabs>
                    <TabList className="flex border-b">
                        <Tab className="px-4 py-2 font-semibold text-gray-700 hover:text-purple-600 focus:outline-none">
                            Personal
                        </Tab>
                        <Tab className="px-4 py-2 font-semibold text-gray-700 hover:text-purple-600 focus:outline-none">
                            Projects
                        </Tab>
                    </TabList>
    
                    <TabPanel>
                        <div className="p-4 md:flex">
                            <div className="md:w-1/2 pr-4">
                                <section className="mb-6">
                                    <h2 className="text-xl font-semibold mb-2">Interests</h2>
                                    <p className="text-gray-700">{user.interests.join(', ')}</p>
                                </section>
                                <section className="mb-6">
                                    <h2 className="text-xl font-semibold mb-2">Skills</h2>
                                    <div className="flex flex-wrap">
                                        {user.skills && user.skills.map((skill, index) => (
                                            <span key={index} className="bg-purple-100 text-purple-800 rounded-full px-3 py-1 text-sm font-semibold mr-2 mb-2">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </section>
                            </div>
                            <div className="md:w-1/2">
                                <section className="mb-6">
                                    <h2 className="text-xl font-semibold mb-2">School</h2>
                                    <p className="text-black opacity-75">{user.education}</p>
                                </section>
                                <section className="mb-6">
                                    <h2 className="text-xl font-semibold mb-2">Contact</h2>
                                    <p className="text-gray-600 mb-2">{user.email}</p>
                                    {user.location && <p className="text-gray-600 mb-2">{user.location}</p>}
                                    {user.website && <p className="text-gray-600 mb-2"><a href={user.website} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:text-purple-800">{user.website}</a></p>}
                                </section>
                                {user.socialLinks && (
                                    <section className="mb-6">
                                        <h2 className="text-xl font-semibold mb-2">Social Links</h2>
                                        <div className="flex space-x-4">
                                            {user.socialLinks.linkedin && <a href={user.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">LinkedIn</a>}
                                            {user.socialLinks.github && <a href={user.socialLinks.github} target="_blank" rel="noopener noreferrer" className="text-gray-800 hover:text-black">GitHub</a>}
                                        </div>
                                    </section>
                                )}
                            </div>
                        </div>
                    </TabPanel>
    
                    <TabPanel>
                    {isOwnProfile && (
                                <button 
                                    onClick={() => handleAddProject()}
                                    className="mt-4 bg-purple-800 hover:bg-blue-700 text-white font-bold w-8 h-8 rounded-full flex items-center justify-center"
                                    title="Add Project"
                                >
                                    <FontAwesomeIcon icon={faPlus} />
                                </button>
                            )}
                        <div className="p-4 ">
                            {user.projects && user.projects.map((project, index) => (
                                <div key={index} className="mb-4 pb-4">
                                    <h3 className="text-lg font-semibold">{project.title}</h3>
                                    <p className="text-gray-700 mt-2">{project.description}</p>
                                    {project.link && <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:text-purple-800 mt-2 inline-block">View Project</a>}
                                    {/* images */}
                                    <div className="flex flex-wrap gap-2">
                                        {user.projects.image && user.projects.image((image, index) => (
                                            <img key={index} src={image} alt={project.title} className="w-20 h-20 rounded-lg" />
                                        ))}
                                    
                                </div>
                                </div>
                            ))}
                            
                        </div>
                    </TabPanel>
                </Tabs>
            </div>
        </main>
    );
}