"use client";

import { useState } from "react";

import Link from "next/link";
import Image from "next/image";

import { useRouter } from "next/navigation";

import toast from "react-hot-toast";

import { Boxes } from "lucide-react";

import {
  signInWithPopup,
} from "firebase/auth";

import {
  auth,
  googleProvider,
  facebookProvider,
} from "@/lib/firebase";

import {
  signInWithEmailAndPassword,
} from "firebase/auth";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      toast.success(
        "Welcome back 👋"
      );

      router.push("/dashboard");
    } catch (error) {
      console.log(error);

      if (
        error.code ===
        "auth/invalid-credential"
      ) {
        toast.error(
          "Invalid email or password"
        );
      } else {
        toast.error(
          "Something went wrong"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F9FAFB] px-6 dark:bg-[#0F172A]">
      <div className="w-full max-w-md rounded-3xl border border-[#E5E7EB] bg-white p-8 shadow-sm dark:border-[#1F2937] dark:bg-[#111827]">
        <div className="mb-8 flex items-center gap-2">
          <Boxes className="text-[#3B82F6]" />

          <h1 className="text-2xl font-bold dark:text-white">
            biz core
          </h1>
        </div>

        <div className="mb-8">
          <h2 className="mb-2 text-3xl font-bold dark:text-white">
            Welcome back
          </h2>

          <p className="text-[#6B7280] dark:text-[#9CA3AF]">
            Login to manage your business.
          </p>
        </div>

        <form
          onSubmit={handleLogin}
          className="space-y-5"
        >
          <div>
            <label className="mb-2 block text-sm font-medium dark:text-white">
              Email
            </label>

            <input
              type="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) =>
                setEmail(
                  e.target.value
                )
              }
              className="w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 outline-none transition focus:border-[#3B82F6] dark:border-[#1F2937] dark:bg-[#0F172A] dark:text-white"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium dark:text-white">
              Password
            </label>

            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }
              className="w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 outline-none transition focus:border-[#3B82F6] dark:border-[#1F2937] dark:bg-[#0F172A] dark:text-white"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-[#3B82F6] px-4 py-3 font-medium text-white transition hover:opacity-90 disabled:opacity-50"
          >
            {loading
              ? "Logging in..."
              : "Login"}
          </button>
          <button
            type="button"
            onClick={async () => {
              try {
                const result =
                  await signInWithPopup(
                    auth,
                    googleProvider
                  );

                toast.success(
                  "Welcome " +
                    result.user.displayName
                );

                router.push("/dashboard");
              } catch (error) {
                console.error("Google login error:", error);
                
                if (error.code === "auth/popup-blocked") {
                  toast.error(
                    "Please allow popups for Google login"
                  );
                } else if (error.code === "auth/popup-closed-by-user") {
                  toast.error(
                    "Google login was cancelled"
                  );
                } else if (error.code === "auth/invalid-origin") {
                  toast.error(
                    "Domain not authorized - check Firebase Console"
                  );
                } else if (error.message?.includes("CORS")) {
                  toast.error(
                    "CORS error - check browser console (F12)"
                  );
                } else {
                  toast.error(
                    error.message || "Google login failed"
                  );
                }
              }
            }}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-[#E5E7EB] bg-white py-3 font-medium transition hover:bg-gray-50 dark:border-[#1F2937] dark:bg-[#0F172A] dark:hover:bg-[#111827]"
          >
            <Image
              src="https://www.google.com/favicon.ico"
              alt="Google"
              width={20}
              height={20}
              className="h-5 w-5"
            />

            Continue with Google
          </button>
          
          <button
            type="button"
            onClick={async () => {
              try {
                const result =
                  await signInWithPopup(
                    auth,
                    facebookProvider
                  );

                toast.success(
                  "Welcome " +
                    result.user.displayName
                );

                router.push("/dashboard");
              } catch (error) {
                console.error("Facebook login error:", error);
                
                if (error.code === "auth/popup-blocked") {
                  toast.error(
                    "Please allow popups for Facebook login"
                  );
                } else if (error.code === "auth/popup-closed-by-user") {
                  toast.error(
                    "Facebook login was cancelled"
                  );
                } else if (error.code === "auth/invalid-origin") {
                  toast.error(
                    "Domain not authorized - check Firebase Console"
                  );
                } else if (error.message?.includes("CORS")) {
                  toast.error(
                    "CORS error - check browser console (F12)"
                  );
                } else {
                  toast.error(
                    error.message || "Facebook login failed"
                  );
                }
              }
            }}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#E5E7EB] bg-white py-3 font-medium transition hover:bg-gray-50 dark:border-[#1F2937] dark:bg-[#0F172A] dark:hover:bg-[#111827]"
          >
            <Image
              src="https://www.facebook.com/favicon.ico"
              alt="Facebook"
              width={20}
              height={20}
              className="h-5 w-5"
            />

            Continue with Facebook
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[#6B7280] dark:text-[#9CA3AF]">
          Don’t have an account?{" "}
          <Link
            href="/auth/signup"
            className="font-medium text-[#3B82F6]"
          >
            Sign up
          </Link>
        </p>

        <p style={{ fontSize: '0.75rem', color: '#999', marginTop: '1rem', textAlign: 'center' }}>
          <Link href="/terms" style={{ color: '#666', textDecoration: 'none', marginRight: '0.5rem' }}>
            Terms
          </Link>
          <span style={{ color: '#999' }}>•</span>
          <Link href="/privacy" style={{ color: '#666', textDecoration: 'none', marginLeft: '0.5rem' }}>
            Privacy
          </Link>
        </p>
      </div>
    </main>
  );
}
