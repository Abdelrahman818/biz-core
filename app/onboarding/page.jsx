"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  Store,
  Package,
  Sparkles,
  Globe,
} from "lucide-react";
import { auth } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { usersAPI } from "@/config";

/* Protect onboarding: only accessible to users who haven't completed it */
function OnboardingGuard({ children }) {
  const { onboardingCompleted, authLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (authLoading) return;

    // If not authenticated, let ProtectedRoute redirect to login
    if (!isAuthenticated) return;

    // Load from localStorage as fallback if onboardingCompleted is still null
    let effective = onboardingCompleted;
    if (effective === null && typeof window !== 'undefined') {
      const stored = localStorage.getItem('onboarding_completed');
      effective = stored !== null ? stored === 'true' : null;
    }

    // If onboarding is completed, auto-redirect to dashboard (no 403 page)
    if (effective === true) {
      router.push('/dashboard');
    }
  }, [authLoading, isAuthenticated, onboardingCompleted, router]);

  // Show spinner while checking auth or onboarding status
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return children;
}

function Background() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">

      {/* LIGHT MODE BLURS */}
      <div className="dark:hidden">
        <motion.div
          animate={{ x: [0, 50, 0], y: [0, -40, 0] }}
          transition={{ duration: 12, repeat: Infinity }}
          className="absolute top-[-80px] left-[-80px] h-[300px] w-[300px] rounded-full bg-blue-200 blur-3xl"
        />

        <motion.div
          animate={{ x: [0, -60, 0], y: [0, 60, 0] }}
          transition={{ duration: 14, repeat: Infinity }}
          className="absolute bottom-[-120px] right-[-120px] h-[320px] w-[320px] rounded-full bg-purple-200 blur-3xl"
        />
      </div>

      {/* DARK MODE BLURS */}
      <div className="hidden dark:block">
        <motion.div
          animate={{ x: [0, 60, 0], y: [0, -50, 0] }}
          transition={{ duration: 12, repeat: Infinity }}
          className="absolute top-[-100px] left-[-100px] h-[320px] w-[320px] rounded-full bg-blue-500/30 blur-3xl"
        />

        <motion.div
          animate={{ x: [0, -60, 0], y: [0, 60, 0] }}
          transition={{ duration: 14, repeat: Infinity }}
          className="absolute bottom-[-120px] right-[-120px] h-[350px] w-[350px] rounded-full bg-purple-500/30 blur-3xl"
        />
      </div>

      {/* FLOATING ICONS */}
      <motion.div
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 6, repeat: Infinity }}
        className="absolute top-20 left-20 text-blue-400 opacity-20"
      >
        <Store size={80} />
      </motion.div>

      <motion.div
        animate={{ y: [0, 20, 0] }}
        transition={{ duration: 7, repeat: Infinity }}
        className="absolute bottom-20 right-20 text-purple-400 opacity-20"
      >
        <Package size={90} />
      </motion.div>
    </div>
  );
}

/* ---------------- MAIN ---------------- */

