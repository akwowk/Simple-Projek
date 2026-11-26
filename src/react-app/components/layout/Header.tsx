
import {
  Settings,
  Sun,
  Moon,
  Monitor,
} from "lucide-react";

import {
  Link,
  useLocation,
} from "react-router-dom";

import { navigation } from "@/lib/navigation";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/context/ThemeContext";
import { useNow } from "@/hooks/useNow";

export default function Header() {
  const location = useLocation();
  const { theme, setTheme } = useTheme();

  const now = useNow(60000);

  const currentPage = navigation.find(
    (item) => item.path === location.pathname
  );

  const today = new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Jakarta",
  }).format(new Date(now));

  const ThemeIcon =
    theme === "dark"
      ? Moon
      : theme === "light"
        ? Sun
        : Monitor;

  function cycleTheme() {
    if (theme === "light") {
      setTheme("dark");
    } else if (theme === "dark") {
      setTheme("system");
    } else {
      setTheme("light");
    }
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b bg-background/95 px-4 backdrop-blur md:px-6">

      <div className="min-w-0">

        <h2 className="truncate font-semibold">
          {currentPage?.title ?? "MyPlanner"}
        </h2>

        <p className="truncate text-xs text-muted-foreground">
          {today}
        </p>

      </div>

      <div className="flex shrink-0 items-center gap-2">

        <Button
          variant="ghost"
          size="icon"
          onClick={cycleTheme}
          aria-label="Ganti tema aplikasi"
          title={`Tema saat ini: ${theme}`}
        >
          <ThemeIcon size={20} />
        </Button>

        <Link
          to="/settings"
          aria-label="Pengaturan"
          className="flex size-9 items-center justify-center rounded-md hover:bg-muted"
        >
          <Settings size={20} />
        </Link>

      </div>

    </header>
  );
}
