import Link from "next/link";
import { auth } from "~/server/auth";
import { NavMenu } from "./navMenu";

export default async function Nav() {
  const seassion = await auth();

  return (
    <nav className="border-border flex h-16 items-center justify-between border-2 px-4 shadow-lg">
      <Link href="/" className="text-lg font-bold text-white">
        User Portal
      </Link>
      <div>
        {seassion?.user ? (
          <NavMenu />
        ) : (
          <Link href="/api/auth/signin" className="text-white">
            Sign In
          </Link>
        )}
      </div>
    </nav>
  );
}
