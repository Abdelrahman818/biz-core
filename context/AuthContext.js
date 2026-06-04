'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [businessId, setBusinessId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch businessId from Firestore
  const fetchBusinessId = async (userId) => {
    try {
      const q = query(
        collection(db, 'businesses'),
        where('userId', '==', userId)
      );
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const doc = snapshot.docs[0];
        setBusinessId(doc.id); // Use the document ID as businessId
        return doc.id;
      }
      return null;
    } catch (err) {
      console.error('Error fetching business ID:', err);
      return null;
    }
  };

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await fetchBusinessId(currentUser.uid);
      } else {
        setBusinessId(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Sign up with email and password
  const signup = async (email, password) => {
    try {
      setError(null);
      const result = await createUserWithEmailAndPassword(auth, email, password);
      return result.user;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Sign in with email and password
  const login = async (email, password) => {
    try {
      setError(null);
      const result = await signInWithEmailAndPassword(auth, email, password);
      return result.user;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Sign out
  const logout = async () => {
    try {
      setError(null);
      await signOut(auth);
      setUser(null);
      setBusinessId(null);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Get ID token for API calls
  const getToken = async () => {
    try {
      if (user) {
        return await user.getIdToken();
      }
      return null;
    } catch (err) {
      setError(err.message);
      return null;
    }
  };

  const value = {
    user,
    businessId,
    loading,
    error,
    signup,
    login,
    logout,
    getToken,
    isAuthenticated: !!user,
    refreshBusinessId: () => user ? fetchBusinessId(user.uid) : null,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
