import NextTopLoader from 'nextjs-toploader';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import type React from 'react';
import { Toaster } from 'sonner';
import { ThemeProvider } from './theme-provider';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      disableTransitionOnChange
      enableSystem
    >
      <NextTopLoader />
      <NuqsAdapter>{children}</NuqsAdapter>
      <Toaster />
    </ThemeProvider>
  );
}
