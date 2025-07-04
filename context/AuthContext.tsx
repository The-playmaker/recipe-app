import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { authInstance } from '@/lib/firebase.native'; // Use native Firebase auth
import { FirebaseAuthTypes } from '@react-native-firebase/auth';

interface AuthContextType {
  currentUser: FirebaseAuthTypes.User | null;
  loading: boolean;
  error: Error | null;
  login: (email, password) => Promise<void>;
  logout: () => Promise<void>;
  // We can add signUp here later if needed
  // signUp: (email, password) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!authInstance) {
      console.error("Auth instance not available in AuthProvider. Firebase might not be initialized correctly.");
      setLoading(false);
      setError(new Error("Firebase Auth service is not available."));
      return;
    }

    // Listen for authentication state changes
    const unsubscribe = authInstance.onAuthStateChanged(user => {
      setCurrentUser(user);
      setLoading(false);
      setError(null); // Clear any previous errors on auth state change
    });

    // Cleanup subscription on unmount
    return unsubscribe;
  }, []);

  const login = async (email, password) => {
    if (!authInstance) {
      throw new Error("Firebase Auth service is not available.");
    }
    setLoading(true);
    setError(null);
    try {
      await authInstance.signInWithEmailAndPassword(email, password);
      // onAuthStateChanged will handle setting the currentUser
    } catch (e) {
      setError(e as Error);
      throw e; // Re-throw to be caught by the caller if needed
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    if (!authInstance) {
      throw new Error("Firebase Auth service is not available.");
    }
    setLoading(true);
    setError(null);
    try {
      await authInstance.signOut();
      // onAuthStateChanged will handle setting the currentUser to null
    } catch (e) {
      setError(e as Error);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  // Placeholder for signUp if you decide to add it later
  // const signUp = async (email, password) => {
  //   if (!authInstance) {
  //     throw new Error("Firebase Auth service is not available.");
  //   }
  //   setLoading(true);
  //   setError(null);
  //   try {
  //     await authInstance.createUserWithEmailAndPassword(email, password);
  //     // onAuthStateChanged will handle setting the currentUser
  //   } catch (e) {
  //     setError(e as Error);
  //     throw e;
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const value = {
    currentUser,
    loading,
    error,
    login,
    logout,
    // signUp, // Uncomment if you implement it
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
