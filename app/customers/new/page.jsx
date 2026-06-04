"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  Phone,
  Pin,
  Plus,
  Sparkles,
} from "lucide-react";
import { customersAPI } from "@/config";
import { useAuth } from "@/context/AuthContext";

/* ---------------- TOAST ---------------- */

const Toast = ({ message, type = "success" }) => {
  return (
    <div
      className={`fixed top-6 right-6 px-4 py-3 rounded-xl text-white shadow-lg z-50 ${
        type === "success"
          ? "bg-green-600"
          : "bg-red-600"
      }`}
    >
      {message}
    </div>
  );
};

/* ---------------- MAIN ---------------- */

export default function CreateCustomerPage() {
  const router = useRouter();
  const { businessId } = useAuth();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState(null);
  const [saving, setSaving] = useState(false);

  /* ---------------- VALIDATION ---------------- */

  const validate = () => {
    const err = {};

    if (!name.trim()) err.name = "Name is required";
    if (!phone.trim()) err.phone = "Phone is required";
    if (!address.trim()) err.address = "Address is required";

    setErrors(err);

    return Object.keys(err).length === 0;
  };

  /* ---------------- SUBMIT ---------------- */

  const createCustomer = async () => {
    if (!validate()) {
      setToast({
        message: "Please fix errors first",
        type: "error",
      });

      setTimeout(() => setToast(null), 2500);
      return;
    }

    if (!businessId) {
      setToast({
        message: "Business setup is still loading",
        type: "error",
      });
      setTimeout(() => setToast(null), 2500);
      return;
    }

    try {
      setSaving(true);
      await customersAPI.create(
        {
          name: name.trim(),
          phone: phone.trim(),
          address: address.trim(),
        },
        businessId
      );

      setToast({
        message: "Customer created successfully",
        type: "success",
      });

      setTimeout(() => setToast(null), 2500);

      setName("");
      setPhone("");
      setAddress("");

      router.push("/customers");
    } catch (error) {
      console.error("Error creating customer:", error);
      setToast({
        message: error.message || "Failed to create customer",
        type: "error",
      });
      setTimeout(() => setToast(null), 2500);
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="min-h-screen px-6 py-12 bg-gradient-to-br from-white to-gray-100 dark:from-[#0B1220] dark:to-[#0F172A] text-black dark:text-white">

      {/* TOAST */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
        />
      )}

      {/* HEADER */}
      <div className="max-w-2xl mx-auto mb-10">

        <div className="flex items-center gap-2 text-blue-500 mb-2">
          <Sparkles size={18} />
          <span className="text-sm">
            CRM System
          </span>
        </div>

        <h1 className="text-3xl font-bold">
          Create New Customer
        </h1>

        <p className="text-sm opacity-60 mt-1">
          Add a customer to your system and start tracking orders.
        </p>

      </div>

      {/* FORM */}
      <div className="max-w-2xl mx-auto rounded-2xl border p-8 bg-white dark:bg-white/5">

        {/* NAME */}
        <div className="mb-5">
          <label className="flex items-center gap-2 text-sm mb-2">
            <User size={16} />
            Full Name
          </label>

          <input
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
            className="w-full px-4 py-3 rounded-xl border bg-transparent"
            placeholder="Customer name"
          />

          {errors.name && (
            <p className="text-red-500 text-sm mt-1">
              {errors.name}
            </p>
          )}
        </div>

        {/* PHONE */}
        <div className="mb-5">
          <label className="flex items-center gap-2 text-sm mb-2">
            <Phone size={16} />
            Phone
          </label>

          <input
            value={phone}
            onChange={(e) =>
              setPhone(e.target.value)
            }
            className="w-full px-4 py-3 rounded-xl border bg-transparent"
            placeholder="01xxxxxxxxx"
          />

          {errors.phone && (
            <p className="text-red-500 text-sm mt-1">
              {errors.phone}
            </p>
          )}
        </div>

        {/* Address */}
        <div className="mb-6">
          <label className="flex items-center gap-2 text-sm mb-2">
            <Pin size={16} />
            Address
          </label>

          <input
            value={address}
            onChange={(e) =>
              setAddress(e.target.value)
            }
            className="w-full px-4 py-3 rounded-xl border bg-transparent"
            placeholder="Cairo"
          />

          {errors.address && (
            <p className="text-red-500 text-sm mt-1">
              {errors.address}
            </p>
          )}
        </div>

        {/* BUTTON */}
        <button
          onClick={createCustomer}
          disabled={saving}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-600 text-white disabled:opacity-50"
        >
          <Plus size={18} />
          {saving ? "Creating..." : "Create Customer"}
        </button>

      </div>
    </main>
  );
}
