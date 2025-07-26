"use client";
import Link from "next/link";
import { useState } from "react";
import NewHabitModal from "./NewHabitModal";
import { Sheet, SheetContent, SheetTrigger } from "../../components/ui/sheet";
import { Button } from "../../components/ui/button";
import { Separator } from "../../components/ui/separator";
import { Menu, Plus, LayoutDashboard, ListTodo, BarChart2, Settings, Gem, Clock } from "lucide-react";
import { Toaster } from "sonner";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

export default function Sidebar() {
  const [showModal, setShowModal] = useState(false);
  const pathname = usePathname();

  // Sidebar content as a component for reuse
  const SidebarContent = (
    <div className="flex flex-col h-full">
      <div className="mb-8 flex items-center gap-3">
        <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none">
          <defs>
            <linearGradient id="habitGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6366F1" />
              <stop offset="100%" stopColor="#8B5CF6" />
            </linearGradient>
            <linearGradient id="accentGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#EF4444" />
            </linearGradient>
            <clipPath id="hexClip">
              <path d="M16 2 L28 9 L28 23 L16 30 L4 23 L4 9 Z"/>
            </clipPath>
          </defs>
          
          {/* Main hexagonal background */}
          <path d="M16 2 L28 9 L28 23 L16 30 L4 23 L4 9 Z" 
                fill="url(#habitGradient)" opacity="0.9"/>
          
          {/* Inner hexagon with pattern */}
          <path d="M16 6 L24 10 L24 20 L16 24 L8 20 L8 10 Z" 
                fill="none" stroke="white" strokeWidth="1" opacity="0.8"/>
          
          {/* Central habit tracker visualization */}
          <g transform="translate(16, 16)">
            {/* 7-day week grid */}
            <g opacity="0.9">
              {/* Row 1 */}
              <rect x="-9" y="-6" width="3" height="3" fill="#10B981" rx="0.5"/>
              <rect x="-6" y="-6" width="3" height="3" fill="#10B981" rx="0.5"/>
              <rect x="-3" y="-6" width="3" height="3" fill="#F59E0B" rx="0.5"/>
              <rect x="0" y="-6" width="3" height="3" fill="#EF4444" rx="0.5"/>
              <rect x="3" y="-6" width="3" height="3" fill="#6B7280" rx="0.5"/>
              <rect x="6" y="-6" width="3" height="3" fill="#6B7280" rx="0.5"/>
              <rect x="9" y="-6" width="3" height="3" fill="#6B7280" rx="0.5"/>
              
              {/* Row 2 */}
              <rect x="-9" y="-3" width="3" height="3" fill="#10B981" rx="0.5"/>
              <rect x="-6" y="-3" width="3" height="3" fill="#10B981" rx="0.5"/>
              <rect x="-3" y="-3" width="3" height="3" fill="#10B981" rx="0.5"/>
              <rect x="0" y="-3" width="3" height="3" fill="#F59E0B" rx="0.5"/>
              <rect x="3" y="-3" width="3" height="3" fill="#EF4444" rx="0.5"/>
              <rect x="6" y="-3" width="3" height="3" fill="#6B7280" rx="0.5"/>
              <rect x="9" y="-3" width="3" height="3" fill="#6B7280" rx="0.5"/>
              
              {/* Row 3 */}
              <rect x="-9" y="0" width="3" height="3" fill="#10B981" rx="0.5"/>
              <rect x="-6" y="0" width="3" height="3" fill="#10B981" rx="0.5"/>
              <rect x="-3" y="0" width="3" height="3" fill="#10B981" rx="0.5"/>
              <rect x="0" y="0" width="3" height="3" fill="#10B981" rx="0.5"/>
              <rect x="3" y="0" width="3" height="3" fill="#F59E0B" rx="0.5"/>
              <rect x="6" y="0" width="3" height="3" fill="#EF4444" rx="0.5"/>
              <rect x="9" y="0" width="3" height="3" fill="#6B7280" rx="0.5"/>
              
              {/* Row 4 */}
              <rect x="-9" y="3" width="3" height="3" fill="#10B981" rx="0.5"/>
              <rect x="-6" y="3" width="3" height="3" fill="#10B981" rx="0.5"/>
              <rect x="-3" y="3" width="3" height="3" fill="#10B981" rx="0.5"/>
              <rect x="0" y="3" width="3" height="3" fill="#10B981" rx="0.5"/>
              <rect x="3" y="3" width="3" height="3" fill="#10B981" rx="0.5"/>
              <rect x="6" y="3" width="3" height="3" fill="#F59E0B" rx="0.5"/>
              <rect x="9" y="3" width="3" height="3" fill="#EF4444" rx="0.5"/>
            </g>
          </g>
          
          {/* Decorative corner elements */}
          <g opacity="0.7">
            {/* Top corners */}
            <circle cx="8" cy="8" r="1.5" fill="url(#accentGradient)"/>
            <circle cx="24" cy="8" r="1.5" fill="url(#accentGradient)"/>
            
            {/* Bottom corners */}
            <circle cx="8" cy="24" r="1.5" fill="url(#accentGradient)"/>
            <circle cx="24" cy="24" r="1.5" fill="url(#accentGradient)"/>
          </g>
          
          {/* Central highlight */}
          <circle cx="16" cy="16" r="2" fill="white" opacity="0.6"/>
          
          {/* Outer glow */}
          <path d="M16 2 L28 9 L28 23 L16 30 L4 23 L4 9 Z" 
                fill="none" stroke="url(#habitGradient)" strokeWidth="0.5" opacity="0.4"/>
        </svg>
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
          href="/reminders"
          className={`px-3 py-2 rounded-md font-medium transition flex items-center gap-2 ${pathname === "/reminders" ? "bg-gray-200 text-blue-600 font-bold" : "hover:bg-gray-200 text-black"}`}
        >
          <Clock className="w-4 h-4" /> Reminders
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
          signOut({ callbackUrl: "/" });
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