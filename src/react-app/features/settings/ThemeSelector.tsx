import {
  Sun,
  Moon,
  Monitor,
} from "lucide-react";

import {
  useTheme,
} from "@/context/ThemeContext";

import type {
  Theme,
} from "@/context/ThemeContext";

import { cn } from "@/lib/utils";

const OPTIONS = [
  {
    value: "light",
    label: "Terang",
    icon: Sun,
  },
  {
    value: "dark",
    label: "Gelap",
    icon: Moon,
  },
  {
    value: "system",
    label: "Sistem",
    icon: Monitor,
  },
] as const;

export default function ThemeSelector() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="grid grid-cols-3 gap-3">

      {OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          aria-pressed={theme === option.value}
          onClick={() =>
            setTheme(option.value as Theme)
          }
          className={cn(
            "flex flex-col items-center gap-3 rounded-xl border p-4 transition-colors",
            theme === option.value
              ? "border-primary bg-primary/15"
              : "bg-background hover:bg-muted"
          )}
        >
          <option.icon size={24} />

          <span className="text-sm font-medium">
            {option.label}
          </span>

        </button>
      ))}

    </div>
  );
}