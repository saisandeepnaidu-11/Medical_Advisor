import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import type { User } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, googleProvider } from '../lib/firebase';
import type { AppUser, UserRole } from '../types';

interface AuthContextType {
  currentUser: User | null;
  appUser: AppUser | null;
  loading: boolean;
  loginWithGoogle: (role: UserRole) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [appUser, setAppUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  async function loginWithGoogle(role: UserRole) {
    const result = await signInWithPopup(auth, googleProvider);
    const { user } = result;

    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      const newUser: Omit<AppUser, 'id'> = {
        uid: user.uid,
        name: user.displayName || 'Unknown',
        email: user.email || '',
        role,
        createdAt: new Date().toISOString(),
      };
      await setDoc(userRef, { ...newUser, createdAt: serverTimestamp() });
      setAppUser({ ...newUser });
    } else {
      const data = userSnap.data() as AppUser;
      // Update role on new login choice
      await setDoc(userRef, { role }, { merge: true });
      setAppUser({ ...data, role });
    }
  }

  async function logout() {
    await signOut(auth);
    setAppUser(null);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        try {
          const userRef = doc(db, 'users', user.uid);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            setAppUser(userSnap.data() as AppUser);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        setAppUser(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const value: AuthContextType = {
    currentUser,
    appUser,
    loading,
    loginWithGoogle,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
