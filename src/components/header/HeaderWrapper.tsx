import React, { useState, useEffect } from 'react';
import Header from '../layout/Header';
import LoginSignup from '../auth/LoginSignup';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { createUser } from '@/firebase/firestore';

const HeaderWrapper = () => {
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Listen for authentication state changes
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true);
      
      if (currentUser) {
        // Create or update user in Firestore
        try {
          await createUser(currentUser);
        } catch (error) {
          console.error('Error saving user data:', error);
        }
      }
      
      setUser(currentUser);
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, []);
  
  // Check for login query parameter
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.get('login') === 'true') {
      setIsLoginDialogOpen(true);
      // Clean up the URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const handleLoginSuccess = (user: any) => {
    setUser(user);
    setIsLoginDialogOpen(false);
  };

  return (
    <>
      <Header 
        user={user} 
        onLoginClick={() => setIsLoginDialogOpen(true)} 
        loading={loading}
      />
      
      <LoginSignup 
        open={isLoginDialogOpen} 
        onOpenChange={setIsLoginDialogOpen} 
        onLoginSuccess={handleLoginSuccess}
      />
    </>
  );
};

export default HeaderWrapper; 