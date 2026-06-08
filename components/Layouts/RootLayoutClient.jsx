'use client';

import SideNav from "@/components/SideNav";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/context/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function RootLayoutClient({ children }) {
  return (
    <AuthProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem={true}
        enableColorScheme={false}
      >
        <ProtectedRoute>
          <SideNav />
          {children}
        </ProtectedRoute>
      </ThemeProvider>
    </AuthProvider>
  );
}