function OnboardingPageContent() {
  const router = useRouter();
  const { refreshBusinessId, markOnboardedLocally, setLocalBusiness } = useAuth();
  const searchParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
  const nextParam = searchParams.get('next');

  const [step, setStep] = useState(0);

  const [businessName, setBusinessName] = useState("");

  const [businessType, setBusinessType] = useState("");

  const [currency, setCurrency] = useState("EGP");

  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({});

  const next = () => setStep(step + 1);

  const back = () => setStep(step - 1);

  const steps = [
    "Welcome",
    "Business",
    "Currency",
    "Finish",
  ];

  /* ---------------- VALIDATION ---------------- */

  const validateStep1 = () => {
    let err = {};

    if (!businessName.trim()) {
      err.businessName = "Business name is required";
    }

    if (!businessType) {
      err.businessType = "Select business type";
    }

    setErrors(err);

    return Object.keys(err).length === 0;
  };

  const finish = async () => {
    try {
      setLoading(true);
      const user = auth.currentUser;

      if (!user) {
        toast.error("User not found");
        return;
      }

      const businessId = `biz_${user.uid}`;

      const userData = {
        name: businessName,
        email: user.email,
        business_id: businessId,
        business_name: businessName,
        business_type: businessType,
        currency,
        onboarding_completed: true,
        pricing_selected: false,
        role: "owner",
        plan: "Starter",
      };

      console.log("Creating user with data:", userData);

      try {
        const response = await usersAPI.create(userData);
        console.log("User created successfully:", response);

        if (!response) {
          throw new Error("No response from server");
        }

        toast.success("Your Business OS is ready 🚀");
        // Navigate to pricing immediately to avoid ProtectedRoute auto-redirecting back to dashboard
        let pricingUrl = '/pricing';
        if (typeof window !== 'undefined') {
          const params = new URLSearchParams(window.location.search);
          const next = params.get('next');
          if (next) {
            pricingUrl = `/pricing?next=${encodeURIComponent(next)}`;
          }
        }

        // Set local business data so dashboard/pricing can render immediately without waiting for backend
        try {
          setLocalBusiness(userData);
        } catch (e) {
          console.warn('setLocalBusiness failed:', e);
        }

        // Mark onboarding completed locally to avoid immediate redirects
        try {
          markOnboardedLocally();
        } catch (e) {
          console.warn('markOnboardedLocally failed:', e);
        }

        // Push to pricing without refreshing business data yet
        // ProtectedRoute will fetch fresh data when /pricing is visited
        router.push(pricingUrl);
      } catch (apiError) {
        console.error("API Error during user creation:", apiError);
        console.error("Error message:", apiError.message);
        console.error("Full error:", apiError);
        
        // Provide specific error messages based on error type
        let errorMessage = apiError.message || "Failed to complete onboarding";
        
        if (apiError.message.includes("500")) {
          errorMessage = "Server error. Please try again in a moment.";
        } else if (apiError.message.includes("400")) {
          errorMessage = "Invalid business information. Please check and try again.";
        } else if (apiError.message.includes("409")) {
          errorMessage = "Business already exists for this account.";
        } else if (apiError.message.includes("timeout") || apiError.message.includes("ECONNREFUSED")) {
          errorMessage = "Connection error. Please check your internet and try again.";
        } else if (apiError.message.includes("Cannot connect to API")) {
          errorMessage = "Backend server is not running. Please contact support.";
        }
        
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error("Error during onboarding:", error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- UI ---------------- */

  return (
    <main className="relative flex min-h-screen items-center justify-center px-6 bg-white text-black dark:bg-[#0B1220] dark:text-white">

      <Background />

      <div className="w-full max-w-2xl">

        {/* PROGRESS */}
        <div className="mb-8">
          <div className="flex justify-between text-sm opacity-60 mb-2">
            <span>
              Step {step + 1} of{" "}
              {steps.length}
            </span>

            <span>{steps[step]}</span>
          </div>

          <div className="h-2 w-full rounded-full bg-black/10 dark:bg-white/10">
            <motion.div
              className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
              animate={{
                width:
                  ((step + 1) /
                    steps.length) *
                  100 +
                  "%",
              }}
            />
          </div>
        </div>

        {/* CARD */}
        <div className="relative overflow-hidden rounded-3xl border border-black/10 dark:border-white/10 bg-white/60 dark:bg-white/5 backdrop-blur-2xl p-10 shadow-xl">

          <AnimatePresence mode="wait">

            {/* STEP 0 */}
            {step === 0 && (
              <motion.div
                key="0"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-center"
              >
                <Sparkles className="mx-auto mb-4 opacity-60" />

                <h1 className="text-4xl font-bold mb-4">
                  Welcome to biz core
                </h1>

                <p className="opacity-60 mb-8">
                  Lets build your
                  business system in
                  minutes.
                </p>

                <button
                  onClick={next}
                  className="px-8 py-3 rounded-xl bg-blue-500 text-white"
                >
                  Start
                </button>
              </motion.div>
            )}

            {/* STEP 1 */}
            {step === 1 && (
              <motion.div
                key="1"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
              >
                <h2 className="text-2xl font-bold mb-6">
                  Business Info
                </h2>

                <input
                  placeholder="Business Name"
                  value={businessName}
                  onChange={(e) =>
                    setBusinessName(
                      e.target.value
                    )
                  }
                  className={`w-full mb-1 px-4 py-3 rounded-xl border bg-transparent
                  ${errors.businessName
                      ? "border-red-500"
                      : "border-black/10 dark:border-white/10"
                    }`}
                />

                {errors.businessName && (
                  <p className="text-red-500 text-sm mb-3">
                    {errors.businessName}
                  </p>
                )}

                <select
                  value={businessType}
                  onChange={(e) =>
                    setBusinessType(
                      e.target.value
                    )
                  }
                  className={`w-full mb-1 px-4 py-3 rounded-xl border bg-transparent
                  ${errors.businessType
                      ? "border-red-500"
                      : "border-black/10 dark:border-white/10"
                    }`}
                >
                  <option value="">
                    Select Type
                  </option>
                  <option>Clothing</option>
                  <option>Services</option>
                  <option>Accessories</option>
                  <option>Other</option>
                </select>

                {errors.businessType && (
                  <p className="text-red-500 text-sm mb-4">
                    {errors.businessType}
                  </p>
                )}

                <div className="flex justify-between">
                  <button
                    onClick={back}
                    className="px-6 py-2 rounded-xl border"
                  >
                    Back
                  </button>

                  <button
                    onClick={() => {
                      if (validateStep1())
                        next();
                    }}
                    className="px-6 py-2 rounded-xl bg-blue-500 text-white"
                  >
                    Next
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 2 - CURRENCY */}
            {step === 2 && (
              <motion.div
                key="2"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
              >
                <h2 className="text-2xl font-bold mb-2">
                  <Globe className="inline-block mr-2" size={24} />
                  Select Currency
                </h2>

                <p className="opacity-60 mb-6">
                  Choose your business currency
                </p>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  {["EGP", "USD", "EUR", "AED", "SAR", "Other"].map((curr) => (
                    <button
                      key={curr}
                      onClick={() => setCurrency(curr)}
                      className={`p-3 rounded-xl border transition ${currency === curr
                        ? "border-blue-500 bg-blue-500/10"
                        : "border-black/10 dark:border-white/10 hover:border-blue-500"
                        }`}
                    >
                      {curr}
                    </button>
                  ))}
                </div>

                <div className="flex justify-between">
                  <button
                    onClick={back}
                    className="px-6 py-2 rounded-xl border"
                  >
                    Back
                  </button>

                  <button
                    onClick={next}
                    className="px-6 py-2 rounded-xl bg-blue-500 text-white"
                  >
                    Next
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 3 - FINISH */}
            {step === 3 && (
              <motion.div
                key="3"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                <h2 className="text-3xl font-bold mb-4">
                  You&apos;re ready
                </h2>

                <p className="opacity-60 mb-8">
                  Business: <strong>{businessName}</strong> <br />
                  Type: <strong>{businessType}</strong> <br />
                  Currency: <strong>{currency}</strong>
                </p>

                <button
                  onClick={finish}
                  disabled={loading}
                  className="px-8 py-3 rounded-xl bg-green-500 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Setting up..." : "Enter Dashboard"}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}

export default function OnboardingPage() {
  return (
    <OnboardingGuard>
      <OnboardingPageContent />
    </OnboardingGuard>
  );
}
