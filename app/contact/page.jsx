"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import emailjs from "@emailjs/browser";
import toast from "react-hot-toast";

import { Mail, Phone, MapPin, Send, MessageSquare } from "lucide-react";

export default function ContactPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAIL_SERVICE_ID,
        process.env.NEXT_PUBLIC_EMAIL_TEMPLATE_ID,
        {
          from_name: form.name,
          from_email: form.email,
          message: form.message,
        },
        process.env.NEXT_PUBLIC_EMAIL_PUBLIC_KEY
      );

      toast.success("Message sent successfully 🚀");

      setForm({ name: "", email: "", message: "" });

      // redirect after short delay
      setTimeout(() => {
        router.push("/dashboard");
      }, 1200);

    } catch (err) {
      toast.error("Failed to send message ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen px-6 py-12 bg-white text-black dark:bg-[#0B1220] dark:text-white">
      <div className="mx-auto max-w-5xl">
        {/* HEADER */}
        <div className="mb-14 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-black/10 dark:border-white/10 px-4 py-1.5 text-sm font-medium opacity-80">
            <MessageSquare size={16} className="text-blue-500" />
            Contact Us
          </div>

          <h1 className="mb-4 text-4xl font-extrabold tracking-tight md:text-5xl">
            Get in touch
          </h1>

          <p className="mx-auto max-w-2xl text-sm opacity-60">
            Have questions, issues, or feedback? Send us a message and our team will get back to you as soon as possible.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-5">
          {/* INFO CARD */}
          <div className="md:col-span-2 rounded-3xl border border-black/10 dark:border-white/10 p-8 space-y-6 flex flex-col justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-4">Contact Info</h2>
              <p className="text-sm opacity-60 mb-6">
                Feel free to reach out to us directly through any of these channels.
              </p>

              <div className="space-y-4">
                <div className="flex items-center gap-3.5 p-3 rounded-2xl border border-black/5 dark:border-white/5 hover:border-blue-500/30 transition-colors">
                  <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-500">
                    <Mail size={18} />
                  </div>
                  <div>
                    <p className="text-xs opacity-50 font-medium">Email</p>
                    <p className="text-sm font-semibold">support@bizly.com</p>
                  </div>
                </div>

                <div className="flex items-center gap-3.5 p-3 rounded-2xl border border-black/5 dark:border-white/5 hover:border-blue-500/30 transition-colors">
                  <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-500">
                    <Phone size={18} />
                  </div>
                  <div>
                    <p className="text-xs opacity-50 font-medium">Phone</p>
                    <p className="text-sm font-semibold">+20 100 000 0000</p>
                  </div>
                </div>

                <div className="flex items-center gap-3.5 p-3 rounded-2xl border border-black/5 dark:border-white/5 hover:border-blue-500/30 transition-colors">
                  <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-500">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <p className="text-xs opacity-50 font-medium">Location</p>
                    <p className="text-sm font-semibold">Cairo, Egypt</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-black/10 dark:border-white/10 text-xs opacity-50">
              © {new Date().getFullYear()} Bizly Inc. All rights reserved.
            </div>
          </div>

          {/* FORM */}
          <form
            onSubmit={handleSubmit}
            className="md:col-span-3 rounded-3xl border border-black/10 dark:border-white/10 p-8 space-y-5"
          >
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider opacity-60 mb-2">
                Your Name
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                className="w-full rounded-2xl border border-black/10 dark:border-white/10 bg-transparent px-4 py-3 outline-none focus:border-blue-500 transition text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider opacity-60 mb-2">
                Your Email
              </label>
              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter your email address"
                className="w-full rounded-2xl border border-black/10 dark:border-white/10 bg-transparent px-4 py-3 outline-none focus:border-blue-500 transition text-sm"
                type="email"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider opacity-60 mb-2">
                Your Message
              </label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder="Tell us how we can help you..."
                rows={5}
                className="w-full rounded-2xl border border-black/10 dark:border-white/10 bg-transparent px-4 py-3 outline-none focus:border-blue-500 transition resize-none text-sm"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-3.5 text-white font-medium transition text-sm shadow-lg shadow-blue-500/20
                ${
                  loading
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }
              `}
            >
              <Send size={16} />
              {loading ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
