// Nav.tsx (Server Component)
import Link from "next/link";
import { auth } from "~/server/auth";
import { NavMenu } from "./navMenu";
import { DynamicBreadcrumbs } from "~/components/dynamic-breadcrumbs";
import { ModeToggle } from "./theme-toggler";

export default async function Nav() {
  const session = await auth();

  return (
    <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
      <nav className="border-border flex h-16 items-center justify-between border-2 px-4 shadow-lg md:px-12">
        <div className="flex min-w-0 flex-1 items-center space-x-4">
          <Link
            href="/"
            className="text-foreground flex-shrink-0 text-lg font-bold"
          >
            User Portal
          </Link>

          <DynamicBreadcrumbs />
        </div>

        <div>
          {session?.user ? (
            <div className="flex items-center gap-4">
              <NavMenu />
              <ModeToggle />
            </div>
          ) : (
            <Link href="/api/auth/signin" className="text-white">
              Sign In
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
