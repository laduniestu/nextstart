import Link from 'next/link';
import type { ReactNode } from 'react';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link className="flex items-center gap-2 font-medium" href="/">
            <div className="flex h-6 w-6 items-center justify-center overflow-hidden bg-foreground text-background">
              <h1>A</h1>
              {/* <Image
                src="/images/logo.jpg"
                alt="App Logo"
                width={24}
                height={24}
                className="object-contain"
              /> */}
            </div>
            App Logo
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">{children}</div>
        </div>
      </div>
      <div className="relative hidden min-h-full items-center justify-center bg-muted lg:flex">
        <div className="">App Logo</div>
        {/* <Image
          fill={true}
          src="/images/logo-ppid.webp"
          alt="Image"
          className="absolute inset-0 h-full w-full object-contain dark:brightness-[0.8]"
        /> */}
      </div>
    </div>
  );
}
