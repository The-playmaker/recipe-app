import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { auth } from '@/lib/firebase'; // Importerer auth-instansen vi lagde
import { 
  User, 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  signOut 
} from 'firebase/auth';

// Definerer hva AuthContext skal inneholde
interface AuthContextType {
  currentUser: User | null; // KORRIGERT: Endret navn fra 'user' til 'currentUser'
  loading: boolean;
  login: (email, password) => Promise<void>;
  logout: () => Promise<void>;
}

// Oppretter konteksten med en standardverdi
export const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  loading: true,
  login: async () => {},
  logout: async () => {},
});

// Dette er "Provider"-komponenten som vil omkranse hele appen
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null); // KORRIGERT: Endret navn på state-variabel
  const [loading, setLoading] = useState(true);

  // Denne effekten kjører én gang og setter opp en lytter
  // som sjekker om brukerens innloggingsstatus endrer seg.
  useEffect(() => {
    if (!auth) {
        console.warn("Auth instance is not available. Skipping auth state listener.");
        setLoading(false);
        return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user); // KORRIGERT: Oppdaterer riktig state
      setLoading(false);
    });

    // Renser opp lytteren når komponenten forsvinner
    return () => unsubscribe();
  }, []);

  // Innloggingsfunksjon med korrekt, moderne syntaks
  const login = async (email, password) => {
    if (!auth) {
        throw new Error("Auth service is not initialized.");
    }
    await signInWithEmailAndPassword(auth, email, password);
  };

  // Utloggingsfunksjon
  const logout = async () => {
    if (!auth) {
        throw new Error("Auth service is not initialized.");
    }
    await signOut(auth);
  };

  const value = {
    currentUser, // KORRIGERT: Sender riktig variabel
    loading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// En enkel "hook" for å bruke konteksten i andre komponenter
export const useAuth = () => {
  return useContext(AuthContext);
};
