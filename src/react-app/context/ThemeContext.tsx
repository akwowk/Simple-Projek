
/* eslint-disable react-refresh/only-export-components */

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import type { ReactNode } from "react";

export type Theme =
  | "light"
  | "dark"
  | "system";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext =
  createContext<ThemeContextType | undefined>(
    undefined
  );

const STORAGE_KEY = "myplanner-theme";

function getInitialTheme(): Theme {
  try {
    const saved = localStorage.getItem(
      STORAGE_KEY
    );

    if (
      saved === "light" ||
      saved === "dark" ||
      saved === "system"
    ) {
      return saved;
    }
  } catch {
    // Gunakan tema sistem jika storage tidak tersedia.
  }

  return "system";
}

export function ThemeProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [theme, setTheme] =
    useState<Theme>(getInitialTheme);

  useEffect(() => {
    const root = document.documentElement;

    const media = window.matchMedia(
      "(prefers-color-scheme: dark)"
    );

    function applyTheme() {
      const dark =
        theme === "dark" ||
        (theme === "system" && media.matches);

      root.classList.toggle("dark", dark);

      root.style.colorScheme =
        dark ? "dark" : "light";
    }

    applyTheme();

    try {
      localStorage.setItem(
        STORAGE_KEY,
        theme
      );
    } catch {
      // Aplikasi tetap berjalan tanpa storage.
    }

    if (theme === "system") {
      media.addEventListener(
        "change",
        applyTheme
      );
    }

    return () => {
      media.removeEventListener(
        "change",
        applyTheme
      );
    };
  }, [theme]);

  return (
    <ThemeContext.Provider
      value={{ theme, setTheme }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error(
      "useTheme must be used inside ThemeProvider"
    );
  }

  return context;
}
