import React from 'react';
import {
  User,
  Building2,
  LandPlot,
  Calendar,
  FileText,
  Sparkles,
  Download,
  Share2,
  PlusCircle,
  Trash,
  Info,
} from 'lucide-react';

// Skeleton component for an individual info item
const SkeletonInfoItem = () => (
  <div>
    <div className="flex items-center">
      <div className="w-6 h-6 bg-gray-300 dark:bg-gray-600 rounded-md animate-pulse mr-3"></div>
      <div className="w-1/3 h-4 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"></div>
    </div>
    <div className="mt-2 ml-9 w-3/4 h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
  </div>
);

// Skeleton component for a table row
const SkeletonTableRow = () => (
  <tr className="border-b border-gray-200 dark:border-gray-700">
    <td className="p-4">
      <div className="w-3/4 h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
    </td>
    <td className="p-4">
      <div className="w-1/2 h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mx-auto"></div>
    </td>
    <td className="p-4 text-right">
      <div className="w-1/2 h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse ml-auto"></div>
    </td>
    <td className="p-4 text-right">
      <div className="w-1/2 h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse ml-auto"></div>
    </td>
    <td className="p-4 text-right">
      <div className="w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse ml-auto"></div>
    </td>
  </tr>
);

// Main Skeleton Component for the entire page
const QuoteSkeleton = () => {
  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen p-4 sm:p-6 w-full lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section Skeleton */}
        <header className="mb-8">
          <div className="w-1/4 h-5 bg-gray-300 dark:bg-gray-600 rounded animate-pulse mb-4"></div>
          <div className="w-3/4 h-12 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"></div>
          <div className="mt-4 w-1/2 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        </header>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Project Details Skeleton */}
          <div className="lg:col-span-2 space-y-8">
            {/* Project Info Card Skeleton */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md">
              <div className="w-1/2 h-8 bg-gray-300 dark:bg-gray-600 rounded animate-pulse mb-6"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
                <SkeletonInfoItem />
                <SkeletonInfoItem />
                <SkeletonInfoItem />
                <SkeletonInfoItem />
              </div>
              <div className="mt-8">
                <SkeletonInfoItem />
              </div>
            </div>

            {/* AI Generated Breakdown Card Skeleton */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md">
              <div className="flex items-center mb-6">
                <div className="w-7 h-7 bg-indigo-200 dark:bg-indigo-900 rounded-full animate-pulse mr-3"></div>
                <div className="w-3/4 h-8 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"></div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 dark:bg-gray-700/50">
                    <tr>
                      <th className="p-4 w-1/3">
                        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"></div>
                      </th>
                      <th className="p-4 w-1/6">
                        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"></div>
                      </th>
                      <th className="p-4 w-1/6">
                        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"></div>
                      </th>
                      <th className="p-4 w-1/6">
                        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"></div>
                      </th>
                      <th className="p-4 w-1/12">
                        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"></div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <SkeletonTableRow />
                    <SkeletonTableRow />
                    <SkeletonTableRow />
                    <SkeletonTableRow />
                    <SkeletonTableRow />
                  </tbody>
                </table>
                <div className="flex justify-center m-2 mt-4">
                   <div className="w-32 h-10 bg-gray-300 dark:bg-gray-700 rounded-lg animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Summary & Actions Skeleton */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md">
              <div className="w-1/3 h-7 bg-gray-300 dark:bg-gray-600 rounded animate-pulse mb-4"></div>
              <div className="flex flex-col space-y-3">
                <div className="w-full h-12 bg-gray-300 dark:bg-gray-700 rounded-lg animate-pulse"></div>
                <div className="w-full h-12 bg-gray-200 dark:bg-gray-600 rounded-lg animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuoteSkeleton;
