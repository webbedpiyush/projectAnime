"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  TrendingUp,
  Calendar,
  History,
  User,
  Settings,
} from "lucide-react";

const navItems = [
  { name: "Home", href: "/", icon: Home },
  { name: "Trending", href: "/trending", icon: TrendingUp },
  { name: "Schedule", href: "/schedule", icon: Calendar },
  { name: "History", href: "/history", icon: History },
  { name: "Profile", href: "/profile", icon: User },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <>
      {/* Sidebar for larger screens */}
      <nav className="hidden md:flex flex-col w-18 h-screen fixed left-0 top-17 overflow-hidden p-2 border-r-2 border-gray-200 dark:border-gray-700 transition-colors duration-200">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`flex flex-col items-center py-4 ${
              pathname === item.href ? "text-blue-600" : "text-gray-700 dark:text-gray-300"
            }` }
          >
            <item.icon className="w-6 h-6" />
            <span className="text-[10px] mt-1">{item.name}</span>
          </Link>
        ))}
      </nav>

      {/* Bottom navigation for mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-black z-10 border-t-2 border-gray-200 dark:border-gray-700">
        <div className="flex justify-around">
          {navItems.slice(0, 5).map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center p-2 ${
                pathname === item.href ? "text-blue-600" : "text-gray-400"
              }`}
            >
              <item.icon className="w-6 h-6" />
              <span className="text-[10px] mt-1">{item.name}</span>
            </Link>
          ))}
        </div>
      </nav>

      {/* Spacer for content on mobile */}
      <div className="h-16 md:hidden "></div>
    </>
  );
}
