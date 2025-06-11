import Link from "next/link";
import { auth } from "~/server/auth";

export default async function Nav() {
  const seassion = await auth();

  return (
    <nav className="border-border flex h-16 items-center justify-between border-2 px-4 shadow-lg">
      <Link href="/" className="text-lg font-bold text-white">
        MyApp
      </Link>
      <div>
        {seassion?.user ? (
          <span className="text-white">Welcome, {seassion.user.name}</span>
        ) : (
          <Link href="/api/auth/signin" className="text-white">
            Sign In
          </Link>
        )}
      </div>
    </nav>
  );
}
