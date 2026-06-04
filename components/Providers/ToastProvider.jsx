"use client";

import { Toaster } from "react-hot-toast";

export default function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          background: "#111827",
          color: "#F9FAFB",
          border: "1px solid #1F2937",
          borderRadius: "12px",
          padding: "14px 16px",
        },

        success: {
          iconTheme: {
            primary: "#22C55E",
            secondary: "#fff",
          },
        },

        error: {
          iconTheme: {
            primary: "#EF4444",
            secondary: "#fff",
          },
        },
      }}
    />
  );
}
