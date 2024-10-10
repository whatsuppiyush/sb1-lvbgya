import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithPopup, signInWithRedirect, getRedirectResult } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import { FcGoogle } from 'react-icons/fc';

const Login: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Login: Checking redirect result');
    const checkRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result) {
          console.log('Login: Redirect result successful');
          navigate('/gallery');
        }
      } catch (error: any) {
        console.error('Error with redirect sign-in:', error);
        handleAuthError(error);
      }
    };

    checkRedirectResult();
  }, [navigate]);

  const handleAuthError = (error: any) => {
    console.error('Login: Auth error', error);
    if (error.code === 'auth/unauthorized-domain') {
      setError('This domain is not authorized for authentication. Please contact the administrator.');
    } else {
      setError('An error occurred during authentication. Please try again.');
    }
  };

  const handleGoogleLogin = async () => {
    console.log('Login: Attempting Google login');
    setError(null);
    try {
      await signInWithPopup(auth, googleProvider);
      console.log('Login: Google login successful');
      navigate('/gallery');
    } catch (error: any) {
      if (error.code === 'auth/popup-blocked') {
        console.log('Login: Popup blocked, attempting redirect');
        try {
          await signInWithRedirect(auth, googleProvider);
        } catch (redirectError: any) {
          console.error('Error with redirect sign-in:', redirectError);
          handleAuthError(redirectError);
        }
      } else {
        console.error('Error logging in with Google:', error);
        handleAuthError(error);
      }
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Login to Ad Creative OS</h2>
      <p className="mb-4">Access 3000+ ad templates and boost your marketing campaigns!</p>
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">{error}</div>}
      <div className="text-center">
        <button
          onClick={handleGoogleLogin}
          className="flex items-center justify-center w-full bg-white border border-gray-300 text-gray-700 py-2 rounded hover:bg-gray-50"
        >
          <FcGoogle className="mr-2" size={20} />
          Sign in with Google
        </button>
      </div>
    </div>
  );
};

export default Login;