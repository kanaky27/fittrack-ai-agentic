import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User as UserIcon, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { AppContext } from '../context/AppContext';

export default function Login() {
  const [mode, setMode] = useState<'login' | 'sign-up'>('login');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login, signup, user } = useContext(AppContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate('/');
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === 'login') {
        await login({ email, password });
      } else {
        await signup({ username, email, password });
      }
    } catch (err: any) {
      alert(err.response?.data?.error?.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2 className="text-3xl font-medium text-gray-900 dark:text-white">
          {mode === 'login' ? 'Sign In' : 'Sign up'}
        </h2>
        <p className="mt-2 text-sm text-gray-500/90 dark:text-gray-400">
          {mode === 'login'
            ? 'Please enter email and password to access.'
            : 'Please enter your details to create an account.'}
        </p>

        {mode !== 'login' && (
          <div className="mt-4">
            <label className="font-medium text-sm text-gray-700 dark:text-gray-300">Username</label>
            <div className="relative mt-2">
              <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                onChange={(e) => setUsername(e.target.value)}
                value={username}
                type="text"
                placeholder="enter a username"
                className="login-input"
                required
              />
            </div>
          </div>
        )}

        <div className="mt-4">
          <label className="font-medium text-sm text-gray-700 dark:text-gray-300">Email</label>
          <div className="relative mt-2">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type="email"
              placeholder="Please enter your email"
              className="login-input"
              required
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="font-medium text-sm text-gray-700 dark:text-gray-300">Password</label>
          <div className="relative mt-2">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              type={showPassword ? 'text' : 'password'}
              placeholder="Please enter your password"
              className="login-input pr-10"
              required
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <button type="submit" disabled={loading} className="login-button">
          {loading ? 'Signing in...' : mode === 'login' ? 'Login' : 'Sign up'}
        </button>

        {mode === 'login' ? (
          <p className="text-center py-6 text-sm text-gray-500 dark:text-gray-400">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={() => setMode('sign-up')}
              className="ml-1 cursor-pointer text-emerald-600 hover:underline"
            >
              Sign up
            </button>
          </p>
        ) : (
          <p className="text-center py-6 text-sm text-gray-500 dark:text-gray-400">
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => setMode('login')}
              className="ml-1 cursor-pointer text-emerald-600 hover:underline"
            >
              Login
            </button>
          </p>
        )}
      </form>
    </main>
  );
}
