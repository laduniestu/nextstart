'use client';

import type { User } from 'better-auth';
import {
  ChevronRight,
  Command,
  HomeIcon,
  type LucideProps,
  UserIcon,
} from 'lucide-react';
import type { Route } from 'next';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  type ComponentProps,
  type ForwardRefExoticComponent,
  type RefAttributes,
  useState,
} from 'react';
import { UserMenu } from '@/components/custom/user-menu';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import { APP_NAME } from '@/config';

type navItem = {
  title: string;
  url: string;
};
type navMain = {
  title: string;
  url: string;
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>
  >;
  items?: undefined | navItem[];
};
type dataType = {
  navMain: navMain[];
};

interface AdminSidebarProps extends ComponentProps<typeof Sidebar> {
  user: User;
}

export function AdminSidebar({ user, ...props }: AdminSidebarProps) {
  const path = usePathname();

  const data: dataType = {
    navMain: [
      {
        title: 'Dashboard',
        url: '/admin' as Route,
        icon: HomeIcon,
      },
      {
        title: 'Users',
        url: '/admin/users' as Route,
        icon: UserIcon,
      },
    ],
  };

  const [openStates, setOpenStates] = useState(() => {
    const initialState: Record<string, boolean> = {};
    data.navMain.forEach((item) => {
      initialState[item.url] =
        path === item.url ||
        (item.items?.some((subItem) => path === subItem.url) ?? false);
    });
    return initialState;
  });

  return (
    <Sidebar variant="floating" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild size="lg">
              <Link href="/app">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-foreground">
                  <Command className="size-4" />
                </div>
                <span className="truncate font-semibold leading-tight">
                  Admin | {APP_NAME}
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {data.navMain.map((item) => (
              <Collapsible
                asChild
                key={item.title}
                onOpenChange={(val) =>
                  setOpenStates((prev) => ({ ...prev, [item.url]: val }))
                }
                open={openStates[item.url]}
              >
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={path === item.url}
                    tooltip={item.title}
                  >
                    <Link href={item.url as Route}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                  {item.items?.length ? (
                    <>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuAction className="data-[state=open]:rotate-90">
                          <ChevronRight />
                          <span className="sr-only">Toggle</span>
                        </SidebarMenuAction>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.items?.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton
                                asChild
                                isActive={path === subItem.url}
                              >
                                <Link href={subItem.url as Route}>
                                  <span>{subItem.title}</span>
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </>
                  ) : null}
                </SidebarMenuItem>
              </Collapsible>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <UserMenu user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
