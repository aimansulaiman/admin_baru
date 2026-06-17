"use client";

import { ThemeProvider } from "next-themes";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider defaultTheme="light" attribute="class">
      {/* NextAuth's SessionProvider is no longer needed with Better Auth. */}
      {children}
    </ThemeProvider>
  );
}
