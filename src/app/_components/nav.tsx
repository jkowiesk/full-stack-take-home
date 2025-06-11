import Link from "next/link";
import { auth } from "~/server/auth";

export default async function Nav() {
  const seassion = await auth();
  console.log("Session:", seassion);

  return (
    <nav className="flex h-16 items-center justify-between bg-gradient-to-b from-[#797879] to-[#15162c] px-4 shadow-lg">
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
