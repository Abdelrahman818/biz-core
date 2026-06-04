'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';

// List of protected routes
const PROTECTED_ROUTES = [
  '/dashboard',
  '/orders',
  '/products',
  '/customers',
  '/analytics',
  '/onboarding',
];

export function ProtectedRoute({ children }) {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading) {
      // Check if current route is protected
      const isProtected = PROTECTED_ROUTES.some(route => pathname.startsWith(route));
      
      if (isProtected && !isAuthenticated) {
        router.push('/auth/login');
      }
    }
  }, [loading, isAuthenticated, pathname, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user && PROTECTED_ROUTES.some(route => pathname.startsWith(route))) {
    return null;
  }

  return children;
}
