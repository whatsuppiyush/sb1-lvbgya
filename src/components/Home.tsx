import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { FcGoogle } from 'react-icons/fc'
import { signInWithPopup, signInWithRedirect } from 'firebase/auth'
import { auth, googleProvider } from '../firebase'

const Home: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      navigate('/gallery');
    } catch (error: any) {
      if (error.code === 'auth/popup-blocked') {
        try {
          await signInWithRedirect(auth, googleProvider);
        } catch (redirectError: any) {
          console.error('Error with redirect sign-in:', redirectError);
        }
      } else {
        console.error('Error logging in with Google:', error);
      }
    }
  };

  if (user) {
    navigate('/gallery');
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Welcome to Ad Creative OS</h1>
        <p className="text-xl mb-8">Explore our curated collection of 3000+ ad templates</p>
      </div>
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Login to Access</h2>
        <button
          onClick={handleGoogleLogin}
          className="flex items-center justify-center w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-50"
        >
          <FcGoogle className="mr-2" size={20} />
          Sign in with Google
        </button>
      </div>
    </div>
  )
}

export default Home