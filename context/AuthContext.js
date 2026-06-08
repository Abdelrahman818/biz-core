'use client';

import { createContext, useCallback, useContext, useState, useEffect, useMemo, useRef } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { usePathname } from 'next/navigation';
import { usersAPI } from '@/config';

export const AuthContext = createContext();

// Module-level cache — survives re-renders, cleared on logout
const businessDataCache = new Map();
const businessDataRequests = new Map();

const readStoredBoolean = (key) => {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem(key);
  return stored !== null ? stored === 'true' : null;
};

// Routes that need businessId loaded before rendering.
// Include onboarding so we fetch user/business flags when visiting
// NOTE: /pricing is excluded — it doesn't need businessId loaded; it just displays plan options
const BUSINESS_DATA_ROUTES = [
  '/dashboard',
  '/orders',
  '/products',
  '/customers',
  '/analytics',
  '/onboarding',
];

export function AuthProvider({ children }) {
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  const [businessId, setBusinessId] = useState(null);
  const [businessName, setBusinessName] = useState(null);
  const [onboardingCompleted, setOnboardingCompleted] = useState(() => readStoredBoolean('onboarding_completed')); // null = unknown, true/false = known
  const [pricingSelected, setPricingSelected] = useState(() => readStoredBoolean('pricing_selected')); // null = unknown, true/false = known
  const [authLoading, setAuthLoading] = useState(true);
  const [error, setError] = useState(null);

  // Keep refs so async fetches don't overwrite a local 'just completed' flag
  const onboardingCompletedRef = useRef(onboardingCompleted);
  useEffect(() => { onboardingCompletedRef.current = onboardingCompleted; }, [onboardingCompleted]);

  const pricingSelectedRef = useRef(pricingSelected);
  useEffect(() => { pricingSelectedRef.current = pricingSelected; }, [pricingSelected]);

  // Persist flags to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined' && onboardingCompleted !== null) {
      localStorage.setItem('onboarding_completed', String(onboardingCompleted));
    }
  }, [onboardingCompleted]);

  useEffect(() => {
    if (typeof window !== 'undefined' && pricingSelected !== null) {
      localStorage.setItem('pricing_selected', String(pricingSelected));
    }
  }, [pricingSelected]);

  const applyBusinessData = useCallback((businessData) => {
    console.log('applyBusinessData called with:', businessData, 'onboardingCompletedRef:', onboardingCompletedRef.current);
    if (businessData) {
      setBusinessId(businessData.business_id);
      setBusinessName(businessData.business_name || businessData.name || null);

      // If onboarding not marked locally, set from backend; else keep local true
      if (!onboardingCompletedRef.current) {
        console.log('Setting onboarding flag from backend:', businessData.onboarding_completed);
        setOnboardingCompleted(!!businessData.onboarding_completed);
      } else {
        console.log('Keeping local onboardingCompleted=true');
      }

      // Pricing: if local not marked, set from backend; if local marked, only set true when backend confirms
      if (!pricingSelectedRef.current) {
        console.log('Setting pricingSelected from backend:', businessData.pricing_selected);
        setPricingSelected(!!businessData.pricing_selected);
      } else {
        if (businessData.pricing_selected) {
          setPricingSelected(true);
        }
      }
    } else {
      setBusinessId(null);
      setBusinessName(null);
      // Only clear local flags if we haven't just marked onboarding locally
      if (!onboardingCompletedRef.current) {
        console.log('Clearing onboarding flags (no business data)');
        setOnboardingCompleted(false);
        setPricingSelected(false);
      }
    }
  }, []);

  // Fetch business data from Firestore with request deduplication + in-memory cache
  const isNewFirebaseUser = (u) => !!(
    u &&
    u.metadata &&
    u.metadata.creationTime &&
    u.metadata.lastSignInTime &&
    u.metadata.creationTime === u.metadata.lastSignInTime
  );

  const fetchBusinessData = useCallback(async (currentUser) => {
    if (!currentUser?.email) return null;

    const cacheKey = currentUser.uid;

    // If this Firebase user was just created (sign-up), skip backend lookup only when on the onboarding page
    // This avoids treating newly-created users as 'no backend user' when visiting dashboard/pricing after onboarding.
    if (isNewFirebaseUser(currentUser) && pathname.startsWith('/onboarding')) {
      businessDataCache.set(cacheKey, null);
      applyBusinessData(null);
      return null;
    }

    // 1. Serve from cache (instant)
    if (businessDataCache.has(cacheKey)) {
      const cached = businessDataCache.get(cacheKey);
      applyBusinessData(cached);
      return cached;
    }

    // 2. Deduplicate concurrent requests for the same userId
    if (businessDataRequests.has(cacheKey)) {
      const pending = await businessDataRequests.get(cacheKey);
      applyBusinessData(pending);
      return pending;
    }

    // 3. Fire the actual API request with retry/backoff
    const maxAttempts = 3;
    const makeRequest = async () => usersAPI.getByEmail(currentUser.email);

    const wrappedRequest = (async () => {
      let attempt = 0;
      let lastError = null;
      while (attempt < maxAttempts) {
        attempt += 1;
        try {
          const res = await makeRequest();
          return res;
        } catch (err) {
          console.warn(`fetchBusinessData attempt ${attempt} failed:`, err);
          lastError = err;
          // exponential backoff: 500ms, 1000ms, 2000ms
          if (attempt < maxAttempts) {
            const wait = 500 * Math.pow(2, attempt - 1);
            await new Promise((r) => setTimeout(r, wait));
          }
        }
      }
      throw lastError;
    })();

    businessDataRequests.set(cacheKey, wrappedRequest);

    try {
      let businessData = await wrappedRequest;
      // Normalize response shape: support { data: {...} }, { user: {...} } or direct object
      if (businessData && typeof businessData === 'object') {
        businessData = businessData.data || businessData.user || businessData;
      }
      businessDataCache.set(cacheKey, businessData || null);
      applyBusinessData(businessData);
      return businessData;
    } catch (err) {
      console.error('Error fetching business data after retries:', err);
      // If onboarding was just completed locally, don't overwrite it with a null result from the API
      if (onboardingCompletedRef.current) {
        businessDataRequests.delete(cacheKey);
        return null;
      }
      businessDataCache.set(cacheKey, null);
      applyBusinessData(null);
      // Surface a friendly error message in UI
      setError('Unable to load your business data. Please refresh the page or try again later.');
      return null;
    } finally {
      businessDataRequests.delete(cacheKey);
    }
  }, [applyBusinessData]);

  // Single Firebase auth listener — only runs once on mount
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        setBusinessId(null);
        setBusinessName(null);
        setOnboardingCompleted(false);
        setPricingSelected(false);
        // Clear cache on logout so next login fetches fresh data
        businessDataCache.clear();
      }
      setAuthLoading(false);
    });

    return unsubscribe;
  }, []);

  // Memoised so it doesn't recalculate on every render
  const shouldLoadBusinessData = useMemo(
    () => BUSINESS_DATA_ROUTES.some((route) => pathname.startsWith(route)),
    [pathname]
  );

  // Trigger business data fetch only for routes that need it
  useEffect(() => {
    if (authLoading || !user || !shouldLoadBusinessData) return;

    let cancelled = false;
    queueMicrotask(() => {
      if (!cancelled) fetchBusinessData(user);
    });

    return () => { cancelled = true; };
  }, [authLoading, fetchBusinessData, shouldLoadBusinessData, user]);

  // Auth actions
  const signup = async (email, password) => {
    try {
      setError(null);
      const result = await createUserWithEmailAndPassword(auth, email, password);
      return result.user;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const login = async (email, password) => {
    try {
      setError(null);
      const result = await signInWithEmailAndPassword(auth, email, password);
      return result.user;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const logout = async () => {
    try {
      setError(null);
      await signOut(auth);
      setUser(null);
      setBusinessId(null);
      setBusinessName(null);
      setOnboardingCompleted(false);
      setPricingSelected(false);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('onboarding_completed');
        localStorage.removeItem('pricing_selected');
      }
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const getToken = async () => {
    try {
      return user ? await user.getIdToken() : null;
    } catch (err) {
      setError(err.message);
      return null;
    }
  };

  // loading is true ONLY while:
  //   a) Firebase auth hasn't resolved yet, OR
  //   b) This page needs businessId AND it isn't loaded yet
  // Note: derive from businessId state so React updates when business data arrives
  const loading = useMemo(
    // Keep onboarding interactive — avoid blocking the onboarding page if businessId is missing (new signup flow)
    () => authLoading || (!!user && shouldLoadBusinessData && businessId == null && !pathname.startsWith('/onboarding')),
    [authLoading, shouldLoadBusinessData, user, businessId, pathname]
  );

  const value = useMemo(() => ({
    user,
    businessId,
    businessName,
    onboardingCompleted,
    pricingSelected,
    loading,
    authLoading,
    error,
    signup,
    login,
    logout,
    getToken,
    isAuthenticated: !!user,
    // Bust cache so the next call re-fetches from Firestore (used after onboarding/pricing)
    refreshBusinessId: () => {
      if (!user) return null;
      businessDataCache.delete(user.uid);
      return fetchBusinessData(user);
    },
    // Set business data locally (used right after onboarding) to avoid waiting for backend
    setLocalBusiness: (biz) => {
      if (!biz) return;
      console.log('setLocalBusiness called with:', biz);
      const id = biz.business_id || biz.id || biz.biz_id || null;
      const name = biz.business_name || biz.businessName || biz.name || null;
      if (id) setBusinessId(id);
      if (name) setBusinessName(name);
    },
    // Mark onboarding as completed locally to avoid redirect races while backend updates
    markOnboardedLocally: () => {
      console.log('markOnboardedLocally called, setting onboardingCompleted=true');
      setOnboardingCompleted(true);
      setPricingSelected(false);
    },
    // Mark pricing selected locally to avoid redirect races while backend updates
    markPlanSelectedLocally: () => {
      console.log('markPlanSelectedLocally called, setting pricingSelected=true');
      setPricingSelected(true);
    },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [user, businessId, businessName, onboardingCompleted, pricingSelected, loading, authLoading, error, fetchBusinessData]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
