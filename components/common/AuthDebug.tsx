
'use client';

import { useAuth } from '@/contexts/AuthContext';

export default function AuthDebug() {
  const { user, isAuthenticated, isLoading, userRole } = useAuth();

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black bg-opacity-75 text-white p-3 rounded-lg text-xs z-50">
      <div className="font-bold">Auth Debug:</div>
      <div>Loading: {isLoading ? 'Yes' : 'No'}</div>
      <div>Authenticated: {isAuthenticated ? 'Yes' : 'No'}</div>
      <div>User: {user?.email || 'None'}</div>
      <div>Role: {userRole || 'None'}</div>
      <div>User ID: {user?.id || 'None'}</div>
    </div>
  );
}
