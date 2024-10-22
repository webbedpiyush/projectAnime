"use client"

import React, { useState } from 'react'
import { Search, Grid, User, Cloud } from 'lucide-react'
import ThemeSwitcher from './ThemeSwitcher'

export default function Navbar() {
  const [isSearchFocused, setIsSearchFocused] = useState(false)

  return (
    <header className="p-2 flex items-center justify-between sm:p-3 md:p-4">
      {/* Logo */}
      <div className="flex items-center">
        <span className="text-xl font-bold mr-1">PROJECTANIME</span>
        <span className="text-sm ">.tv</span>
      </div>

      {/* Search Bar */}
      <div className="flex-grow mx-4 relative max-w-2xl hidden sm:block">
        <input
          type="text"
          placeholder="Search Anime"
          className={`w-full pl-10 pr-4 py-1.5 rounded-md text-sm border border-gray-500 dark:bg-background`}
          onFocus={() => setIsSearchFocused(true)}
          onBlur={() => setIsSearchFocused(false)}
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
      </div>

      {/* Icons */}
      <div className="flex items-center space-x-4">
        <button className="text-gray-400 hover:text-white focus:outline-none">
          <Grid size={18} />
        </button>
        <button className="text-gray-400 hover:text-white focus:outline-none sm:hidden">
          <Search size={18} />
        </button>
        <button className="text-gray-400 hover:text-white focus:outline-none">
          <Cloud size={18} />
        </button>
        <ThemeSwitcher />
        <button className="text-gray-400 hover:text-white focus:outline-none sm:pr-2">
          <User size={18} />
        </button>
      </div>
    </header>
  )
}