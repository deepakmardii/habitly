"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session, status } = useSession();

  const handleLogout = async () => {
    await signOut({ 
      callbackUrl: "/",
      redirect: true 
    });
    };

  return (
    <nav className="w-full flex items-center justify-between py-4 px-6 bg-white shadow-sm dark:bg-black dark:text-white">
      <div className="font-bold text-lg tracking-tight">
        Habitly
      </div>
      <div className="flex gap-6">
        {status === 'authenticated' && session?.user && (
          <>
            <Link href="/dashboard" className="hover:underline">
              Dashboard
            </Link>
            <button
              onClick={handleLogout}
              className="hover:underline text-red-600 ml-4"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}