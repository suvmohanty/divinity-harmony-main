import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Phone } from 'lucide-react';
import { 
  getAuth, 
  RecaptchaVerifier, 
  signInWithPhoneNumber, 
  PhoneAuthProvider 
} from 'firebase/auth';

interface PhoneAuthProps {
  onSuccess: (user: any) => void;
  onCancel: () => void;
}

const PhoneAuth = ({ onSuccess, onCancel }: PhoneAuthProps) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [formattedPhoneNumber, setFormattedPhoneNumber] = useState('');
  const [verificationId, setVerificationId] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Phone input, 2: OTP input
  const [timeLeft, setTimeLeft] = useState(0);
  const [recaptchaVerified, setRecaptchaVerified] = useState(false);

  // Handle countdown timer for resend
  useEffect(() => {
    if (timeLeft <= 0) return;
    
    const timerId = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);
    
    return () => clearTimeout(timerId);
  }, [timeLeft]);

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Format phone number as user types
  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.replace(/\D/g, '');
    setPhoneNumber(input);
    
    // Format for display: +91 98765 43210
    if (input.length > 0) {
      let formatted = '+' + input;
      if (input.length > 2) {
        formatted = '+' + input.substring(0, 2) + ' ' + input.substring(2);
      }
      if (input.length > 7) {
        formatted = '+' + input.substring(0, 2) + ' ' + input.substring(2, 7) + ' ' + input.substring(7);
      }
      setFormattedPhoneNumber(formatted);
    } else {
      setFormattedPhoneNumber('');
    }
  };

  // Initialize reCAPTCHA verifier
  const setupRecaptcha = () => {
    const auth = getAuth();
    window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
      'size': 'normal',
      'callback': () => {
        setRecaptchaVerified(true);
      },
      'expired-callback': () => {
        setRecaptchaVerified(false);
        setError('reCAPTCHA has expired. Please verify again.');
      }
    });
  };

  // Send OTP
  const handleSendOTP = async () => {
    if (phoneNumber.length < 10) {
      setError('Please enter a valid phone number');
      return;
    }
    
    setError('');
    setLoading(true);
    
    try {
      // Initialize reCAPTCHA if not already
      if (!window.recaptchaVerifier) {
        setupRecaptcha();
      }
      
      const auth = getAuth();
      const formattedNumber = '+' + phoneNumber; // e.g., +919876543210
      
      const confirmationResult = await signInWithPhoneNumber(
        auth, 
        formattedNumber,
        window.recaptchaVerifier
      );
      
      // Store the verification ID
      setVerificationId(confirmationResult.verificationId);
      window.confirmationResult = confirmationResult;
      
      // Move to OTP input
      setStep(2);
      setTimeLeft(120); // 2-minute countdown
      setLoading(false);
    } catch (error) {
      console.error('Error sending OTP:', error);
      setError('Failed to send OTP. Please try again.');
      setLoading(false);
      
      // Reset reCAPTCHA
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = null;
      }
    }
  };

  // Verify OTP
  const handleVerifyOTP = async () => {
    if (verificationCode.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }
    
    setError('');
    setLoading(true);
    
    try {
      // Use the stored confirmation result
      const result = await window.confirmationResult.confirm(verificationCode);
      
      // User signed in successfully
      const user = result.user;
      onSuccess(user);
      setLoading(false);
    } catch (error) {
      console.error('Error verifying OTP:', error);
      setError('Invalid OTP. Please try again.');
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResendOTP = () => {
    // Reset verification code and error
    setVerificationCode('');
    setError('');
    
    // Reset reCAPTCHA
    if (window.recaptchaVerifier) {
      window.recaptchaVerifier.clear();
      window.recaptchaVerifier = null;
    }
    
    // Go back to step 1
    setStep(1);
  };

  return (
    <div className="flex flex-col space-y-4">
      {step === 1 ? (
        <>
          <h2 className="text-xl font-semibold text-center">Login with Phone</h2>
          <p className="text-muted-foreground text-center text-sm mb-4">
            We'll send a verification code to your phone
          </p>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="phone" className="text-sm font-medium">
                Phone Number
              </label>
              <Input
                id="phone"
                type="tel"
                placeholder="+91 98765 43210"
                value={formattedPhoneNumber}
                onChange={handlePhoneNumberChange}
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Please enter your full phone number with country code
              </p>
            </div>
            
            <div id="recaptcha-container" className="flex justify-center"></div>
            
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="flex space-x-3">
              <Button variant="outline" onClick={onCancel} className="flex-1">
                Cancel
              </Button>
              <Button 
                className="flex-1 bg-hindu-orange hover:bg-hindu-orange/90"
                onClick={handleSendOTP}
                disabled={loading || phoneNumber.length < 10}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Phone className="mr-2 h-4 w-4" />
                    Send OTP
                  </>
                )}
              </Button>
            </div>
          </div>
        </>
      ) : (
        <>
          <h2 className="text-xl font-semibold text-center">Verify OTP</h2>
          <p className="text-muted-foreground text-center text-sm">
            Enter the verification code sent to {formattedPhoneNumber}
          </p>
          
          <div className="space-y-4">
            <Input
              type="text"
              placeholder="123456"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').substring(0, 6))}
              className="text-center text-lg tracking-widest"
              maxLength={6}
            />
            
            {timeLeft > 0 && (
              <p className="text-xs text-center text-muted-foreground">
                Resend in {formatTime(timeLeft)}
              </p>
            )}
            
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="flex space-x-3">
              <Button 
                variant="outline" 
                onClick={handleResendOTP}
                disabled={timeLeft > 0}
                className="flex-1"
              >
                Resend OTP
              </Button>
              <Button 
                className="flex-1 bg-hindu-orange hover:bg-hindu-orange/90"
                onClick={handleVerifyOTP}
                disabled={loading || verificationCode.length !== 6}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  'Verify'
                )}
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PhoneAuth;

// Add global interface for window object
declare global {
  interface Window {
    recaptchaVerifier: any;
    confirmationResult: any;
  }
} 