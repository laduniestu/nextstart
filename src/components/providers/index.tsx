import React from 'react';
import { ThemeProvider } from './theme-provider';
import NextTopLoader from 'nextjs-toploader';
import { Toaster } from 'sonner';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <NextTopLoader />
      {children}
      <Toaster />
    </ThemeProvider>
  );
}
