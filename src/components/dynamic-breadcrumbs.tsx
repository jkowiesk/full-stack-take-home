"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";

// Helper function to generate breadcrumbs from pathname
function generateBreadcrumbs(pathname: string) {
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length === 0) return [];

  const breadcrumbs: Array<{
    label: string;
    href?: string;
    current?: boolean;
  }> = [];
  let currentPath = "";

  // Define route labels for your specific routes
  const routeLabels: Record<string, string> = {
    accounts: "Accounts",
    "pdf-chat": "PDF Chat",
    workflow: "Workflow",
  };

  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    const isLast = index === segments.length - 1;

    breadcrumbs.push({
      label:
        routeLabels[segment] ||
        segment.charAt(0).toUpperCase() + segment.slice(1),
      href: isLast ? undefined : currentPath,
      current: isLast,
    });
  });

  return breadcrumbs;
}

export function DynamicBreadcrumbs() {
  const pathname = usePathname();
  const breadcrumbs = generateBreadcrumbs(pathname);
  const showBreadcrumbs = pathname !== "/" && breadcrumbs.length > 0;

  if (!showBreadcrumbs) {
    return null;
  }

  return (
    <div className="hidden min-w-0 flex-1 md:block">
      <Breadcrumb>
        <BreadcrumbList>
          {breadcrumbs.map((crumb, index) => (
            <div key={index} className="flex items-center gap-4">
              <BreadcrumbSeparator className="text-white/60" />
              <BreadcrumbItem>
                {crumb.current || !crumb.href ? (
                  <BreadcrumbPage className="text-white">
                    {crumb.label}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink
                    href={crumb.href}
                    className="text-white/80 hover:text-white"
                  >
                    {crumb.label}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </div>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}
