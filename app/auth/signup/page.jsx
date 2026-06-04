"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

import {
  Boxes,
} from "lucide-react";

import {
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithPopup,
} from "firebase/auth";

import { auth, googleProvider } from "@/lib/firebase";

import { useAuth } from "@/context/AuthContext";

import toast from "react-hot-toast";

export default function SignupPage() {
  const router = useRouter();
  const { signup } = useAuth();

  const [businessName, setBusinessName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [googleLoading, setGoogleLoading] =
    useState(false);

  /* ---------------- SIGNUP ---------------- */

  const handleSignup = async (e) => {
    e.preventDefault();

    if (businessName.trim().length < 2) {
      return toast.error("Business name is too short");
    }

    if (password.length < 6) {
      return toast.error(
        "Password should be at least 6 characters"
      );
    }

    try {
      setLoading(true);

      const userCredential = await signup(email, password);
      await updateProfile(userCredential, {
        displayName: businessName,
      });

      toast.success("Account created successfully");
      router.replace("/onboarding");
    } catch (error) {
      console.log(error);

      if (error.code === "auth/email-already-in-use") {
        toast.error("This email is already registered");
      } else if (error.code === "auth/weak-password") {
        toast.error("Password should be at least 6 characters");
      } else if (error.code === "auth/invalid-email") {
        toast.error("Invalid email address");
      } else {
        toast.error(error.message || "Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- GOOGLE LOGIN ---------------- */

  const handleGoogleLogin =
    async () => {
      try {
        setGoogleLoading(true);

        const result =
          await signInWithPopup(
            auth,
            googleProvider
          );

        toast.success(
          `Welcome ${result.user.displayName}`
        );

        router.push("/onboarding");
      } catch (error) {
        console.log(error);

        toast.error(
          "Google login failed"
        );
      } finally {
        setGoogleLoading(false);
      }
    };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F9FAFB] px-6 dark:bg-[#0F172A]">
      <div className="w-full max-w-md rounded-3xl border border-[#E5E7EB] bg-white p-8 shadow-xl dark:border-[#1F2937] dark:bg-[#111827]">

        {/* LOGO */}
        <div className="mb-8 flex items-center gap-3">
          <div className="rounded-2xl bg-[#3B82F6]/10 p-3">
            <Boxes className="text-[#3B82F6]" />
          </div>

          <div>
            <h1 className="text-2xl font-bold dark:text-white">
              Bizly
            </h1>

            <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">
              Micro Business OS
            </p>
          </div>
        </div>

        {/* HEADER */}
        <div className="mb-8">
          <h2 className="mb-2 text-3xl font-bold dark:text-white">
            Create your account
          </h2>

          <p className="text-[#6B7280] dark:text-[#9CA3AF]">
            Start managing your business today.
          </p>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSignup}
          className="space-y-5"
        >

          {/* BUSINESS NAME */}
          <div>
            <label className="mb-2 block text-sm font-medium dark:text-white">
              Business Name
            </label>

            <input
              type="text"
              required
              placeholder="My Store"
              value={businessName}
              onChange={(e) =>
                setBusinessName(
                  e.target.value
                )
              }
              className="w-full rounded-2xl border border-[#E5E7EB] bg-white px-4 py-3 outline-none transition focus:border-[#3B82F6] focus:ring-4 focus:ring-[#3B82F6]/10 dark:border-[#1F2937] dark:bg-[#0F172A] dark:text-white"
            />
          </div>

          {/* EMAIL */}
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
              className="w-full rounded-2xl border border-[#E5E7EB] bg-white px-4 py-3 outline-none transition focus:border-[#3B82F6] focus:ring-4 focus:ring-[#3B82F6]/10 dark:border-[#1F2937] dark:bg-[#0F172A] dark:text-white"
            />
          </div>

          {/* PASSWORD */}
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
              className="w-full rounded-2xl border border-[#E5E7EB] bg-white px-4 py-3 outline-none transition focus:border-[#3B82F6] focus:ring-4 focus:ring-[#3B82F6]/10 dark:border-[#1F2937] dark:bg-[#0F172A] dark:text-white"
            />
          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-[#3B82F6] px-4 py-3 font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading
              ? "Creating account..."
              : "Create Account"}
          </button>

          {/* DIVIDER */}
          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#E5E7EB] dark:border-[#1F2937]" />
            </div>

            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-4 text-[#6B7280] dark:bg-[#111827] dark:text-[#9CA3AF]">
                OR
              </span>
            </div>
          </div>

          {/* GOOGLE LOGIN */}
          <button
            type="button"
            onClick={
              handleGoogleLogin
            }
            disabled={
              googleLoading
            }
            className="flex w-full items-center justify-center gap-3 rounded-2xl border border-[#E5E7EB] bg-white py-3 font-medium transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-[#1F2937] dark:bg-[#0F172A] dark:text-white dark:hover:bg-[#111827]"
          >
            <Image
              src="https://www.google.com/favicon.ico"
              alt="Google"
              width={20}
              height={20}
            />

            {googleLoading
              ? "Connecting..."
              : "Continue with Google"}
          </button>
        </form>

        {/* FOOTER */}
        <p className="mt-6 text-center text-sm text-[#6B7280] dark:text-[#9CA3AF]">
          Already have an account?{" "}
          <Link
            href="/auth/login"
            className="font-medium text-[#3B82F6] hover:underline"
          >
            Login
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
