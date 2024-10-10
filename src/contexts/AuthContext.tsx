import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { auth } from '../firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isProUser: boolean;
  checkProStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isProUser: false,
  checkProStatus: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isProUser, setIsProUser] = useState(false);

  const checkProStatus = async () => {
    if (user) {
      try {
        const response = await fetch(`/.netlify/functions/check-subscription?userId=${user.uid}`);
        const data = await response.json();
        setIsProUser(data.isProUser);
      } catch (error) {
        console.error('Error checking pro status:', error);
        setIsProUser(false);
      }
    } else {
      setIsProUser(false);
    }
  };

  useEffect(() => {
    console.log('AuthProvider: Setting up auth state listener');
    const unsubscribe = auth.onAuthStateChanged((user) => {
      console.log('AuthProvider: Auth state changed', user);
      setUser(user);
      setLoading(false);
      if (user) {
        checkProStatus();
      } else {
        setIsProUser(false);
      }
    });

    return () => {
      console.log('AuthProvider: Cleaning up auth state listener');
      unsubscribe();
    };
  }, []);

  console.log('AuthProvider: Rendering', { user, loading, isProUser });

  return (
    <AuthContext.Provider value={{ user, loading, isProUser, checkProStatus }}>
      {children}
    </AuthContext.Provider>
  );
};