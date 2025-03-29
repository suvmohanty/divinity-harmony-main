import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Mail, Phone, Lock, User, Facebook } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import PhoneAuth from './PhoneAuth';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
  updateProfile,
} from 'firebase/auth';
import { getFirestore, doc, setDoc, Timestamp } from 'firebase/firestore';

interface LoginSignupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLoginSuccess?: (user: any) => void;
}

const LoginSignup = ({ open, onOpenChange, onLoginSuccess }: LoginSignupProps) => {
  const [activeTab, setActiveTab] = useState('login');
  const [authMethod, setAuthMethod] = useState<'email' | 'phone'>('email');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Email/Password login states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (!open) {
      resetForm();
    }
  }, [open]);

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setName('');
    setError('');
    setAuthMethod('email');
    setActiveTab('login');
    setLoading(false);
  };

  // Handle Email Login
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      if (onLoginSuccess) {
        onLoginSuccess(userCredential.user);
      }
      
      onOpenChange(false);
    } catch (error: any) {
      console.error('Error logging in:', error);
      setError(error.message || 'Failed to login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Email Signup
  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !name) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update user profile with name
      await updateProfile(userCredential.user, {
        displayName: name
      });

      // Store user data in Firestore
      const db = getFirestore();
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        uid: userCredential.user.uid,
        displayName: name,
        email: email,
        phoneNumber: userCredential.user.phoneNumber || null,
        photoURL: userCredential.user.photoURL || null,
        createdAt: Timestamp.now(),
        lastLogin: Timestamp.now(),
        provider: 'email'
      });
      
      if (onLoginSuccess) {
        onLoginSuccess(userCredential.user);
      }
      
      onOpenChange(false);
    } catch (error: any) {
      console.error('Error signing up:', error);
      setError(error.message || 'Failed to sign up. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Social Login
  const handleSocialLogin = async (provider: 'google' | 'facebook') => {
    setLoading(true);
    setError('');

    try {
      const auth = getAuth();
      const authProvider = provider === 'google' 
        ? new GoogleAuthProvider() 
        : new FacebookAuthProvider();
      
      const userCredential = await signInWithPopup(auth, authProvider);
      
      // Store or update user data in Firestore
      const db = getFirestore();
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        uid: userCredential.user.uid,
        displayName: userCredential.user.displayName,
        email: userCredential.user.email,
        phoneNumber: userCredential.user.phoneNumber || null,
        photoURL: userCredential.user.photoURL,
        createdAt: Timestamp.now(),
        lastLogin: Timestamp.now(),
        provider: provider
      }, { merge: true });
      
      if (onLoginSuccess) {
        onLoginSuccess(userCredential.user);
      }
      
      onOpenChange(false);
    } catch (error: any) {
      console.error(`Error logging in with ${provider}:`, error);
      setError(error.message || `Failed to login with ${provider}. Please try again.`);
      setLoading(false);
    }
  };

  // Handle Phone Auth Success
  const handlePhoneAuthSuccess = async (user: any) => {
    // Store or update user data in Firestore
    try {
      const db = getFirestore();
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        displayName: user.displayName || `User${user.uid.substring(0, 5)}`,
        email: user.email || null,
        phoneNumber: user.phoneNumber,
        photoURL: user.photoURL || null,
        createdAt: Timestamp.now(),
        lastLogin: Timestamp.now(),
        provider: 'phone'
      }, { merge: true });
      
      if (onLoginSuccess) {
        onLoginSuccess(user);
      }
      
      onOpenChange(false);
    } catch (error) {
      console.error('Error storing user data:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl">
            {activeTab === 'login' ? 'Welcome Back' : 'Create Account'}
          </DialogTitle>
          <DialogDescription className="text-center">
            {activeTab === 'login' 
              ? 'Login to access your account and preferences'
              : 'Sign up to start your spiritual journey'
            }
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="space-y-4">
            {authMethod === 'email' ? (
              <form onSubmit={handleEmailLogin} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium">
                    Password
                  </label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Button
                  type="submit"
                  className="w-full bg-hindu-orange hover:bg-hindu-orange/90"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Logging in...
                    </>
                  ) : (
                    <>
                      <Mail className="mr-2 h-4 w-4" />
                      Login with Email
                    </>
                  )}
                </Button>
              </form>
            ) : (
              <PhoneAuth
                onSuccess={handlePhoneAuthSuccess}
                onCancel={() => setAuthMethod('email')}
              />
            )}

            {authMethod === 'email' && (
              <div className="text-center">
                <Button
                  variant="link"
                  className="text-sm text-muted-foreground"
                  onClick={() => setAuthMethod('phone')}
                >
                  Login with Phone Number Instead
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="signup" className="space-y-4">
            <form onSubmit={handleEmailSignup} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Name
                </label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="signup-email" className="text-sm font-medium">
                  Email
                </label>
                <Input
                  id="signup-email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="signup-password" className="text-sm font-medium">
                  Password
                </label>
                <Input
                  id="signup-password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className="w-full bg-hindu-orange hover:bg-hindu-orange/90"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    <User className="mr-2 h-4 w-4" />
                    Create Account
                  </>
                )}
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t"></span>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            onClick={() => handleSocialLogin('google')}
            disabled={loading}
          >
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Google
          </Button>
          <Button
            variant="outline"
            onClick={() => handleSocialLogin('facebook')}
            disabled={loading}
          >
            <Facebook className="mr-2 h-4 w-4 text-[#1877F2]" />
            Facebook
          </Button>
        </div>

        <DialogFooter className="mt-4 text-center flex justify-center">
          <p className="text-xs text-muted-foreground">
            By continuing, you agree to our{' '}
            <a href="#" className="underline">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="underline">
              Privacy Policy
            </a>
          </p>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LoginSignup; 