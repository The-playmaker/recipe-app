import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { authInstance } from '@/lib/firebase'; // Now imports from the barrel file
import { User as FirebaseUser } from 'firebase/auth'; // Web SDK User type
import { FirebaseAuthTypes } from '@react-native-firebase/auth'; // Native SDK User type (for potential type union or checking)
import { Platform } from 'react-native';

// Define a unified User type or use 'any' if structures are too different and not cross-assigned.
// For simplicity here, we'll assume the core User properties we care about are similar enough,
// or that authInstance will be typed correctly by the platform-specific import.
// A more robust solution might involve a type adapter if properties differ significantly.
type AppUser = FirebaseUser | FirebaseAuthTypes.User | null;


interface AuthContextType {
  currentUser: AppUser;
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
  const [currentUser, setCurrentUser] = useState<AppUser>(null);
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
