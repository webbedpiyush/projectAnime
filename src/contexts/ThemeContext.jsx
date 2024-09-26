/* eslint-disable react/prop-types */
import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext(undefined);

export function useTheme() {
  useContext(ThemeContext);
}

export function ThemeProvider({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(() =>
    getInitialThemePreference()
  );

  useEffect(
    function () {
      document.documentElement.classList.toggle("dark-mode", isDarkMode);
      localStorage.setItem("themePreference", isDarkMode ? "dark" : "light");
    },
    [isDarkMode]
  );

  function toggleTheme() {
    setIsDarkMode(!isDarkMode);
  }
  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

function getInitialThemePreference() {
  const storedThemePreference = localStorage.getItem("themePreference");
  if (storedThemePreference) {
    return storedThemePreference === "dark";
  }

  return (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );
}
