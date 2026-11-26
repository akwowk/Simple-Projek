import { Settings } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { navigation } from "@/lib/navigation";
import { Button } from "@/components/ui/button";

export default function Header() {
  const location = useLocation();

  const currentPage = navigation.find(
    (item) => item.path === location.pathname
  );

  const today = new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Jakarta",
  }).format(new Date());

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/95 px-4 backdrop-blur md:px-6">

      <div>
        <h2 className="font-semibold">
          {currentPage?.title ?? "MyPlanner"}
        </h2>

        <p className="text-xs text-muted-foreground">
          {today}
        </p>
      </div>

      <Link to="/settings">
        <Button variant="ghost" size="icon" aria-label="Pengaturan">
          <Settings size={20} />
        </Button>
      </Link>

    </header>
  );
}