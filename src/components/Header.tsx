import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { signOut } from 'firebase/auth'
import { auth } from '../firebase'
import { Image, LogIn, LogOut, DollarSign } from 'lucide-react'

const Header: React.FC = () => {
  const { user, isProUser } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <header className="bg-white shadow">
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-gray-800">Ad Creative OS</Link>
        <div className="flex space-x-4 items-center">
          <Link to="/gallery" className="flex items-center text-gray-600 hover:text-gray-800">
            <Image className="w-5 h-5 mr-1" />
            Gallery
          </Link>
          {user ? (
            <>
              {isProUser && (
                <span className="bg-green-500 text-white px-2 py-1 rounded-full text-sm font-semibold">
                  Pro
                </span>
              )}
              <button onClick={handleLogout} className="flex items-center text-gray-600 hover:text-gray-800">
                <LogOut className="w-5 h-5 mr-1" />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/pricing" className="flex items-center text-gray-600 hover:text-gray-800">
                <DollarSign className="w-5 h-5 mr-1" />
                Pricing
              </Link>
              <Link to="/login" className="flex items-center text-gray-600 hover:text-gray-800">
                <LogIn className="w-5 h-5 mr-1" />
                Login
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  )
}

export default Header