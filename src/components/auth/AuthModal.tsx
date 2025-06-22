import React, { useState } from 'react';
import { X, Mail, Lock, User, Eye, EyeOff, Github, Chrome } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import RegisterForm from './RegisterForm';
import CheckEmailPage from './CheckEmailPage';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'signin' | 'signup';
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialMode = 'signin' }) => {
  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot' | 'check-email'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [registrationEmail, setRegistrationEmail] = useState('');

  const { signUp, signIn, signInWithProvider, resetPassword } = useAuth();

  if (!isOpen) return null;

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setFullName('');
    setError(null);
    setMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      if (mode === 'signin') {
        await signIn(email, password);
        onClose();
      } else if (mode === 'forgot') {
        await resetPassword(email);
        setMessage('Password reset email sent! Check your inbox.');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialSignIn = async (provider: 'google' | 'github') => {
    setLoading(true);
    setError(null);

    try {
      await signInWithProvider(provider);
      onClose();
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (newMode: 'signin' | 'signup' | 'forgot' | 'check-email') => {
    setMode(newMode);
    resetForm();
  };

  const handleRegistrationSuccess = (email: string) => {
    setRegistrationEmail(email);
    setMode('check-email');
  };

  const renderContent = () => {
    switch (mode) {
      case 'signup':
        return (
          <RegisterForm
            onSuccess={() => handleRegistrationSuccess(email)}
            onSwitchToLogin={() => switchMode('signin')}
          />
        );
      case 'check-email':
        return (
          <CheckEmailPage
            email={registrationEmail}
            onBack={() => switchMode('signup')}
          />
        );
      default:
        return renderSignInForm();
    }
  };

  const renderSignInForm = () => (
    <>
        <div className="mb-6">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">M</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">
              {mode === 'signin' ? 'Welcome back' : 
               'Reset password'}
            </h2>
          </div>
          <p className="text-gray-600">
            {mode === 'signin' ? 'Sign in to continue to MindCue' : 
             'Enter your email to reset your password'}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {message && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-700 text-sm">{message}</p>
          </div>
        )}

        {mode !== 'forgot' && (
          <>
            <div className="space-y-3 mb-6">
              <button
                onClick={() => handleSocialSignIn('google')}
                disabled={loading}
                className="w-full flex items-center justify-center space-x-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-3 rounded-lg transition-colors disabled:opacity-50"
              >
                <Chrome className="w-5 h-5" />
                <span>Continue with Google</span>
              </button>
              <button
                onClick={() => handleSocialSignIn('github')}
                disabled={loading}
                className="w-full flex items-center justify-center space-x-2 bg-gray-900 hover:bg-gray-800 text-white px-4 py-3 rounded-lg transition-colors disabled:opacity-50"
              >
                <Github className="w-5 h-5" />
                <span>Continue with GitHub</span>
              </button>
            </div>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">or continue with email</span>
              </div>
            </div>
          </>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          {mode !== 'forgot' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your password"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 text-gray-400" />
                  ) : (
                    <Eye className="w-4 h-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-3 rounded-lg transition-colors font-medium"
          >
            {loading ? 'Loading...' : 
             mode === 'signin' ? 'Sign In' :
             'Send Reset Link'}
          </button>
        </form>

        <div className="mt-6 text-center space-y-2">
          {mode === 'signin' && (
            <>
              <button
                onClick={() => switchMode('forgot')}
                className="text-blue-600 hover:text-blue-700 text-sm"
              >
                Forgot your password?
              </button>
              <div>
                <span className="text-gray-600 text-sm">Don't have an account? </span>
                <button
                  onClick={() => switchMode('signup')}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  Sign up
                </button>
              </div>
            </>
          )}

          {mode === 'forgot' && (
            <button
              onClick={() => switchMode('signin')}
              className="text-blue-600 hover:text-blue-700 text-sm"
            >
              Back to sign in
            </button>
          )}
        </div>
    </>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg transition-colors z-10"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>

        {renderContent()}
      </div>
    </div>
  );
};

export default AuthModal;