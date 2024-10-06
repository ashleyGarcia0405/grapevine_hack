'use client'

import Link from 'next/link'
import { signOut, useSession } from 'next-auth/react'
import { useState } from 'react'

const Navbar = () => {
  const { data: session, status } = useSession()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <nav className="text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/explore" className="text-2xl font-bold">
          Grapevine 🍇
        </Link>
        
        {/* Mobile menu button */}
        <button 
          className="md:hidden"
          onClick={toggleMenu}
        >
          <svg className="w-6 h-6" fill="none" stroke="black" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Desktop menu */}
        <div className="hidden md:flex items-center">
          {/* <Link href="/projects" className="mr-4 hover:text-purple-200">
            Discover
          </Link> */}
          {status === "authenticated" ? (
            <>
              <Link href="/profile" className="mr-4 hover:text-purple-200">
                Profile
              </Link>
              <Link href="/explore" className="mr-4 hover:text-purple-200">
                Explore🧭
              </Link>
              <Link href="/matches" className="mr-4 hover:text-purple-200">
                Matches🥂
              </Link>
              <Link href="/exploreProjects" className="block py-2 hover:text-purple-200">
                Projects🤖
              </Link>
              <button 
                onClick={() => signOut({ callbackUrl: '/' })}
                className=" text-gray-600 font-bold py-2 px-4 rounded"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link 
                href="/login" 
                className="bg-purple-600 hover:bg-purple-500 text-white font-bold py-1 px-4 rounded mr-2"
              >
                Sign in
              </Link>
              <Link 
                href="/signup" 
                className="bg-purple-600 hover:bg-purple-500 text-white font-bold py-1 px-4 rounded"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden mt-4">
          {/* <Link href="/projects" className="block py-2 hover:text-purple-200">
            Discover
          </Link> */}
          {status === "authenticated" ? (
            <>
              <Link href="/profile" className="block py-2 hover:text-purple-200">
                Profile
              </Link>
              <Link href="/explore" className="block py-2 hover:text-purple-200">
                Explore🧭
              </Link>
              <Link href="/matches" className="block py-2 hover:text-purple-200">
                Matches🥂
              </Link>
              <Link href="/exploreProjects" className="block py-2 hover:text-purple-200">
                Projects🤖
              </Link>
              <button 
                onClick={() => signOut({ callbackUrl: '/' })}
                className="block w-full text-left py-2 hover:text-purple-200 text-purple-600"
              >
                Sign out 
              </button>
              
            </>
          ) : (
            <>
              <Link 
                href="/login" 
                className="block py-2 hover:text-purple-200"
              >
                Sign in
              </Link>
              <Link 
                href="/signup" 
                className="block py-2 hover:text-purple-200"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}

export default Navbar