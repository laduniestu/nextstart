import { Lock, Monitor, UserRound } from 'lucide-react';
import type { ReactNode } from 'react';
import {
  NavigationItem,
  NavigationList,
  NavigationMenu,
} from '@/components/ui/tabs';

export default function SettingsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col">
      <h1 className="font-bold text-2xl">Settings</h1>
      <h2 className="mt-2 mb-6">
        Manage your details and personal preferences here.
      </h2>
      <NavigationMenu className="mb-6 w-full">
        <NavigationList
          className="grid grid-cols-3"
          size="md"
          variant="default"
        >
          <NavigationItem href="/app/settings" variant="default">
            <UserRound />
            Profile
          </NavigationItem>
          <NavigationItem href="/app/settings/appearances" variant="default">
            <Monitor />
            Appearances
          </NavigationItem>
          <NavigationItem href="/app/settings/security" variant="default">
            <Lock />
            Security
          </NavigationItem>
        </NavigationList>
      </NavigationMenu>
      {children}
    </div>
  );
}
