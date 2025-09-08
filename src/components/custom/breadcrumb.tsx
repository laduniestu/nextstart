/** biome-ignore-all lint/suspicious/noArrayIndexKey: <explanation> */
'use client';

import type { Route } from 'next';
import { usePathname, useRouter } from 'next/navigation';
import { Fragment } from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

const BreadcrumbDashboard = () => {
  const pathname = usePathname();
  const router = useRouter();

  const pathSegments = pathname
    .split('/')
    .filter((segment) => segment)
    .slice(1);

  const transformSegment = (segment: string) => {
    return segment
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {pathSegments.length > 0 ? (
          pathSegments.map((segment, index) => {
            const href = `/admin/${pathSegments.slice(0, index + 1).join('/')}`;
            const displayText = transformSegment(segment);

            return (
              <Fragment key={index}>
                {index > 0 && <BreadcrumbSeparator />}
                <BreadcrumbItem>
                  {index !== pathSegments.length - 1 ? (
                    <BreadcrumbLink
                      href={href}
                      onClick={(e) => {
                        e.preventDefault();
                        router.push(href as Route);
                      }}
                    >
                      {displayText}
                    </BreadcrumbLink>
                  ) : (
                    <BreadcrumbPage>{displayText}</BreadcrumbPage>
                  )}
                </BreadcrumbItem>
              </Fragment>
            );
          })
        ) : (
          <BreadcrumbPage>Dashboard</BreadcrumbPage>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default BreadcrumbDashboard;
