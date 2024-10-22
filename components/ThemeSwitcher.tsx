"use client";

import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { FaMoon, FaSun } from "react-icons/fa";

export default function ThemeSwitcher() {
  const [isdark, setIsDark] = useState(false);

  useEffect(function () {
    const currentTheme = localStorage.getItem("theme");
    if (currentTheme === "dark") {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    } else {
      setIsDark(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  function toggleTheme() {
    const newTheme = isdark ? "light" : "dark";
    setIsDark((prev) => !prev);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
    localStorage.setItem("theme", newTheme);
  }
  return (
    <Button onClick={toggleTheme} className="rounded-full">
      {isdark ? <FaSun /> : <FaMoon />}
    </Button>
  );
}
