"use client";
import Link from "next/link";
import { useState } from "react";
import NewHabitModal from "./NewHabitModal";
import { Sheet, SheetContent, SheetTrigger } from "../../components/ui/sheet";
import { Button } from "../../components/ui/button";
import { Separator } from "../../components/ui/separator";
import { Menu, Plus, LayoutDashboard, ListTodo, BarChart2, Settings, Gem } from "lucide-react";
import { Toaster } from "sonner";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const [showModal, setShowModal] = useState(false);
  const pathname = usePathname();

  // Sidebar content as a component for reuse
  const SidebarContent = (
    <div className="flex flex-col h-full">
      <div className="mb-8 flex items-center gap-3">
        <Gem className="w-8 h-8 text-black" />
        <div>
          <h1 className="text-2xl font-bold text-black leading-tight">Habitly</h1>
          <p className="text-xs text-black font-medium mt-1">Build better habits</p>
        </div>
      </div>
      <Button className="mb-8 flex items-center gap-2 cursor-pointer" onClick={() => setShowModal(true)}>
        <Plus className="w-5 h-5" /> New Habit
      </Button>
      <NewHabitModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={async data => {
          setShowModal(false);
          try {
            const realUserId = localStorage.getItem("userId");
            if (realUserId) {
              document.cookie = `userId=${realUserId}; path=/; SameSite=Lax`;
            }
            const res = await fetch("/api/habits", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(data),
            });
            const result = await res.json();
            if (!res.ok) throw new Error(result.error || "Unknown error");
            // alert("Habit created!"); // Removed, toast is used in modal
          } catch (e) {
            // alert("Failed to create habit: " + e.message); // Removed, toast is used in modal
          }
        }}
      />
      <span className="text-xs text-gray-500 font-semibold mb-2 uppercase tracking-wide">Navigation</span>
      <nav className="flex flex-col gap-2 flex-1">
        <Link
          href="/dashboard"
          className={`px-3 py-2 rounded-md font-medium transition flex items-center gap-2 ${pathname === "/dashboard" ? "bg-gray-200 text-blue-600 font-bold" : "hover:bg-gray-200 text-black"}`}
        >
          <LayoutDashboard className="w-4 h-4" /> Dashboard
        </Link>
        <Link
          href="/habits"
          className={`px-3 py-2 rounded-md font-medium transition flex items-center gap-2 ${pathname === "/habits" ? "bg-gray-200 text-blue-600 font-bold" : "hover:bg-gray-200 text-black"}`}
        >
          <ListTodo className="w-4 h-4" /> Habits
        </Link>
        <Link
          href="/analytics"
          className={`px-3 py-2 rounded-md font-medium transition flex items-center gap-2 ${pathname === "/analytics" ? "bg-gray-200 text-blue-600 font-bold" : "hover:bg-gray-200 text-black"}`}
        >
          <BarChart2 className="w-4 h-4" /> Analytics
        </Link>
        <Link
          href="/settings"
          className={`px-3 py-2 rounded-md font-medium transition flex items-center gap-2 ${pathname === "/settings" ? "bg-gray-200 text-blue-600 font-bold" : "hover:bg-gray-200 text-black"}`}
        >
          <Settings className="w-4 h-4" /> Settings
        </Link>
      </nav>
      <Separator className="my-4" />
      <Button
        variant="destructive"
        className="w-full mt-auto mb-2 cursor-pointer"
        onClick={() => {
          localStorage.removeItem("isLoggedIn");
          document.cookie = "isLoggedIn=false; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax";
          window.location.href = "/";
        }}
      >
        Logout
      </Button>
    </div>
  );

  return (
    <>
      <Toaster position="bottom-right" toastOptions={{ className: 'text-base px-6 py-4 min-w-[320px] max-w-[400px]' }} />
      {/* Mobile: Sheet trigger */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu className="w-6 h-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-6 w-64">
            {SidebarContent}
          </SheetContent>
        </Sheet>
      </div>
      {/* Desktop: fixed sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 h-screen w-64 bg-gray-100 text-black shadow-lg flex-col border-r border-gray-200 z-40 p-4">
        {SidebarContent}
      </aside>
    </>
  );
} 