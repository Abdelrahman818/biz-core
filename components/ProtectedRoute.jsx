'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useMemo } from 'react';

// Routes that are always accessible without authentication or onboarding
const ALWAYS_ACCESSIBLE = [
  '/',
  '/auth/login',
  '/auth/signup',
  '/terms',
  '/privacy',
  '/contact',
  '/policy',
  '/support',
];

// Routes that require both onboarding AND pricing to be completed
const FULLY_PROTECTED_ROUTES = [
  '/dashboard',
  '/orders',
  '/products',
  '/customers',
  '/analytics',
];

export function ProtectedRoute({ children }) {
  const { user, authLoading, isAuthenticated, onboardingCompleted, pricingSelected } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const storedFlags = useMemo(() => {
    if (typeof window !== 'undefined') {
      const onb = localStorage.getItem('onboarding_completed');
      const prc = localStorage.getItem('pricing_selected');
      return {
        onboarding: onb !== null ? onb === 'true' : null,
        pricing: prc !== null ? prc === 'true' : null,
      };
    }
    return { onboarding: null, pricing: null };
  }, []);

  // Use state value if available, otherwise use stored value from localStorage
  const effectiveOnboarding = onboardingCompleted !== null ? onboardingCompleted : storedFlags.onboarding;
  const effectivePricing = pricingSelected !== null ? pricingSelected : storedFlags.pricing;

  const isAlwaysAccessible = ALWAYS_ACCESSIBLE.some(route =>
    pathname === route || pathname.startsWith(route + '/')
  );

  useEffect(() => {
    // Wait only for Firebase auth init; allow redirects even while business data is loading
    if (authLoading) return;

    // Redirect unauthenticated users away from protected routes
    if (!isAuthenticated && !isAlwaysAccessible) {
      router.push('/auth/login');
      return;
    }

    // **AUTO-REDIRECT (403): User tries to access /onboarding after completing it → go to dashboard**
    if (
      isAuthenticated &&
      effectiveOnboarding === true &&
      pathname.startsWith('/onboarding')
    ) {
      router.push('/dashboard');
      return;
    }

    // **ENFORCE FLOW: New user (onboarding not done) must go to /onboarding**
    if (
      isAuthenticated &&
      effectiveOnboarding === false &&
      !isAlwaysAccessible &&
      !pathname.startsWith('/onboarding')
    ) {
      const next = encodeURIComponent(pathname || '/dashboard');
      router.push(`/onboarding?next=${next}`);
      return;
    }

    // **ENFORCE FLOW: User must complete onboarding before accessing /pricing**
    if (
      isAuthenticated &&
      effectiveOnboarding === false &&
      pathname.startsWith('/pricing')
    ) {
      const next = encodeURIComponent(pathname || '/dashboard');
      router.push(`/onboarding?next=${next}`);
      return;
    }

    // **ENFORCE FLOW: User must complete pricing before accessing dashboard/orders/products/etc**
    if (
      isAuthenticated &&
      effectiveOnboarding === true &&
      effectivePricing !== true &&
      FULLY_PROTECTED_ROUTES.some(route => pathname.startsWith(route))
    ) {
      const next = encodeURIComponent(pathname || '/dashboard');
      router.push(`/pricing?next=${next}`);
      return;
    }
  }, [authLoading, isAuthenticated, effectiveOnboarding, effectivePricing, pathname, router, isAlwaysAccessible]);

  // Always-accessible routes render immediately — no spinner even during auth init
  if (isAlwaysAccessible) {
    return children;
  }

  // For protected routes: show spinner only while onboarding flag is truly unknown (null in both state and storage)
  // Use effectiveOnboarding which already combines state and localStorage
  const flagsUnknown = (effectiveOnboarding === null && !pathname.startsWith('/onboarding'));

  if (flagsUnknown) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Show loading spinner only while auth is resolving, don't block on business data loading
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // If not authenticated, render nothing (redirect is in flight via useEffect)
  if (!user) {
    return null;
  }

  return children;
}
