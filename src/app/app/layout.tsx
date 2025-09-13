import type { ReactNode } from 'react';
import { AppSidebar } from '@/app/app/sidebar';
import BreadcrumbDashboard from '@/components/custom/breadcrumb';
import { ModeToggle } from '@/components/custom/mode-toggle';
import { Separator } from '@/components/ui/separator';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { getServerSessionRedirect } from '@/lib/auth/helpers/get-session';

export default async function AppLayout({ children }: { children: ReactNode }) {
  const session = await getServerSessionRedirect();
  return (
    <SidebarProvider>
      <AppSidebar user={session.user} />
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-16 w-full shrink-0 items-center justify-between gap-2 border-b bg-background px-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator className="mr-2 h-4" orientation="vertical" />
            <BreadcrumbDashboard />
          </div>
          <div className="flex items-center gap-2">
            <ModeToggle />
          </div>
        </header>
        <div className="flex flex-1 flex-col p-4 pt-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
