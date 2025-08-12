// app/quotes/page.tsx (or your component's file)
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import React from 'react';
import { Building,LandPlot, User, FileText, AlertTriangle, Inbox } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';


interface Quote {
  _id: string; 
  client_name: string;
  project_title: string;
  project_type: string;
  project_description: string;
  estimated_area: number;
}

const QuoteCard = ({ quote }: { quote: Quote }) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transform hover:-translate-y-1 transition-all duration-300 ease-in-out hover:shadow-2xl">
    <Link href={`/quote/${quote._id}`} className="block">
    <div className="p-6">
      <div className="flex items-start justify-between">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
          {quote.project_title}
        </h2>
        <span className="bg-indigo-100 text-indigo-800 text-xs font-semibold px-2.5 py-0.5 rounded-full dark:bg-indigo-900 dark:text-indigo-300">
          {quote.project_type}
        </span>
      </div>
      
      <div className="mt-4 space-y-3 text-gray-600 dark:text-gray-300">
        <div className="flex items-center">
          <User className="w-5 h-5 mr-3 text-indigo-500" />
          <span>{quote.client_name}</span>
        </div>
        <div className="flex items-center">
          <LandPlot className="w-5 h-5 mr-3 text-indigo-500" />
          <span>{quote.estimated_area} sq ft</span>
        </div>
        <div className="flex items-start">
          <FileText className="w-5 h-5 mr-3 text-indigo-500 flex-shrink-0 mt-1" />
          <p className="text-gray-700 dark:text-gray-400">
            {quote.project_description}
          </p>
        </div>
      </div>
    </div>
    </Link>
  </div>
);

// 2. New Component: A Skeleton Loader for a better loading experience
const SkeletonCard = () => (
  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 animate-pulse">
    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-3"></div>
    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-3"></div>
    <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded mt-4"></div>
  </div>
);

// The main page component, now orchestrating the states
const QuotesPage = () => {
  const { data: session, status } = useSession();

  // 3. Improved State Management
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const getQuotes = async () => {
      if (!session?.user?.email) return;

      setLoading(true);
      setError(null);

      try {
        const res = await axios.get('/api/get-users-quotes', {
          params: { user_email: session.user.email }
        });
        setQuotes(res.data.quotes);
      } catch (err) {
        console.error("Failed to fetch quotes:", err);
        setError("We couldn't load your quotes. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (status === 'authenticated') {
      getQuotes();
    }
    if (status === 'unauthenticated') {
      setLoading(false);
      router.push('/login');
      setError("You must be logged in to view quotes.");
    }
  }, [session, status]);

  // 4. Main Render Logic based on state
  const renderContent = () => {
    if (loading) {
      // Show 3 skeleton cards while loading
      return Array.from({ length: 3 }).map((_, index) => <SkeletonCard key={index} />);
    }

    if (error) {
      return (
        <div className="col-span-full flex flex-col items-center justify-center bg-red-50 dark:bg-red-900/10 text-red-700 dark:text-red-300 p-8 rounded-lg">
          <AlertTriangle className="w-12 h-12 mb-4" />
          <h3 className="text-xl font-semibold">An Error Occurred</h3>
          <p>{error}</p>
        </div>
      );
    }

    if (quotes.length === 0) {
      return (
        <div className="col-span-full flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-800/50 p-12 rounded-lg text-center">
          <Inbox className="w-16 h-16 mb-4 text-gray-400" />
          <h3 className="text-2xl font-bold text-gray-800 dark:text-white">No Quotes Found</h3>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Looks like you haven't created any quotes yet. Get started!</p>
          <button className="mt-6 bg-indigo-600 text-white font-semibold py-2 px-5 rounded-lg hover:bg-indigo-700 transition-colors">
            Create First Quote
          </button>
        </div>
      );
    }

    return quotes.map((quote) => <QuoteCard key={quote._id} quote={quote} />);
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl lg:text-6xl tracking-tight">
            Your Project Quotes
          </h1>
          <p className="mt-4 max-w-xl mx-auto text-xl text-gray-500 dark:text-gray-400">
            A centralized view of all your estimates and project plans.
          </p>
        </header>

        <main>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default QuotesPage;