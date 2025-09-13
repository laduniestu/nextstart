import NextTopLoader from 'nextjs-toploader';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import type React from 'react';
import { Toaster } from 'sonner';
import { TanstackProvider } from './tanstack-provider';
import { ThemeProvider } from './theme-provider';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NuqsAdapter>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        disableTransitionOnChange
        enableSystem
      >
        <NextTopLoader />

        <TanstackProvider>{children}</TanstackProvider>
        <Toaster />
      </ThemeProvider>
    </NuqsAdapter>
  );
}
