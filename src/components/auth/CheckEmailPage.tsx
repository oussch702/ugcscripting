import React, { useState } from 'react';
import { Mail, RefreshCw, ArrowLeft } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface CheckEmailPageProps {
  email: string;
  onBack?: () => void;
}

const CheckEmailPage: React.FC<CheckEmailPageProps> = ({ email, onBack }) => {
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resendConfirmation = async () => {
    if (!email) return;

    setResending(true);
    setError(null);
    
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email
      });

      if (error) {
        setError(error.message);
      } else {
        setResent(true);
        // Reset the "resent" state after 5 seconds
        setTimeout(() => setResent(false), 5000);
      }
    } catch (err) {
      setError('Failed to resend confirmation email. Please try again.');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto text-center">
      <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <Mail className="w-10 h-10 text-blue-600" />
      </div>
      
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Check your email</h2>
      
      <p className="text-gray-600 mb-2">
        We've sent a confirmation link to
      </p>
      <p className="font-semibold text-gray-800 mb-6">{email}</p>
      
      <p className="text-gray-600 mb-8">
        Click the link in the email to verify your account and get started with MindCue.
      </p>

      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <h3 className="font-semibold text-gray-800 mb-3">Didn't receive the email?</h3>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {resent ? (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-700 text-sm">✅ Confirmation email sent!</p>
          </div>
        ) : (
          <button 
            onClick={resendConfirmation}
            disabled={resending}
            className="flex items-center justify-center space-x-2 w-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`w-4 h-4 ${resending ? 'animate-spin' : ''}`} />
            <span>{resending ? 'Sending...' : 'Resend confirmation email'}</span>
          </button>
        )}
      </div>

      <div className="space-y-3 text-sm text-gray-500">
        <p>• Check your spam folder if you don't see the email</p>
        <p>• Make sure you entered the correct email address</p>
        <p>• The confirmation link will expire in 24 hours</p>
      </div>

      {onBack && (
        <button
          onClick={onBack}
          className="flex items-center justify-center space-x-2 w-full mt-6 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to registration</span>
        </button>
      )}
    </div>
  );
};

export default CheckEmailPage;