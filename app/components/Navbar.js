"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const checkLogin = () => {
      setLoggedIn(localStorage.getItem("isLoggedIn") === "true");
    };
    checkLogin();
    window.addEventListener("storage", checkLogin);
    return () => window.removeEventListener("storage", checkLogin);
  }, []);

  return (
    <nav className="w-full flex items-center justify-between py-4 px-6 bg-white shadow-sm dark:bg-black dark:text-white">
      <div className="font-bold text-lg tracking-tight">
        Habitly
      </div>
      <div className="flex gap-6">
        {loggedIn && (
          <>
            <Link href="/dashboard" className="hover:underline">
              Dashboard
            </Link>
            <button
              onClick={() => {
                localStorage.removeItem("isLoggedIn");
                document.cookie = "isLoggedIn=false; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax";
                window.location.href = "/";
              }}
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