'use client';
import { useState } from 'react';
import { Mail } from 'lucide-react';
import { Lock } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';


export default function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
    const router = useRouter();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError(''); 

    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }
    const response = await signIn('credentials', {
      redirect: false,
      email: email.toLowerCase(),
      password,
    })
    if (response?.error) {
      setError("Login failed. Please check your credentials.");
      return;
    }else{
        router.push('/');
    }
  };

  return (

    <div className="min-h-screen w-full bg-secondary/10 flex items-center justify-center font-sans p-4">
      <div className="w-full max-w-5xl grid md:grid-cols-2 rounded-2xl shadow-2xl overflow-hidden bg-white">
      
        <div className="relative hidden md:block">
          <div className="absolute inset-0 bg-primary opacity-20"></div>
          <Image 
            src="/quote.png" 
            width={600}
            height={800}
            alt="Abstract background image with purple and blue tones"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/50 to-transparent p-10 flex flex-col justify-end">
            <h2 className="text-4xl font-bold text-white mb-3 leading-tight">
              Continue Your Journey With Us
            </h2>
            <p className="text-white/80">
              Login to unlock exclusive features and content.
            </p>
          </div>
        </div>

        {/* Form Side */}
        <div className="w-full p-8 lg:p-12 flex flex-col justify-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Log Into Your Account</h1>
          <p className="text-gray-500 mb-8">Welcome! Please enter your details.</p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                </span>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <Lock className="h-5 w-5 text-gray-400" />
                </span>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Confirm Password Input */}
            
            
            {/* Error Message */}
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative" role="alert">
                <span className="block sm:inline">{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-transform transform hover:scale-105"
              >
                Sign In
              </button>
            </div>
          </form>

          {/* Sign in link */}
          <p className="mt-8 text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <a href="register" className="font-medium text-primary hover:text-primary/80">
              Sign Up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
